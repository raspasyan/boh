let vAdd = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]];
let vAddScalar = (v, s) => [v[0] + s, v[1] + s];
let vSub = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1]];
let vMultScalar = (v, s) => [v[0] * s, v[1] * s];
let vMultVectorScalar = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1];
let angleBetweenVectors = (v1, v2) => Math.acos(vMultVectorScalar(v1, v2));
// let vMult = (v1, v2) => ();
let vLength = v => Math.sqrt((v[0] * v[0]) + (v[1] * v[1]));
let vNormal = v => {
    let l = vLength(v);
    return [v[0] / l, v[1] / l];
}