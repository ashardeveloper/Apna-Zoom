// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const AuthContext = createContext();

// Custom Hook (easy use anywhere)
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider Component
export const AuthProvider = ({ children }) => {
  // Global States
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Backend Base URL
  const API = "http://localhost:8000/api/v1/users";

  // Register User
  const register = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API}/register`, formData);

      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const login = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API}/login`, formData);

      const receivedToken = res.data.token;

      setToken(receivedToken);
      localStorage.setItem("token", receivedToken);

      setUser({
        username: formData.username,
      });

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // Auto Login on Refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const getHistoryOfUser = async () => {
    try {
      let request = await axios.get(`${API}/get_all_activity`, {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      return request.data;
    } catch (err) {
      throw err;
    }
  };

  const addToUserHistory = async (meetingCode) => {
    try {
      let request = await axios.post(`${API}/add_to_activity`, {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
      });
      return request;
    } catch (e) {
      throw e;
    }
  };

  // Values available everywhere
  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    getHistoryOfUser,
    addToUserHistory,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
