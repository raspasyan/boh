function vAdd(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}
function vAddScalar(v, s) {
    return [v[0] + s, v[1] + s];
}
function vSub(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1]];
}
function vMultScalar(v, s) {
    return [v[0] * s, v[1] * s];
}
function vMultVectorScalar(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
}
function angleBetweenVectors(v1, v2) {
    return Math.acos(vMultVectorScalar(v1, v2));
}
function vMult(v1, v2) {
    //
}
function vLength(v) {
    return Math.sqrt((v[0] * v[0]) + (v[1] * v[1]));
}
function vNormal(v) {
    let l = vLength(v);
    return [v[0] / l, v[1] / l];
}