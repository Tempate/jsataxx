const MoveType = require('./types').MoveType
const Util = require('./util')

function createMove(to, from) {
    if (from == undefined || Util.distance(from, to) == 1) {
        type = MoveType.Single
        from = -1
    } else {
        type = MoveType.Double
    }

    return {
        from,
        to,
        type,

        toString: function() {
            switch (type) {
                case MoveType.Single:
                    return Util.squareToCoordinate(to)
                case MoveType.Double:
                    return Util.squareToCoordinate(from) + Util.squareToCoordinate(to)
                case MoveType.Null:
                    return '0000'
            }
        }
    };
}

function createMoveFromString(moveString) {
    switch (moveString.length) {
        case 2:
            return createMove(Util.coordinateToSquare(moveString))
        case 4:
            return createMove(Util.coordinateToSquare(moveString.substr(2,2)), Util.coordinateToSquare(moveString.substr(0,2)))
    }
}

module.exports = {createMove, createMoveFromString}