import React, { useState } from 'react';
import CosmosCanvas from './components/CosmosCanvas';
import ChatPanel from './components/ChatPanel';

function App() {
  const [proximityUser, setProximityUser] = useState(null);

  return (
    // Fixed screen container - No scrolling allowed
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden font-sans select-none">

      {/* 1. Background Layer (The PixiJS Game) */}
      <div className="absolute inset-0 z-0">
        <CosmosCanvas onProximityChange={setProximityUser} />
      </div>

      {/* 2. Top Navigation Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-30 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-2xl pointer-events-auto">
          <span className="text-white font-bold tracking-tight uppercase text-xs sm:text-sm">Virtual Cosmos</span>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Invite link copied! Share it to start chatting.");
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg text-sm font-semibold pointer-events-auto active:scale-95"
        >
          Invite Friend
        </button>
      </div>

      
      {/* Container wraps the chat to center it vertically */}
      {/* 3. Right Side Chat Panel Overlay */}
      <div className="absolute top-0 right-0 h-full w-full max-w-[380px] p-6 flex flex-col justify-center z-50 pointer-events-none">
        {proximityUser && (
          <div className="h-[75%] w-full pointer-events-auto bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <ChatPanel targetUser={proximityUser} />
          </div>
        )}
      </div>

      {/* 4. Instructions (Shows only when alone) */}
      {!proximityUser && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md text-white/90 px-8 py-3 rounded-full border border-white/10 shadow-2xl flex items-center gap-3 animate-bounce">
            <span className="text-[10px] uppercase tracking-widest opacity-60">Control:</span>
            <span className="text-indigo-400 font-black tracking-widest uppercase">WASD / Arrows</span>
          </div>
        </div>
      )}
      
      {/* Optional: Simple Vignette effect for depth */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.5)] z-10" />
    </div>
  );
}

export default App;