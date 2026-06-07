import api from '../../services/app'

export const loginAPI = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);

    console.log('✅ Login successful:', response.data);
    // Normalize: return the inner `data` payload if backend wraps it as { success, message, data }
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};