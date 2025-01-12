// src/pages/Lobby.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';  // Change this line
import webSocketService from '../services/WebSocketService';

const Lobby = () => {
  const [lobbies, setLobbies] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [privateCode, setPrivateCode] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize WebSocket connection
    const token = localStorage.getItem('token');
    webSocketService.init(token);

    // Listen for lobby updates
    webSocketService.onLobbyUpdate((updatedLobbies) => {
      setLobbies(updatedLobbies);
    });

    // Listen for game start
    webSocketService.onGameStart((gameData) => {
      navigate(`/game/${gameData.gameId}`);
    });

    return () => {
      webSocketService.disconnect();
    };
  }, [navigate]);

  const handleCreateLobby = async (lobbyData) => {
    try {
      await webSocketService.createLobby(lobbyData.name, lobbyData.isPrivate);
      setShowCreate(false);
    } catch (error) {
      console.error('Error creating lobby:', error);
    }
  };

  const handleJoinLobby = async (lobbyId) => {
    try {
      await webSocketService.joinLobby(lobbyId);
    } catch (error) {
      console.error('Error joining lobby:', error);
    }
  };

  const handleJoinPrivate = async () => {
    try {
      await webSocketService.joinPrivateLobby(privateCode);
      setPrivateCode('');
    } catch (error) {
      console.error('Error joining private lobby:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-cyan-400">Stone Sheets Sheers</h1>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400">Playing as: {user.username}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-700 text-cyan-400 rounded hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Create/Join Options */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-2 bg-cyan-900 text-cyan-400 rounded hover:bg-cyan-800"
          >
            Create Game
          </button>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Enter private game code"
              className="flex-1 p-2 bg-gray-700 text-cyan-400 rounded border border-gray-600"
              value={privateCode}
              onChange={(e) => setPrivateCode(e.target.value)}
            />
            <button
              onClick={handleJoinPrivate}
              className="px-6 py-2 bg-cyan-900 text-cyan-400 rounded hover:bg-cyan-800"
            >
              Join Private
            </button>
          </div>
        </div>

        {/* Lobbies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lobbies.map((lobby) => (
            <Card key={lobby.id} className="bg-gray-800 p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg text-cyan-400">{lobby.name}</h3>
                <span className="px-2 py-1 text-sm bg-gray-700 rounded">
                  {lobby.players.length}/2
                </span>
              </div>
              <div className="mb-4 text-sm text-gray-400">
                Host: {lobby.creator.username}
              </div>
              <button
                onClick={() => handleJoinLobby(lobby.id)}
                className="w-full py-2 bg-cyan-900 text-cyan-400 rounded hover:bg-cyan-800"
                disabled={lobby.players.length >= 2}
              >
                {lobby.players.length >= 2 ? 'Full' : 'Join Game'}
              </button>
            </Card>
          ))}
        </div>

        {/* Create Lobby Modal */}
        {showCreate && (
          <CreateLobbyModal
            onClose={() => setShowCreate(false)}
            onCreate={handleCreateLobby}
          />
        )}
      </div>
    </div>
  );
};

const CreateLobbyModal = ({ onClose, onCreate }) => {
  const [lobbyData, setLobbyData] = useState({
    name: '',
    isPrivate: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(lobbyData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 p-6">
        <h2 className="text-xl text-cyan-400 mb-4">Create Game</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Game Name"
            className="w-full p-2 bg-gray-700 text-cyan-400 rounded border border-gray-600"
            value={lobbyData.name}
            onChange={(e) => setLobbyData({ ...lobbyData, name: e.target.value })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={lobbyData.isPrivate}
              onChange={(e) => setLobbyData({ ...lobbyData, isPrivate: e.target.checked })}
            />
            <span className="text-cyan-400">Make Private</span>
          </label>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-cyan-900 text-cyan-400 rounded hover:bg-cyan-800"
            >
              Create
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-700 text-cyan-400 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Lobby;
