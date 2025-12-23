import { useState, useEffect } from 'react';
import '../styles/MultiplayerLobby.css';

function MultiplayerLobby({ socket, onGameStart }) {
    const [availableGames, setAvailableGames] = useState([]);
    const [roomId, setRoomId] = useState('');
    const [timeControl, setTimeControl] = useState(600);
    const [showJoinInput, setShowJoinInput] = useState(false);

    useEffect(() => {
        if (!socket) return;

        socket.on('availableGames', ({ games }) => {
            setAvailableGames(games);
        });

        // Request available games on mount
        socket.emit('getAvailableGames');

        // Refresh every 5 seconds
        const interval = setInterval(() => {
            socket.emit('getAvailableGames');
        }, 5000);

        return () => {
            clearInterval(interval);
            socket.off('availableGames');
        };
    }, [socket]);

    const handleCreateGame = () => {
        if (socket) {
            socket.emit('createGame', { timeControl });
        }
    };

    const handleJoinGame = (gameRoomId) => {
        if (socket) {
            socket.emit('joinGame', { roomId: gameRoomId });
        }
    };

    const handleJoinByRoomId = () => {
        if (roomId.trim() && socket) {
            socket.emit('joinGame', { roomId: roomId.trim() });
        }
    };

    return (
        <div className="multiplayer-lobby">
            <div className="lobby-header">
                <h1>♟️ Chess Multiplayer</h1>
                <p>Create a new game or join an existing one</p>
            </div>

            <div className="lobby-actions">
                <div className="create-game-section">
                    <h2>Create New Game</h2>
                    <div className="time-control">
                        <label>Time Control (minutes):</label>
                        <select
                            value={timeControl}
                            onChange={(e) => setTimeControl(Number(e.target.value))}
                        >
                            <option value={180}>3 minutes</option>
                            <option value={300}>5 minutes</option>
                            <option value={600}>10 minutes</option>
                            <option value={900}>15 minutes</option>
                            <option value={1800}>30 minutes</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={handleCreateGame}>
                        Create Game
                    </button>
                </div>

                <div className="divider">OR</div>

                <div className="join-game-section">
                    <h2>Join Game</h2>

                    {!showJoinInput ? (
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowJoinInput(true)}
                        >
                            Join by Room ID
                        </button>
                    ) : (
                        <div className="join-by-id">
                            <input
                                type="text"
                                placeholder="Enter Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleJoinByRoomId()}
                            />
                            <button className="btn btn-primary" onClick={handleJoinByRoomId}>
                                Join
                            </button>
                            <button
                                className="btn btn-text"
                                onClick={() => setShowJoinInput(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {availableGames.length > 0 && (
                <div className="available-games">
                    <h2>Available Games</h2>
                    <div className="games-list">
                        {availableGames.map((game) => (
                            <div key={game.roomId} className="game-card">
                                <div className="game-info">
                                    <div className="game-id">Room: {game.roomId}</div>
                                    <div className="game-time">
                                        Time: {Math.floor(game.timeControl / 60)} min
                                    </div>
                                </div>
                                <button
                                    className="btn btn-join"
                                    onClick={() => handleJoinGame(game.roomId)}
                                >
                                    Join Game
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {availableGames.length === 0 && !showJoinInput && (
                <div className="no-games">
                    <p>No games available. Create a new game to start playing!</p>
                </div>
            )}
        </div>
    );
}

export default MultiplayerLobby;
