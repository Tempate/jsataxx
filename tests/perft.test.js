const Board = require('../board');
const Move = require("../move");

function perft(pos, depth) {
    if (depth == 0) {
        return 1;
    } else if (depth == 1) {
        return pos.legalMoves().length;
    }

    let nodes = 0;
    let moves = pos.legalMoves();

    for (let i = 0; i < moves.length; i++) {
        let npos = new Board.Board();
        Board.copy(npos, pos);
        npos.make(moves[i]);
        nodes += perft(npos, depth - 1);
    }

    return nodes;
}

test('perft', () => {
    let tests = [
        ["7/7/7/7/7/7/7 x 0 1", [1, 0, 0, 0, 0]],
        ["7/7/7/7/7/7/7 o 0 1", [1, 0, 0, 0, 0]],
        ["x5o/7/7/7/7/7/o5x x 0 1", [1, 16, 256, 6460, 155888]],
        ["x5o/7/7/7/7/7/o5x o 0 1", [1, 16, 256, 6460, 155888]],
        ["x5o/7/2-1-2/7/2-1-2/7/o5x x 0 1", [1, 14, 196, 4184, 86528]],
        ["x5o/7/2-1-2/7/2-1-2/7/o5x o 0 1", [1, 14, 196, 4184, 86528]],
        ["x5o/7/2-1-2/3-3/2-1-2/7/o5x x 0 1", [1, 14, 196, 4100, 83104]],
        ["x5o/7/2-1-2/3-3/2-1-2/7/o5x o 0 1", [1, 14, 196, 4100, 83104]],
        ["x5o/7/3-3/2-1-2/3-3/7/o5x x 0 1", [1, 16, 256, 5948, 133264]],
        ["x5o/7/3-3/2-1-2/3-3/7/o5x o 0 1", [1, 16, 256, 5948, 133264]],
        ["7/7/7/7/ooooooo/ooooooo/xxxxxxx x 0 1", [1, 1, 75, 249, 14270]],
        ["7/7/7/7/ooooooo/ooooooo/xxxxxxx o 0 1", [1, 75, 249, 14270]],
        ["7/7/7/7/xxxxxxx/xxxxxxx/ooooooo x 0 1", [1, 75, 249, 14270]],
        ["7/7/7/7/xxxxxxx/xxxxxxx/ooooooo o 0 1", [1, 1, 75, 249, 14270]],
        ["7/7/7/2x1o2/7/7/7 x 0 1", [1, 23, 419, 7887, 168317]],
        ["7/7/7/2x1o2/7/7/7 o 0 1", [1, 23, 419, 7887, 168317]],
        ["x5o/7/7/7/7/7/o5x x 100 1", [1, 0, 0, 0, 0]],
        ["x5o/7/7/7/7/7/o5x o 100 1", [1, 0, 0, 0, 0]],
        ["7/7/7/7/-------/-------/x5o x 0 1", [1, 2, 4, 13, 30, 73, 174]],
        ["7/7/7/7/-------/-------/x5o o 0 1", [1, 2, 4, 13, 30, 73, 174]],
    ];

    tests.forEach(function(item) {
        let pos = new Board.Board();
        pos.fromFen(item[0]);

        item[1].forEach(function(nodes, depth) {
            expect(perft(pos, depth)).toBe(nodes);
        });
    });
});
