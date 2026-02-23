
import React from 'react';

export const HolographicMap: React.FC<{ size?: number }> = ({ size = 300 }) => {
  return (
    <div className="relative preserve-3d group" style={{ width: size, height: size }}>
      {/* 3D Base Grid */}
      <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full rotate-x-75 transform translate-z-[-50px] animate-[spin_20s_linear_infinite]" 
           style={{ backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      {/* Map Structures (Visualized as 3D Bars/Buildings) */}
      <div className="absolute inset-0 flex items-center justify-center preserve-3d animate-[rotate-3d_30s_linear_infinite]">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-gradient-to-t from-purple-600/60 to-cyan-400/80 w-4 rounded-t-sm transform-gpu"
            style={{
              height: Math.random() * 80 + 20 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              transform: `translateZ(${Math.random() * 50}px) rotateX(-90deg)`,
              opacity: 0.7
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white/20 blur-[2px]" />
          </div>
        ))}
        
        {/* Floating Data Points */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={`p-${i}`}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15] animate-pulse"
            style={{
              left: Math.random() * 80 + 10 + '%',
              top: Math.random() * 80 + 10 + '%',
              transform: `translateZ(${Math.random() * 100 + 50}px)`
            }}
          />
        ))}
      </div>

      {/* Scanning Ring */}
      <div className="absolute inset-[-20px] border-t-2 border-purple-500/40 rounded-full rotate-x-75 animate-[spin_4s_linear_infinite]" />
      <div className="absolute inset-[-40px] border-b-2 border-cyan-500/20 rounded-full rotate-x-75 animate-[spin_8s_linear_infinite_reverse]" />

      <style>{`
        @keyframes rotate-3d {
          from { transform: rotateZ(0deg) rotateX(0deg); }
          to { transform: rotateZ(360deg) rotateX(10deg); }
        }
      `}</style>
    </div>
  );
};
