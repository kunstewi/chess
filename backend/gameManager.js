// Game room and state management

import { createInitialBoard, validateMove, isInCheck, isCheckmate, isStalemate } from './chessLogic.js';

class GameManager {
    constructor() {
        this.games = new Map(); // roomId -> gameState
        this.players = new Map(); // socketId -> { roomId, color }
    }

    createGame(roomId, player1SocketId, timeControl = 600) {
        const gameState = {
            roomId,
            board: createInitialBoard(),
            currentTurn: 'white',
            players: {
                white: { socketId: player1SocketId, time: timeControl },
                black: { socketId: null, time: timeControl }
            },
            gameStatus: 'waiting', // waiting, active, finished
            winner: null,
            moveHistory: [],
            capturedPieces: { white: [], black: [] },
            gameState: {
                enPassant: null,
                castling: {
                    white: { kingside: true, queenside: true },
                    black: { kingside: true, queenside: true }
                }
            },
            lastMoveTime: null,
            timeControl
        };

        this.games.set(roomId, gameState);
        this.players.set(player1SocketId, { roomId, color: 'white' });

        return gameState;
    }

    joinGame(roomId, player2SocketId) {
        const game = this.games.get(roomId);
        if (!game) return null;

        if (game.players.black.socketId) {
            return null; // Game is full
        }

        game.players.black.socketId = player2SocketId;
        game.gameStatus = 'active';
        game.lastMoveTime = Date.now();

        this.players.set(player2SocketId, { roomId, color: 'black' });

        return game;
    }

    getGame(roomId) {
        return this.games.get(roomId);
    }

    getPlayerGame(socketId) {
        const playerInfo = this.players.get(socketId);
        if (!playerInfo) return null;
        return this.games.get(playerInfo.roomId);
    }

    makeMove(roomId, socketId, move) {
        const game = this.games.get(roomId);
        if (!game) return { success: false, error: 'Game not found' };

        if (game.gameStatus !== 'active') {
            return { success: false, error: 'Game is not active' };
        }

        // Verify it's the player's turn
        const playerInfo = this.players.get(socketId);
        if (!playerInfo || playerInfo.color !== game.currentTurn) {
            return { success: false, error: 'Not your turn' };
        }

        const { fromRow, fromCol, toRow, toCol } = move;

        // Validate move
        const validation = validateMove(
            game.board,
            fromRow,
            fromCol,
            toRow,
            toCol,
            game.gameState
        );

        if (!validation.valid) {
            return { success: false, error: validation.reason };
        }

        // Update timer
        const now = Date.now();
        const elapsed = Math.floor((now - game.lastMoveTime) / 1000);
        game.players[game.currentTurn].time -= elapsed;

        if (game.players[game.currentTurn].time <= 0) {
            game.gameStatus = 'finished';
            game.winner = game.currentTurn === 'white' ? 'black' : 'white';
            return {
                success: true,
                gameState: game,
                gameOver: true,
                reason: 'timeout'
            };
        }

        // Capture piece if present
        const capturedPiece = game.board[toRow][toCol];
        if (capturedPiece) {
            game.capturedPieces[game.currentTurn].push(capturedPiece);
        }

        // Make the move
        game.board[toRow][toCol] = game.board[fromRow][fromCol];
        game.board[fromRow][fromCol] = null;

        // Handle pawn promotion
        const piece = game.board[toRow][toCol];
        if (piece && piece.toUpperCase() === 'P') {
            if ((piece === 'P' && toRow === 0) || (piece === 'p' && toRow === 7)) {
                game.board[toRow][toCol] = piece === 'P' ? 'Q' : 'q'; // Auto-promote to queen
            }
        }

        // Update en passant
        game.gameState.enPassant = null;
        if (piece && piece.toUpperCase() === 'P' && Math.abs(fromRow - toRow) === 2) {
            game.gameState.enPassant = {
                row: (fromRow + toRow) / 2,
                col: fromCol
            };
        }

        // Update castling rights
        if (piece && piece.toUpperCase() === 'K') {
            const color = game.currentTurn;
            game.gameState.castling[color].kingside = false;
            game.gameState.castling[color].queenside = false;
        }
        if (piece && piece.toUpperCase() === 'R') {
            const color = game.currentTurn;
            if (fromCol === 0) game.gameState.castling[color].queenside = false;
            if (fromCol === 7) game.gameState.castling[color].kingside = false;
        }

        // Add to move history
        game.moveHistory.push({
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece,
            captured: capturedPiece,
            timestamp: now
        });

        // Switch turn
        game.currentTurn = game.currentTurn === 'white' ? 'black' : 'white';
        game.lastMoveTime = now;

        // Check for game end conditions
        const isWhiteTurn = game.currentTurn === 'white';

        if (isCheckmate(game.board, isWhiteTurn)) {
            game.gameStatus = 'finished';
            game.winner = isWhiteTurn ? 'black' : 'white';
            return {
                success: true,
                gameState: game,
                gameOver: true,
                reason: 'checkmate'
            };
        }

        if (isStalemate(game.board, isWhiteTurn)) {
            game.gameStatus = 'finished';
            game.winner = 'draw';
            return {
                success: true,
                gameState: game,
                gameOver: true,
                reason: 'stalemate'
            };
        }

        const inCheck = isInCheck(game.board, isWhiteTurn);

        return {
            success: true,
            gameState: game,
            inCheck,
            gameOver: false
        };
    }

    removePlayer(socketId) {
        const playerInfo = this.players.get(socketId);
        if (!playerInfo) return;

        const game = this.games.get(playerInfo.roomId);
        if (game) {
            // If game is active, opponent wins
            if (game.gameStatus === 'active') {
                game.gameStatus = 'finished';
                game.winner = playerInfo.color === 'white' ? 'black' : 'white';
            } else {
                // If waiting, delete the game
                this.games.delete(playerInfo.roomId);
            }
        }

        this.players.delete(socketId);
    }

    getAvailableGames() {
        const available = [];
        for (const [roomId, game] of this.games.entries()) {
            if (game.gameStatus === 'waiting') {
                available.push({
                    roomId,
                    timeControl: game.timeControl
                });
            }
        }
        return available;
    }

    updateTimer(roomId) {
        const game = this.games.get(roomId);
        if (!game || game.gameStatus !== 'active') return null;

        const now = Date.now();
        const elapsed = Math.floor((now - game.lastMoveTime) / 1000);
        const currentTime = game.players[game.currentTurn].time - elapsed;

        if (currentTime <= 0) {
            game.gameStatus = 'finished';
            game.winner = game.currentTurn === 'white' ? 'black' : 'white';
            game.players[game.currentTurn].time = 0;
            return { gameOver: true, winner: game.winner, reason: 'timeout' };
        }

        return {
            white: game.currentTurn === 'white' ? currentTime : game.players.white.time,
            black: game.currentTurn === 'black' ? currentTime : game.players.black.time
        };
    }
}

export default GameManager;
