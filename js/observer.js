import { deg2rad } from "./common.js";

const gRadius = 8000;

export default class Observer {
    /*
     * @param pointArray, an array of vectors that contain position
     */
    constructor(latitude, longitude, elevation) {
        this.latitude = latitude
        this.longitude = longitude
        this.elevation = elevation
        this.observer = new Astronomy.Observer(latitude, longitude, elevation);
    }

    calPosition(date, ra, dec, refraction = false) {
        const hor = Astronomy.Horizon(date, this.observer, ra, dec, refraction ? 'normal' : false);
        // HorizontalCoordinates: azimuth is horizontal direction, altitude is vertical direction
        // azimuth = 0 North, 90 East, 180 South, 270 West
        // altitude = 0 horizon, 90 up, -90 down
        // in WebGL, -z = north, +x = east, +y = up
        let phi = deg2rad(hor.azimuth)
        let theta = deg2rad(hor.altitude)

        let z = -gRadius * Math.cos(theta) * Math.cos(phi);
        let x = gRadius * Math.cos(theta) * Math.sin(phi);
        let y = gRadius * Math.sin(theta);
        return [x, y, z]
    }
}