"use client";

import { Card } from "@/components/ui/card";
import ChessGame from "@/components/chess-game";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-white">Chess Game</h1>
            <ChessGame />
          </div>
        </Card>
      </div>
    </div>
  );
}