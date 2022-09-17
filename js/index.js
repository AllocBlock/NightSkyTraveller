import WebGLUniform from "./webgl-uniform.js"
import PerspectiveCamera from "./camera.js"
import Scene from "./scene.js"

const gCamera = new PerspectiveCamera();
const gScene = new Scene();

function createScene() {
    gScene.addObject(gl.TRIANGLES, [[-1, -1, 0], [3, -1, 0], [-1, 3, 0]]);
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
    // const vertexShaderSource = loadShaderSourceFromElement("vertex-shader")
    // const fragmentShaderSource = loadShaderSourceFromElement("fragment-shader")
    requestPackedShaderSource("../shaders/simple.glsl").then(shaders => {
        const [vertexShaderSource, fragmentShaderSource] = shaders
        let program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource])
        gl.useProgram( program );
        
        // init vao
        createScene()
        gScene.createVao(program);

        // start render loop
        startRenderLoop(() => render(program));
    })
}

function render(program) {
    gl.useProgram( program );
    gScene.drawAll();
}
