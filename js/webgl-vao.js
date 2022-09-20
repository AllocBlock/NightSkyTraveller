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
        let curObjectOffset = 0
        for (let object of objects) {
            // check format
            for (let i in vertexFormats) {
                assert(vertexFormats[i].type == gl.FLOAT, "Only support float attribute for now")
                assert( (vertexFormats[i].compNum == 1 && (object.pointArray[0][i].length == undefined || object.pointArray[0][i].length == 1)) ||
                    (vertexFormats[i].compNum == object.pointArray[0][i].length)
                , "Format and data not match")
            }

            let objectVertices = flatten(object.pointArray, false)
            let count = object.pointArray.length
            this.objectDrawInfo.set(object.name, new ObjectDrawInfo(object.type, curObjectOffset, count))
            
            vertices = vertices.concat(objectVertices)
            curObjectOffset += count
        }

        let floats = flatten(vertices)

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, floats, gl.STATIC_DRAW);

        // create vao
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        let stride = 0
        let attrOffsets = []
        for (let format of vertexFormats) {
            attrOffsets.push(stride)
            stride += format.compNum * 4
        }

        for (let i in vertexFormats) {
            let format = vertexFormats[i]
            let location = gl.getAttribLocation( program, format.name);
            assert(location != -1, "Attribute location should not be -1")

            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, format.compNum, format.type, false, stride, attrOffsets[i]);
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