// Chess game logic and move validation

export function createInitialBoard() {
    return [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
}

export function isWhitePiece(piece) {
    return piece && piece === piece.toUpperCase();
}

export function isBlackPiece(piece) {
    return piece && piece === piece.toLowerCase();
}

export function isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function getValidMoves(board, row, col, gameState = {}) {
    const piece = board[row][col];
    if (!piece) return [];

    const isWhite = isWhitePiece(piece);
    const moves = [];

    switch (piece.toUpperCase()) {
        case 'P':
            moves.push(...getPawnMoves(board, row, col, isWhite, gameState));
            break;
        case 'R':
            moves.push(...getRookMoves(board, row, col, isWhite));
            break;
        case 'N':
            moves.push(...getKnightMoves(board, row, col, isWhite));
            break;
        case 'B':
            moves.push(...getBishopMoves(board, row, col, isWhite));
            break;
        case 'Q':
            moves.push(...getQueenMoves(board, row, col, isWhite));
            break;
        case 'K':
            moves.push(...getKingMoves(board, row, col, isWhite, gameState));
            break;
    }

    return moves;
}

function getPawnMoves(board, row, col, isWhite, gameState) {
    const moves = [];
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;

    // Move forward one square
    const newRow = row + direction;
    if (isValidPosition(newRow, col) && !board[newRow][col]) {
        moves.push([newRow, col]);

        // Move forward two squares from starting position
        if (row === startRow && !board[row + 2 * direction][col]) {
            moves.push([row + 2 * direction, col]);
        }
    }

    // Capture diagonally
    for (const colOffset of [-1, 1]) {
        const newCol = col + colOffset;
        if (isValidPosition(newRow, newCol)) {
            const targetPiece = board[newRow][newCol];
            if (targetPiece && isWhitePiece(targetPiece) !== isWhite) {
                moves.push([newRow, newCol]);
            }

            // En passant
            if (gameState.enPassant &&
                gameState.enPassant.row === newRow &&
                gameState.enPassant.col === newCol) {
                moves.push([newRow, newCol]);
            }
        }
    }

    return moves;
}

function getRookMoves(board, row, col, isWhite) {
    const moves = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (const [dRow, dCol] of directions) {
        let newRow = row + dRow;
        let newCol = col + dCol;

        while (isValidPosition(newRow, newCol)) {
            const targetPiece = board[newRow][newCol];

            if (!targetPiece) {
                moves.push([newRow, newCol]);
            } else {
                if (isWhitePiece(targetPiece) !== isWhite) {
                    moves.push([newRow, newCol]);
                }
                break;
            }

            newRow += dRow;
            newCol += dCol;
        }
    }

    return moves;
}

function getKnightMoves(board, row, col, isWhite) {
    const moves = [];
    const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (const [dRow, dCol] of knightMoves) {
        const newRow = row + dRow;
        const newCol = col + dCol;

        if (isValidPosition(newRow, newCol)) {
            const targetPiece = board[newRow][newCol];
            if (!targetPiece || isWhitePiece(targetPiece) !== isWhite) {
                moves.push([newRow, newCol]);
            }
        }
    }

    return moves;
}

function getBishopMoves(board, row, col, isWhite) {
    const moves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (const [dRow, dCol] of directions) {
        let newRow = row + dRow;
        let newCol = col + dCol;

        while (isValidPosition(newRow, newCol)) {
            const targetPiece = board[newRow][newCol];

            if (!targetPiece) {
                moves.push([newRow, newCol]);
            } else {
                if (isWhitePiece(targetPiece) !== isWhite) {
                    moves.push([newRow, newCol]);
                }
                break;
            }

            newRow += dRow;
            newCol += dCol;
        }
    }

    return moves;
}

function getQueenMoves(board, row, col, isWhite) {
    return [...getRookMoves(board, row, col, isWhite), ...getBishopMoves(board, row, col, isWhite)];
}

function getKingMoves(board, row, col, isWhite, gameState) {
    const moves = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dRow, dCol] of directions) {
        const newRow = row + dRow;
        const newCol = col + dCol;

        if (isValidPosition(newRow, newCol)) {
            const targetPiece = board[newRow][newCol];
            if (!targetPiece || isWhitePiece(targetPiece) !== isWhite) {
                moves.push([newRow, newCol]);
            }
        }
    }

    // Castling
    if (gameState.castling) {
        const castlingRights = isWhite ? gameState.castling.white : gameState.castling.black;

        // Kingside castling
        if (castlingRights.kingside &&
            !board[row][col + 1] &&
            !board[row][col + 2]) {
            moves.push([row, col + 2]);
        }

        // Queenside castling
        if (castlingRights.queenside &&
            !board[row][col - 1] &&
            !board[row][col - 2] &&
            !board[row][col - 3]) {
            moves.push([row, col - 2]);
        }
    }

    return moves;
}

export function isInCheck(board, isWhite) {
    // Find king position
    let kingRow, kingCol;
    const kingPiece = isWhite ? 'K' : 'k';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === kingPiece) {
                kingRow = row;
                kingCol = col;
                break;
            }
        }
    }

    // Check if any opponent piece can attack the king
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && isWhitePiece(piece) !== isWhite) {
                const moves = getValidMoves(board, row, col, {});
                if (moves.some(([r, c]) => r === kingRow && c === kingCol)) {
                    return true;
                }
            }
        }
    }

    return false;
}

export function isCheckmate(board, isWhite) {
    if (!isInCheck(board, isWhite)) return false;

    // Check if any move can get out of check
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && isWhitePiece(piece) === isWhite) {
                const moves = getValidMoves(board, row, col, {});

                for (const [newRow, newCol] of moves) {
                    // Simulate move
                    const tempBoard = board.map(r => [...r]);
                    tempBoard[newRow][newCol] = tempBoard[row][col];
                    tempBoard[row][col] = null;

                    if (!isInCheck(tempBoard, isWhite)) {
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

export function isStalemate(board, isWhite) {
    if (isInCheck(board, isWhite)) return false;

    // Check if any legal move exists
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && isWhitePiece(piece) === isWhite) {
                const moves = getValidMoves(board, row, col, {});

                for (const [newRow, newCol] of moves) {
                    // Simulate move
                    const tempBoard = board.map(r => [...r]);
                    tempBoard[newRow][newCol] = tempBoard[row][col];
                    tempBoard[row][col] = null;

                    if (!isInCheck(tempBoard, isWhite)) {
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

export function validateMove(board, fromRow, fromCol, toRow, toCol, gameState) {
    const piece = board[fromRow][fromCol];
    if (!piece) return { valid: false, reason: 'No piece at source position' };

    const validMoves = getValidMoves(board, fromRow, fromCol, gameState);
    const isValid = validMoves.some(([r, c]) => r === toRow && c === toCol);

    if (!isValid) {
        return { valid: false, reason: 'Invalid move for this piece' };
    }

    // Check if move puts own king in check
    const isWhite = isWhitePiece(piece);
    const tempBoard = board.map(r => [...r]);
    tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
    tempBoard[fromRow][fromCol] = null;

    if (isInCheck(tempBoard, isWhite)) {
        return { valid: false, reason: 'Move puts king in check' };
    }

    return { valid: true };
}
