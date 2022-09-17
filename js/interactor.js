const EMoveState = {
    FRONT: 1,
    BACK: 2,
    LEFT: 3,
    RIGHT: 4,
    UP: 5,
    DOWN: 6,
    BOOST: 7,
    HINDER: 8
}

const BOOST_TIMES = 3.0 // HINDER is the inverse of it

const EViewState = {
    TRUN_LEFT: 1,
    TRUN_RIGHT: 2,
    TRUN_UP: 3,
    TRUN_DOWN: 4,
}

const KEY_MOVE_STATE_MAP = new Map(Object.entries({
    w: EMoveState.FRONT,
    s: EMoveState.BACK,
    a: EMoveState.LEFT,
    d: EMoveState.RIGHT,
    e: EMoveState.UP,
    q: EMoveState.DOWN,
    shift: EMoveState.BOOST,
    ctrl: EMoveState.HINDER,
}))

const KEY_VIEW_STATE_MAP = new Map(Object.entries({
    arrowleft: EViewState.TRUN_LEFT,
    arrowright: EViewState.TRUN_RIGHT,
    arrowup: EViewState.TRUN_UP,
    arrowdown: EViewState.TRUN_DOWN,
}))

export default class Interactor {
    constructor() {
        this.camera = null
        this.moveState = new Set()
        this.viewState = new Set()

        this.moveSpeed = 5.0
        this.viewSpeed = 1.0

        this.keydownListener = null
        this.keyupListener = null
    }

    start(camera) {
        this.camera = camera
        this.keydownListener = (e) => this._keydown(this, e)
        this.keyupListener = (e) => this._keyup(this, e)
        document.addEventListener("keydown", this.keydownListener)
        document.addEventListener("keyup", this.keyupListener)
    }

    update(deltaTime) {
        // move
        {
            let moveDirection = [0.0, 0.0, 0.0]
            let boost = 1.0
            const front = this.camera.getFront()
            const left = this.camera.getLeft()
            const up = this.camera.getUp()

            if (this.moveState.has(EMoveState.FRONT)) moveDirection = m4.addVectors(moveDirection, front)
            if (this.moveState.has(EMoveState.BACK)) moveDirection = m4.subtractVectors(moveDirection, front)
            
            if (this.moveState.has(EMoveState.LEFT)) moveDirection = m4.addVectors(moveDirection, left)
            if (this.moveState.has(EMoveState.RIGHT)) moveDirection = m4.subtractVectors(moveDirection, left)
            
            if (this.moveState.has(EMoveState.UP)) moveDirection = m4.addVectors(moveDirection, up)
            if (this.moveState.has(EMoveState.DOWN)) moveDirection = m4.subtractVectors(moveDirection, up)
            
            if (this.moveState.has(EMoveState.BOOST)) boost *= BOOST_TIMES
            if (this.moveState.has(EMoveState.HINDER)) boost /= BOOST_TIMES

            let move = m4.scaleVector(moveDirection, this.moveSpeed * deltaTime * boost)

            this.camera.position = m4.addVectors(this.camera.position, move)
            this.camera.target = m4.addVectors(this.camera.target, move)
        }

        // view
        {
            const left = this.camera.getLeft()
            const up = this.camera.getUp()
            let rotateLeft = 0.0, rotateUp = 0.0;
            if (this.viewState.has(EViewState.TRUN_UP)) rotateUp += 1.0
            if (this.viewState.has(EViewState.TRUN_DOWN)) rotateUp -= 1.0
            if (this.viewState.has(EViewState.TRUN_LEFT)) rotateLeft += 1.0
            if (this.viewState.has(EViewState.TRUN_RIGHT)) rotateLeft -= 1.0

            let newTarget = this.camera.target
            const position = this.camera.position
            let m = m4.axisRotation(up, rotateLeft * this.viewSpeed * deltaTime)
            m = m4.axisRotate(m, left, -rotateUp * this.viewSpeed * deltaTime)
            newTarget = m4.subtractVectors(newTarget, position)
            newTarget = m4.transformVector(m, [...newTarget, 0.0])
            newTarget = m4.addVectors(newTarget.slice(0, 3), position)
            this.camera.target = newTarget
        }
    }

    stop() {
        document.removeEventListener("keydown", this.keydownListener)
        document.removeEventListener("keyup", this.keyupListener)
        this.camera = this.keydownListener = this.keyupListener = null
        this.moveState.clear()
    }

    _keydown(that, e) {
        const key = e.key.toLowerCase()
        if (KEY_MOVE_STATE_MAP.has(key)) {
            that.moveState.add(KEY_MOVE_STATE_MAP.get(key))
        }

        if (KEY_VIEW_STATE_MAP.has(key)) {
            that.viewState.add(KEY_VIEW_STATE_MAP.get(key))
        }
    }

    _keyup(that, e) {
        const key = e.key.toLowerCase()
        if (KEY_MOVE_STATE_MAP.has(key)) {
            that.moveState.delete(KEY_MOVE_STATE_MAP.get(key))
        }

        if (KEY_VIEW_STATE_MAP.has(key)) {
            that.viewState.delete(KEY_VIEW_STATE_MAP.get(key))
        }
    }
}