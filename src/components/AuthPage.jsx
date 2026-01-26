// src/pages/AuthPage.jsx (ya jahan bhi aapka ye file hai)
import React, { useState } from 'react';
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';
import ForgotPassword from './auth/ForgotPassword';

const AuthPage = () => {
  // Hum 'true/false' ki jagah ab 'view' ka naam store karenge
  // Possible values: 'login', 'signup', 'forgot-password'
  const [view, setView] = useState('login');

  return (
    <div className="auth-page">
      
      {/* CASE 1: LOGIN PAGE */}
      {view === 'login' && (
        <Login 
          onSwitchToSignup={() => setView('signup')}
          onSwitchToForgotPassword={() => setView('forgot-password')} // 👈 Ye naya function pass kiya
        />
      )}

      {/* CASE 2: SIGNUP PAGE */}
      {view === 'signup' && (
        <Signup 
          onSwitchToLogin={() => setView('login')} 
          onSignupSuccess={() => setView('login')} 
        />
      )}

      {/* CASE 3: FORGOT PASSWORD PAGE */}
      {view === 'forgot-password' && (
        <ForgotPassword 
          onBackToLogin={() => setView('login')} // 👈 Wapis login pe jaane ke liye
        />
      )}

    </div>
  );
};

export default AuthPage;


// import React, { useState } from 'react';
// import Signup from '../components/auth/Signup';
// import Login from '../components/auth/Login';

// const AuthPage = () => {
//   const [showLogin, setShowLogin] = useState(true);

//   // Ye function login screen pe switch karega
//   const handleSuccess = () => {
//       setShowLogin(true);
//   };

//   return (
//     <div className="auth-page">
//       {showLogin ? (
//         <Login onSwitchToSignup={() => setShowLogin(false)} />
//       ) : (
//         <Signup 
//             onSwitchToLogin={() => setShowLogin(true)} 
//             onSignupSuccess={handleSuccess}  // 👈 Ye line add karni hai
//         />
//       )}
//     </div>
//   );
// };

// export default AuthPage;