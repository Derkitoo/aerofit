import React from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { state, switchScreen, setIsFitCoachOpen, setIsNotificationsOpen } = useApp();

  return (
    <div className="flex items-center justify-between pb-1 pt-0.5">
      <div 
        className="flex items-center space-x-2.5 cursor-pointer group" 
        onClick={() => switchScreen('screen-profile')}
      >
        <div className="relative">
          <img 
            id="header-avatar" 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
            alt="Avatar" 
            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-main/30 shadow-sm group-hover:scale-105 transition-transform" 
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <span className="text-[10px] font-semibold text-gray-muted block leading-tight">Ravi de vous voir,</span>
          <h2 className="text-sm font-extrabold text-slate-dark leading-tight tracking-tight">{state.user.name}</h2>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        <button 
          onClick={() => setIsFitCoachOpen(true)} 
          className="px-3 py-2 bg-gradient-primary text-white rounded-xl shadow-purple-glow hover:opacity-95 transition-all flex items-center gap-1.5 active:scale-95 text-xs font-bold"
        >
          <i data-lucide="sparkles" className="w-3.5 h-3.5"></i>
          <span>FitCoach</span>
        </button>

        <button 
          onClick={() => setIsNotificationsOpen(true)} 
          className="relative p-2 bg-white rounded-xl shadow-soft-card text-gray-muted hover:text-slate-dark transition-colors active:scale-95 border border-gray-100"
        >
          <i data-lucide="bell" className="w-4 h-4 text-purple-main"></i>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-main rounded-full"></span>
        </button>
      </div>
    </div>
  );
}
