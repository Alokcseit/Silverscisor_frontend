import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import recommendationReducer from './recommendationSlice';
import subscriptionReducer from './subscriptionSlice';
import adminReducer from './adminSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    recommendation: recommendationReducer,
    subscription: subscriptionReducer,
     admin: adminReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['recommendation/setRecommendedServices'],
      },
    }),
});

export default store;
