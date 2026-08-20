import React from 'react';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { state, switchScreen, setIsAddFoodOpen } = useApp();

  const getNavClass = (screenId) => {
    const isActive = state.currentScreen === screenId;
    return `nav-btn flex flex-col items-center p-2 ${isActive ? 'text-purple-main' : 'text-gray-muted hover:text-purple-main'} transition-colors`;
  };

  return (
    <nav id="bottom-nav" className="absolute bottom-3 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-3xl p-2 shadow-soft-card border border-white/80 flex justify-around items-center z-40">
      <button 
        onClick={() => switchScreen('screen-dashboard')} 
        className={getNavClass('screen-dashboard')}
      >
        <i data-lucide="layout-grid" className="w-5 h-5"></i>
        <span className="text-[9px] font-bold mt-1">Accueil</span>
      </button>

      <button 
        onClick={() => switchScreen('screen-tracker')} 
        className={getNavClass('screen-tracker')}
      >
        <i data-lucide="pie-chart" className="w-5 h-5"></i>
        <span className="text-[9px] font-bold mt-1">Calories</span>
      </button>

      <button 
        onClick={() => setIsAddFoodOpen(true)} 
        className="w-11 h-11 bg-gradient-primary text-white rounded-2xl shadow-purple-glow flex items-center justify-center -mt-5 active:scale-90 transition-transform"
      >
        <i data-lucide="plus" className="w-6 h-6"></i>
      </button>

      <button 
        onClick={() => switchScreen('screen-analytics')} 
        className={getNavClass('screen-analytics')}
      >
        <i data-lucide="line-chart" className="w-5 h-5"></i>
        <span className="text-[9px] font-bold mt-1">Analytics</span>
      </button>

      <button 
        onClick={() => switchScreen('screen-profile')} 
        className={getNavClass('screen-profile')}
      >
        <i data-lucide="user" className="w-5 h-5"></i>
        <span className="text-[9px] font-bold mt-1">Profil</span>
      </button>
    </nav>
  );
}
