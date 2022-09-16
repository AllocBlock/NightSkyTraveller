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

// common global variable
let canvas;
let gl;