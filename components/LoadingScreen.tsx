
import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface LoadingScreenProps {
  progress: number;
}

const HYPE_ASSETS = [
  {
    url: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=2070&auto=format&fit=crop", 
    title: "OPERATIONS READY",
    log: "Analyzing Combat Zone..."
  },
  {
    url: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=2070&auto=format&fit=crop", 
    title: "NEON INFILTRATION",
    log: "Patching Secure Uplink..."
  },
  {
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2156&auto=format&fit=crop", 
    title: "SQUAD FORMATION",
    log: "Allocating Resources..."
  }
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  const [assetIndex, setAssetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssetIndex(prev => (prev + 1) % HYPE_ASSETS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        {HYPE_ASSETS.map((asset, idx) => (
          <div 
            key={asset.url}
            className={`absolute inset-0 transition-all duration-[2500ms] ${idx === assetIndex ? 'opacity-50 scale-100' : 'opacity-0 scale-110 blur-sm'}`}
            style={{ backgroundImage: `url(${asset.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-black/20 backdrop-grayscale-[0.4]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="animate__animated animate__pulse animate__infinite">
           <Logo size={85} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-8 pb-12 z-20 flex flex-col gap-5">
         <div className="space-y-1">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
               <span className="text-[7px] text-purple-400 font-black uppercase tracking-[0.5em]">{HYPE_ASSETS[assetIndex].log}</span>
            </div>
            <h2 className="text-white font-orbitron font-black text-2xl md:text-5xl italic uppercase leading-tight tracking-tighter">
              {HYPE_ASSETS[assetIndex].title}
            </h2>
         </div>

         <div className="w-full flex flex-col gap-2.5">
            <div className="flex justify-between items-end">
               <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Optimizing Engine...</span>
               <span className="text-2xl md:text-4xl font-orbitron font-black text-white italic drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">{Math.floor(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
              <div 
                className="h-full bg-gradient-to-r from-purple-800 to-purple-400 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                style={{ width: `${progress}%` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-[loading_1.5s_infinite]" />
            </div>
         </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
