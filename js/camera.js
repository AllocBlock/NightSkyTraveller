export default class PerspectiveCamera {
    constructor() {
        this.position = [0.0, 0.0, 0.0]
        this.target = [0.0, 0.0, 1.0]
        this.up = [0.0, 1.0, 0.0]
        this.fov = 90.0

        this.near = 0.001;
        this.far = 100;
    }

    getViewMat() {
        // TIPS: the author of m4 use lookat to generaye "camera matrix" rather than "view matrix"
        // simply inverse camera matrix to get view matrix
        // for more: https://webgl2fundamentals.org/webgl/lessons/webgl-3d-camera.html
        return m4.inverse(m4.lookAt(this.position, this.target, this.up));
    }

    getProjMat(aspect) {
        let fovRadian = deg2rad(this.fov)
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