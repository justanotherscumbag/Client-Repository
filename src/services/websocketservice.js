// services/WebSocketService.js
import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.gameCallbacks = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  init(token) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.REACT_APP_API_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.setupBaseHandlers();
    return this.socket;
  }

  setupBaseHandlers() {
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });
  }

  // Lobby Methods
  createLobby(name, isPrivate = false) {
    return new Promise((resolve, reject) => {
      this.socket.emit('createLobby', { name, isPrivate }, (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  joinLobby(lobbyId) {
    return new Promise((resolve, reject) => {
      this.socket.emit('joinLobby', lobbyId, (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  joinPrivateLobby(code) {
    return new Promise((resolve, reject) => {
      this.socket.emit('joinPrivateLobby', code, (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  leaveLobby() {
    this.socket.emit('leaveLobby');
  }

  // Game Methods
  joinGame(gameId) {
    this.socket.emit('joinGame', gameId);
  }

  playCard(gameId, cardIndex) {
    this.socket.emit('playCard', { gameId, cardIndex });
  }

  drawCards(gameId) {
    this.socket.emit('drawCards', gameId);
  }

  // Event Listeners
  onLobbyUpdate(callback) {
    this.socket.on('lobbyUpdate', callback);
  }

  onGameStart(callback) {
    this.socket.on('gameStart', callback);
  }

  onGameUpdate(callback) {
    this.socket.on('gameUpdate', callback);
  }

  onCardPlayed(callback) {
    this.socket.on('cardPlayed', callback);
  }

  onCardsDrawn(callback) {
    this.socket.on('cardsDrawn', callback);
  }

  onRoundComplete(callback) {
    this.socket.on('roundComplete', callback);
  }

  onGameOver(callback) {
    this.socket.on('gameOver', callback);
  }

  // Remove specific event listener
  off(event, callback) {
    this.socket.off(event, callback);
  }

  // Clean up all listeners for an event
  removeAllListeners(event) {
    this.socket.removeAllListeners(event);
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;