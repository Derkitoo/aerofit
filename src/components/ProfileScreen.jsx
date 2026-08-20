import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function ProfileScreen() {
  const { state, switchScreen, changeTheme, updateUserProfile, resetDayData, showToast } = useApp();

  const [name, setName] = useState(state.user.name);
  const [height, setHeight] = useState(state.user.height);
  const [age, setAge] = useState(state.user.age);
  const [gender, setGender] = useState(state.user.gender);
  const [currentWeight, setCurrentWeight] = useState(state.user.currentWeight);
  const [targetWeight, setTargetWeight] = useState(state.user.targetWeight);

  useEffect(() => {
    setName(state.user.name);
    setHeight(state.user.height);
    setAge(state.user.age);
    setGender(state.user.gender);
    setCurrentWeight(state.user.currentWeight);
    setTargetWeight(state.user.targetWeight);
  }, [state.user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({
      name,
      height: parseInt(height) || 180,
      age: parseInt(age) || 26,
      gender,
      currentWeight: parseFloat(currentWeight) || 76.4,
      targetWeight: parseFloat(targetWeight) || 73.0,
    });
  };

  return (
    <section id="screen-profile" className={`screen-view ${state.currentScreen === 'screen-profile' ? '' : 'screen-hidden'} p-5 space-y-5`}>
      
      <div className="flex items-center justify-between pt-1">
        <button onClick={() => switchScreen('screen-dashboard')} className="p-2.5 bg-white rounded-2xl shadow-soft-card text-gray-muted">
          <i data-lucide="arrow-left" className="w-5 h-5"></i>
        </button>
        <h2 className="text-base font-bold text-slate-dark">Mon Profil</h2>
        <button onClick={handleSubmit} className="p-2.5 bg-gradient-primary text-white rounded-2xl shadow-purple-glow">
          <i data-lucide="check" className="w-5 h-5"></i>
        </button>
      </div>

      {/* Profile Card Header */}
      <div className="bg-white rounded-[28px] p-6 shadow-soft-card border border-white text-center">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
            alt="Avatar" 
            className="w-full h-full rounded-3xl object-cover ring-4 ring-purple-main/20 shadow-md" 
          />
          <button onClick={() => showToast('Option photo active')} className="absolute -bottom-1 -right-1 p-1.5 bg-gradient-primary text-white rounded-xl shadow-md">
            <i data-lucide="camera" className="w-3.5 h-3.5"></i>
          </button>
        </div>
        <h3 className="text-lg font-extrabold text-slate-dark">{state.user.name}</h3>
        <p className="text-xs text-purple-main font-semibold">{state.user.email}</p>
      </div>

      {/* Theme Selector */}
      <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white space-y-3">
        <h3 className="text-xs font-bold text-slate-dark uppercase tracking-wider">Thème Visuel</h3>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => changeTheme('default')} 
            className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center ${state.theme === 'default' ? 'border-purple-main bg-purple-50' : 'border-transparent bg-gray-50'}`}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#FD79A8] mb-1"></div>
            <span className="text-[10px] font-bold text-slate-dark">Violet/Rose</span>
          </button>

          <button 
            onClick={() => changeTheme('emerald')} 
            className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center ${state.theme === 'emerald' ? 'border-emerald-500 bg-emerald-50' : 'border-transparent bg-gray-50'}`}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00B894] to-[#00CEC9] mb-1"></div>
            <span className="text-[10px] font-bold text-slate-dark">Émeraude</span>
          </button>

          <button 
            onClick={() => changeTheme('sunset')} 
            className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center ${state.theme === 'sunset' ? 'border-orange-500 bg-orange-50' : 'border-transparent bg-gray-50'}`}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FF7675] to-[#E17055] mb-1"></div>
            <span className="text-[10px] font-bold text-slate-dark">Sunset</span>
          </button>
        </div>
      </div>

      {/* Physiological Data Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white space-y-4">
        <h3 className="text-xs font-bold text-slate-dark uppercase tracking-wider">Données Physiologiques</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-gray-muted block mb-1">Prénom / Nom</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-muted block mb-1">Taille (cm)</label>
            <input 
              type="number" 
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-gray-muted block mb-1">Âge (ans)</label>
            <input 
              type="number" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-muted block mb-1">Genre</label>
            <select 
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none"
            >
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-gray-muted block mb-1">Poids Actuel (kg)</label>
            <input 
              type="number" 
              step="0.1" 
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-muted block mb-1">Objectif Poids (kg)</label>
            <input 
              type="number" 
              step="0.1" 
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-3 bg-gradient-primary text-white font-bold text-xs rounded-2xl shadow-purple-glow mt-2 active:scale-98 transition-transform"
        >
          Enregistrer les modifications
        </button>
      </form>

      <button 
        onClick={resetDayData} 
        className="w-full py-3 bg-gray-100 text-gray-600 font-bold text-xs rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
      >
        <i data-lucide="refresh-cw" className="w-4 h-4"></i>
        <span>Réinitialiser la journée</span>
      </button>

      <button 
        onClick={() => { switchScreen('screen-login'); showToast("Vous avez été déconnecté"); }} 
        className="w-full py-3 bg-red-50 text-red-500 font-bold text-xs rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
      >
        <i data-lucide="log-out" className="w-4 h-4"></i>
        <span>Déconnexion</span>
      </button>
    </section>
  );
}
