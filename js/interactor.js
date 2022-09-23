import { assert } from "./common.js"

class MouseState {
    constructor() {
        this.isDragging = false
        this.lastMousePos = null
        this.curDelta = [0.0, 0.0, 0.0]
    }

    startDrag(pos) {
        this.lastMousePos = pos
        this.isDragging = true
    }

    update(pos, wheel) {
        if (pos) {
            this.curDelta[0] += pos[0] - this.lastMousePos[0]
            this.curDelta[1] += pos[1] - this.lastMousePos[1]
            this.lastMousePos = pos
        }
        if (wheel)
            this.curDelta[2] += wheel
    }

    getDelta() {
        let delta = this.curDelta
        this.curDelta = [0.0, 0.0, 0.0]
        return delta
    }

    stopDrag() {
        this.lastMousePos = null
        this.isDragging = false
    }
}

const MAX_FOV = 170
const MIN_FOV = 1

export default class Interactor {
    constructor() {
        this.camera = null
        this.mouseSpeed = 0.06
        this.mouseWheelSpeed = 0.001

        this.mousedownListener = null
        this.mousemoveListener = null
        this.mouseupListener = null
        this.mousewheelListener = null

        // mouse
        this.mouseState = new MouseState()
    }

    start(camera) {
        assert(canvas, "Canvas is not ready")

        this.camera = camera
        this.mousedownListener = (e) => this._mousedown(this, e)
        this.mousemoveListener = (e) => this._mousemove(this, e)
        this.mouseupListener = (e) => this._mouseup(this, e)
        this.mousewheelListener = (e) => this._mousewheel(this, e)
        canvas.addEventListener("mousedown", this.mousedownListener)
        document.addEventListener("mousemove", this.mousemoveListener)
        document.addEventListener("mouseup", this.mouseupListener)
        document.addEventListener("mousewheel", this.mousewheelListener)
    }

    update(deltaTime) {
        const left = this.camera.getLeft()
        const up = this.camera.getUp()

        const mouseDelta = this.mouseState.getDelta()
        let rotateLeft = mouseDelta[0] * this.mouseSpeed
        let rotateUp = mouseDelta[1] * this.mouseSpeed

        this.camera.fov *= Math.exp(mouseDelta[2] * this.mouseWheelSpeed)
        this.camera.fov = Math.max(MIN_FOV, Math.min(MAX_FOV, this.camera.fov))

        let newTarget = this.camera.target
        const position = this.camera.position
        let m = m4.axisRotation(up, rotateLeft * deltaTime)
        m = m4.axisRotate(m, left, -rotateUp * deltaTime)
        newTarget = m4.subtractVectors(newTarget, position)
        newTarget = m4.transformVector(m, [...newTarget, 0.0])
        newTarget = m4.addVectors(newTarget.slice(0, 3), position)
        this.camera.target = newTarget
    }

    stop() {
        canvas.removeEventListener("mousedown", this.mousedownListener)
        document.removeEventListener("mousemove", this.mousemoveListener)
        document.removeEventListener("mouseup", this.mouseupListener)
        document.removeEventListener("mousewheel", this.mousewheelListener)
        this.camera = null

        this.mousedownListener = null
        this.mousemoveListener = null
        this.mouseupListener = null
        this.mousewheelListener = null
    }

    _mousedown(that, e) {
        that.mouseState.startDrag([e.x, e.y])
    }

    _mousemove(that, e) {
        if (that.mouseState.isDragging)
            that.mouseState.update([e.x, e.y], 0.0)
    }

    _mouseup(that, e) {
        that.mouseState.stopDrag()
    }

    _mousewheel(that, e) {
        that.mouseState.update(null, e.deltaY)
    }
}