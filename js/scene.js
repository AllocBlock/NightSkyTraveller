import { assert, flatten } from "./common.js"
import Object from "./object.js"

export default class Scene {
    constructor() {
        this.objects = new Map()
    }

    addObject(name, type, pointArray) {
        assert(!this.objects.has(name), "Already have an object with same name")
        this.objects.set(name, new Object(name, type, pointArray))
    }

    getObject(name) {
        assert(this.objects.has(name), `Can not find object with name [${name}]`)
        return this.objects.get(name)
    }

    removeObject(name) {
        if (this.objects.has(name)) {
            this.objects.delete(name)
        }
    }

    clear() {
        this.objects.clear()
    }
}