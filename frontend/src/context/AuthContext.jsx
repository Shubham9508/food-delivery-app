import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/profile');
          setUser(res.data.user);
        } catch (err) {
          console.error('Error fetching user profile', err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token: userToken, user: userData } = res.data;
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      const { token: userToken, user: userData } = res.data;
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      toast.success(`Welcome to FoodExpress, ${userData.name}!`);
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const updateProfile = async (name, phone, address) => {
    try {
      const res = await API.put('/auth/profile', { name, phone, address });
      setUser(res.data.user);
      toast.success('Profile updated successfully!');
      return res.data.user;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile.';
      toast.error(errMsg);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
