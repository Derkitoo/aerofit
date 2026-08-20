import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AddWorkoutModal() {
  const { isAddWorkoutOpen, setIsAddWorkoutOpen, addWorkout } = useApp();

  const [workoutType, setWorkoutType] = useState('Musculation Pectoraux & Triceps');
  const [duration, setDuration] = useState('45');
  const [calories, setCalories] = useState('420');

  if (!isAddWorkoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addWorkout({
      name: workoutType,
      duration: parseInt(duration) || 45,
      calBurned: parseInt(calories) || 400
    });
    setIsAddWorkoutOpen(false);
  };

  return (
    <div className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-white w-full rounded-t-[32px] p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-dark">Enregistrer un Entraînement</h3>
          <button onClick={() => setIsAddWorkoutOpen(false)} className="p-1.5 text-gray-muted hover:text-slate-dark">
            <i data-lucide="x" className="w-5 h-5"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-gray-muted block mb-1">Type d'activité</label>
            <select 
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-semibold text-slate-dark focus:outline-none"
            >
              <option value="Musculation Pectoraux & Triceps">Musculation (Pecs/Triceps)</option>
              <option value="Musculation Dos & Biceps">Musculation (Dos/Biceps)</option>
              <option value="Séance Jambes & Abdos">Musculation (Legday)</option>
              <option value="Course à pied (5km)">Course à pied</option>
              <option value="Session HIIT Cardio">Session HIIT</option>
              <option value="Natation 45min">Natation</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-muted block mb-1">Durée (minutes)</label>
              <input 
                type="number" 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required 
                placeholder="45" 
                className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-muted block mb-1">Calories brûlées (kcal)</label>
              <input 
                type="number" 
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required 
                placeholder="420" 
                className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-gradient-primary text-white font-bold text-sm rounded-2xl shadow-purple-glow mt-2 active:scale-98 transition-transform"
          >
            Valider la Séance
          </button>
        </form>
      </div>
    </div>
  );
}
