import { useState, useEffect } from 'react';
import { getSquareColor, getPieceImage, getValidMovesClient, isWhitePiece } from '../utils/chessLogic';
import '../styles/ChessBoard.css';

function ChessBoard({ gameState, playerColor, onMove, disabled }) {
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [validMoves, setValidMoves] = useState([]);

    useEffect(() => {
        // Clear selection when turn changes
        setSelectedSquare(null);
        setValidMoves([]);
    }, [gameState?.currentTurn]);

    const handleSquareClick = (row, col) => {
        if (disabled || !gameState) return;

        const piece = gameState.board[row][col];
        const isPlayerTurn = gameState.currentTurn === playerColor;

        if (!isPlayerTurn) return;

        if (selectedSquare) {
            const [selectedRow, selectedCol] = selectedSquare;

            // Check if clicking on a valid move
            const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

            if (isValidMove) {
                // Make the move
                onMove({
                    fromRow: selectedRow,
                    fromCol: selectedCol,
                    toRow: row,
                    toCol: col
                });
                setSelectedSquare(null);
                setValidMoves([]);
            } else if (piece && isWhitePiece(piece) === (playerColor === 'white')) {
                // Select a different piece
                setSelectedSquare([row, col]);
                setValidMoves(getValidMovesClient(gameState.board, row, col));
            } else {
                // Deselect
                setSelectedSquare(null);
                setValidMoves([]);
            }
        } else {
            // Select a piece
            if (piece && isWhitePiece(piece) === (playerColor === 'white')) {
                setSelectedSquare([row, col]);
                setValidMoves(getValidMovesClient(gameState.board, row, col));
            }
        }
    };

    const isSquareSelected = (row, col) => {
        return selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
    };

    const isValidMoveSquare = (row, col) => {
        return validMoves.some(([r, c]) => r === row && c === col);
    };

    const getLastMove = () => {
        if (!gameState?.moveHistory || gameState.moveHistory.length === 0) return null;
        return gameState.moveHistory[gameState.moveHistory.length - 1];
    };

    const isLastMoveSquare = (row, col) => {
        const lastMove = getLastMove();
        if (!lastMove) return false;
        return (lastMove.from.row === row && lastMove.from.col === col) ||
            (lastMove.to.row === row && lastMove.to.col === col);
    };

    if (!gameState) {
        return (
            <div className="chess-board-container">
                <div className="loading">Waiting for game...</div>
            </div>
        );
    }

    const board = gameState.board;
    const displayBoard = playerColor === 'black' ? [...board].reverse().map(row => [...row].reverse()) : board;

    return (
        <div className="chess-board-container">
            <div className="chess-board">
                {displayBoard.map((row, rowIndex) => {
                    const actualRow = playerColor === 'black' ? 7 - rowIndex : rowIndex;

                    return row.map((piece, colIndex) => {
                        const actualCol = playerColor === 'black' ? 7 - colIndex : colIndex;
                        const squareColor = getSquareColor(actualRow, actualCol);
                        const isSelected = isSquareSelected(actualRow, actualCol);
                        const isValidMove = isValidMoveSquare(actualRow, actualCol);
                        const isLastMove = isLastMoveSquare(actualRow, actualCol);

                        return (
                            <div
                                key={`${actualRow}-${actualCol}`}
                                className={`square ${isSelected ? 'selected' : ''} ${isLastMove ? 'last-move' : ''}`}
                                style={{ backgroundColor: squareColor }}
                                onClick={() => handleSquareClick(actualRow, actualCol)}
                            >
                                {isValidMove && (
                                    <div className={`valid-move-indicator ${piece ? 'capture' : ''}`} />
                                )}
                                {piece && (
                                    <img
                                        src={getPieceImage(piece)}
                                        alt={piece}
                                        className="piece"
                                        draggable={false}
                                    />
                                )}
                                {rowIndex === 7 && (
                                    <div className="file-label">
                                        {String.fromCharCode(97 + actualCol)}
                                    </div>
                                )}
                                {colIndex === 0 && (
                                    <div className="rank-label">
                                        {8 - actualRow}
                                    </div>
                                )}
                            </div>
                        );
                    });
                })}
            </div>
        </div>
    );
}

export default ChessBoard;
