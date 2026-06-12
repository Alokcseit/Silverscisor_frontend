// src/store/adminSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  token: localStorage.getItem('admin_token') || null,
  isAuthenticated: !!localStorage.getItem('admin_token'),
  currentView: 'dashboard'
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('admin_token', action.payload.token);
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('admin_token');
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    }
  }
});

export const { setAdmin, logoutAdmin, setCurrentView } = adminSlice.actions;
export default adminSlice.reducer;