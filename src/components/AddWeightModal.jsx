import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AddWeightModal() {
  const { isAddWeightOpen, setIsAddWeightOpen, addWeight } = useApp();

  const [weightVal, setWeightVal] = useState('76.0');
  const [weightDate, setWeightDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  if (!isAddWeightOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weightVal) return;
    addWeight(parseFloat(weightVal) || 76.0, weightDate);
    setIsAddWeightOpen(false);
  };

  return (
    <div className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-white w-full rounded-t-[32px] p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-dark">Enregistrer une Pesée</h3>
          <button onClick={() => setIsAddWeightOpen(false)} className="p-1.5 text-gray-muted hover:text-slate-dark">
            <i data-lucide="x" className="w-5 h-5"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-gray-muted block mb-1">Poids relevé (kg)</label>
            <input 
              type="number" 
              step="0.1" 
              value={weightVal}
              onChange={(e) => setWeightVal(e.target.value)}
              required 
              placeholder="76.0" 
              className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-sm font-bold text-slate-dark focus:outline-none focus:ring-2 focus:ring-purple-main/30" 
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-muted block mb-1">Date de la pesée</label>
            <input 
              type="date" 
              value={weightDate}
              onChange={(e) => setWeightDate(e.target.value)}
              required 
              className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold text-slate-dark focus:outline-none" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-gradient-primary text-white font-bold text-sm rounded-2xl shadow-purple-glow mt-2 active:scale-98 transition-transform"
          >
            Valider la Pesée
          </button>
        </form>
      </div>
    </div>
  );
}
