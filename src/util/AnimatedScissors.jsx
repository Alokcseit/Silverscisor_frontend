const AnimatedScissors = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Scissors 1 - Moving left to right with cutting animation */}
      <svg
        className="absolute top-1/2 -translate-y-1/2 w-8 h-8 text-white/10 dark:text-white/5 animate-scissors-move-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6" cy="6" r="3" className="animate-scissors-cut-1" />
        <circle cx="6" cy="18" r="3" className="animate-scissors-cut-2" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" className="origin-center" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" className="origin-center" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>

      {/* Scissors 2 - Moving right to left */}
      <svg
        className="absolute top-1/3 -translate-y-1/2 w-6 h-6 text-white/8 dark:text-white/4 animate-scissors-move-2 rotate-180"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>

      {/* Scissors 3 - Small one moving diagonally */}
      <svg
        className="absolute bottom-1/4 w-5 h-5 text-white/6 dark:text-white/3 animate-scissors-move-3 -rotate-45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>

      {/* Cut line trail effect - dashed line following scissors */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <line
          x1="0%"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="8 12"
          className="text-white/5 dark:text-white/3 animate-cut-line"
        />
      </svg>

      {/* Floating hair strand particles */}
      <div className="absolute top-1/4 left-1/4 w-1 h-6 bg-gradient-to-b from-white/10 to-transparent dark:from-white/5 rounded-full animate-hair-fall-1 rotate-12" />
      <div className="absolute top-1/3 left-1/2 w-0.5 h-4 bg-gradient-to-b from-white/8 to-transparent dark:from-white/4 rounded-full animate-hair-fall-2 -rotate-6" />
      <div className="absolute top-1/4 right-1/3 w-1 h-5 bg-gradient-to-b from-white/6 to-transparent dark:from-white/3 rounded-full animate-hair-fall-3 rotate-[20deg]" />

      {/* Sparkle effects where scissors cut */}
      <div className="absolute top-1/2 left-1/4 animate-sparkle-1">
        <svg className="w-3 h-3 text-amber-200/40 dark:text-amber-400/20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
      <div className="absolute top-1/3 right-1/4 animate-sparkle-2">
        <svg className="w-2 h-2 text-white/30 dark:text-white/15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scissors-move-1 {
          0% {
            left: -10%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 110%;
            opacity: 0;
          }
        }

        @keyframes scissors-move-2 {
          0% {
            right: -10%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            right: 110%;
            opacity: 0;
          }
        }

        @keyframes scissors-move-3 {
          0% {
            left: -5%;
            bottom: 25%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 105%;
            bottom: 75%;
            opacity: 0;
          }
        }

        @keyframes scissors-cut-1 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(2px);
          }
        }

        @keyframes scissors-cut-2 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        @keyframes cut-line {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: -100;
          }
        }

        @keyframes hair-fall-1 {
          0% {
            opacity: 0;
            transform: translateY(-10px) rotate(12deg);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(60px) rotate(45deg);
          }
        }

        @keyframes hair-fall-2 {
          0% {
            opacity: 0;
            transform: translateY(-10px) rotate(-6deg);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(50px) rotate(-30deg);
          }
        }

        @keyframes hair-fall-3 {
          0% {
            opacity: 0;
            transform: translateY(-10px) rotate(20deg);
          }
          25% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(55px) rotate(60deg);
          }
        }

        @keyframes sparkle-1 {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes sparkle-2 {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(45deg);
          }
        }

        .animate-scissors-move-1 {
          animation: scissors-move-1 8s linear infinite, scissors-cut-1 0.3s ease-in-out infinite;
        }

        .animate-scissors-move-2 {
          animation: scissors-move-2 12s linear infinite 3s;
        }

        .animate-scissors-move-3 {
          animation: scissors-move-3 15s linear infinite 6s;
        }

        .animate-scissors-cut-1 {
          animation: scissors-cut-1 0.4s ease-in-out infinite;
        }

        .animate-scissors-cut-2 {
          animation: scissors-cut-2 0.4s ease-in-out infinite;
        }

        .animate-cut-line {
          animation: cut-line 4s linear infinite;
        }

        .animate-hair-fall-1 {
          animation: hair-fall-1 3s ease-in infinite 1s;
        }

        .animate-hair-fall-2 {
          animation: hair-fall-2 3.5s ease-in infinite 2s;
        }

        .animate-hair-fall-3 {
          animation: hair-fall-3 4s ease-in infinite 0.5s;
        }

        .animate-sparkle-1 {
          animation: sparkle-1 2s ease-in-out infinite 1.5s;
        }

        .animate-sparkle-2 {
          animation: sparkle-2 2.5s ease-in-out infinite 2.5s;
        }
      `}</style>
    </div>
  );
};

export default AnimatedScissors;