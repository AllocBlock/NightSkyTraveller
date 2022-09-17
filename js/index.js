import WebGLUniform from "./webgl-uniform.js"
import PerspectiveCamera from "./camera.js"
import Scene from "./scene.js"

const gCamera = new PerspectiveCamera();
const gScene = new Scene();

function loadShaderSourceFromElement(shaderId) {
    return document.getElementById(shaderId).text;
}

function createScene() {
    let pointArray = [[-1, -1], [3, -1], [-1, 3]]
    return pointArray;
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
    gScene.addObject(gl.TRIANGLES, pointArray);
    gScene.createVao(program);

    // start render loop
    startRenderLoop(() => render(program, pointArray));
}

function render(program) {
    gl.useProgram( program );
    gScene.drawAll();
}
