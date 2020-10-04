function coordinateToSquare(coordinate) {
    const x = coordinate.charCodeAt(0) - "a".charCodeAt(0);
    const y = coordinate.charCodeAt(1) - "1".charCodeAt(0);

    return y * 7 + x;
}

function squareToCoordinate(square) {
    const x = square % 7;
    const y = square / 7;

    return String.fromCharCode("a".charCodeAt(0) + x) + String.fromCharCode("1".charCodeAt(0) + y);
}

function distance(s1, s2) {
    const x1 = s1 % 7
    const x2 = s2 % 7

    const y1 = Math.floor(s1 / 7)
    const y2 = Math.floor(s2 / 7)

    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2))
}

module.exports = {coordinateToSquare, squareToCoordinate, distance}