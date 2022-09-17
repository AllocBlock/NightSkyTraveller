function assert(value, requirement = null) {
    if (!value) {
        throw "Assert failed" + (requirement ? ": " + requirement : "");
    }
}

function flatten(v, toTypeArray = true) {
    assert(Array.isArray(v), "Array.flat target should be an array")
    flatted = v.flat()
    return toTypeArray ? new Float32Array(flatted) : flatted
}

function requestText(url) {
    result = null
    return fetch(url)
    .then(response => response.text())
    .then(data => result = data);
}

function requestPackedShaderSource(url) {
    return requestText(url).then(source => {
        assert(source, "Failed to request shader source")
        shaders = source.split(/\/\/\![^\n]*\n/)
        if (shaders[0] == "")
            shaders = shaders.slice(1)
        assert(shaders.length == 2, `Current shader only support two part: vert and frag, but found ${shaders.length} parts`)
        return shaders
    })
}

// common global variable
let canvas;
let gl;