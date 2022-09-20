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
        this.name = ""
        this.ra = 0 // RightAscension J2000
        this.dec = 0 // Declination J2000
        this.spectrumType = ESpectrumType.UNKNOWN
        this.magnitude = 0

        //this.rapr = 0 // RightAscension Proper Motion
        //this.decpr = 0 // Declination Proper Motion
    }
}

function loadStarFromFile(url) {
    
}

export function getStars() {
    return []
}