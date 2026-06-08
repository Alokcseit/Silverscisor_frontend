
import api from '../../services/app'

export const signupAPI = async (userData) => {
  console.log(userData);
  delete userData.confirmPassword;
  let newUserData={
    username: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: userData.password,
    userType: userData.userType
  }
  try {
    // URL check kar lena: /api/Signup hai ya /api/Register
    const response = await api.post('/api/auth/signup', newUserData);

    console.log('✅ Signup successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Signup failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Signup failed. Please try again.');
  }
};