const chessboard = document.getElementById('chessboard');

// Define the initial positions of the pieces
const initialBoard = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'], // Black pieces
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'], // Black pawns
  ['', '', '', '', '', '', '', ''], // Empty row
  ['', '', '', '', '', '', '', ''], // Empty row
  ['', '', '', '', '', '', '', ''], // Empty row
  ['', '', '', '', '', '', '', ''], // Empty row
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'], // White pawns
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'], // White pieces
];

for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.setAttribute('data-position', `${row}-${col}`); // Add position for tracking

    // Alternate square colors
    if ((row + col) % 2 === 0) {
      square.classList.add('white');
    } else {
      square.classList.add('black');
    }

    // Add chess piece if present
    const piece = initialBoard[row][col];
    if (piece) {
      square.textContent = piece; // Add Unicode chess symbol
    }

    chessboard.appendChild(square);
  }
}