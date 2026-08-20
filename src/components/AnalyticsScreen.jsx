import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function AnalyticsScreen() {
  const { 
    state, 
    switchScreen, 
    deleteWeight, 
    setWeightGraphRange, 
    setIsAddWeightOpen, 
    setBadgeModal 
  } = useApp();

  const weightCanvasRef = useRef(null);
  const calCanvasRef = useRef(null);

  // Render Weight Canvas Chart
  useEffect(() => {
    if (state.currentScreen !== 'screen-analytics') return;
    const canvas = weightCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const data = state.weightsHistory.map(h => h.weight);
    if (data.length === 0) return;

    const min = Math.min(...data) - 1;
    const max = Math.max(...data) + 1;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    data.forEach((val, idx) => {
      const x = (idx / (data.length - 1 || 1)) * (width - 20) + 10;
      const y = height - ((val - min) / (max - min)) * (height - 30) - 15;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, '#6C5CE7');
    grad.addColorStop(1, '#FD79A8');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [state.currentScreen, state.weightsHistory, state.weightGraphRange]);

  // Render Weekly Calorie Canvas Chart
  useEffect(() => {
    if (state.currentScreen !== 'screen-analytics') return;
    const canvas = calCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const cals = [2300, 2450, 2100, 2550, 2200, 2600, state.consumedCal];
    const maxCal = 3000;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = 18;
    const gap = (width - (days.length * barWidth)) / (days.length + 1);

    ctx.clearRect(0, 0, width, height);

    days.forEach((day, i) => {
      const x = gap + i * (barWidth + gap);
      const barHeight = (cals[i] / maxCal) * (height - 25);
      const y = height - barHeight - 15;

      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      if (i === 6) {
        gradient.addColorStop(0, '#FD79A8');
        gradient.addColorStop(1, '#FF7675');
      } else {
        gradient.addColorStop(0, '#6C5CE7');
        gradient.addColorStop(1, '#A29BFE');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, barWidth, barHeight, 8);
      else ctx.rect(x, y, barWidth, barHeight);
      ctx.fill();

      ctx.fillStyle = '#B2BEC3';
      ctx.font = 'bold 9px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(day, x + barWidth / 2, height - 3);
    });
  }, [state.currentScreen, state.consumedCal]);

  // Health Metrics
  const h = state.user.height / 100;
  const w = state.user.currentWeight;
  const bmi = (w / (h * h)).toFixed(1);
  let bmr = (10 * w) + (6.25 * state.user.height) - (5 * state.user.age);
  bmr = state.user.gender === 'male' ? bmr + 5 : bmr - 161;
  const tdee = Math.round(bmr * 1.45);

  return (
    <section id="screen-analytics" className={`screen-view ${state.currentScreen === 'screen-analytics' ? '' : 'screen-hidden'} p-5 space-y-5`}>
      
      <div className="flex items-center justify-between pt-1">
        <button onClick={() => switchScreen('screen-dashboard')} className="p-2.5 bg-white rounded-2xl shadow-soft-card text-gray-muted">
          <i data-lucide="arrow-left" className="w-5 h-5"></i>
        </button>
        <h2 className="text-base font-bold text-slate-dark">Progression & Analytics</h2>
        <button onClick={() => setIsAddWeightOpen(true)} className="p-2.5 bg-gradient-primary text-white rounded-2xl shadow-purple-glow">
          <i data-lucide="plus" className="w-5 h-5"></i>
        </button>
      </div>

      {/* Weight Graph Card */}
      <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-xs font-bold text-gray-muted block">Évolution du Poids</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-slate-dark">{state.user.currentWeight} kg</span>
              <span className="text-xs font-bold text-emerald-500">-2.1 kg</span>
            </div>
          </div>
          
          <div className="flex bg-[#F5F7FB] p-1 rounded-xl text-[10px] font-bold">
            {['7d', '30d', '90d'].map(r => (
              <button 
                key={r}
                onClick={() => setWeightGraphRange(r)} 
                className={`px-2.5 py-1 rounded-lg transition-all ${state.weightGraphRange === r ? 'bg-white text-purple-main shadow-sm' : 'text-gray-muted'}`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full h-40 mt-2">
          <canvas ref={weightCanvasRef} className="w-full h-full"></canvas>
        </div>
      </div>

      {/* Weekly Calories Chart Card */}
      <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-dark uppercase tracking-wider">Calories Consommées vs Cible</h3>
            <span className="text-[10px] text-gray-muted">Moyenne cette semaine : 2 240 kcal</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold text-[10px] rounded-lg">92% Réussite</span>
        </div>

        <div className="relative w-full h-36 mt-3">
          <canvas ref={calCanvasRef} className="w-full h-full"></canvas>
        </div>
      </div>

      {/* Weight Relevé History */}
      <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-dark uppercase tracking-wider">Historique des pesées</h3>
          <button onClick={() => setIsAddWeightOpen(true)} className="text-xs font-bold text-purple-main">+ Nouvelle pesée</button>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
          {[...state.weightsHistory].reverse().map((item, index) => {
            const realIdx = state.weightsHistory.length - 1 - index;
            return (
              <div key={index} className="flex justify-between items-center p-2.5 bg-[#F5F7FB] rounded-xl text-xs">
                <span className="font-semibold text-slate-dark">{item.date}</span>
                <div className="flex items-center space-x-3">
                  <span className="font-extrabold text-purple-main">{item.weight} kg</span>
                  <button onClick={() => deleteWeight(realIdx)} className="text-gray-300 hover:text-red-500">
                    <i data-lucide="x" className="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trophies & Badges */}
      <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white">
        <h3 className="text-xs font-bold text-slate-dark mb-3 uppercase tracking-wider">Récompenses & Discipline</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => setBadgeModal({ open: true, type: 'streak' })} 
            className="p-3 bg-[#F5F7FB] rounded-2xl flex items-center space-x-3 cursor-pointer hover:bg-purple-50 transition-colors"
          >
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <i data-lucide="award" className="w-5 h-5"></i>
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-dark block">14 Jours</span>
              <span className="text-[10px] text-gray-muted">Série de Log</span>
            </div>
          </div>

          <div 
            onClick={() => setBadgeModal({ open: true, type: 'loss' })} 
            className="p-3 bg-[#F5F7FB] rounded-2xl flex items-center space-x-3 cursor-pointer hover:bg-pink-50 transition-colors"
          >
            <div className="p-2.5 bg-pink-100 text-pink-main rounded-xl">
              <i data-lucide="zap" className="w-5 h-5"></i>
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-dark block">-2.1 kg</span>
              <span className="text-[10px] text-gray-muted">Perte Totale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Physiological Indicators */}
      <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white space-y-2.5">
        <h3 className="text-xs font-bold text-slate-dark uppercase tracking-wider">Indicateurs Physiologiques</h3>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-50 text-xs">
          <span className="text-gray-muted font-medium">Métabolisme de Base (MB)</span>
          <span className="font-bold text-slate-dark">{Math.round(bmr)} kcal/j</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-50 text-xs">
          <span className="text-gray-muted font-medium">Dépense Totale (TDEE)</span>
          <span className="font-bold text-purple-main">{tdee} kcal/j</span>
        </div>

        <div className="flex justify-between items-center py-2 text-xs">
          <span className="text-gray-muted font-medium">Indice de Masse Corporelle (IMC)</span>
          <span className="font-bold text-emerald-500">{bmi} ({bmi < 25 ? 'Normal' : 'Surpoids'})</span>
        </div>
      </div>

    </section>
  );
}
