const MoveType = require('./types').MoveType
const Util = require('./util')

function createMove(to, from) {
    if (to == undefined) {
        type = MoveType.Null;
    } else if (from == undefined) {
        type = MoveType.Single;
        from = -1;
    } else {
        switch (Util.distance(from, to)) {
            case 1:
                type = MoveType.Single;
                break;
            case 2:
                type = MoveType.Double;
                break;
            default:
                console.assert(false);
        }
    }

    return {
        from,
        to,
        type,

        toString: function() {
            switch (this.type) {
                case MoveType.Single:
                    if (from >= 0 && from < 49) {
                        return Util.squareToCoordinate(from) + Util.squareToCoordinate(to);
                    } else {
                        return Util.squareToCoordinate(to);
                    }
                case MoveType.Double:
                    return Util.squareToCoordinate(from) + Util.squareToCoordinate(to);
                case MoveType.Null:
                    return '0000';
            }
        }
    };
}

function createMoveFromString(moveString) {
    switch (moveString.length) {
        case 2:
            return createMove(Util.coordinateToSquare(moveString));
        case 4:
            return createMove(Util.coordinateToSquare(moveString.substr(2,2)), Util.coordinateToSquare(moveString.substr(0,2)));
    }
}

module.exports = {createMove, createMoveFromString}