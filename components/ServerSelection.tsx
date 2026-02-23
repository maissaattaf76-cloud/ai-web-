
import React, { useState, useEffect } from 'react';

interface ServerSelectionProps {
  onSelect: (server: string) => void;
}

const SERVERS = [
  { id: 'me', name: 'MIDDLE EAST', region: 'Riyadh, KSA', basePing: 22 },
  { id: 'eu', name: 'EUROPE', region: 'Frankfurt, DE', basePing: 65 },
  { id: 'na', name: 'NORTH AMERICA', region: 'Virginia, US', basePing: 140 },
  { id: 'asia', name: 'ASIA PACIFIC', region: 'Singapore', basePing: 110 },
];

export const ServerSelection: React.FC<ServerSelectionProps> = ({ onSelect }) => {
  const [pings, setPings] = useState<Record<string, number>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPings: Record<string, number> = {};
      SERVERS.forEach(s => {
        newPings[s.id] = s.basePing + Math.floor(Math.random() * 8) - 4;
      });
      setPings(newPings);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-[60] bg-black flex flex-col items-center justify-center p-5 animate__animated animate__fadeIn">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black" />
      
      <div className="relative z-10 w-full max-w-xs">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-purple-600/10 border border-purple-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <img src="https://img.icons8.com/ios-filled/50/a855f7/globe.png" className="w-6 h-6 animate-pulse" />
           </div>
           <h2 className="font-orbitron text-xl font-black italic text-purple-400 tracking-tighter text-glow uppercase">Link Authority</h2>
           <p className="text-[8px] font-bold text-white/30 tracking-widest mt-1 uppercase">Select Global Access Point</p>
        </div>

        <div className="space-y-3">
          {SERVERS.map((server) => {
            const currentPing = pings[server.id] || server.basePing;
            const pingColor = currentPing < 50 ? 'text-green-500' : currentPing < 100 ? 'text-amber-500' : 'text-red-500';
            const bgColor = currentPing < 50 ? 'bg-green-500' : currentPing < 100 ? 'bg-amber-500' : 'bg-red-500';
            
            return (
              <button
                key={server.id}
                onClick={() => setSelectedId(server.id)}
                className={`w-full p-4 rounded-[22px] border transition-all flex items-center justify-between group active:scale-95 relative overflow-hidden
                  ${selectedId === server.id 
                    ? 'bg-purple-600 border-white shadow-[0_10px_20px_rgba(168,85,247,0.3)]' 
                    : 'bg-[#0a0a0a]/80 border-white/5 hover:border-purple-500/40'}`}
              >
                <div className="flex flex-col items-start relative z-10">
                  <span className={`text-[10px] font-black tracking-wider transition-colors ${selectedId === server.id ? 'text-white' : 'text-purple-400'}`}>
                    {server.name}
                  </span>
                  <span className="text-[6px] font-black uppercase text-white/30 tracking-[0.2em] mt-0.5">{server.region}</span>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="flex flex-col items-end">
                    <span className={`text-[9px] font-mono font-black ${selectedId === server.id ? 'text-white' : pingColor}`}>
                      {currentPing}ms
                    </span>
                    <div className="flex gap-0.5 mt-1 items-end h-2">
                      {[1, 2, 3, 4].map((bar) => {
                        const threshold = currentPing < 50 ? 0 : currentPing < 100 ? 1 : 3;
                        const isActive = bar <= (4 - threshold);
                        return (
                          <div 
                            key={bar} 
                            className={`w-0.5 rounded-full ${isActive ? (selectedId === server.id ? 'bg-white' : bgColor) : 'bg-white/5'}`} 
                            style={{ height: `${bar * 25}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button 
          disabled={!selectedId}
          onClick={() => selectedId && onSelect(SERVERS.find(s => s.id === selectedId)?.name || 'AUTO')}
          className={`w-full h-14 mt-10 rounded-[25px] font-black italic text-lg uppercase tracking-tighter transition-all
            ${selectedId 
              ? 'bg-white text-black active:scale-95 shadow-lg' 
              : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
        >
          Initialize Link
        </button>
      </div>
    </div>
  );
};
