// Chess logic utilities for frontend

export function isWhitePiece(piece) {
    return piece && piece === piece.toUpperCase();
}

export function isBlackPiece(piece) {
    return piece && piece === piece.toLowerCase();
}

export function isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function getPieceSymbol(piece) {
    const symbols = {
        'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
        'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    };
    return symbols[piece] || '';
}

export function getPieceImage(piece) {
    if (!piece) return null;
    const isWhite = isWhitePiece(piece);
    const prefix = isWhite ? 'w' : 'b';
    return `/images/${prefix}${piece.toUpperCase()}.png`;
}

export function getSquareColor(row, col) {
    return (row + col) % 2 === 0 ? '#eeeed2' : '#769656';
}

export function algebraicNotation(row, col) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return files[col] + ranks[row];
}

export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getValidMovesClient(board, row, col) {
    // This is a simplified version for highlighting
    // Actual validation happens on the server
    const piece = board[row][col];
    if (!piece) return [];

    const isWhite = isWhitePiece(piece);
    const moves = [];

    switch (piece.toUpperCase()) {
        case 'P':
            return getPawnMovesClient(board, row, col, isWhite);
        case 'R':
            return getRookMovesClient(board, row, col, isWhite);
        case 'N':
            return getKnightMovesClient(board, row, col, isWhite);
        case 'B':
            return getBishopMovesClient(board, row, col, isWhite);
        case 'Q':
            return getQueenMovesClient(board, row, col, isWhite);
        case 'K':
            return getKingMovesClient(board, row, col, isWhite);
        default:
            return [];
    }
}

function getPawnMovesClient(board, row, col, isWhite) {
    const moves = [];
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;

    const newRow = row + direction;
    if (isValidPosition(newRow, col) && !board[newRow][col]) {
        moves.push([newRow, col]);

        if (row === startRow && !board[row + 2 * direction][col]) {
            moves.push([row + 2 * direction, col]);
        }
    }

    for (const colOffset of [-1, 1]) {
        const newCol = col + colOffset;
        if (isValidPosition(newRow, newCol)) {
            const targetPiece = board[newRow][newCol];
            if (targetPiece && isWhitePiece(targetPiece) !== isWhite) {
                moves.push([newRow, newCol]);
            }
        }
    }

    return moves;
}

function getRookMovesClient(board, row, col, isWhite) {
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

function getKnightMovesClient(board, row, col, isWhite) {
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

function getBishopMovesClient(board, row, col, isWhite) {
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

function getQueenMovesClient(board, row, col, isWhite) {
    return [...getRookMovesClient(board, row, col, isWhite), ...getBishopMovesClient(board, row, col, isWhite)];
}

function getKingMovesClient(board, row, col, isWhite) {
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

    return moves;
}
