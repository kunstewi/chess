"use client";

import { useState, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCw, Crown } from "lucide-react";

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState("");
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});

  function getMoveOptions(square: string) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: { [key: string]: { background: string; borderRadius: string } } = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(255,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
      borderRadius: "0",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square: string) {
    setRightClickedSquares({});

    // from square
    if (!moveFrom) {
      const hasMoves = getMoveOptions(square);
      if (hasMoves) setMoveFrom(square);
      return;
    }

    // to square
    if (moveFrom) {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoves = getMoveOptions(square);
        if (hasMoves) setMoveFrom(square);
        return;
      }

      setGame(gameCopy);
      setMoveFrom("");
      setOptionSquares({});
      return;
    }
  }

  function onSquareRightClick(square: string) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] && rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  const resetGame = useCallback(() => {
    setGame(new Chess());
    setMoveFrom("");
    setRightClickedSquares({});
    setMoveSquares({});
    setOptionSquares({});
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-full max-w-[600px]">
        <Chessboard
          position={game.fen()}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          customSquareStyles={{
            ...moveSquares,
            ...optionSquares,
            ...rightClickedSquares,
          }}
          boardWidth={600}
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-white">
            <Crown className="w-4 h-4 mr-2" />
            {game.turn() === "w" ? "White to move" : "Black to move"}
          </Badge>
          <Button onClick={resetGame} variant="outline" size="sm">
            <RotateCw className="w-4 h-4 mr-2" />
            Reset Game
          </Button>
        </div>
        {game.isGameOver() && (
          <div className="text-xl font-bold text-white">
            {game.isCheckmate()
              ? `Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins!`
              : game.isDraw()
              ? "Game Over - Draw!"
              : "Game Over!"}
          </div>
        )}
      </div>
    </div>
  );
}