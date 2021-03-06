let vAdd = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]];
let vAddScalar = (v, s) => [v[0] + s, v[1] + s];
let vSub = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1]];
let vMultScalar = (v, s) => [v[0] * s, v[1] * s];
let vMultVectorScalar = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1];
let angleBetweenVectors = (v1, v2) => Math.acos(vMultVectorScalar(v1, v2));
let vLength = v => Math.sqrt((v[0] * v[0]) + (v[1] * v[1]));
let vNormal = v => {
    let l = vLength(v);
    return [v[0] / l, v[1] / l];
}
let getNextPosByBezier = (t, p) => (p.length == 2 ? getNextPosByBezierTwo(t, p) : getNextPosByBezierThree(t, p));
let getNextPosByBezierTwo = (t, p) => [
    p[0][0] * (1 - t) + t * p[1][0],
    p[0][1] * (1 - t) + t * p[1][1]
];
let getNextPosByBezierThree = (t, p) => [
    p[0][0] * Math.pow((1 - t), 2) + p[1][0] *  2 * (1 - t) * t + p[2][0] * Math.pow(t, 2),
    p[0][1] * Math.pow((1 - t), 2) + p[1][1] *  2 * (1 - t) * t + p[2][1] * Math.pow(t, 2),
];
let back = (x, timeFraction) => Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x);
let makeEaseOut = (timing) => (timeFraction) => 1 - timing(1 - timeFraction);
let bounce = (timeFraction)  => {
    for (let a = 0, b = 1; 1; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
        return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
        }
    }
}
let bounceEaseOut = makeEaseOut(bounce);