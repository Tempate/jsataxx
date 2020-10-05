const Types = require('./types');

const MoveType  = Types.MoveType
const StoneType = Types.StoneType
const Player    = Types.Player
const Result    = Types.Result

const initialFen = "x5o/7/7/7/7/7/o5x x 0 1";

const single_offsets = [
    [-1,-1],
    [-1,0],
    [-1,1],
    [0,-1],
    [0,1],
    [1,-1],
    [1,0],
    [1,1]
];

const double_offsets = [
    [-2,-2],
    [-2,-1],
    [-2,0],
    [-2,1],
    [-2,2],
    [-1,-2],
    [-1,2],
    [0,-2],
    [0,2],
    [1,-2],
    [1,2],
    [2,-2],
    [2,-1],
    [2,0],
    [2,1],
    [2,2]
];

const move_offsets = single_offsets.concat(double_offsets);


class Board {
    constructor() {
        this.turn = Player.Black;
        this.ply = 0;
        this.fiftyMovesCounter = 0;
        this.stones = [
            StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,
            StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,
            StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,
            StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,
            StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,
            StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,
            StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,StoneType.Blank,
        ];
    }

    toFen() {
        let fen = "";

        for (let y = 6; y >= 0; y--) {
            for (let x = 0; x < 7; x++) {
                const square = y * 7 + x;

                switch (this.stones[square]) {
                    case StoneType.Blank:
                        // If the last character is a number, increase it.
                        // Otherwise, append a 1.

                        const lastCharacter = fen.slice(-1)

                        if (!lastCharacter || isNaN(lastCharacter)) { 
                            fen += '1' 
                        } else { 
                            fen = fen.slice(0, -1) + (parseInt(lastCharacter) + 1) 
                        }

                        break;
                    case StoneType.Black:
                        fen += 'x';
                        break;
                    case StoneType.White:
                        fen += 'o';
                        break;
                    case StoneType.Gap:
                        fen += '-';
                        break;
                }
            }

            if (y > 0) {
                fen += '/';
            }
        }

        fen += ' ';
        fen += (turn == Player.Black) ? 'x' : 'o';

        fen += ' ';
        fen += fiftyMovesCounter.toString();

        fen += ' ';
        fen += ply.toString();

        return fen;
    }

    fromFen(fen) {
        const fenParts = fen.split(' ');

        // Load the board state
        const boardFen = fenParts[0];

        let x = 0;
        let y = 6;

        for (let i = 0; i < boardFen.length; i++) {
            const square = y * 7 + x;

            switch (boardFen.charAt(i)) {
                case 'x':
                    this.stones[square] = StoneType.Black;
                    x++;
                    break;
                case 'o':
                    this.stones[square] = StoneType.White;
                    x++;
                    break;
                case '-':
                    this.stones[square] = StoneType.Gap;
                    x++;
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                    // Add as many blank stones as the number indicates
                    const blankStonesCount = Number(fen.charAt(i));

                    for (let k = 0; k < blankStonesCount; k++) {
                        this.stones[square + k] = StoneType.Blank;
                    }

                    x += blankStonesCount;
                    break;
                case '/':
                    x = 0;
                    y--;
                    break;
            }
        }

        // Load the turn
        switch (fenParts[1].charAt(0)) {
            case 'x':
            case 'X':
            case 'b':
            case 'B':
                this.turn = Player.Black;
                break;
            case 'o':
            case 'O':
            case 'w':
            case 'W':
                this.turn = Player.White;
                break;
        }

        // Load counters
        this.fiftyMovesCounter = Number(fenParts[2]) - Number('0');
        this.ply = Number(fenParts[3]) - Number('0');
    }

    isLegal(move) {
        const stoneType = (this.turn == Player.White) ? StoneType.White : StoneType.Black;

        if (move.type == MoveType.Null) {

            // Iterate through all blank squares and check that no friendly stone
            // can move or jump to it.
            for (let square = 0; square < stones.length; square++) {
                if (this.stones[square] == StoneType.Blank && this.surroundingStones(square, stoneType, 2).length > 0) {
                    return false; 
                }
            }

            return true;
        }

        // Check that move.to's value is within range
        if (move.to < 0 || move.to >= 49) {
            return false;
        }

        // Check that the destination is empty
        if (this.stones[move.to] != StoneType.Blank) {
            return false;
        }

        switch (move.type) {
            case MoveType.Single:

                // Check that there is an adjacent, friendly stone to make the move
                return this.surroundingStones(move.to, stoneType, 1).length > 0;
            
            case MoveType.Double:
                // Check that move.from's value is within range
                if (move.from < 0 || move.from >= 49) {
                    return false;
                }

                // Check that there's a friendly stone at the departure square
                return this.stones[move.from] == stoneType;
        }

        return false;
    }

