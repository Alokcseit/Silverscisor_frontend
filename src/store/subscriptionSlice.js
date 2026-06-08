// src/store/subscriptionSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plan: 'free',           // 'free', 'silver', 'gold', 'platinum'
  tokenBalance: 0,
  bookingsUsed: 0,        // free plan ke liye
  bookingsLimit: 10,      // free plan limit
  planExpiry: null,
  isActive: true,
  features: {
    whatsappNotifications: false,
    aiRecommendations: false,
    advancedAnalytics: false,
    unlimitedBookings: false,
    staffLimit: 1
  }
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setPlan: (state, action) => {
      const { plan, expiry, tokens } = action.payload;
      state.plan = plan;
      state.planExpiry = expiry;
      state.tokenBalance = tokens || state.tokenBalance;

      // Features update based on plan
      switch (plan) {
        case 'silver':
          state.features = {
            whatsappNotifications: false,
            aiRecommendations: false,
            advancedAnalytics: false,
            unlimitedBookings: true,
            staffLimit: 3
          };
          state.bookingsLimit = Infinity;
          break;
        case 'gold':
          state.features = {
            whatsappNotifications: true,
            aiRecommendations: true,
            advancedAnalytics: true,
            unlimitedBookings: true,
            staffLimit: 10
          };
          state.bookingsLimit = Infinity;
          break;
        case 'platinum':
          state.features = {
            whatsappNotifications: true,
            aiRecommendations: true,
            advancedAnalytics: true,
            unlimitedBookings: true,
            staffLimit: Infinity
          };
          state.bookingsLimit = Infinity;
          break;
        default: // free
          state.features = {
            whatsappNotifications: false,
            aiRecommendations: false,
            advancedAnalytics: false,
            unlimitedBookings: false,
            staffLimit: 1
          };
          state.bookingsLimit = 10;
      }
    },
    setTokenBalance: (state, action) => {
      state.tokenBalance = action.payload;
    },
    deductTokens: (state, action) => {
      state.tokenBalance = Math.max(0, state.tokenBalance - action.payload);
    },
    addTokens: (state, action) => {
      state.tokenBalance += action.payload;
    },
    incrementBookings: (state) => {
      state.bookingsUsed += 1;
    },
    resetMonthlyBookings: (state) => {
      state.bookingsUsed = 0;
    }
  }
});

export const {
  setPlan,
  setTokenBalance,
  deductTokens,
  addTokens,
  incrementBookings,
  resetMonthlyBookings
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer; 