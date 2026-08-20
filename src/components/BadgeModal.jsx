import React from 'react';
import { useApp } from '../context/AppContext';

export default function BadgeModal() {
  const { badgeModal, setBadgeModal } = useApp();

  if (!badgeModal.open) return null;

  const isStreak = badgeModal.type === 'streak';

  return (
    <div className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white w-full rounded-[32px] p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <i data-lucide="trophy" className="w-8 h-8"></i>
        </div>
        <h3 className="text-lg font-extrabold text-slate-dark">
          {isStreak ? 'Série de 14 Jours' : 'Cap des -2 kg Franchi'}
        </h3>
        <p className="text-xs text-gray-muted leading-relaxed">
          {isStreak 
            ? 'Vous avez suivi vos repas avec assiduité durant 14 jours consécutifs. Votre rigueur paie !'
            : 'Excellente progression ! Vous avez perdu 2.1 kg depuis votre première pesée.'
          }
        </p>
        <button 
          onClick={() => setBadgeModal({ open: false, type: 'streak' })} 
          className="w-full py-3 bg-gradient-primary text-white font-bold text-xs rounded-2xl shadow-purple-glow active:scale-95 transition-transform"
        >
          Génial !
        </button>
      </div>
    </div>
  );
}
