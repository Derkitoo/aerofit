import React from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { state, switchScreen, setIsFitCoachOpen, setIsNotificationsOpen } = useApp();

  return (
    <div className="flex items-center justify-between pt-1">
      <div 
        className="flex items-center space-x-3 cursor-pointer" 
        onClick={() => switchScreen('screen-profile')}
      >
        <div className="relative">
          <img 
            id="header-avatar" 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
            alt="Avatar" 
            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-pink-main/30 shadow-sm" 
          />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <span className="text-[11px] font-medium text-gray-muted block">Ravi de vous voir,</span>
          <h2 className="text-base font-bold text-slate-dark leading-none">{state.user.name}</h2>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setIsFitCoachOpen(true)} 
          className="p-2.5 bg-gradient-primary text-white rounded-2xl shadow-purple-glow hover:opacity-95 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <i data-lucide="sparkles" className="w-4 h-4"></i>
          <span className="text-xs font-bold">FitCoach</span>
        </button>

        <button 
          onClick={() => setIsNotificationsOpen(true)} 
          className="relative p-2.5 bg-white rounded-2xl shadow-soft-card text-gray-muted hover:text-slate-dark transition-colors active:scale-95"
        >
          <i data-lucide="bell" className="w-5 h-5 text-purple-main"></i>
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-main rounded-full"></span>
        </button>
      </div>
    </div>
  );
}
