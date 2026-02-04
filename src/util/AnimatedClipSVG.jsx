'use client';

import React from 'react';

const AnimatedClipSVG = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-32 overflow-hidden pointer-events-none z-10">
      <svg
        viewBox="0 0 1200 150"
        className="w-full h-full opacity-50 dark:opacity-40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="silverGloss" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* --- COMPACT FLOATING GROUP --- */}
        <g className="animate-top-flow">
          
          {/* 1. SCISSORS (Smaller & Faster) */}
          <g transform="translate(0, 40) scale(0.4)">
            <g className="animate-scissor-snip" style={{ transformOrigin: '0px 0px' }}>
              <path d="M-10 -5 L150 -35 Q170 -35 170 -15 L10 -2 Z" fill="url(#silverGloss)" stroke="#1e293b" strokeWidth="2" />
              <circle cx="-40" cy="-25" r="22" stroke="url(#silverGloss)" strokeWidth="8" />
            </g>
            <g className="animate-scissor-snip-rev" style={{ transformOrigin: '0px 0px' }}>
              <path d="M-10 5 L150 35 Q170 35 170 15 L10 2 Z" fill="url(#silverGloss)" stroke="#1e293b" strokeWidth="2" />
              <circle cx="-40" cy="25" r="22" stroke="url(#silverGloss)" strokeWidth="8" />
            </g>
          </g>

          {/* 2. STYLING COMB (Following Scissors) */}
          <g transform="translate(100, 35) rotate(-15) scale(0.35)">
            <rect x="0" y="0" width="180" height="35" rx="5" fill="#1e293b" />
            {[...Array(15)].map((_, i) => (
              <rect key={i} x={10 + i * 11} y="35" width="3" height="30" fill="#64748b" />
            ))}
          </g>

          {/* 3. MINI DRYER */}
          <g transform="translate(-80, 50) scale(0.35)">
            <path d="M0 0 L60 -10 Q80 -10 80 20 L70 50 L10 40 Z" fill="#334155" />
            <rect x="35" y="45" width="25" height="40" rx="5" fill="#0f172a" />
            <path d="M85 10 L105 10 M85 20 L110 20" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
          </g>
        </g>
      </svg>

      <style jsx>{`
        /* Movement strictly at the TOP */
        @keyframes top-flow {
          0% {
            transform: translateX(-300px);
          }
          100% {
            transform: translateX(1300px);
          }
        }

        .animate-top-flow {
          animation: top-flow 12s linear infinite;
        }

        /* Fast Snapping Cut */
        @keyframes snip { 
          0%, 100% { transform: rotate(-12deg); } 
          50% { transform: rotate(5deg); } 
        }
        @keyframes snip-rev { 
          0%, 100% { transform: rotate(12deg); } 
          50% { transform: rotate(-5deg); } 
        }

        .animate-scissor-snip { animation: snip 0.6s ease-in-out infinite; }
        .animate-scissor-snip-rev { animation: snip-rev 0.6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AnimatedClipSVG;