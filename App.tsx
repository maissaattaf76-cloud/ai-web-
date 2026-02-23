
import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { LoginScreen } from './components/LoginScreen';
import { GameLobby } from './components/GameLobby';
import { ServerSelection } from './components/ServerSelection';
import { Gameplay } from './components/Gameplay';
import { MatchLoadingScreen } from './components/MatchLoadingScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'DISCLAIMER' | 'LOADING' | 'LOGIN' | 'SERVER_SELECTION' | 'LOBBY' | 'PRE_GAME_LOADING' | 'GAMEPLAY'>('DISCLAIMER');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  useEffect(() => {
    if (gameState === 'DISCLAIMER') {
      const timer = setTimeout(() => setGameState('LOADING'), 3500);
      return () => clearTimeout(timer);
    }

    if (gameState === 'LOADING') {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setGameState('LOGIN'), 800);
            return 100;
          }
          const jump = prev > 80 ? Math.random() * 2 : Math.random() * 12;
          return prev + jump;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const handleLogin = () => {
    setGameState('SERVER_SELECTION');
  };

  const handleServerSelect = (serverName: string) => {
    setSelectedServer(serverName);
    setGameState('LOBBY');
  };

  const handleGameStart = () => {
    setGameState('PRE_GAME_LOADING');
  };

  const handleFinalLoadComplete = () => {
    setGameState('GAMEPLAY');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-purple-500 selection:text-white">
      <div className="scanline opacity-10" />

      {gameState === 'DISCLAIMER' && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6 text-center animate__animated animate__fadeIn">
          <div className="max-w-2xl space-y-8">
            <div className="flex justify-center gap-12 opacity-80 mb-12">
               <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center font-black text-2xl border border-white/20">R*</div>
               <div className="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center font-black text-2xl border border-purple-500/30">RC</div>
            </div>
            <p className="text-xs md:text-sm font-medium tracking-[0.2em] text-slate-400 leading-loose animate__animated animate__fadeIn animate__delay-1s">
              © 2025 RAYELITY CITY STUDIOS IN PARTNERSHIP WITH GLOBAL INTERACTIVE.<br/>
              ALL TRADEMARKS ARE THE PROPERTY OF THEIR RESPECTIVE OWNERS.<br/>
              THE CONTENT OF THIS GAME IS PURELY FICTIONAL.
            </p>
            <div className="pt-8 flex justify-center animate__animated animate__fadeIn animate__delay-2s">
              <div className="w-8 h-8 border-2 border-white/10 border-t-purple-500 rounded-full animate-spin" />
            </div>
          </div>
        </div>
      )}

      {gameState === 'LOADING' && <LoadingScreen progress={loadingProgress} />}

      {gameState === 'LOGIN' && (
        <LoginScreen onLogin={handleLogin} />
      )}

      {gameState === 'SERVER_SELECTION' && (
        <ServerSelection onSelect={handleServerSelect} />
      )}

      {gameState === 'LOBBY' && (
        <GameLobby server={selectedServer || 'AUTO'} onStartGame={handleGameStart} />
      )}

      {gameState === 'PRE_GAME_LOADING' && (
        <MatchLoadingScreen onComplete={handleFinalLoadComplete} />
      )}

      {gameState === 'GAMEPLAY' && (
        <Gameplay onExit={() => setGameState('LOBBY')} />
      )}
    </div>
  );
};

export default App;
