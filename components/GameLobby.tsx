
import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { GameWorld3D } from './GameWorld3D';

type LobbyMenu = 'MAIN' | 'STORE' | 'VAULT' | 'SOCIAL' | 'SETTINGS' | 'PROFILE' | 'CHARACTER' | 'PET' | 'LUCK_ROYALE' | 'ELITE_PASS';

interface PlayerStats {
  kills: number;
  wins: number;
  mvps: number;
  kd: number;
  matches: number;
  winRate: number;
}

interface Item {
  id: string;
  name: string;
  price: number;
  icon: string;
  rarity: 'LEGENDARY' | 'EPIC' | 'RARE';
  type: 'BUNDLE' | 'WEAPON' | 'HAT' | 'BACKPACK' | 'CLOTHES' | 'ARMOR' | 'SHOES' | 'BOX' | 'CURRENCY';
}

interface PassTier {
  level: number;
  freeReward: Item;
  premiumReward: Item;
}

interface Friend {
  id: string;
  name: string;
  level: number;
  status: 'Online' | 'In Game' | 'Offline';
  rank: string;
  stats: PlayerStats;
  signature?: string;
}

interface FriendRequest {
  id: string;
  name: string;
  level: number;
  time: string;
}

const STORE_ITEMS: Item[] = [
  { id: 's1', name: 'SAKURA BUNDLE', price: 2500, icon: 'https://cdn-icons-png.flaticon.com/512/3222/3222781.png', rarity: 'LEGENDARY', type: 'BUNDLE' },
  { id: 's2', name: 'NEON M4A1', price: 1200, icon: 'https://cdn-icons-png.flaticon.com/512/10043/10043206.png', rarity: 'EPIC', type: 'WEAPON' },
  { id: 's3', name: 'COBRA HEADSET', price: 500, icon: 'https://cdn-icons-png.flaticon.com/512/659/659021.png', rarity: 'RARE', type: 'HAT' },
  { id: 's4', name: 'CYBER WINGS', price: 1800, icon: 'https://cdn-icons-png.flaticon.com/512/3554/3554605.png', rarity: 'LEGENDARY', type: 'BACKPACK' },
  { id: 's5', name: 'GOLDEN KATANA', price: 5000, icon: 'https://cdn-icons-png.flaticon.com/512/2855/2855171.png', rarity: 'LEGENDARY', type: 'WEAPON' },
];

