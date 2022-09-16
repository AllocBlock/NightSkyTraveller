export default class WebGLUniform {
    constructor(program) {
        this.program = program
        this.attrLocationMap = Map()
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
        location = getLocation(name)
        gl.uniform1f(location, value);
    }

    updateVec3(name, value) {
        location = getLocation(name)
        gl.uniform3fv(location, value);
    }

    updateVec4(name, value) {
        location = getLocation(name)
        gl.uniform4fv(location, value);
    }
}