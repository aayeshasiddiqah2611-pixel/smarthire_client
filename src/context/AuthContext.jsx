import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // Check if token is expired
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            throw new Error('Token expired');
          }
          // Optionally fetch profile details here if needed
          // const res = await authService.getProfile();
          // setUser(res.data);
          
          setUser({ id: decoded.userId || decoded.id, ...decoded });
        } catch (error) {
          console.error("Auth initialization error:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    // Assuming data contains { token, user }
    const newToken = data.token || data.data?.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    
    const decoded = jwtDecode(newToken);
    setUser({ id: decoded.userId || decoded.id, ...decoded });
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    const newToken = data.token || data.data?.token;
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      const decoded = jwtDecode(newToken);
      setUser({ id: decoded.userId || decoded.id, ...decoded });
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
