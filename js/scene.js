class Object {
    /*
     * @param pointArray, an array of vectors that contain position
     */
    constructor(type, pointArray) {
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
        this.objects = []
        this.objectDrawInfo = []
        this.posBuffer = null
    }

    addObject(type, pointArray) {
        this.objects.push(new Object(type, pointArray))
        this.posBuffer = null
    }

    clear() {
        this.objects = []
        this.objectDrawInfo = []
        this.posBuffer = null
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

        for (let objectDrawInfo of this.objectDrawInfo) {
            gl.drawArrays(objectDrawInfo.type, objectDrawInfo.offset, objectDrawInfo.count);
        }
    }

    _createPositionVertexBuffer() {
        let positions = []
        let curOffset = 0
        for (let object of this.objects) {
            let objectPositions = flatten(object.pointArray, false)
            let count = object.pointArray.length
            this.objectDrawInfo.push(new ObjectDrawInfo(object.type, curOffset, count))
            
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