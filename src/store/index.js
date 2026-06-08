import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import recommendationReducer from './recommendationSlice';
import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recommendation: recommendationReducer,
    subscription: subscriptionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['recommendation/setRecommendedServices'],
      },
    }),
});

export default store;