export const GameLobby: React.FC<{ server: string; onStartGame: () => void }> = ({ server, onStartGame }) => {
  const [activeMenu, setActiveMenu] = useState<LobbyMenu>('MAIN');
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [viewingPlayer, setViewingPlayer] = useState<Friend | null>(null);
  const [spinActive, setSpinActive] = useState(false);
  
  const [user, setUser] = useState({
    name: 'RAYELITY_PRO_EN',
    id: '7789021',
    level: 72,
    rank: 'GRANDMASTER',
    gems: 15000,
    gold: 850000,
    inventory: [] as string[],
    selectedCharacter: 'c1',
    selectedPet: 'p1',
    stats: { kills: 12450, wins: 840, mvps: 215, kd: 4.8, matches: 2100, winRate: 40 },
    signature: 'THE CITY IS MINE. 🏙️',
    elitePass: {
      isPremium: false,
      xp: 250,
      claimed: [] as string[]
    },
    settings: {
      music: true,
      sfx: true,
      highFps: true,
      graphics: 'ULTRA'
    }
  });

  const [friends, setFriends] = useState<Friend[]>([
    { 
      id: 'f1', name: 'ALEX_KING', level: 65, status: 'Online', rank: 'HEROIC',
      stats: { kills: 8500, wins: 520, mvps: 110, kd: 3.2, matches: 1500, winRate: 34 },
      signature: 'Stay hungry, stay foolish.'
    },
    { 
      id: 'f2', name: 'SHADOW_NINJA', level: 88, status: 'In Game', rank: 'GRANDMASTER',
      stats: { kills: 22000, wins: 1400, mvps: 450, kd: 6.5, matches: 3500, winRate: 48 },
      signature: 'Unseen is deadly.'
    }
  ]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    let timer: any;
    if (isMatchmaking) {
      timer = setInterval(() => {
        setMatchCount(c => {
          if (c >= 50) {
            clearInterval(timer);
            setTimeout(onStartGame, 800);
            return 50;
          }
          return c + Math.floor(Math.random() * 5) + 1;
        });
      }, 500);
    } else {
      setMatchCount(0);
    }
    return () => clearInterval(timer);
  }, [isMatchmaking, onStartGame]);

  const showNotify = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
  };

  const handleBuyItem = (item: Item) => {
    if (user.inventory.includes(item.id)) {
      showNotify("Item already owned!", "error");
      return;
    }
    if (user.gems >= item.price) {
      setUser(prev => ({
        ...prev,
        gems: prev.gems - item.price,
        inventory: [...prev.inventory, item.id]
      }));
      showNotify(`${item.name} purchased successfully!`);
    } else {
      showNotify("Insufficient Gems!", "error");
    }
  };

  const getRarityUI = (rarity: Item['rarity']) => {
    switch(rarity) {
      case 'LEGENDARY': return { border: 'border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.5)]', text: 'text-amber-500', bg: 'bg-amber-500/10', iconBorder: 'border-amber-500' };
      case 'EPIC': return { border: 'border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.5)]', text: 'text-purple-500', bg: 'bg-purple-500/10', iconBorder: 'border-purple-500' };
      case 'RARE': return { border: 'border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.5)]', text: 'text-blue-500', bg: 'bg-blue-500/10', iconBorder: 'border-blue-500' };
      default: return { border: 'border-white/10', text: 'text-white/40', bg: 'bg-white/5', iconBorder: 'border-white/20' };
    }
  };

  const isLobby = activeMenu === 'MAIN';

  return (
    <div className="absolute inset-0 z-50 flex flex-col font-rajdhani overflow-hidden bg-black text-white" dir="ltr">
      <GameWorld3D isMatchmaking={isMatchmaking} isMenuOpen={!isLobby} />

      {notification && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[10000] px-10 py-4 rounded-2xl border-2 backdrop-blur-3xl animate__animated animate__bounceInDown flex items-center gap-4 ${notification.type === 'success' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}>
           <span className="text-2xl">{notification.type === 'success' ? '✅' : '❌'}</span>
           <span className="font-black italic uppercase tracking-widest">{notification.msg}</span>
        </div>
      )}

      {/* TOP HUD */}
      <div className={`relative z-[300] flex justify-between items-start px-8 py-6 transition-all duration-700 ${!isLobby || isMatchmaking ? 'opacity-0 -translate-y-20 pointer-events-none' : 'opacity-100'}`}>
        <div onClick={() => setActiveMenu('PROFILE')} className="relative flex items-center group cursor-pointer">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-xl skew-x-[12deg] border-l-4 border-yellow-500 shadow-2xl transition-all group-hover:bg-black/60" />
          <div className="relative flex items-center p-3 gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-900 rounded-lg p-0.5">
              <div className="w-full h-full bg-black rounded-[6px] overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black italic uppercase text-white drop-shadow-md">{user.name}</span>
              <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest">{user.rank} | Lv.{user.level}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <CurrencyItem icon="https://img.icons8.com/emoji/48/gold-coin-emoji.png" value={user.gold} />
          <CurrencyItem icon="https://img.icons8.com/emoji/48/diamond-emoji.png" value={user.gems} color="purple" />
          <button onClick={() => setActiveMenu('SETTINGS')} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all shadow-xl">⚙️</button>
        </div>
      </div>

      {/* SIDE BUTTONS */}
      <div className={`absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-[400] transition-all duration-700 ${!isLobby || isMatchmaking ? '-translate-x-32 opacity-0' : 'translate-x-0'}`}>
        <SideButton icon="🏬" label="STORE" onClick={() => setActiveMenu('STORE')} />
        <SideButton icon="💎" label="FIRE PASS" color="red" onClick={() => setActiveMenu('ELITE_PASS')} />
        <SideButton icon="🎰" label="LUCK ROYALE" color="yellow" onClick={() => setActiveMenu('LUCK_ROYALE')} />
      </div>

      <div className={`absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-[400] transition-all duration-700 ${!isLobby || isMatchmaking ? 'translate-x-32 opacity-0' : 'translate-x-0'}`}>
        <SideButton icon="🎒" label="VAULT" onClick={() => setActiveMenu('VAULT')} />
        <SideButton icon="👤" label="CHARACTER" onClick={() => setActiveMenu('CHARACTER')} />
        <SideButton icon="🐾" label="PETS" onClick={() => setActiveMenu('PET')} />
        <SideButton icon="👥" label="SOCIAL" onClick={() => setActiveMenu('SOCIAL')} />
      </div>

      {/* BOTTOM CLUSTER - THE HEART OF THE UI */}
      <div className={`mt-auto p-8 pb-12 flex items-end justify-between transition-all duration-700 ${!isLobby || isMatchmaking ? 'translate-y-40 opacity-0' : 'translate-y-0'}`}>
        <div className="flex gap-4">
           {[1, 2, 3].map(i => <div key={i} className="w-16 h-16 bg-black/40 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center text-white/20 text-3xl hover:border-yellow-500 hover:text-yellow-500 cursor-pointer transition-all shadow-2xl">+</div>)}
        </div>
        
        <div className="flex flex-col items-end gap-4">
           <div className="bg-black/60 backdrop-blur-xl p-3 px-8 rounded-2xl border border-yellow-500/30 flex items-center gap-6 cursor-pointer hover:bg-black/80 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-2xl shadow-lg">🏙️</div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">MAP SELECTION</span>
                <span className="text-xl font-black italic uppercase text-white drop-shadow-md">RAYELITY CITY</span>
              </div>
           </div>
           
           <button onClick={() => setIsMatchmaking(true)} className="relative h-24 w-72 active:scale-95 transition-all group">
              <div className="absolute inset-0 bg-yellow-500 skew-x-[-15deg] shadow-[0_15px_40px_rgba(234,179,8,0.4)] rounded-xl group-hover:bg-yellow-400 transition-colors" />
              <div className="relative h-full w-full flex items-center justify-center">
                <span className="text-5xl font-black text-black italic uppercase tracking-tighter drop-shadow-md animate-pulse">START</span>
              </div>
           </button>
        </div>
      </div>

      {/* MATCHMAKING OVERLAY */}
      {isMatchmaking && (
        <div className="absolute inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center animate__animated animate__fadeIn">
           <div className="mb-10 flex flex-col items-center">
              <span className="text-yellow-500 font-black tracking-[1em] uppercase text-xl animate-pulse">OPTIMIZING LINK</span>
              <div className="mt-8 flex items-baseline gap-4">
                <span className="text-[15rem] font-black italic text-white leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">{matchCount}</span>
                <span className="text-6xl font-black opacity-20 italic">/50</span>
              </div>
           </div>
           <button onClick={() => setIsMatchmaking(false)} className="px-16 py-4 bg-red-600 text-white font-black rounded-xl uppercase hover:bg-red-700 transition-all shadow-2xl active:scale-95">ABORT MISSION</button>
        </div>
      )}

      {/* MODAL MENUS */}
      {!isLobby && (
        <div className="absolute inset-0 z-[2000] bg-black/95 backdrop-blur-3xl animate__animated animate__fadeIn flex flex-col p-10 overflow-hidden">
           <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
              <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white drop-shadow-md">{activeMenu.replace('_', ' ')}</h2>
              <button onClick={() => setActiveMenu('MAIN')} className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl hover:bg-red-600 transition-all border border-white/10">✕</button>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
              {activeMenu === 'STORE' && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
                   {STORE_ITEMS.map(item => {
                     const ui = getRarityUI(item.rarity);
                     const isOwned = user.inventory.includes(item.id);
                     return (
                       <div key={item.id} className={`bg-white/5 p-8 rounded-[40px] border-2 flex flex-col items-center gap-6 group relative overflow-hidden transition-all hover:-translate-y-2 ${ui.border} ${ui.bg}`}>
                          <div className={`absolute top-0 right-0 px-4 py-1.5 ${ui.bg} ${ui.text} text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-3xl border-l border-b border-white/10 z-10`}>
                            {item.rarity}
                          </div>
                          
                          <div className={`w-full aspect-square bg-black/40 rounded-[35px] flex items-center justify-center p-8 border-4 ${ui.iconBorder} transition-all duration-500 group-hover:scale-105 shadow-2xl relative overflow-hidden`}>
                             <div className={`absolute inset-0 opacity-10 ${ui.bg}`} />
                             <img src={item.icon} className="w-full h-full object-contain group-hover:scale-125 transition-all duration-700 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] relative z-10" />
                          </div>

                          <div className="text-center w-full z-10">
                             <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${ui.text} block mb-1`}>{item.rarity}</span>
                             <h3 className={`text-xl font-black italic uppercase leading-none h-12 flex items-center justify-center text-white drop-shadow-sm`}>{item.name}</h3>
                             <button 
                               onClick={() => handleBuyItem(item)}
                               className={`mt-4 w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${isOwned ? 'bg-white/10 text-white/20 cursor-default' : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-xl active:scale-95'}`}
                             >
                                {isOwned ? 'OWNED' : <><img src="https://img.icons8.com/emoji/48/diamond-emoji.png" className="w-6 h-6" /> {item.price}</>}
                             </button>
                          </div>
                          <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-20 pointer-events-none transition-all group-hover:scale-150 ${ui.bg.replace('/20', '')}`} />
                       </div>
                     );
                   })}
                </div>
              )}
              {/* Other menus would go here... (Character, Pet, etc.) */}
              {activeMenu !== 'STORE' && (
                <div className="flex flex-col items-center justify-center h-full opacity-30 italic">
                  <div className="text-9xl mb-8">🚧</div>
                  <h3 className="text-4xl font-black uppercase">Feature Under Calibration</h3>
                </div>
              )}
           </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

const CurrencyItem: React.FC<{ icon: string; value: number; color?: string }> = ({ icon, value, color = "yellow" }) => (
  <div className="bg-black/40 backdrop-blur-3xl px-6 py-3 rounded-[24px] flex items-center gap-4 border border-white/5 shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer">
    <img src={icon} className="w-6 h-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
    <span className="text-2xl font-black tabular-nums tracking-tighter text-white">{value.toLocaleString()}</span>
    <button className={`${color === 'yellow' ? 'bg-yellow-500 text-black' : 'bg-purple-500 text-white'} rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black shadow-lg`}>+</button>
  </div>
);

const SideButton: React.FC<{ icon: string; label: string; color?: string; onClick?: () => void }> = ({ icon, label, color = "white", onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-3 group transition-all active:scale-90">
    <div className={`w-16 h-16 bg-black/40 backdrop-blur-3xl border-2 border-white/10 rounded-3xl flex items-center justify-center text-4xl group-hover:border-${color === 'white' ? 'yellow' : color}-500 transition-all duration-300 shadow-2xl group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] group-hover:scale-110`}>{icon}</div>
    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors drop-shadow-md">{label}</span>
  </button>
);
