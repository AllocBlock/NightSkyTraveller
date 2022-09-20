import WebGLUniform from "./webgl-uniform.js"
import PerspectiveCamera from "./camera.js"
import Interactor from "./interactor.js"
import Scene from "./scene.js"
import { requestPackedShaderSource, flatten } from "./common.js"
 
const gCamera = new PerspectiveCamera();
const gInteractor = new Interactor();
const gScene = new Scene();

function createScene() {
    const groundSize = 1000
    let vertices = [
        [-groundSize, 0, -groundSize],
        [groundSize, 0, -groundSize],
        [-groundSize, 0, groundSize],
        [groundSize, 0, groundSize],
    ]
    gScene.addObject("ground", gl.TRIANGLES, [
        vertices[0],
        vertices[1],
        vertices[2],
        vertices[2],
        vertices[1],
        vertices[3],
    ]);

    // random points
    let points = []
    for (let i = 0; i < 1000; ++i) {
        points.push([(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15])
    }
    gScene.addObject("stars", gl.POINTS, points);
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

async function createProgramAndUniform(url) {
    let shaders = await requestPackedShaderSource(url);
    const [vertexShaderSource, fragmentShaderSource] = shaders
    let program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource])

    let uniform = new WebGLUniform();
    uniform.init(program)

    return [program, uniform]
}

window.onload = async function() {
    // init gl context
    canvas = document.getElementById( "gl-canvas" );
    
    gl = canvas.getContext("webgl2");
    if (!gl) { alert( "WebGL2 isn't available" ); }
    
    onResize();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // init camera
    gCamera.setPos([0.0, 1.0, 0.0])
    gCamera.setFov(90.0)
    
    // init shader
    const [programStar, uniformStar] = await createProgramAndUniform("../shaders/star.glsl");
    const [programSolid, uniformSolid] = await createProgramAndUniform("../shaders/solid.glsl");
    
    // init vao
    createScene()
    gScene.createVao(programStar);

    // init interactor
    gInteractor.start(gCamera)

    // start render loop
    function render(deltaTime) {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gCamera.update(deltaTime)
        gInteractor.update(deltaTime)
        const aspect = canvas.width / canvas.height

        // draw star
        {
            gl.useProgram( programStar );
            uniformStar.updateVec2("uScreenSize", flatten([canvas.width, canvas.height]))
            uniformStar.updateMat4("uViewProjMat", gCamera.getViewProjMat(aspect))
            // depth test but no write
            gl.disable(gl.DEPTH_TEST);
            gl.depthMask(false);

            // additive blend
            gl.enable(gl.BLEND)
            gl.blendEquation(gl.FUNC_ADD)
            gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA)
            gScene.draw("stars");
        }

        // draw ground
        {
            gl.useProgram( programSolid );
            uniformSolid.updateMat4("uViewProjMat", gCamera.getViewProjMat(aspect))
            uniformSolid.updateVec3("uColor", flatten([0.2, 0.2, 0.2]))

            // depth test and write
            gl.enable(gl.DEPTH_TEST);
            gl.depthMask(true);
            gl.disable(gl.BLEND)

            gScene.draw("ground");
        }
    }
    startRenderLoop((deltaTime) => render(deltaTime, programStar));
}

window.onresize = onResize;
