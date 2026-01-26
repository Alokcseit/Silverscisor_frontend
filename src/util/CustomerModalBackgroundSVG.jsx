import React from 'react';

const CustomerModalBackgroundSVG = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      <svg
        className="w-full h-full opacity-10 dark:opacity-5"
        viewBox="0 0 800 800"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 0.5 }} /> {/* Pink */}
            <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.5 }} /> {/* Purple */}
          </linearGradient>
          
          <style>
            {`
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(5deg); }
              }
              @keyframes drift {
                0% { transform: translate(0, 0); }
                50% { transform: translate(10px, 15px); }
                100% { transform: translate(0, 0); }
              }
              @keyframes spin-slow {
                from { transform: rotate(0deg); transform-origin: center; }
                to { transform: rotate(360deg); transform-origin: center; }
              }
              .salon-icon { animation: float 6s ease-in-out infinite; }
              .salon-blob { animation: drift 10s ease-in-out infinite; }
              .salon-spin { animation: spin-slow 20s linear infinite; }
            `}
          </style>
        </defs>

        {/* --- Background Blobs --- */}
        <circle cx="10%" cy="10%" r="150" fill="url(#grad1)" className="salon-blob" style={{ animationDelay: '0s' }} />
        <circle cx="90%" cy="80%" r="200" fill="url(#grad1)" className="salon-blob" style={{ animationDelay: '2s' }} />
        <circle cx="50%" cy="50%" r="100" fill="#f59e0b" fillOpacity="0.3" className="salon-blob" style={{ animationDelay: '4s' }} />

        {/* --- Scissors Icon (Floating) --- */}
        <g transform="translate(100, 400) scale(1.5)" className="salon-icon" style={{ animationDelay: '1s', color: '#6b7280' }}>
           <path fill="currentColor" d="M16.5,6c-1.4,0-2.5,1.1-2.5,2.5c0,0.5,0.2,1,0.5,1.4L10,14.4l-4.5-4.5C5.8,9.5,6,9,6,8.5 C6,7.1,4.9,6,3.5,6S1,7.1,1,8.5c0,1.4,1.1,2.5,2.5,2.5c0.5,0,1-0.2,1.4-0.5l4.5,4.5l-4.5,4.5C4.5,19.2,4,19,3.5,19 C2.1,19,1,20.1,1,21.5S2.1,24,3.5,24s2.5-1.1,2.5-2.5c0-0.5-0.2-1-0.5-1.4l4.5-4.5l4.5,4.5c-0.3,0.4-0.5,0.9-0.5,1.4 c0,1.4,1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5c0-1.4-1.1-2.5-2.5-2.5c-0.5,0-1,0.2-1.4,0.5l-4.5-4.5l4.5-4.5C15.5,10.8,16,11,16.5,11 c1.4,0,2.5-1.1,2.5-2.5S17.9,6,16.5,6z M3.5,10C2.7,10,2,9.3,2,8.5S2.7,7,3.5,7S5,7.7,5,8.5S4.3,10,3.5,10z M3.5,23 C2.7,23,2,22.3,2,21.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S4.3,23,3.5,23z M16.5,23c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5 s1.5,0.7,1.5,1.5S17.3,23,16.5,23z M16.5,10c-0.8,0-1.5-0.7-1.5-1.5S15.7,7,16.5,7s1.5,0.7,1.5,1.5S17.3,10,16.5,10z" />
        </g>

        {/* --- Comb Icon (Floating) --- */}
        <g transform="translate(600, 200) rotate(45) scale(2)" className="salon-icon" style={{ animationDelay: '3s', color: '#6b7280' }}>
            <path fill="currentColor" d="M18,6H6C3.8,6,2,7.8,2,10v8h2v-5h2v5h2v-5h2v5h2v-5h2v5h2v-5h2v5h2v-8C22,7.8,20.2,6,18,6z" />
        </g>

        {/* --- Sparkles/Stars --- */}
        <g className="salon-spin" style={{ transformOrigin: 'center' }}>
            <path fill="#fbbf24" d="M400,100 L405,115 L420,120 L405,125 L400,140 L395,125 L380,120 L395,115 Z" />
            <path fill="#fbbf24" d="M100,600 L105,615 L120,620 L105,625 L100,640 L95,625 L80,620 L95,615 Z" />
            <path fill="#fbbf24" d="M700,500 L703,508 L711,511 L703,514 L700,522 L697,514 L689,511 L697,508 Z" />
        </g>
      </svg>
    </div>
  );
};

export default CustomerModalBackgroundSVG;