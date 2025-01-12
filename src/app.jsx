// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Game from './pages/Game';
import Lobby from './pages/Lobby';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/lobby" 
              element={
                <ProtectedRoute>
                  <Lobby />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/game/:gameId" 
              element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;