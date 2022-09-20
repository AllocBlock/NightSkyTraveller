export function assert(value, requirement = null) {
    if (!value) {
        throw "Assert failed" + (requirement ? ": " + requirement : "");
    }
}

export function flatten(v, toTypeArray = true) {
    assert(Array.isArray(v), "Array.flat target should be an array")
    let flatted = v.flat()
    return toTypeArray ? new Float32Array(flatted) : flatted
}

export function requestText(url) {
    return fetch(url)
    .then(response => response.text())
}

export function requestPackedShaderSource(url) {
    return requestText(url).then(source => {
        assert(source, "Failed to request shader source")
        let shaders = source.split(/\/\/\![^\n]*\n/)
        if (shaders[0] == "")
            shaders = shaders.slice(1)
        assert(shaders.length == 2, `Current shader only support two part: vert and frag, but found ${shaders.length} parts`)
        return shaders
    })
}

export function deg2rad(deg) {
    return (deg / 360.0) * (2 * Math.PI)
}

// common global variable
let canvas;
let gl;