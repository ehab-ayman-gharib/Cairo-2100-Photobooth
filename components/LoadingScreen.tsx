import React from 'react';
import { PortalRing } from './PortalRing';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-2xl text-center p-6">
      <div className="relative mb-2 animate-pulse-slow">
        {/* Same portal ring used in countdown */}
        <PortalRing size={520} />
      </div>

      <div className="mt-[-2rem] space-y-3">
        <h3 
          className="text-3xl font-bold text-white tracking-[0.2em] uppercase"
          style={{ 
            fontFamily: '"Lalezar", cursive',
            textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff'
          }}
        >
          Initializing visual synthesis…..
        </h3>
        <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase opacity-60 animate-pulse">
          Neural networks converging • Stabilizing identity matrix
        </p>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
