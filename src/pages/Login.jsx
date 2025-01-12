// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login, register, loginAsGuest } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = isLogin 
      ? await login(formData.username, formData.password)
      : await register(formData.username, formData.password);

    if (result.success) {
      navigate('/lobby');
    } else {
      setError(result.error);
    }
  };

  const handleGuestLogin = async () => {
    const result = await loginAsGuest();
    if (result.success) {
      navigate('/lobby');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 text-cyan-400 p-6">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 text-center ${isLogin ? 'bg-cyan-900 text-cyan-400' : 'bg-gray-700'}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center ${!isLogin ? 'bg-cyan-900 text-cyan-400' : 'bg-gray-700'}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 bg-gray-700 text-cyan-400 rounded border border-gray-600 focus:border-cyan-400 focus:outline-none"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 bg-gray-700 text-cyan-400 rounded border border-gray-600 focus:border-cyan-400 focus:outline-none"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 bg-gray-700 text-cyan-400 rounded border border-gray-600 focus:border-cyan-400 focus:outline-none"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          )}

          <button 
            type="submit"
            className="w-full py-2 bg-cyan-900 hover:bg-cyan-800 text-cyan-400 rounded"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <button 
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-cyan-400 rounded"
            onClick={handleGuestLogin}
          >
            Play as Guest
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
