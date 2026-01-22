import React from 'react';

const DecorativeBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 1. LUXURY GRADIENTS */}
          <linearGradient id="lux-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3E8FF" stopOpacity="0.5" /> {/* Soft Purple */}
            <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.2" /> {/* Transparent Blue */}
          </linearGradient>

          <linearGradient id="lux-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="sharp-silver" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.1" />
          </linearGradient>

          {/* 2. FILTERS */}
          <filter id="glass-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          </filter>

          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.1" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* CSS ANIMATIONS */}
        <style>
          {`
            .strand { animation: floatStrand 8s ease-in-out infinite alternate; }
            .orb { animation: breathe 10s ease-in-out infinite; }
            .sharp-cut { animation: slice 15s linear infinite; }
            .sparkle { animation: twinkle 4s ease-in-out infinite; }

            @keyframes floatStrand {
              0% { transform: translateY(0px) skewX(0deg); }
              100% { transform: translateY(-20px) skewX(2deg); }
            }
            @keyframes breathe {
              0%, 100% { transform: scale(1); opacity: 0.3; }
              50% { transform: scale(1.1); opacity: 0.5; }
            }
            @keyframes slice {
              0% { stroke-dashoffset: 1000; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { stroke-dashoffset: 0; opacity: 0; }
            }
            @keyframes twinkle {
              0%, 100% { opacity: 0.2; transform: scale(0.8); }
              50% { opacity: 0.8; transform: scale(1.2); }
            }
          `}
        </style>

        {/* --- LAYERS --- */}

        {/* 1. Subtle Noise Texture (For paper/premium feel) */}
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.4" />

        {/* 2. Background Orbs (Soft Lighting) */}
        <circle className="orb" cx="10%" cy="20%" r="300" fill="url(#lux-purple)" filter="url(#glass-blur)" />
        <circle className="orb" cx="90%" cy="80%" r="400" fill="#E0F2FE" filter="url(#glass-blur)" opacity="0.4" style={{animationDelay: '-5s'}} />

        {/* 3. THE ARTISTIC ELEMENTS */}

        {/* Element A: Abstract Hair Strands (Bezier Curves) */}
        {/* These represent flow and style without being literal hair */}
        <g fill="none" stroke="url(#lux-gold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
           <path className="strand" d="M-100 600 C 200 600, 400 200, 800 200 S 1200 500, 1600 400" />
           <path className="strand" d="M-100 650 C 200 650, 450 250, 850 250 S 1250 550, 1600 450" style={{animationDelay: '1s'}} opacity="0.4" />
           <path className="strand" d="M-100 700 C 200 700, 500 300, 900 300 S 1300 600, 1600 500" style={{animationDelay: '2s'}} opacity="0.2" />
        </g>

        {/* Element B: The "Precision Cut" (Geometric Shapes) */}
        {/* Represents Scissors/Razor sharpness abstractly */}
        <g transform="translate(1100, 150) rotate(-15)">
            <rect className="sharp-cut" x="0" y="0" width="300" height="300" rx="150" stroke="url(#sharp-silver)" strokeWidth="1" fill="none" strokeDasharray="10 20" opacity="0.3" />
            <line x1="0" y1="150" x2="300" y2="150" stroke="url(#sharp-silver)" strokeWidth="0.5" opacity="0.5" />
            <line x1="150" y1="0" x2="150" y2="300" stroke="url(#sharp-silver)" strokeWidth="0.5" opacity="0.5" />
        </g>

        {/* Element C: Fashion Circles (Mirrors/Ring Light) */}
        <circle cx="100" cy="800" r="150" stroke="#F472B6" strokeWidth="2" fill="none" opacity="0.1" strokeDasharray="4 8" />
        <circle cx="100" cy="800" r="130" stroke="#A855F7" strokeWidth="1" fill="none" opacity="0.1" />

        {/* Element D: Sparkles (Cleanliness/Shine) */}
        {/* Top Right Cluster */}
        <g className="sparkle" transform="translate(1200, 100)">
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="#FBBF24" />
        </g>
        <g className="sparkle" transform="translate(1150, 150) scale(0.6)" style={{animationDelay: '1s'}}>
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="#A855F7" />
        </g>

        {/* Bottom Left Cluster */}
        <g className="sparkle" transform="translate(200, 600) scale(0.8)" style={{animationDelay: '2s'}}>
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="#38BDF8" />
        </g>

        {/* 4. Abstract "Comb" Lines (Minimalist texture) */}
        <g transform="translate(1300, 700) rotate(30)" opacity="0.1">
            <line x1="0" y1="0" x2="100" y2="0" stroke="black" strokeWidth="2" />
            <line x1="0" y1="10" x2="100" y2="10" stroke="black" strokeWidth="2" />
            <line x1="0" y1="20" x2="100" y2="20" stroke="black" strokeWidth="2" />
            <line x1="0" y1="30" x2="100" y2="30" stroke="black" strokeWidth="2" />
            <line x1="0" y1="40" x2="100" y2="40" stroke="black" strokeWidth="2" />
        </g>

      </svg>
    </div>
  );
};

export default DecorativeBackground;