import { useState, useEffect } from 'react';
import { formatTime } from '../utils/chessLogic';
import '../styles/GameTimer.css';

function GameTimer({ gameState, timerUpdate }) {
    const [displayTime, setDisplayTime] = useState({
        white: gameState?.players?.white?.time || 600,
        black: gameState?.players?.black?.time || 600
    });

    useEffect(() => {
        if (timerUpdate) {
            setDisplayTime(timerUpdate);
        }
    }, [timerUpdate]);

    useEffect(() => {
        if (gameState?.players) {
            setDisplayTime({
                white: gameState.players.white.time,
                black: gameState.players.black.time
            });
        }
    }, [gameState]);

    const isWhiteTurn = gameState?.currentTurn === 'white';
    const isBlackTurn = gameState?.currentTurn === 'black';

    return (
        <div className="game-timer">
            <div className={`timer black-timer ${isBlackTurn ? 'active' : ''}`}>
                <div className="timer-label">Black</div>
                <div className="timer-display">{formatTime(displayTime.black)}</div>
            </div>
            <div className={`timer white-timer ${isWhiteTurn ? 'active' : ''}`}>
                <div className="timer-label">White</div>
                <div className="timer-display">{formatTime(displayTime.white)}</div>
            </div>
        </div>
    );
}

export default GameTimer;
