import { assert } from "./common.js"

export default class WebGLUniform {
    constructor() {
        this.program = null
        this.attrLocationMap = new Map()
    }

    init(program) {
        this.program = program
        this.clearLocationCache()
    }

    clearLocationCache() {
        this.attrLocationMap.clear()
    }

    getLocation(name) {
        if (this.attrLocationMap.has(name))
            return this.attrLocationMap.get(name)

        let location = gl.getUniformLocation(this.program, name);
        if (location == -1) {
            throw `Error: get uniform location of ${name} failed`
        }

        this.attrLocationMap.set(name, location)
        return location
    }

    updateFloat(name, value) {
        assert(value.length == undefined && isFinite(value), "Value is not float")
        let location = this.getLocation(name)
        gl.uniform1f(location, value);
    }

    updateVec2(name, value) {
        assert(value.length == 2, "Value is not vec1")
        let location = this.getLocation(name)
        gl.uniform2fv(location, value);
    }

    updateVec3(name, value) {
        assert(value.length == 3, "Value is not vec3")
        let location = this.getLocation(name)
        gl.uniform3fv(location, value);
    }

    updateVec4(name, value) {
        assert(value.length == 4, "Value is not vec4")
        let location = this.getLocation(name)
        gl.uniform4fv(location, value);
    }

    updateMat4(name, value) {
        assert(value.length == 16, "Value is not mat4")
        let location = this.getLocation(name)
        gl.uniformMatrix4fv(location, false, value);
    }
}