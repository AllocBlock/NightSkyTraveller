class Object {
    /*
     * @param pointArray, an array of vectors that contain position
     */
    constructor(name, type, pointArray) {
        this.name = name
        this.type = type
        this.pointArray = pointArray
    }
}

class ObjectDrawInfo {
    constructor(type, offset, count) {
        this.type = type
        this.offset = offset
        this.count = count
    }
}

export default class Scene {
    constructor() {
        this.objects = new Map()
        this.objectDrawInfo = new Map()
        this.posBuffer = null
    }

    addObject(name, type, pointArray) {
        assert(!this.objects.has(name), "Already have an object with same name")
        this.objects.set(name, new Object(name, type, pointArray))
        this._clearBuffer()
    }

    getObject(name) {
        assert(this.objects.has(name), `Can not find object with name [${name}]`)
        return this.objects.get(name)
    }

    removeObject(name) {
        if (this.objects.has(name)) {
            this.objects.delete(name)
            this._clearBuffer()
        }
    }

    clear() {
        this.objects.clear()
        this._clearBuffer()
    }

    createVao(program) {
        let aPositionLoc = gl.getAttribLocation( program, "aPosition");
        assert(aPositionLoc != -1, "Attribute location should not be -1")
    
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
        this._bindVertexBuffer();
    
        gl.enableVertexAttribArray(aPositionLoc);
        // TODO: how to specific?
        gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
    }

    drawAll() {
        assert(this.vao, "VAO is not inited, create it first!")
        gl.bindVertexArray(this.vao);

        for (let [name, objectDrawInfo] of this.objectDrawInfo) {
            gl.drawArrays(objectDrawInfo.type, objectDrawInfo.offset, objectDrawInfo.count);
        }
    }

    draw(name) {
        assert(this.objects.has(name), `Can not find object with name [${name}]`)
        let objectDrawInfo = this.objectDrawInfo.get(name)
        
        assert(this.vao, "VAO is not inited, create it first!")
        gl.bindVertexArray(this.vao);
        gl.drawArrays(objectDrawInfo.type, objectDrawInfo.offset, objectDrawInfo.count);
    }

    _clearBuffer() {
        this.objectDrawInfo.clear()
        this.posBuffer = null
    }

    _createPositionVertexBuffer() {
        let positions = []
        let curOffset = 0
        for (let [name, object] of this.objects) {
            let objectPositions = flatten(object.pointArray, false)
            let count = object.pointArray.length
            this.objectDrawInfo.set(name, new ObjectDrawInfo(object.type, curOffset, count))
            
            positions = positions.concat(objectPositions)
            curOffset += count
        }

        let floats = flatten(positions)

        this.posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, floats, gl.STATIC_DRAW);
    }
    

    _bindVertexBuffer() {
        if (!this.posBuffer) {
            this._createPositionVertexBuffer()
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    }
}