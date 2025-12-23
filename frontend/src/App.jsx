import { useState, useEffect } from 'react';
import socketService from './utils/socketService';
import MultiplayerLobby from './components/MultiplayerLobby';
import ChessBoard from './components/ChessBoard';
import GameTimer from './components/GameTimer';
import GameStatus from './components/GameStatus';
import './styles/App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [gameStatus, setGameStatus] = useState('lobby'); // lobby, waiting, playing, finished
  const [timerUpdate, setTimerUpdate] = useState(null);
  const [inCheck, setInCheck] = useState(false);
  const [gameOverInfo, setGameOverInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const newSocket = socketService.connect();
    setSocket(newSocket);

    // Game created
    newSocket.on('gameCreated', ({ roomId, color, gameState }) => {
      console.log('Game created:', roomId);
      setRoomId(roomId);
      setPlayerColor(color);
      setGameState(gameState);
      setGameStatus('waiting');
    });

    // Game joined
    newSocket.on('gameJoined', ({ roomId, color, gameState }) => {
      console.log('Game joined:', roomId);
      setRoomId(roomId);
      setPlayerColor(color);
      setGameState(gameState);
      setGameStatus('playing');
    });

    // Opponent joined
    newSocket.on('opponentJoined', ({ gameState }) => {
      console.log('Opponent joined');
      setGameState(gameState);
      setGameStatus('playing');
    });

    // Move made
    newSocket.on('moveMade', ({ gameState, move, inCheck: checkStatus }) => {
      console.log('Move made:', move);
      setGameState(gameState);
      setInCheck(checkStatus || false);
    });

    // Timer update
    newSocket.on('timerUpdate', (update) => {
      setTimerUpdate(update);
    });

    // Game over
    newSocket.on('gameOver', ({ winner, reason }) => {
      console.log('Game over:', winner, reason);
      setGameStatus('finished');
      setGameOverInfo({ winner, reason });
    });

    // Opponent disconnected
    newSocket.on('opponentDisconnected', () => {
      setError('Opponent disconnected');
      setTimeout(() => {
        setGameStatus('lobby');
        setGameState(null);
        setPlayerColor(null);
        setRoomId(null);
        setError(null);
      }, 3000);
    });

    // Error
    newSocket.on('error', ({ message }) => {
      console.error('Socket error:', message);
      setError(message);
    });

    // Move error
    newSocket.on('moveError', ({ error }) => {
      console.error('Move error:', error);
      setError(error);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleMove = (move) => {
    if (socket && roomId) {
      socketService.makeMove(roomId, move);
    }
  };

  const handleNewGame = () => {
    setGameStatus('lobby');
    setGameState(null);
    setPlayerColor(null);
    setRoomId(null);
    setGameOverInfo(null);
    setInCheck(false);
    setError(null);
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      alert('Room ID copied to clipboard!');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>♟️ Chess Game</h1>
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {gameStatus === 'lobby' && (
        <MultiplayerLobby socket={socket} />
      )}

      {gameStatus === 'waiting' && (
        <div className="waiting-screen">
          <div className="waiting-content">
            <h2>Waiting for opponent...</h2>
            <div className="room-info">
              <p>Room ID: <strong>{roomId}</strong></p>
              <button className="btn btn-secondary" onClick={copyRoomId}>
                Copy Room ID
              </button>
            </div>
            <div className="spinner"></div>
            <p>Share the Room ID with your opponent to join</p>
            <button className="btn btn-text" onClick={handleNewGame}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {(gameStatus === 'playing' || gameStatus === 'finished') && gameState && (
        <div className="game-screen">
          <div className="game-container">
            <div className="game-main">
              <div className="game-info-top">
                <div className="room-badge">Room: {roomId}</div>
                {gameStatus === 'playing' && (
                  <GameTimer gameState={gameState} timerUpdate={timerUpdate} />
                )}
              </div>

              <ChessBoard
                gameState={gameState}
                playerColor={playerColor}
                onMove={handleMove}
                disabled={gameStatus === 'finished'}
              />

              {gameStatus === 'finished' && gameOverInfo && (
                <div className="game-over-overlay">
                  <div className="game-over-content">
                    <h2>Game Over!</h2>
                    {gameOverInfo.winner === 'draw' ? (
                      <p className="result">It's a draw!</p>
                    ) : (
                      <p className="result">
                        {gameOverInfo.winner === playerColor ? 'You won!' : 'You lost!'}
                      </p>
                    )}
                    <p className="reason">
                      Reason: {gameOverInfo.reason}
                    </p>
                    <button className="btn btn-primary" onClick={handleNewGame}>
                      New Game
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="game-sidebar">
              <GameStatus
                gameState={gameState}
                playerColor={playerColor}
                inCheck={inCheck}
              />
              {gameStatus === 'playing' && (
                <button className="btn btn-secondary resign-btn" onClick={handleNewGame}>
                  Resign
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
