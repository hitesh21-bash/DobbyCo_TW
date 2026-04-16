import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // Set axios default header
  useEffect(() => {
    const token = getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.data);
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, data } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(data);
      
      toast.success('Login successful! Welcome back! 🎉');
      return { success: true, user: data };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const signup = async (name, email, password, phone, role = 'user', businessName = '', businessLicense = '') => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        phone,
        role,
        businessName,
        businessLicense
      });
      const { token, data } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(data);
      
      const roleMessages = {
        user: 'Welcome to DobbyCo! 🐾',
        service_provider: 'Welcome! Your service provider account is pending verification 🏪',
        breeder: 'Welcome breeder! Start listing your pets 🐕',
        trainer: 'Welcome trainer! Start offering your services 🎓',
        veterinarian: 'Welcome doctor! Your expertise is valuable 🏥'
      };
      
      toast.success(roleMessages[role] || 'Account created successfully!');
      return { success: true, user: data };
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};