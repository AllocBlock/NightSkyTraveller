import WebGLUniform from "./webgl-uniform.js"
import PerspectiveCamera from "./camera.js"
import Interactor from "./interactor.js"
import Scene from "./scene.js"

const gCamera = new PerspectiveCamera();
const gInteractor = new Interactor();
const gUniform = new WebGLUniform();
const gScene = new Scene();

function createScene() {
    gScene.addObject(gl.TRIANGLES, [[-1, -1, 0], [3, -1, 0], [-1, 3, 0]]);

    // random points
    let points = []
    for (let i = 0; i < 1000; ++i) {
        points.push([(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15])
    }
    gScene.addObject(gl.POINTS, points);
}

function startRenderLoop(func) {
    let prevTick = Date.now();
    function loop() {
        let curTick = Date.now();
        let deltaTime = (curTick - prevTick) / 1000.0;
        func(deltaTime)
        prevTick = curTick;
        window.requestAnimationFrame(loop)
    }
    loop()
}

function onResize() {
    if (gl && canvas) {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
}

window.onload = async function() {
    // init gl context
    canvas = document.getElementById( "gl-canvas" );
    
    gl = canvas.getContext("webgl2");
    if (!gl) { alert( "WebGL2 isn't available" ); }
    
    onResize();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // init camera
    gCamera.position = [0.0, 0.0, -10]
    gCamera.fov = 120.0
    
    // init shader
    shaders = await requestPackedShaderSource("../shaders/simple.glsl");
    const [vertexShaderSource, fragmentShaderSource] = shaders
    let program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource])
    gl.useProgram( program );
    gUniform.init(program)
    
    // init vao
    createScene()
    gScene.createVao(program);

    // init interactor
    gInteractor.start(gCamera)

    // start render loop
    startRenderLoop((deltaTime) => render(deltaTime, program));
}

window.onresize = onResize;

function render(deltaTime, program) {
    gl.useProgram( program );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gInteractor.update(deltaTime)
    let aspect = canvas.width / canvas.height
    gUniform.updateMat4("uViewProjMat", gCamera.getViewProjMat(aspect))
    gScene.drawAll();
}
