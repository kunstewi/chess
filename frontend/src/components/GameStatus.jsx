import { getPieceSymbol } from '../utils/chessLogic';
import '../styles/GameStatus.css';

function GameStatus({ gameState, playerColor, inCheck }) {
    if (!gameState) return null;

    const isPlayerTurn = gameState.currentTurn === playerColor;
    const turnText = isPlayerTurn ? 'Your turn' : "Opponent's turn";
    const currentTurnDisplay = gameState.currentTurn.charAt(0).toUpperCase() + gameState.currentTurn.slice(1);

    return (
        <div className="game-status">
            <div className="status-header">
                <h2>Game Status</h2>
            </div>

            <div className="turn-indicator">
                <div className={`turn-badge ${gameState.currentTurn}`}>
                    {currentTurnDisplay} to move
                </div>
                {inCheck && (
                    <div className="check-indicator">
                        ⚠️ Check!
                    </div>
                )}
            </div>

            <div className="player-info">
                <div className={`player-badge ${playerColor === 'white' ? 'white' : 'black'}`}>
                    You are playing as {playerColor}
                </div>
                <div className="turn-status">{turnText}</div>
            </div>

            {gameState.capturedPieces && (
                <div className="captured-pieces">
                    <div className="captured-section">
                        <h3>Captured by White</h3>
                        <div className="pieces">
                            {gameState.capturedPieces.white.length > 0 ? (
                                gameState.capturedPieces.white.map((piece, idx) => (
                                    <span key={idx} className="captured-piece">
                                        {getPieceSymbol(piece)}
                                    </span>
                                ))
                            ) : (
                                <span className="no-pieces">None</span>
                            )}
                        </div>
                    </div>
                    <div className="captured-section">
                        <h3>Captured by Black</h3>
                        <div className="pieces">
                            {gameState.capturedPieces.black.length > 0 ? (
                                gameState.capturedPieces.black.map((piece, idx) => (
                                    <span key={idx} className="captured-piece">
                                        {getPieceSymbol(piece)}
                                    </span>
                                ))
                            ) : (
                                <span className="no-pieces">None</span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {gameState.moveHistory && gameState.moveHistory.length > 0 && (
                <div className="move-history">
                    <h3>Recent Moves</h3>
                    <div className="moves-list">
                        {gameState.moveHistory.slice(-5).reverse().map((move, idx) => (
                            <div key={idx} className="move-item">
                                {getPieceSymbol(move.piece)} {String.fromCharCode(97 + move.from.col)}{8 - move.from.row} → {String.fromCharCode(97 + move.to.col)}{8 - move.to.row}
                                {move.captured && ` (captured ${getPieceSymbol(move.captured)})`}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default GameStatus;
