// src/util/SalonMorphIcon.jsx

import React, { useState, useEffect } from 'react';

const SalonMorphIcon = ({ size = 60 }) => {
  const [activeStage, setActiveStage] = useState(0); // 0: Scissors, 1: Dryer, 2: Comb

  // Cycle through icons every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 3);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* --- Gradients for Realism --- */}
          
          {/* Chrome/Silver Gradient */}
          <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Premium Gold Gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Black Matte Gradient (Dryer Body) */}
          <linearGradient id="matteBlack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Wood/Amber Gradient (Comb) */}
          <linearGradient id="combGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" /> {/* Burnt Orange */}
            <stop offset="100%" stopColor="#7C2D12" /> {/* Dark Brown */}
          </linearGradient>

          {/* Air Flow Gradient */}
          <linearGradient id="airGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Drop Shadow */}
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* =========================================
            STAGE 1: SCISSORS (Active when stage 0)
            =========================================
        */}
        <g 
          className={`transition-all duration-700 ease-in-out origin-center ${activeStage === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          filter="url(#dropShadow)"
        >
          {/* Static Screw */}
          <circle cx="50" cy="50" r="3" fill="url(#goldGradient)" className="z-20 relative" />

          {/* Top Blade (Animate Rotation) */}
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0 50 50; -15 50 50; 0 50 50" dur="0.8s" repeatCount="indefinite" />
            <path d="M50 50 L80 20 Q85 15, 80 10 L45 45 Z" fill="url(#chromeGradient)" />
            <path d="M45 45 L30 60 Q20 70, 30 80 Q40 90, 50 80 L55 75" fill="none" stroke="url(#goldGradient)" strokeWidth="3" />
             {/* Finger Ring */}
            <circle cx="35" cy="75" r="8" stroke="url(#goldGradient)" strokeWidth="3" fill="none" />
          </g>

          {/* Bottom Blade (Animate Rotation) */}
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0 50 50; 15 50 50; 0 50 50" dur="0.8s" repeatCount="indefinite" />
            <path d="M50 50 L80 80 Q85 85, 80 90 L45 55 Z" fill="url(#chromeGradient)" />
            <path d="M45 55 L30 40 Q20 30, 30 20 Q40 10, 50 20 L55 25" fill="none" stroke="url(#goldGradient)" strokeWidth="3" />
             {/* Finger Ring */}
            <circle cx="35" cy="25" r="8" stroke="url(#goldGradient)" strokeWidth="3" fill="none" />
          </g>

          {/* Sparkles */}
          <path d="M85 50 L90 50 M87.5 47.5 L87.5 52.5" stroke="white" strokeWidth="2" opacity={activeStage === 0 ? 1 : 0}>
             <animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite" />
          </path>
        </g>


        {/* =========================================
            STAGE 2: HAIR DRYER (Active when stage 1)
            =========================================
        */}
        <g 
          className={`transition-all duration-700 ease-in-out origin-center ${activeStage === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          filter="url(#dropShadow)"
        >
          {/* Slight Hover Animation Group */}
          <g>
             <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2; 0 0" dur="0.2s" repeatCount="indefinite" />
             
             {/* Nozzle */}
             <rect x="70" y="30" width="10" height="20" rx="2" fill="url(#goldGradient)" />
             
             {/* Main Body */}
             <path d="M20 30 H70 V50 H20 Q10 50, 10 40 Q10 30, 20 30 Z" fill="url(#matteBlack)" />
             
             {/* Handle */}
             <path d="M30 50 L25 80 Q23 90, 33 90 L38 90 Q48 90, 45 80 L40 50 Z" fill="url(#matteBlack)" />
             
             {/* Back Detail (Fan Grill) */}
             <circle cx="20" cy="40" r="8" fill="url(#goldGradient)" />
             <path d="M20 32 V48 M12 40 H28" stroke="#333" strokeWidth="1" />
             
             {/* Buttons on Handle */}
             <circle cx="34" cy="60" r="2" fill="red" />
             <circle cx="33" cy="68" r="2" fill="cyan" />
          </g>

          {/* Air Flow Lines (Animated) */}
          <g transform="translate(82, 40)">
             <path d="M0 0 H15" stroke="url(#airGradient)" strokeWidth="2" strokeLinecap="round">
                <animate attributeName="stroke-dasharray" values="0 20; 20 0" dur="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite" />
             </path>
             <path d="M0 5 H20" stroke="url(#airGradient)" strokeWidth="2" strokeLinecap="round">
                <animate attributeName="stroke-dasharray" values="0 20; 20 0" dur="0.6s" repeatCount="indefinite" begin="0.1s" />
                <animate attributeName="opacity" values="0;1;0" dur="0.6s" repeatCount="indefinite" begin="0.1s" />
             </path>
              <path d="M0 -5 H10" stroke="url(#airGradient)" strokeWidth="2" strokeLinecap="round">
                <animate attributeName="stroke-dasharray" values="0 20; 20 0" dur="0.4s" repeatCount="indefinite" begin="0.2s" />
                <animate attributeName="opacity" values="0;1;0" dur="0.4s" repeatCount="indefinite" begin="0.2s" />
             </path>
          </g>
        </g>


        {/* =========================================
            STAGE 3: COMB (Active when stage 2)
            =========================================
        */}
        <g 
          className={`transition-all duration-700 ease-in-out origin-center ${activeStage === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          filter="url(#dropShadow)"
        >
          {/* Combing Motion Animation */}
          <animateTransform 
             attributeName="transform" 
             type="rotate" 
             values="-10 50 50; 10 50 50; -10 50 50" 
             dur="2s" 
             repeatCount="indefinite" 
             additive="sum"
          />

          {/* Comb Body */}
          <rect x="20" y="35" width="60" height="10" rx="3" fill="url(#combGradient)" />
          
          {/* Comb Handle (Tail comb style) */}
          <path d="M20 40 L5 40 Q0 40, 2 38 L20 36 Z" fill="url(#combGradient)" />

          {/* Comb Teeth */}
          <g fill="url(#combGradient)">
            {/* Generating teeth */}
            <rect x="22" y="45" width="2" height="15" rx="1" />
            <rect x="27" y="45" width="2" height="15" rx="1" />
            <rect x="32" y="45" width="2" height="15" rx="1" />
            <rect x="37" y="45" width="2" height="15" rx="1" />
            <rect x="42" y="45" width="2" height="15" rx="1" />
            <rect x="47" y="45" width="2" height="15" rx="1" />
            <rect x="52" y="45" width="2" height="15" rx="1" />
            <rect x="57" y="45" width="2" height="15" rx="1" />
            <rect x="62" y="45" width="2" height="15" rx="1" />
            <rect x="67" y="45" width="2" height="15" rx="1" />
            <rect x="72" y="45" width="2" height="15" rx="1" />
            <rect x="77" y="45" width="2" height="15" rx="1" />
          </g>

          {/* Shine effect on Comb */}
          <rect x="20" y="37" width="60" height="2" fill="white" opacity="0.2" />
        </g>

      </svg>
    </div>
  );
};

export default SalonMorphIcon;