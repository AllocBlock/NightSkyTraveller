import { assert, flatten } from "./common.js"

class ObjectDrawInfo {
    constructor(type, offset, count) {
        this.type = type
        this.offset = offset
        this.count = count
    }
}

export class VertexFormat {
    constructor(name, type, compNum) {
        this.name = name
        this.type = type
        this.compNum = compNum
    }
}

export class WebGLVertexArrayObject {
    constructor() {
        this.vao = null
        this.vertexBuffer = null
        this.program = null
        this.objectDrawInfo = new Map()
    }

    clear() {
        this.vao = null
        this.vertexBuffer = null
        this.program = null
        this.objectDrawInfo.clear()
    }

    create(program, vertexFormats, objects) {
        this.program = program

        // create vertex buffer
        let vertices = []
        let curOffset = 0
        for (let object of objects) {
            let objectVertices = flatten(object.pointArray, false)
            let count = object.pointArray.length
            this.objectDrawInfo.set(object.name, new ObjectDrawInfo(object.type, curOffset, count))
            
            vertices = vertices.concat(objectVertices)
            curOffset += count
        }

        let floats = flatten(vertices)

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, floats, gl.STATIC_DRAW);

        // create vao
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        let locations = []
        for (let format of vertexFormats) {
            let location = gl.getAttribLocation( program, "aPosition");
            assert(location != -1, "Attribute location should not be -1")
            locations.push(location)

            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, format.compNum, format.type, false, 0, 0);
        }
    }

    drawAll() {
        this._bind()

        for (let [name, objectDrawInfo] of this.objectDrawInfo) {
            gl.drawArrays(objectDrawInfo.type, objectDrawInfo.offset, objectDrawInfo.count);
        }
    }

    draw(name) {
        assert(this.objects.has(name), `Can not find object with name [${name}]`)
        let objectDrawInfo = this.objectDrawInfo.get(name)
        
        this._bind()
        gl.drawArrays(objectDrawInfo.type, objectDrawInfo.offset, objectDrawInfo.count);
    }

    _bind() {
        assert(this.vao, "VAO is not inited, create it first!")
        gl.useProgram(this.program)
        gl.bindVertexArray(this.vao);
    }
}