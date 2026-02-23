
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 120 }) => {
  return (
    <div className={`flex flex-col items-center justify-center preserve-3d transition-transform duration-500 hover:rotate-y-12 ${className}`}>
      <div 
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center group preserve-3d"
      >
        {/* 3D Orbitals */}
        <div className="absolute inset-0 border-[2px] border-purple-500/20 rounded-[45%] scale-[1.7] animate-[spin_15s_linear_infinite]" />
        <div className="absolute inset-0 border-[1px] border-white/5 rounded-[45%] scale-[1.9] animate-[spin_25s_linear_infinite_reverse]" />
        
        {/* Core Glow */}
        <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-[50px] animate-pulse scale-150" />

        {/* Main Body */}
        <div className="relative w-full h-full bg-[#050505] border-[1px] border-white/20 rounded-[35%] flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.4)] transform translate-z-10">
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent h-[200%] w-full animate-[scan_4s_linear_infinite]" />
          
          <div className="relative flex items-center justify-center transform translate-z-20">
             <span className="font-orbitron text-5xl md:text-6xl font-black text-white italic drop-shadow-[0_0_20px_rgba(168,85,247,1)] select-none">
              R
            </span>
          </div>

          <div className="absolute bottom-2 right-3 text-[4px] font-mono text-white/30 tracking-[0.4em] uppercase">V.3D_ULTRA</div>
        </div>
      </div>
      
      <div className="mt-10 flex flex-col items-center transform translate-z-30">
        <h1 className="font-orbitron tracking-[0.6em] text-white font-black text-xl md:text-2xl text-glow uppercase italic ml-[0.6em] scale-x-110">
          RAYELITY
        </h1>
        <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-1" />
        <span className="mt-2 font-orbitron tracking-[0.3em] text-purple-400/60 text-[7px] font-black uppercase ml-[0.3em]">CITY 3D OPERATIONS</span>
      </div>

      <style>{`
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
      `}</style>
    </div>
  );
};