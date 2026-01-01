// WebSocket service for chess game

import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        this.socket.on('connect', () => {
            console.log('Connected to server:', this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    createGame(timeControl = 600) {
        if (this.socket) {
            this.socket.emit('createGame', { timeControl });
        }
    }

    joinGame(roomId) {
        if (this.socket) {
            this.socket.emit('joinGame', { roomId });
        }
    }

    getAvailableGames() {
        if (this.socket) {
            this.socket.emit('getAvailableGames');
        }
    }

    makeMove(roomId, move) {
        if (this.socket) {
            this.socket.emit('makeMove', { roomId, move });
        }
    }

    getGameState(roomId) {
        if (this.socket) {
            this.socket.emit('getGameState', { roomId });
        }
    }

    sendChatMessage(roomId, message) {
        if (this.socket) {
            this.socket.emit('chatMessage', { roomId, message });
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }
}

export default new SocketService();
