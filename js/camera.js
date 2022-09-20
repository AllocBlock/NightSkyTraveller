import { assert, deg2rad } from "./common.js"

function lerp(a, b, r) {
    if (a.length || b.length) {
        assert(a.length == b.length, "lerp require same data format");
        let res = []
        for (let i in a)
            res.push(a[i] * (1 - r) + b[i] * r)
        return res
    }
    else
        return a * (1 - r) + b * r
}

export default class PerspectiveCamera {
    constructor() {
        this.position = [0.0, 0.0, 0.0]
        this.target = [0.0, 0.0, 1.0]
        this.up = [0.0, 1.0, 0.0]
        this.fov = 90.0

        this.near = 0.001;
        this.far = 100;

        this.actualPosition = this.position
        this.actualTarget = this.target
        this.actualFov = this.fov
    }

    setPos(pos, skipAnimation = false) {
        assert(pos.length == 3, "Position require a vector3")
        this.position = pos
        if (skipAnimation)
            this.actualPosition = pos
    }

    setTarget(target, skipAnimation = false) {
        assert(target.length == 3, "Target require a vector3")
        this.target = target
        if (skipAnimation)
            this.actualTarget = target;
    }

    setFov(fov, skipAnimation = false) {
        this.fov = fov
        if (skipAnimation)
            this.actualFov = fov
    }

    update(deltaTime) {
        let r = Math.min(1.0, deltaTime * 10)
        this.actualPosition = lerp(this.actualPosition, this.position, r)
        this.actualTarget = lerp(this.actualTarget, this.target, r)
        this.actualFov = lerp(this.actualFov, this.fov, r)
    }

    getViewMat() {
        // TIPS: the author of m4 use lookat to generaye "camera matrix" rather than "view matrix"
        // simply inverse camera matrix to get view matrix
        // for more: https://webgl2fundamentals.org/webgl/lessons/webgl-3d-camera.html
        return m4.inverse(m4.lookAt(this.actualPosition, this.actualTarget, this.up));
    }

    getProjMat(aspect) {
        let fovRadian = deg2rad(this.actualFov)
        return m4.perspective(fovRadian, aspect, this.near, this.far);
    }

    getViewProjMat(aspect) {
        return m4.multiply(this.getProjMat(aspect), this.getViewMat())
    }

    getFront() {
        return m4.normalize(m4.subtractVectors(this.target, this.position))
    }

    getLeft() {
        return m4.normalize(m4.cross(this.up, this.getFront()))
    }

    getUp() {
        return m4.normalize(this.up)
    }
}