
import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

export const MatchLoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Loading Map Assets...');

  const messages = [
    'Equipping Weapons...',
    'Generating 3D Terrain...',
    'Syncing Squad Data...',
    'Activating Rayelity Protocols...',
    'Ready for Deployment!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        const msgIndex = Math.floor((next / 100) * messages.length);
        if (messages[msgIndex]) setStatus(messages[msgIndex]);
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-[5000] bg-[#020202] flex flex-col items-center justify-center p-10 font-rajdhani overflow-hidden" dir="ltr">
      <div className="scanline opacity-20" />
      
      {/* 3D Wireframe Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute inset-0" style={{ 
           backgroundImage: 'linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)',
           backgroundSize: '100px 100px',
           transform: 'perspective(500px) rotateX(60deg) translateY(-50%)',
           transformOrigin: 'top'
         }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
         <div className="mb-20 animate__animated animate__zoomIn">
            <Logo size={120} />
         </div>

         <div className="w-full space-y-12">
            <div className="flex justify-between items-end">
               <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-purple-400 font-black tracking-[0.6em] uppercase animate-pulse">{status}</span>
                  <h3 className="text-4xl font-black italic text-white tracking-tighter uppercase">MAP_GENERATION_IN_PROGRESS</h3>
               </div>
               <div className="text-right">
                  <span className="text-6xl font-black italic text-white text-glow">{Math.floor(progress)}%</span>
               </div>
            </div>

            <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
               <div 
                className="h-full bg-gradient-to-r from-purple-800 to-purple-400 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                style={{ width: `${progress}%` }}
               />
               <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-[loading_1s_infinite]" />
            </div>

            <div className="grid grid-cols-3 gap-10 opacity-60">
               <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col items-center">
                  <span className="text-[10px] font-black text-white/40 mb-3 tracking-widest">SQUAD ID</span>
                  <span className="text-xl font-black text-white italic">RAY-701</span>
               </div>
               <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col items-center">
                  <span className="text-[10px] font-black text-white/40 mb-3 tracking-widest">ENGINE</span>
                  <span className="text-xl font-black text-purple-400 italic">3D_NATIVE</span>
               </div>
               <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col items-center">
                  <span className="text-[10px] font-black text-white/40 mb-3 tracking-widest">LATENCY</span>
                  <span className="text-xl font-black text-green-500 italic">14ms</span>
               </div>
            </div>
         </div>
      </div>

      <style>{`
        @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
};
