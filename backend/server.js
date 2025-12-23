import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import GameManager from './gameManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

const gameManager = new GameManager();

// REST API endpoints
app.get('/api/games', (req, res) => {
    const availableGames = gameManager.getAvailableGames();
    res.json({ games: availableGames });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Create a new game room
    socket.on('createGame', ({ timeControl = 600 }) => {
        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const game = gameManager.createGame(roomId, socket.id, timeControl);

        socket.join(roomId);
        socket.emit('gameCreated', {
            roomId,
            color: 'white',
            gameState: game
        });

        console.log(`Game created: ${roomId} by ${socket.id}`);
    });

    // Join an existing game room
    socket.on('joinGame', ({ roomId }) => {
        const game = gameManager.joinGame(roomId, socket.id);

        if (!game) {
            socket.emit('error', { message: 'Game not found or full' });
            return;
        }

        socket.join(roomId);

        // Notify both players
        socket.emit('gameJoined', {
            roomId,
            color: 'black',
            gameState: game
        });

        io.to(game.players.white.socketId).emit('opponentJoined', {
            gameState: game
        });

        // Start timer updates
        startTimerUpdates(roomId);

        console.log(`Player ${socket.id} joined game: ${roomId}`);
    });

    // Get list of available games
    socket.on('getAvailableGames', () => {
        const games = gameManager.getAvailableGames();
        socket.emit('availableGames', { games });
    });

    // Make a move
    socket.on('makeMove', ({ roomId, move }) => {
        const result = gameManager.makeMove(roomId, socket.id, move);

        if (!result.success) {
            socket.emit('moveError', { error: result.error });
            return;
        }

        // Broadcast move to both players
        io.to(roomId).emit('moveMade', {
            gameState: result.gameState,
            move,
            inCheck: result.inCheck
        });

        if (result.gameOver) {
            io.to(roomId).emit('gameOver', {
                winner: result.gameState.winner,
                reason: result.reason
            });
            stopTimerUpdates(roomId);
        }
    });

    // Request current game state
    socket.on('getGameState', ({ roomId }) => {
        const game = gameManager.getGame(roomId);
        if (game) {
            socket.emit('gameState', { gameState: game });
        } else {
            socket.emit('error', { message: 'Game not found' });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);

        const game = gameManager.getPlayerGame(socket.id);
        if (game) {
            io.to(game.roomId).emit('opponentDisconnected');
            stopTimerUpdates(game.roomId);
        }

        gameManager.removePlayer(socket.id);
    });

    // Chat message (optional feature)
    socket.on('chatMessage', ({ roomId, message }) => {
        const game = gameManager.getGame(roomId);
        if (game) {
            socket.to(roomId).emit('chatMessage', {
                message,
                sender: socket.id
            });
        }
    });
});

// Timer update intervals
const timerIntervals = new Map();

function startTimerUpdates(roomId) {
    if (timerIntervals.has(roomId)) return;

    const interval = setInterval(() => {
        const timerUpdate = gameManager.updateTimer(roomId);

        if (!timerUpdate) {
            stopTimerUpdates(roomId);
            return;
        }

        if (timerUpdate.gameOver) {
            io.to(roomId).emit('gameOver', {
                winner: timerUpdate.winner,
                reason: timerUpdate.reason
            });
            stopTimerUpdates(roomId);
        } else {
            io.to(roomId).emit('timerUpdate', timerUpdate);
        }
    }, 1000);

    timerIntervals.set(roomId, interval);
}

function stopTimerUpdates(roomId) {
    const interval = timerIntervals.get(roomId);
    if (interval) {
        clearInterval(interval);
        timerIntervals.delete(roomId);
    }
}

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Chess server running on port ${PORT}`);
    console.log(`WebSocket server ready for connections`);
});
