// src/store/recommendationSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  recommendedServices: [],
  trendingServices: [],
  personalizedSuggestions: [],
  isLoading: false,
  error: null,
  lastFetched: null
};

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState,
  reducers: {
    setRecommendedServices: (state, action) => {
      state.recommendedServices = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setTrendingServices: (state, action) => {
      state.trendingServices = action.payload;
    },
    setPersonalizedSuggestions: (state, action) => {
      state.personalizedSuggestions = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearRecommendations: (state) => {
      state.recommendedServices = [];
      state.trendingServices = [];
      state.personalizedSuggestions = [];
      state.error = null;
    }
  }
});

export const {
  setRecommendedServices,
  setTrendingServices,
  setPersonalizedSuggestions,
  setLoading,
  setError,
  clearRecommendations
} = recommendationSlice.actions;

export default recommendationSlice.reducer;