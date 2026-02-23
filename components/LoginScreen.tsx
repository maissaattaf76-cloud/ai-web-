
import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [scanPhase, setScanPhase] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginAction = () => {
    setScanPhase(true);
    setIsLoggingIn(true);
    setTimeout(onLogin, 2500);
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 overflow-hidden bg-black">
      {/* Photorealistic Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Real City/Warzone Background with high blur for focus */}
        <div className="absolute inset-0 bg-cover bg-center opacity-40 scale-110 grayscale-[0.5]" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2156&auto=format&fit=crop')" }} />
        
        {/* Dynamic Light Flares */}
        <div className="absolute top-[-15%] left-[-15%] w-[80%] h-[80%] bg-purple-700/10 blur-[130px] rounded-full animate-[float_20s_infinite_alternate] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-white/5 blur-[110px] rounded-full animate-[float_15s_infinite_alternate-reverse] mix-blend-overlay" />
        
        {/* Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black z-10" />
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] z-10" />
        
        {/* Subtle Dust Particles Simulation (Simple CSS) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-10 overflow-hidden">
           {[...Array(20)].map((_, i) => (
             <div key={i} className="absolute bg-white rounded-full opacity-40 animate-pulse" 
                  style={{ 
                    width: Math.random() * 3 + 'px', 
                    height: Math.random() * 3 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 5 + 's',
                    animationDuration: Math.random() * 10 + 5 + 's'
                  }} 
             />
           ))}
        </div>
      </div>

      {scanPhase && (
        <div className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 border border-purple-500/20 rounded-full flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-purple-500/5 animate-pulse" />
             <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_15px_rgba(168,85,247,1)] animate-[scan_1.5s_linear_infinite]" />
             <div className="text-center relative z-10">
                <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <span className="text-[9px] font-black tracking-[0.5em] text-white uppercase italic">Verifying Identity</span>
             </div>
          </div>
        </div>
      )}

      <div className={`relative z-10 w-full max-w-sm transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
        <div className="bg-[#080808]/70 backdrop-blur-[40px] border border-white/5 rounded-[56px] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          
          <div className="flex flex-col items-center mb-12 relative z-10">
            <Logo size={90} />
            <div className="w-12 h-0.5 bg-purple-600/30 mt-6 rounded-full" />
          </div>

          <div className="space-y-4 relative z-10">
            <button 
              onClick={handleLoginAction}
              disabled={isLoggingIn}
              className="w-full h-14 flex items-center justify-center gap-4 bg-white text-black rounded-[24px] font-black transition-all active:scale-95 hover:bg-slate-100 shadow-xl group overflow-hidden relative"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
              <span className="text-[10px] font-orbitron font-black uppercase tracking-widest">Infiltrate with Google</span>
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button 
              onClick={handleLoginAction}
              disabled={isLoggingIn}
              className="w-full h-14 flex items-center justify-center gap-4 bg-[#1877F2] text-white rounded-[24px] font-black transition-all active:scale-95 shadow-xl group relative overflow-hidden"
            >
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-orbitron font-black uppercase tracking-widest">Connect Facebook</span>
            </button>

            <div className="grid grid-cols-2 gap-4 mt-6">
               <button onClick={handleLoginAction} className="h-12 bg-white/5 border border-white/10 rounded-2xl text-[8px] font-black text-white/50 uppercase hover:bg-white/10 transition-all active:scale-95">Guest Entry</button>
               <button onClick={handleLoginAction} className="h-12 bg-white/5 border border-white/10 rounded-2xl text-[8px] font-black text-white/50 uppercase hover:bg-white/10 transition-all active:scale-95">Restore Data</button>
            </div>
          </div>
          
          <div className="mt-12 text-center relative z-10">
            <p className="text-[7px] font-bold text-white/10 uppercase tracking-[0.3em] leading-relaxed">
              OPERATING UNDER PROTOCOL RC-7.<br/>
              SECURE UPLINK ESTABLISHED.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan { 0% { transform: translateY(-110%); } 100% { transform: translateY(110%); } }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(8%, 12%) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
      `}</style>
    </div>
  );
};
