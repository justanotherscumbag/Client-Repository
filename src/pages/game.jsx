// src/pages/Game.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import webSocketService from '../services/WebSocketService';

const Game = () => {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [playedCards, setPlayedCards] = useState({ player1: null, player2: null });
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    const token = localStorage.getItem('token');
    webSocketService.init(token);

    // Join game room
    webSocketService.joinGame(gameId);

    // Set up event listeners
    const handleGameUpdate = (newState) => {
      setGameState(newState);
    };

    const handleCardPlayed = (data) => {
      setPlayedCards(prev => ({
        ...prev,
        [data.playerId === user.id ? 'player1' : 'player2']: data.card
      }));
    };

    const handleRoundComplete = (result) => {
      setShowResults(true);
      setTimeout(() => {
        setShowResults(false);
        setPlayedCards({ player1: null, player2: null });
      }, 2000);
    };

    const handleGameOver = (data) => {
      // Handle game over
      setTimeout(() => {
        navigate('/lobby');
      }, 3000);
    };

    webSocketService.onGameUpdate(handleGameUpdate);
    webSocketService.onCardPlayed(handleCardPlayed);
    webSocketService.onRoundComplete(handleRoundComplete);
    webSocketService.onGameOver(handleGameOver);

    return () => {
      webSocketService.disconnect();
    };
  }, [gameId, user.id, navigate]);

  const handlePlayCard = (cardIndex) => {
    if (selectedCard !== null) {
      webSocketService.playCard(gameId, cardIndex);
      setSelectedCard(null);
    }
  };

  const handleDrawCards = () => {
    webSocketService.drawCards(gameId);
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto flex flex-col h-screen">
        {/* Opponent Area */}
        <div className="h-1/4 border-b border-cyan-500 p-4">
          <div className="flex justify-between items-center">
            <span className="text-cyan-400">
              Opponent's Cards: {gameState.opponentCards}
            </span>
            <span className="text-cyan-400">
              Draws Remaining: {gameState.opponentDraws}
            </span>
          </div>
        </div>

        {/* Play Area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Played Cards */}
          <div className="flex gap-8 mb-8">
            {playedCards.player2 && (
              <Card className="w-32 h-48 border-cyan-500 bg-gray-800 flex items-center justify-center">
                {showResults && playedCards.player2}
              </Card>
            )}
            {playedCards.player1 && (
              <Card className="w-32 h-48 border-cyan-500 bg-gray-800 flex items-center justify-center">
                {showResults && playedCards.player1}
              </Card>
            )}
          </div>

          {/* Draw Button */}
          {gameState.canDraw && (
            <button
              onClick={handleDrawCards}
              className="px-6 py-2 bg-cyan-900 text-cyan-400 rounded hover:bg-cyan-800"
            >
              Draw Cards ({gameState.drawsRemaining})
            </button>
          )}
        </div>

        {/* Player Area */}
        <div className="h-1/4 border-t border-cyan-500 p-4">
          <div className="flex flex-col">
            <div className="flex justify-center gap-4">
              {gameState.playerCards.map((card, index) => (
                <Card
                  key={index}
                  className={`w-24 h-32 bg-gray-800 border-cyan-500 cursor-pointer transition-all
                    ${selectedCard === index ? 'transform -translate-y-4' : ''}
                    hover:transform hover:-translate-y-2`}
                  onClick={() => setSelectedCard(index)}
                >
                  <div className="h-full flex items-center justify-center text-cyan-400">
                    {card}
                  </div>
                </Card>
              ))}
            </div>
            {selectedCard !== null && (
              <button
                className="mt-4 px-6 py-2 bg-cyan-900 text-cyan-400 rounded hover:bg-cyan-800 self-center"
                onClick={() => handlePlayCard(selectedCard)}
              >
                Play Selected Card
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;