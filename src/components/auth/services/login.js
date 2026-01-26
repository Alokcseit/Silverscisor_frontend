import axios from 'axios'
const API_URL ="https://silverscisor-backend-1.onrender.com/api"

export const loginAPI = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/v1/auth/login`, credentials);

    console.log("✅ Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Login failed. Please check your credentials."
    );
  }
};