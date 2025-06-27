// Example of board representation
const board = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];
// Uppercase for White, lowercase for Black (standard notation)

const canvas = document.getElementById('chessBoard');
const ctx = canvas.getContext('2d');
const squareSize = canvas.width / 8;

const pieceImages = {}; // To store loaded piece images

// Load piece images (you'll need to provide these image paths)
function loadImages() {
    const pieces = ['bR', 'bN', 'bB', 'bQ', 'bK', 'bP', 'wR', 'wN', 'wB', 'wQ', 'wK', 'wP'];
    let loadedCount = 0;
    pieces.forEach(piece => {
        const img = new Image();
        img.src = `images/${piece}.png`; // Adjust path as needed
        img.onload = () => {
            pieceImages[piece] = img;
            loadedCount++;
            if (loadedCount === pieces.length) {
                drawBoard();
                drawPieces();
            }
        };
    });
}

function drawBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const color = (row + col) % 2 === 0 ? '#eeeed2' : '#769656'; // Light and dark square colors
            ctx.fillStyle = color;
            ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
        }
    }
}

function drawPieces() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const pieceCode = board[row][col];
            if (pieceCode) {
                const isWhite = pieceCode === pieceCode.toUpperCase();
                const imgKey = (isWhite ? 'w' : 'b') + pieceCode.toUpperCase();
                const img = pieceImages[imgKey];
                if (img) {
                    ctx.drawImage(img, col * squareSize, row * squareSize, squareSize, squareSize);
                }
            }
        }
    }
}

loadImages(); // Call this to start loading and drawing

let selectedPiece = null;
let turn = 'white'; // 'white' or 'black'
let possibleMoves = [];

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);

    const clickedPiece = board[row][col];

    if (selectedPiece) {
        // A piece is already selected, try to move it
        const [startRow, startCol] = selectedPiece;
        const isValidMove = possibleMoves.some(move => move[0] === row && move[1] === col);

        if (isValidMove) {
            makeMove(startRow, startCol, row, col);
            selectedPiece = null;
            possibleMoves = [];
            turn = (turn === 'white') ? 'black' : 'white';
            updateStatus();
        } else {
            // Invalid move or clicked on another piece, deselect
            selectedPiece = null;
            possibleMoves = [];
            drawBoard(); // Redraw to clear highlights
            drawPieces();
        }
    } else {
        // No piece selected, try to select one
        if (clickedPiece) {
            const isWhitePiece = clickedPiece === clickedPiece.toUpperCase();
            if ((isWhitePiece && turn === 'white') || (!isWhitePiece && turn === 'black')) {
                selectedPiece = [row, col];
                possibleMoves = getValidMoves(row, col); // Implement this function
                highlightMoves(possibleMoves);
            }
        }
    }
});

function highlightMoves(moves) {
    drawBoard(); // Clear previous highlights
    drawPieces();

    // Highlight selected piece
    if (selectedPiece) {
        const [sRow, sCol] = selectedPiece;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)'; // Green highlight for selected piece
        ctx.fillRect(sCol * squareSize, sRow * squareSize, squareSize, squareSize);
    }

    // Highlight possible move squares
    moves.forEach(([r, c]) => {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Yellow highlight for possible moves
        ctx.fillRect(c * squareSize, r * squareSize, squareSize, squareSize);
    });
    drawPieces(); // Redraw pieces on top of highlights
}

function makeMove(startRow, startCol, endRow, endCol) {
    board[endRow][endCol] = board[startRow][startCol];
    board[startRow][startCol] = null;
    drawBoard();
    drawPieces();
    // Add logic for pawn promotion, castling, en passant here
}

function updateStatus() {
    document.getElementById('status').textContent = `${turn.charAt(0).toUpperCase() + turn.slice(1)}'s turn`;
}

// Initial status update
updateStatus();

function getValidMoves(row, col) {
    const piece = board[row][col];
    if (!piece) return [];

    const isWhite = piece === piece.toUpperCase();
    let moves = [];

    switch (piece.toUpperCase()) {
        case 'P':
            if (isWhite) {
                // White pawn moves
                if (row > 0 && !board[row - 1][col]) { // One square forward
                    moves.push([row - 1, col]);
                }
                if (row === 6 && !board[row - 1][col] && !board[row - 2][col]) { // Two squares from start
                    moves.push([row - 2, col]);
                }
                // Add capture logic here
            } else {
                // Black pawn moves
                if (row < 7 && !board[row + 1][col]) { // One square forward
                    moves.push([row + 1, col]);
                }
                if (row === 1 && !board[row + 1][col] && !board[row + 2][col]) { // Two squares from start
                    moves.push([row + 2, col]);
                }
                // Add capture logic here
            }
            break;
        // ... implement logic for other pieces (Rook, Knight, Bishop, Queen, King)
    }
    return moves;
}