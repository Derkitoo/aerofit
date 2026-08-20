import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Header from './Header';

export default function DashboardScreen() {
  const { 
    state, 
    switchScreen, 
    showToast, 
    setActiveRoutine, 
    addWater, 
    updateWater, 
    toggleFastingTimer, 
    deleteMeal,
    setFilterMeal,
    setIsAddFoodOpen,
    setIsAddWorkoutOpen
  } = useApp();

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  const remWeight = (state.user.currentWeight - state.user.targetWeight).toFixed(1);
  const leftCal = Math.max(0, state.targetCal - state.consumedCal);

  const filteredMeals = state.activeFilterMeal === 'all'
    ? state.meals
    : state.meals.filter(m => m.category === state.activeFilterMeal);

  const getRoutineClass = (type) => {
    const isActive = state.activeRoutine === type;
    return `routine-btn flex-shrink-0 px-3.5 py-2.5 rounded-2xl ${isActive ? 'bg-gradient-primary text-white shadow-pill-active' : 'bg-white text-slate-dark shadow-soft-card border border-gray-100'} flex items-center space-x-2 transition-all active:scale-95`;
  };

  const getMealFilterClass = (category) => {
    const isActive = state.activeFilterMeal === category;
    return `px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${isActive ? 'bg-purple-main text-white' : 'bg-white text-gray-muted shadow-sm border border-gray-100'}`;
  };

  return (
    <section id="screen-dashboard" className={`screen-view ${state.currentScreen === 'screen-dashboard' ? '' : 'screen-hidden'} p-4 space-y-3.5`}>
      
      {/* Header */}
      <Header />

      {/* Level / XP Gamification Banner */}
      <div className="bg-gradient-primary text-white p-3 rounded-2xl shadow-purple-glow flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-xs">
            Nv.4
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-white/80 tracking-wider">Rang Actuel</span>
            <h4 className="text-xs font-extrabold text-white">Athlète Bronze (850 / 1000 XP)</h4>
            <div className="w-32 h-1.5 bg-white/20 rounded-full mt-0.5 overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => showToast('Remplissez vos objectifs quotidiens pour passer Nv.5 !')} 
          className="text-[9px] font-bold bg-white/20 px-2 py-1 rounded-lg backdrop-blur-md hover:bg-white/30 transition-colors"
        >
          +150 XP
        </button>
      </div>

      {/* Weight Summary Card */}
      <div 
        onClick={() => switchScreen('screen-analytics')} 
        className="bg-white rounded-2xl p-3.5 shadow-soft-card border border-white/60 cursor-pointer hover:border-purple-main/20 transition-all"
      >
        <div className="grid grid-cols-2 gap-3 divide-x divide-gray-100">
          <div className="pr-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-muted block mb-0.5">Poids Actuel</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-extrabold text-slate-dark">{state.user.currentWeight.toFixed(1)}</span>
              <span className="text-[11px] font-bold text-gray-muted">kg</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-500 inline-flex items-center gap-0.5 mt-0.5">
              <i data-lucide="trending-down" className="w-3 h-3"></i> -0.8 kg cette semaine
            </span>
          </div>

          <div className="pl-3">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-muted block mb-0.5">Objectif Sèche</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-extrabold text-slate-dark">{state.user.targetWeight.toFixed(1)}</span>
              <span className="text-[11px] font-bold text-gray-muted">kg</span>
            </div>
            <span className="text-[9px] font-bold text-purple-main inline-flex items-center gap-0.5 mt-0.5">
              <i data-lucide="target" className="w-3 h-3"></i> Reste {remWeight} kg
            </span>
          </div>
        </div>
      </div>

      {/* Metabolic Routines Selector */}
      <div>
        <div className="flex justify-between items-center mb-1.5 px-0.5">
          <h3 className="text-[10px] font-bold text-slate-dark uppercase tracking-wider">Routines Métaboliques</h3>
          <span className="text-[10px] text-purple-main font-bold">
            {state.activeRoutine === 'training' && 'Training Day'}
            {state.activeRoutine === 'rest' && 'Jour Repos'}
            {state.activeRoutine === 'cut' && 'Sèche Express'}
            {state.activeRoutine === 'cheat' && 'Cheat Day'}
          </span>
        </div>
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-0.5">
          <button onClick={() => setActiveRoutine('training')} className={getRoutineClass('training')}>
            <div className="p-1 bg-white/20 rounded-lg">
              <i data-lucide="dumbbell" className="w-3.5 h-3.5 text-white"></i>
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold block leading-tight">Training Day</span>
              <span className="text-[9px] opacity-90 block">2 500 kcal</span>
            </div>
          </button>

          <button onClick={() => setActiveRoutine('rest')} className={getRoutineClass('rest')}>
            <div className="p-1 bg-purple-100 rounded-lg">
              <i data-lucide="coffee" className="w-3.5 h-3.5 text-purple-main"></i>
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold block leading-tight">Jour Repos</span>
              <span className="text-[9px] text-gray-muted block">2 000 kcal</span>
            </div>
          </button>

          <button onClick={() => setActiveRoutine('cut')} className={getRoutineClass('cut')}>
            <div className="p-1 bg-pink-100 rounded-lg">
              <i data-lucide="flame" className="w-3.5 h-3.5 text-pink-main"></i>
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold block leading-tight">Sèche Express</span>
              <span className="text-[9px] text-gray-muted block">1 800 kcal</span>
            </div>
          </button>

          <button onClick={() => setActiveRoutine('cheat')} className={getRoutineClass('cheat')}>
            <div className="p-1 bg-amber-100 rounded-lg">
              <i data-lucide="utensils" className="w-3.5 h-3.5 text-amber-600"></i>
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold block leading-tight">Cheat Day</span>
              <span className="text-[9px] text-gray-muted block">2 900 kcal</span>
            </div>
          </button>
        </div>
      </div>

      {/* Circular SVG Calorie & Macro Gauge */}
      <div className="bg-white rounded-2xl p-4 shadow-soft-card border border-white/60">
        <div className="flex justify-between items-center mb-2.5">
          <div>
            <h3 className="text-xs font-bold text-slate-dark">Bilan Nutritionnel</h3>
            <p className="text-[9px] text-gray-muted">Aujourd'hui</p>
          </div>
          <button 
            onClick={() => switchScreen('screen-tracker')} 
            className="text-[11px] font-bold text-purple-main hover:text-pink-main transition-colors flex items-center gap-0.5"
          >
            <span>Ajuster</span>
            <i data-lucide="chevron-right" className="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#F0F2FA" strokeWidth="9" fill="transparent" />
              <circle 
                className="gauge-circle" 
                cx="50" cy="50" r="40" 
                stroke="url(#dashGradient)" strokeWidth="9" strokeLinecap="round" fill="transparent" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 * (1 - Math.min(1, state.consumedCal / state.targetCal))} 
              />
              <defs>
                <linearGradient id="dashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-secondary)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] text-gray-muted font-medium">Restant</span>
              <span className="text-base font-extrabold text-slate-dark leading-tight">{leftCal}</span>
              <span className="text-[8px] font-bold text-purple-main uppercase">kcal</span>
            </div>
          </div>

          <div className="flex-1 pl-4 space-y-2">
            <div>
              <div className="flex justify-between text-[10px] font-semibold mb-0.5">
                <span className="text-slate-dark">Protéines</span>
                <span className="text-purple-main font-bold">{state.protein} / {state.proteinTarget}g</span>
              </div>
              <div className="w-full h-1.5 bg-[#F0F2FA] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (state.protein / state.proteinTarget) * 100)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-semibold mb-0.5">
                <span className="text-slate-dark">Glucides</span>
                <span className="text-pink-main font-bold">{state.carbs} / {state.carbsTarget}g</span>
              </div>
              <div className="w-full h-1.5 bg-[#F0F2FA] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-pill rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (state.carbs / state.carbsTarget) * 100)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-semibold mb-0.5">
                <span className="text-slate-dark">Lipides</span>
                <span className="text-amber-500 font-bold">{state.fat} / {state.fatTarget}g</span>
              </div>
              <div className="w-full h-1.5 bg-[#F0F2FA] rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (state.fat / state.fatTarget) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intermittent Fasting Card */}
      <div className="bg-white rounded-2xl p-3.5 shadow-soft-card border border-white/60">
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-purple-50 text-purple-main rounded-xl">
              <i data-lucide="timer" className="w-4 h-4"></i>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-dark">Jeûne Intermittent 16:8</h3>
              <span className="text-[10px] text-gray-muted block leading-tight">{state.fastingActive ? "Période de Jeûne en cours" : "Jeûne en pause"}</span>
            </div>
          </div>
          <button 
            onClick={toggleFastingTimer} 
            className="px-2.5 py-1 bg-gradient-primary text-white font-bold text-[10px] rounded-lg shadow-purple-glow active:scale-95 transition-transform"
          >
            {state.fastingActive ? "Stopper" : "Démarrer"}
          </button>
        </div>

        <div className="flex items-center justify-between pt-1.5">
          <div className="flex-1 bg-[#F5F7FB] p-2 rounded-xl text-center mr-1.5">
            <span className="text-[8px] font-bold text-gray-muted block uppercase">Temps Écoulé</span>
            <span className="text-xs font-extrabold text-slate-dark">11h 24m</span>
          </div>
          <div className="flex-1 bg-purple-50 p-2 rounded-xl text-center ml-1.5">
            <span className="text-[8px] font-bold text-purple-main block uppercase">Restant (Cible 16h)</span>
            <span className="text-xs font-extrabold text-purple-main">04h 36m</span>
          </div>
        </div>
      </div>

      {/* Workouts List Card */}
      <div className="bg-white rounded-2xl p-3.5 shadow-soft-card border border-white/60">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-pink-50 text-pink-main rounded-xl">
              <i data-lucide="flame" className="w-4 h-4"></i>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-dark">Entraînements du jour</h3>
              <span className="text-[10px] text-gray-muted block leading-tight">
                {state.workouts.length} séance(s) • -{state.workouts.reduce((acc, w) => acc + w.calBurned, 0)} kcal
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsAddWorkoutOpen(true)} 
            className="px-2.5 py-1 bg-pink-50 text-pink-main font-bold text-[10px] rounded-lg hover:bg-pink-100 transition-colors flex items-center gap-0.5 active:scale-95"
          >
            <i data-lucide="plus" className="w-3 h-3"></i> Ajouter
          </button>
        </div>

        <div className="space-y-1.5">
          {state.workouts.map((w, idx) => (
            <div key={idx} className="p-2.5 bg-[#F5F7FB] rounded-xl flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-pink-100 text-pink-main rounded-lg">
                  <i data-lucide="dumbbell" className="w-3.5 h-3.5"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-dark leading-tight">{w.name}</h4>
                  <span className="text-[9px] text-gray-muted">{w.duration} min • {w.time || '10:00'}</span>
                </div>
              </div>
              <span className="font-extrabold text-pink-main">-{w.calBurned} kcal</span>
            </div>
          ))}
        </div>
      </div>

      {/* Water Intake Tracker */}
      <div className="bg-white rounded-2xl p-3.5 shadow-soft-card border border-white/60">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-50 text-blue-500 rounded-xl">
              <i data-lucide="droplet" className="w-4 h-4"></i>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-dark">Hydratation</h3>
              <span className="text-[10px] text-gray-muted block leading-tight">{state.water.toFixed(2)} L / {state.waterTarget.toFixed(2)} L</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => addWater(-0.25)} 
              className="px-2 py-1 bg-gray-100 text-slate-dark font-bold text-[10px] rounded-lg hover:bg-gray-200 transition-colors active:scale-95"
            >
              -250ml
            </button>
            <button 
              onClick={() => addWater(0.25)} 
              className="px-2.5 py-1 bg-blue-50 text-blue-600 font-bold text-[10px] rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-0.5 active:scale-95"
            >
              <i data-lucide="plus" className="w-3 h-3"></i> 250ml
            </button>
          </div>
        </div>

        <div className="mt-1">
          <input 
            type="range" 
            min="0" 
            max="4.0" 
            step="0.25" 
            value={state.water} 
            onChange={(e) => updateWater(e.target.value)} 
          />
          <div className="flex justify-between text-[9px] text-gray-muted font-bold mt-0.5">
            <span>0L</span>
            <span>1.5L</span>
            <span>2.5L (Objectif)</span>
            <span>4.0L</span>
          </div>
        </div>
      </div>

      {/* Logged Meals List */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-0.5">
          <h3 className="text-[10px] font-bold text-slate-dark uppercase tracking-wider">Repas enregistrés</h3>
          <button 
            onClick={() => setIsAddFoodOpen(true)} 
            className="text-[11px] font-bold text-purple-main flex items-center gap-0.5 hover:underline"
          >
            <i data-lucide="plus-circle" className="w-3.5 h-3.5"></i> Ajouter
          </button>
        </div>

        <div className="flex space-x-1 overflow-x-auto no-scrollbar text-[10px] font-bold">
          <button onClick={() => setFilterMeal('all')} className={getMealFilterClass('all')}>Tous</button>
          <button onClick={() => setFilterMeal('breakfast')} className={getMealFilterClass('breakfast')}>Petit-déj</button>
          <button onClick={() => setFilterMeal('lunch')} className={getMealFilterClass('lunch')}>Déjeuner</button>
          <button onClick={() => setFilterMeal('dinner')} className={getMealFilterClass('dinner')}>Dîner</button>
          <button onClick={() => setFilterMeal('snack')} className={getMealFilterClass('snack')}>Snacks</button>
        </div>

        <div className="space-y-1.5">
          {filteredMeals.map((meal) => (
            <div key={meal.id} className="bg-white p-3 rounded-2xl shadow-soft-card border border-white/60 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-main font-bold text-xs">
                  {meal.cal}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-dark leading-tight">{meal.name}</h4>
                  <span className="text-[9px] text-gray-muted">P:{meal.protein}g • G:{meal.carbs}g • L:{meal.fat}g • {meal.time || '12:00'}</span>
                </div>
              </div>
              <button 
                onClick={() => deleteMeal(meal.id)} 
                className="p-1 text-gray-300 hover:text-red-500 transition-colors"
              >
                <i data-lucide="trash-2" className="w-3.5 h-3.5"></i>
              </button>
            </div>
          ))}

          {filteredMeals.length === 0 && (
            <div className="text-center py-4 text-xs text-gray-muted">
              Aucun repas enregistré dans cette catégorie.
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
