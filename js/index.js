"use strict";

let canvas;
let gl;

// let near = -10;
// let far = 10;
// let radius = 1;
// let theta  = 10.0*Math.PI/180.0;
// let phi    = 0.0*Math.PI/180.0;
// let dr = 3.0 * Math.PI/180.0;

// let left = -3.0;
// let right = 3.0;
// let ytop =3.0;
// let bottom = -3.0;

// let modelViewMatrix, projectionMatrix;
// let modelViewMatrixLoc, projectionMatrixLoc;

// let eye;
// let at = vec3(0.0, 0.0, 0.0);
// let up = vec3(0.0, 1.0, 0.0);

function assert(value, requirement = null) {
    if (!value) {
        throw "Assert failed" + (requirement ? ": " + requirement : "");
    }
}

function flatten(v) {
    assert(Array.isArray(v), "flatten target should be an array")
    let floats = []
    function traverse(array) {
        for (let e of array) {
            if (Array.isArray(e)) {
                traverse(e)
            }
            else {
                floats.push(e)
            }
        }
    }
    traverse(v);
    return new Float32Array(floats);
}

function loadShaderSourceFromElement(shaderId) {
    return document.getElementById(shaderId).text;
}

function createScene() {
    let pointArray = []

    function appendFullscreenTriangle() {
        pointArray.push([-1, -1])
        pointArray.push([-1, 3])
        pointArray.push([3, -1])
    }

    appendFullscreenTriangle();
    return pointArray;
}

function createVao(program, pointArray) {

    let aPositionLoc = gl.getAttribLocation( program, "aPosition");
    assert(aPositionLoc != -1, "Attribute location should not be -1")
    let vPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointArray), gl.STATIC_DRAW);

    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
    return vao;
}

function startRenderLoop(func) {
    function loop() {
        func()
        window.requestAnimationFrame(loop)
    }
    loop()
}

window.onload = function() {
    // init gl context
    canvas = document.getElementById( "gl-canvas" );
    
    gl = canvas.getContext("webgl2");
    if ( !gl ) { alert( "WebGL2 isn't available" ); }
    
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    // init shader
    const vertexShaderSource = loadShaderSourceFromElement("vertex-shader")
    const fragmentShaderSource = loadShaderSourceFromElement("fragment-shader")
    let program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource])
    gl.useProgram( program );
    
    // init vao
    let pointArray = createScene()
    let vao = createVao(program, pointArray)
    gl.bindVertexArray(vao);

    // start render loop
    startRenderLoop(() => render(program, pointArray));
}

function render(program, pointArray) {
    gl.useProgram( program );
    // let modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    // let projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    // let colorLoc = gl.getUniformLocation(program, "uColor");
    // assert(colorLoc, "Uniform location is null")

    // gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // gl.enable(gl.DEPTH_TEST);
    // gl.disable(gl.DEPTH_TEST);
    // eye = vec3(radius*Math.cos(theta)*Math.sin(phi), radius*Math.sin(theta), radius*Math.cos(theta)*Math.cos(phi));
    // modelViewMatrix = lookAt(eye, at , up);
    // projectionMatrix = ortho(left, right, bottom, ytop, near, far);
            
    // gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    // gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    // let pointNumber = (pointArray.length - subline*2 - 2)/2;

    //console.log("facenumber:", pointNumber, pointArray.length/2);

    // gl.uniform1f(thetaAutoLOC, 0.0);
    // gl.uniform1f(thetaRevoLOC, 0.0);
    // gl.uniform1f(radiusRevoLOC, 0.0);
    // gl.uniform4fv(colorLoc, colorList['orange']);
    gl.drawArrays(gl.TRIANGLES, 0, pointArray.length);
    // gl.uniform4fv(colorLoc, colorList['black']);
    // gl.drawArrays( gl.LINES, pointNumber*2, subline*2);
}
