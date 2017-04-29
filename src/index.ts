declare var require;

var geodesy = require("geodesy");

export function toLatLon(lat0, lon0, x, y) {
    var dimension = getGeoDimension(lat0, lon0, 10000);
    
    return {
        lat: lat0 + y * dimension.ky,
        lon: lon0 + x * dimension.kx
    }
}

export function toXY(lat0, lon0, lat, lon) {
    var dimension = getGeoDimension(lat0, lon0, 10000);
    
    var inverted = {
        kLat: 1/dimension.ky,
        kLon: 1/dimension.kx
    }
    
    return {
        x: (lon - lon0) * inverted.kLon,
        y: (lat - lat0) * inverted.kLat
    }
}

function getGeoDimension(lat, lon, accuracy): any {
    var deltaLat = lat/accuracy;
    var deltaLon = lon/accuracy;

    var latLon0 = new geodesy.LatLonEllipsoidal(lat, lon);

    var latLonX = new geodesy.LatLonEllipsoidal(lat, lon + deltaLon);
    var latLonY = new geodesy.LatLonEllipsoidal(lat + deltaLat, lon);

    var v0 = latLon0.toCartesian();
    var vx = latLonX.toCartesian();
    var vy = latLonY.toCartesian();

    var x = vx.minus(v0).length();
    var y = vy.minus(v0).length();

    return {
        kx: deltaLon/x,
        ky: deltaLat/y
    }
}