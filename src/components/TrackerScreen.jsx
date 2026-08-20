import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function TrackerScreen() {
  const { 
    state, 
    switchScreen, 
    adjustCalorieTarget, 
    quickAddCalories, 
    setMacroMode,
    setIsAddFoodOpen 
  } = useApp();

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  const pct = Math.round((state.consumedCal / state.targetCal) * 100);

  return (
    <section id="screen-tracker" className={`screen-view ${state.currentScreen === 'screen-tracker' ? '' : 'screen-hidden'} p-5 space-y-5`}>
      
      <div className="flex items-center justify-between pt-1">
        <button onClick={() => switchScreen('screen-dashboard')} className="p-2.5 bg-white rounded-2xl shadow-soft-card text-gray-muted hover:text-slate-dark">
          <i data-lucide="arrow-left" className="w-5 h-5"></i>
        </button>
        <h2 className="text-base font-bold text-slate-dark">Contrôle Nutritionnel</h2>
        <button onClick={() => setIsAddFoodOpen(true)} className="p-2.5 bg-white rounded-2xl shadow-soft-card text-purple-main">
          <i data-lucide="plus" className="w-5 h-5"></i>
        </button>
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-soft-card border border-white/80 text-center relative overflow-hidden">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-muted block mb-1">Cadran Énergétique</span>

        <div className="relative w-56 h-56 mx-auto my-2 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="78" stroke="#F5F7FB" strokeWidth="16" fill="none" strokeLinecap="round" />
            <circle 
              className="gauge-circle" 
              cx="100" cy="100" r="78" 
              stroke="url(#trackerGradient)" strokeWidth="16" fill="none" strokeLinecap="round"
              strokeDasharray="490" 
              strokeDashoffset={490 * (1 - Math.min(1, state.consumedCal / state.targetCal))} 
            />
            <defs>
              <linearGradient id="trackerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-secondary)" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-extrabold text-slate-dark tracking-tight">{state.consumedCal}</span>
            <span className="text-xs font-bold text-purple-main uppercase tracking-widest mt-0.5">/ {state.targetCal} kcal</span>
            
            <div className="mt-2 px-3 py-1 bg-pink-50 rounded-full flex items-center space-x-1">
              <i data-lucide="flame" className="w-3.5 h-3.5 text-pink-main"></i>
              <span className="text-[11px] font-bold text-pink-main">{pct}% atteint</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-6 mt-3">
          <button onClick={() => adjustCalorieTarget(-100)} className="w-11 h-11 rounded-2xl bg-[#F5F7FB] text-slate-dark font-extrabold text-xl flex items-center justify-center hover:bg-purple-100 transition-colors shadow-sm active:scale-95">
            -
          </button>
          <div className="text-center">
            <span className="text-[10px] text-gray-muted font-bold block uppercase">Cible Quotidienne</span>
            <span className="text-sm font-extrabold text-slate-dark">{state.targetCal} kcal</span>
          </div>
          <button onClick={() => adjustCalorieTarget(100)} className="w-11 h-11 rounded-2xl bg-[#F5F7FB] text-slate-dark font-extrabold text-xl flex items-center justify-center hover:bg-purple-100 transition-colors shadow-sm active:scale-95">
            +
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <button onClick={() => quickAddCalories(100)} className="px-3 py-1.5 bg-purple-50 text-purple-main font-bold text-xs rounded-xl hover:bg-purple-100 transition-colors active:scale-95">
            +100 kcal
          </button>
          <button onClick={() => quickAddCalories(250)} className="px-3 py-1.5 bg-purple-50 text-purple-main font-bold text-xs rounded-xl hover:bg-purple-100 transition-colors active:scale-95">
            +250 kcal
          </button>
          <button onClick={() => quickAddCalories(500)} className="px-3 py-1.5 bg-pink-50 text-pink-main font-bold text-xs rounded-xl hover:bg-pink-100 transition-colors active:scale-95">
            +500 kcal
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[28px] p-4 shadow-soft-card border border-white">
        <span className="text-xs font-bold text-slate-dark block mb-3 px-1">Répartition des Macronutriments</span>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => setMacroMode('high-protein')} className="p-3 rounded-2xl bg-gradient-primary text-white text-center shadow-pill-active transition-all active:scale-95">
            <i data-lucide="shield-check" className="w-5 h-5 mx-auto mb-1"></i>
            <span className="text-xs font-bold block">Protéiné</span>
            <span className="text-[9px] opacity-80">40P / 40G / 20L</span>
          </button>

          <button onClick={() => setMacroMode('balanced')} className="p-3 rounded-2xl bg-[#F5F7FB] text-slate-dark text-center transition-all hover:bg-gray-100 active:scale-95">
            <i data-lucide="scale" className="w-5 h-5 mx-auto mb-1 text-purple-main"></i>
            <span className="text-xs font-bold block">Équilibré</span>
            <span className="text-[9px] text-gray-muted">30P / 50G / 20L</span>
          </button>

          <button onClick={() => setMacroMode('keto')} className="p-3 rounded-2xl bg-[#F5F7FB] text-slate-dark text-center transition-all hover:bg-gray-100 active:scale-95">
            <i data-lucide="zap" className="w-5 h-5 mx-auto mb-1 text-pink-main"></i>
            <span className="text-xs font-bold block">Low Carb</span>
            <span className="text-[9px] text-gray-muted">35P / 15G / 50L</span>
          </button>
        </div>
      </div>

    </section>
  );
}
