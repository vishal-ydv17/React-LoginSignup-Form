import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login: contextLogin, signup: contextSignup, logout: contextLogout } = useAuthContext();

  const handleAuth = async (action, data, redirectPath) => {
    setLoading(true);
    setError(null);
    try {
      await action(data);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(
    (credentials) => handleAuth(contextLogin, credentials, '/dashboard'),
    [contextLogin, navigate]
  );

  const signup = useCallback(
    (userData) => handleAuth(contextSignup, userData, '/login'),
    [contextSignup, navigate]
  );

  const logout = useCallback(() => {
    contextLogout();
    navigate('/login');
  }, [contextLogout, navigate]);

  return {
    login,
    signup,
    logout,
    loading,
    error
  };
};