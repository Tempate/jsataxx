const Board = require('../board');
const Move = require("../move");
const Types = require("../types");

test('result - Player.Black', () => {
    let tests = [
        "x6/7/7/7/7/7/7 x 0 1",
        "x6/7/7/7/7/7/7 o 0 1",
        "7/7/7/7/-------/-------/xxxxooo x 0 1",
        "7/7/7/7/-------/-------/xxxxooo o 0 1",
    ];

    tests.forEach(function(fen) {
        let pos = new Board.Board();
        pos.fromFen(fen);
        expect(pos.result()).toBe(Types.Result.BlackWin);
    });
});

test('result - Player.White', () => {
    let tests = [
        "o6/7/7/7/7/7/7 x 0 1",
        "o6/7/7/7/7/7/7 o 0 1",
        "7/7/7/7/-------/-------/xxxoooo x 0 1",
        "7/7/7/7/-------/-------/xxxoooo o 0 1",
    ];

    tests.forEach(function(fen) {
        let pos = new Board.Board();
        pos.fromFen(fen);
        expect(pos.result()).toBe(Types.Result.WhiteWin);
    });
});

test('result - Draw', () => {
    let tests = [
        "7/7/7/7/7/7/7 x 0 1",
        "7/7/7/7/7/7/7 o 0 1",
        "x5o/7/7/7/7/7/o5x x 100 1",
        "x5o/7/7/7/7/7/o5x x 101 1",
    ];

    tests.forEach(function(fen) {
        let pos = new Board.Board();
        pos.fromFen(fen);
        expect(pos.result()).toBe(Types.Result.Draw);
    });
});

test('result - none', () => {
    let tests = [
        "x5o/7/7/7/7/7/o5x x 0 1",
        "x5o/7/2-1-2/7/2-1-2/7/o5x x 0 1",
        "x5o/7/3-3/2-1-2/3-3/7/o5x x 0 1",
        "x5o/7/7/7/7/7/o5x x 0 1",
        "x5o/7/7/7/7/7/o5x x 99 1",
    ];

    tests.forEach(function(fen) {
        let pos = new Board.Board();
        pos.fromFen(fen);
        expect(pos.result()).toBe(Types.Result.None);
    });
});
