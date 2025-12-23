# Chess Game - Multiplayer

A full-featured chess game with real-time multiplayer support, built with Node.js and React.

## Features

* **Complete Chess Board** - Full 8x8 chess board with all pieces
* **All Chess Rules** - Complete implementation of chess rules including:
  - All piece movements (Pawn, Rook, Knight, Bishop, Queen, King)
  - Special moves (Castling, En Passant, Pawn Promotion)
  - Check and Checkmate detection
  - Stalemate detection
* **Time Clock** - Configurable time controls for both players
* **Player Switch** - Automatic turn switching after each move
* **Real-time Multiplayer** - WebSocket-based multiplayer using Socket.io
* **Room System** - Create or join game rooms with unique room IDs
* **Move Validation** - Server-side move validation for security
* **Move History** - Track all moves made during the game
* **Captured Pieces** - Display captured pieces for both players
* **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web server framework
- **Socket.io** - Real-time WebSocket communication
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library (vanilla JavaScript, no TypeScript)
- **Vite** - Build tool and dev server
- **Socket.io Client** - WebSocket client
- **CSS3** - Modern styling with animations

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will start on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is in use)

## How to Play

### Single Player (Local)
1. Start both backend and frontend servers
2. Open the application in your browser
3. Click "Create Game"
4. Wait for an opponent or share the Room ID

### Multiplayer
1. **Player 1**: Click "Create Game" and copy the Room ID
2. **Player 2**: Enter the Room ID and click "Join"
3. The game starts automatically when both players are connected
4. Players take turns moving pieces
5. The timer counts down during each player's turn

### Game Controls
- Click on a piece to select it
- Valid moves will be highlighted
- Click on a highlighted square to move
- The game automatically detects check, checkmate, and stalemate

## Project Structure

```
chess/
├── backend/
│   ├── server.js           # Express + Socket.io server
│   ├── gameManager.js      # Game state management
│   ├── chessLogic.js       # Chess rules and validation
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChessBoard.jsx
│   │   │   ├── GameTimer.jsx
│   │   │   ├── GameStatus.jsx
│   │   │   └── MultiplayerLobby.jsx
│   │   ├── utils/
│   │   │   ├── socketService.js
│   │   │   └── chessLogic.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── ChessBoard.css
│   │   │   ├── GameTimer.css
│   │   │   ├── GameStatus.css
│   │   │   └── MultiplayerLobby.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── images/         # Chess piece images
│   ├── index.html
│   └── package.json
├── images/                  # Original chess piece images
└── README.md
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with hot reload
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## Game Rules

This implementation follows standard chess rules:

- **Pawns**: Move forward one square, two squares from starting position, capture diagonally
- **Rooks**: Move horizontally or vertically any number of squares
- **Knights**: Move in an L-shape (2 squares in one direction, 1 in perpendicular)
- **Bishops**: Move diagonally any number of squares
- **Queens**: Combine rook and bishop movements
- **Kings**: Move one square in any direction

Special moves:
- **Castling**: King and rook special move (when neither has moved and path is clear)
- **En Passant**: Special pawn capture
- **Pawn Promotion**: Pawns reaching the opposite end auto-promote to Queen

## Future Enhancements

Potential features for future development:
- [ ] User authentication and accounts
- [ ] ELO rating system
- [ ] Game replay functionality
- [ ] Chat system between players
- [ ] Spectator mode
- [ ] Tournament mode
- [ ] AI opponent (single player vs computer)
- [ ] Move suggestions and analysis
- [ ] Different board themes
- [ ] Sound effects

## License

MIT

## Author

Created with ❤️ for chess enthusiasts
