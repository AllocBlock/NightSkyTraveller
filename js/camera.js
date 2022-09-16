export default class PerspectiveCamera {
    constructor() {
        this.position = [0.0, 0.0, 0.0]
        this.target = [0.0, 0.0, 0.0]
        this.up = [0.0, 1.0, 0.0]
        this.fov = 90.0

        this.near = 0.001;
        this.far = 100;
    }

    getViewMat() {
        return m4.lookAt(this.position, this.target, this.up);
    }

    getProjMat(aspect) {
        let fovRadian = this.fov / (2 * Math.PI)
        return m4.perspective(fovRadian, aspect, this.near, this.far);
    }
}