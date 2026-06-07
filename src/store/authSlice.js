import { createSlice } from '@reduxjs/toolkit';

const getLocalStorageItem = (key) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const getLocalStorageJson = (key) => {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const initialState = {
  accessToken: getLocalStorageItem('silverscisor_token'),
  refreshToken: getLocalStorageItem('silverscisor_refresh_token'),
  user: getLocalStorageJson('silverscisor_user')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('silverscisor_token');
        localStorage.removeItem('silverscisor_refresh_token');
        localStorage.removeItem('silverscisor_user');
      }
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('silverscisor_token', action.payload);
        } else {
          localStorage.removeItem('silverscisor_token');
        }
      }
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('silverscisor_refresh_token', action.payload);
        } else {
          localStorage.removeItem('silverscisor_refresh_token');
        }
      }
    },
    setUser(state, action) {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('silverscisor_user', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('silverscisor_user');
        }
      }
    }
  }
});

export const { logout, setAccessToken, setRefreshToken, setUser } = authSlice.actions;
export default authSlice.reducer;
