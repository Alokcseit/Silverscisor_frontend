import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import recommendationReducer from './recommendationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recommendation: recommendationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['recommendation/setRecommendedServices'],
      },
    }),
});

export default store;
