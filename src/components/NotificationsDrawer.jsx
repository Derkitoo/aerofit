import React from 'react';
import { useApp } from '../context/AppContext';

export default function NotificationsDrawer() {
  const { isNotificationsOpen, setIsNotificationsOpen } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 flex flex-col justify-start">
      <div className="bg-white rounded-b-[28px] p-5 shadow-2xl space-y-4 animate-in slide-in-from-top duration-300">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <i data-lucide="bell" className="w-5 h-5 text-purple-main"></i>
            <h3 className="text-sm font-bold text-slate-dark">Notifications FitPulse</h3>
          </div>
          <button onClick={() => setIsNotificationsOpen(false)} className="p-1.5 text-gray-muted hover:text-slate-dark">
            <i data-lucide="x" className="w-5 h-5"></i>
          </button>
        </div>

        <div className="space-y-2.5 max-h-64 overflow-y-auto no-scrollbar">
          <div className="p-3 bg-purple-50/60 rounded-2xl flex items-start space-x-3">
            <div className="p-2 bg-purple-100 text-purple-main rounded-xl mt-0.5">
              <i data-lucide="trophy" className="w-4 h-4"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-dark">Nouveau Badge Débloqué !</h4>
              <p className="text-[11px] text-gray-600">Vous avez atteint 14 jours consécutifs de suivi nutritionnel.</p>
              <span className="text-[9px] text-gray-muted font-semibold mt-1 block">Il y a 2 heures</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-2xl flex items-start space-x-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl mt-0.5">
              <i data-lucide="droplet" className="w-4 h-4"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-dark">Rappel Hydratation</h4>
              <p className="text-[11px] text-gray-600">Pensez à boire 250ml d'eau pour atteindre vos 2.5L aujourd'hui.</p>
              <span className="text-[9px] text-gray-muted font-semibold mt-1 block">Il y a 4 heures</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsNotificationsOpen(false)} 
          className="w-full py-2.5 bg-gray-100 text-slate-dark font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