    make(move) {
        let opponent;
        let friendlyStoneType;
        let hostileStoneType;


        switch (this.turn) {
            case Player.White:
                friendlyStoneType = StoneType.White;
                hostileStoneType = StoneType.Black;

                opponent = Player.Black;

                break;
            case Player.Black:
                friendlyStoneType = StoneType.Black;
                hostileStoneType = StoneType.White;

                opponent = Player.White;

                break;
        }

        let newFiftyMovesCounter = 0;

        switch (move.type) {
            case MoveType.Double:
                // Remove the stone that's jumping
                this.stones[move.from] = StoneType.Blank;

                // Increase the fifty-moves counter
                newFiftyMovesCounter = this.fiftyMovesCounter + 1;

                // no break
            case MoveType.Single:
                // Place a friendly stone at the destination
                this.stones[move.to] = friendlyStoneType;

                // Capture all adjacent, hostile stones
                this.surroundingStones(move.to, hostileStoneType, 1).forEach(square => {
                    this.stones[square] = friendlyStoneType;
                });

                break;
        }

        // Swap the turn
        if (this.hasMoves(opponent)) {
            //this.turn = opponent;
        }
        this.turn = opponent;

        // Update the fifty-moves counter
        this.fiftyMovesCounter = newFiftyMovesCounter;

        this.ply++;
    }

    reachableSquares(square) {
        return this.surroundingStones(square, StoneType.Blank, 2);
    }

    // List all the squares in the surroundings of a stone 
    // that contain stones of a given type.

    // The margin indicates how big those surroundings are.
    // For instance, a margin of 1 would comprehend adjacent squares.
    surroundingStones(square, type, margin) {
        console.assert(square >= 0 && square < 49);
        console.assert(type == StoneType.White || type == StoneType.Black || type == StoneType.Blank || type == StoneType.Gap);
        console.assert(margin >= 1 && margin <= 3);

        let squares = [];

        const moveToX = square % 7;
        const moveToY = Math.floor(square / 7);

        for (let y = Math.max(0, moveToY - margin); y <= Math.min(6, moveToY + margin); y++) {
            for (let x = Math.max(0, moveToX - margin); x <= Math.min(6, moveToX + margin); x++) {
                const pos = y * 7 + x;

                if (pos != square && this.stones[pos] == type) {
                    squares.push(pos);
                }
            }
        }

        return squares;
    }

    // List with the possible moves for a given stone
    stoneMoves(square) {
        console.assert(square >= 0 && square < 49);
        console.assert(this.stones[square] == StoneType.White || this.stones[square] == StoneType.Black);

        return this.reachableSquares(square).map(squareTo => this.createMove(squareTo, square));
    }

    // Detects if a side has available moves
    hasMoves(side) {
        console.assert(side == Player.White || side == Player.Black);

        const stoneType = (side == Player.White) ? StoneType.White : StoneType.Black;

        for (let square = 0; square < 49; square++) {
            if (this.stones[square] == stoneType && this.reachableSquares(square).length > 0) {
                return true;
            }
        }

        return false;
    }

    movesLeft() {
        for (let y = 0; y < 7; y++) {
            for (let x = 0; x < 7; x++) {
                let idx = 7 * y + x;

                if (this.stones[idx] != StoneType.Blank) {
                    continue;
                }

                // See if a stone can move here
                for (let i = 0; i < move_offsets.length; i++) {
                    let nx = x + move_offsets[i][0];
                    let ny = y + move_offsets[i][1];

                    // We went off the edge of the board
                    if (nx < 0 || nx > 6 || ny < 0 || ny > 6) {
                        continue;
                    }

                    let nidx = 7 * ny + nx;

                    if (this.stones[nidx] == StoneType.Black || this.stones[nidx] == StoneType.White) {
                        return true;
                    }
                }
            }    
        }

        return false;
    }

    // Determine if the game has ended and the proper result
    result() {
        let numBlack = 0;
        let numWhite = 0;

        for (let i = 0; i < 49; i++) {
            if (this.stones[i] == StoneType.White) {
                numWhite++;
            } else if (this.stones[i] == StoneType.Black) {
                numBlack++;
            }
        }

        if (!this.movesLeft() || numBlack == 0 || numWhite == 0) {
            if (numBlack > numWhite) {
                return Result.BlackWin;
            } else if (numWhite > numBlack) {
                return Result.WhiteWin;
            } else {
                return Result.Draw;
            }
        }

        if (this.fiftyMovesCounter >= 100) {
            return Result.Draw;
        }

        return Result.None;
    }

    toString() {
        let boardString = "";

        for (let y = 6; y >= 0; y--) {
            for (let x = 0; x < 7; x++) {
                let idx = 7 * y + x;
                switch (this.stones[idx]) {
                    case StoneType.Blank:
                        boardString += "-";
                        break;
                    case StoneType.Gap:
                        boardString += " ";
                        break;
                    case StoneType.Black:
                        boardString += "x";
                        break;
                    case StoneType.White:
                        boardString += "o";
                        break;
                    default:
                        boardString += "?";
                        break;
                }
            }

            boardString += "\n";
        }

        if (this.turn == Player.Black) {
            boardString += "x";
        } else if (this.turn == Player.White) {
            boardString += "o";
        } else {
            boardString += "?";
        }

        return boardString
    }
}

module.exports = {Board, initialFen}