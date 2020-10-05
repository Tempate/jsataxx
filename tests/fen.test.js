const Board = require('../board');

test('toFen()', () => {
    let tests = [
        Board.initialFen,
        "x5o/7/7/7/7/7/o5x x 0 1",
        "x5o/7/2-1-2/7/2-1-2/7/o5x x 0 1",
        "x5o/7/3-3/2-1-2/3-3/7/o5x x 0 1",
        "xx4o/7/7/7/7/7/o5x x 0 1",
        "7/7/7/7/7/7/7 x 0 1",
        "7/7/7/7/7/7/7 o 0 1",
        "7/7/7/7/7/7/7 x 100 1",
        "7/7/7/7/7/7/7 o 100 1",
        "7/7/7/7/7/7/7 x 0 100",
        "7/7/7/7/7/7/7 o 0 100",
        "7/7/7/7/7/7/7 x 100 200",
        "7/7/7/7/7/7/7 o 100 200",
    ];

    tests.forEach(function(fen) {
        let pos = new Board.Board();
        pos.fromFen(fen);
        expect(pos.toFen()).toBe(fen);
    });
});
