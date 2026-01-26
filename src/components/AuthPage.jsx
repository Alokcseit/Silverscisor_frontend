// import React, { useState } from 'react';
// import Signup from '../components/auth/Signup';
// import Login from '../components/auth/Login';

// const AuthPage = () => {
//   const [showLogin, setShowLogin] = useState(true);

//   return (
//     <div className="auth-page">
//       {showLogin ? (
//         <Login onSwitchToSignup={() => setShowLogin(false)} />
//       ) : (
//         <Signup onSwitchToLogin={() => setShowLogin(true)} />
//       )}
//     </div>
//   );
// };

// export default AuthPage;


import React, { useState } from 'react';
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  // Ye function login screen pe switch karega
  const handleSuccess = () => {
      setShowLogin(true);
  };

  return (
    <div className="auth-page">
      {showLogin ? (
        <Login onSwitchToSignup={() => setShowLogin(false)} />
      ) : (
        <Signup 
            onSwitchToLogin={() => setShowLogin(true)} 
            onSignupSuccess={handleSuccess}  // 👈 Ye line add karni hai
        />
      )}
    </div>
  );
};

export default AuthPage;