const MoveType = {
    Single: 0,
    Double: 1,
    Null: 2
}

const Player = {
    White: 0,
    Black: 1 
}

const StoneType = {
    White: 0,
    Black: 1,
    Blank: 2,
    Gap: 3
}

const Result = {
    None: 0,
    Draw: 1,
    BlackWin: 2,
    WhiteWin: 3
}

module.exports = {MoveType, Player, StoneType, Result}