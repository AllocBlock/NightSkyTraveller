import { assert, requestText, deg2rad } from "./common.js"

const ESpectrumType = {
    UNKNOWN: "Unknown",
    O: "O",
    B: "B",
    A: "A",
    F: "F",
    G: "G",
    K: "K",
    M: "M",
}

export class Star {
    constructor() {
        this.id = -1
        this.name = ""
        this.ra = 0 // RightAscension J2000
        this.dec = 0 // Declination J2000
        this.spectrumType = ESpectrumType.UNKNOWN
        this.magnitude = 0

        //this.rapr = 0 // RightAscension Proper Motion
        //this.decpr = 0 // Declination Proper Motion
    }

    getRa24h() {
        let comp = this.ra.split(" ")
        return parseInt(comp[0]) + parseInt(comp[1]) / 60.0 + parseFloat(comp[2]) / 3600.0
    }

    getDecDegree() {
        let comp = this.dec.split(" ")
        let isPositive = (this.dec[0] == "+")
        let decDegree = parseInt(comp[0].slice(1)) + parseInt(comp[1]) / 60.0 + parseFloat(comp[2]) / 3600.0
        decDegree *= isPositive ? 1.0 : -1.0;
        return decDegree;
    }

    getJ2000() {
        return [this.getRa24h(), this.getDecDegree()]
    }

    getDebugPos() {
        let [ra, dec] = this.getJ2000()
        let raRad = deg2rad(ra * 15)
        let decRad = deg2rad(dec)

        const r = 10
        let y = r * Math.sin(decRad)
        let x = r * Math.cos(decRad) * Math.cos(raRad)
        let z = r * Math.cos(decRad) * Math.sin(raRad)
        return [x, y, z]
    }
}

const gBSCDatasetFileUrl = "../dataset/bsc.tsv"

function pasreTSV(data) {
    let lastSharpIndex = data.lastIndexOf("#")
    let lastSharpLineEndIndex = data.indexOf("\n", lastSharpIndex)
    let lines = data.slice(lastSharpLineEndIndex + 1).split("\n")
    // line 1：header
    // line 2：format
    // line 3：field size

    let stars = []
    for (let i = 3; i < lines.length; ++i) {
        if (lines[i].trim().length == 0)
            continue

        let fields = lines[i].split("\t")

        let star = new Star()
        star.id = parseInt(fields[0])
        star.name = fields[1].trim()
        star.ra = fields[2].trim()
        star.dec = fields[3].trim()
        star.magnitude = parseFloat(fields[4])
        star.spectrumType = fields[5].trim()

        if (star.ra.length == 0)
            continue

        stars.push(star)
    }

    return stars
}

export function requrestStarData() {
    return requestText(gBSCDatasetFileUrl)
    .then(text => pasreTSV(text))
}