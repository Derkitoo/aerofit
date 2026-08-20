import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function FitCoachDrawer() {
  const { isFitCoachOpen, setIsFitCoachOpen, state } = useApp();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: `👋 Bonjour ${state.user.name} ! Je suis votre coach personnel IA. Comment puis-je vous aider aujourd'hui ?` }
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isFitCoachOpen]);

  if (!isFitCoachOpen) return null;

  const handleSend = (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      let botReply = "";
      const lower = text.toLowerCase();
      const calLeft = Math.max(0, state.targetCal - state.consumedCal);
      const protLeft = Math.max(0, state.proteinTarget - state.protein);

      if (lower.includes('repas') || lower.includes('post') || lower.includes('manger')) {
        if (protLeft > 25) {
          botReply = `🥗 Tu as encore besoin de ${protLeft}g de protéines aujourd'hui ! Je te conseille 150g de Blanc de Poulet avec 180g de Riz basmati et du Brocoli à la vapeur.`;
        } else {
          botReply = `🥗 Tes protéines sont au top (${state.protein}g) ! Un repas léger comme une salade composée avec pavé de saumon et quinoa fera l'affaire pour combler tes ${calLeft} kcal restantes.`;
        }
      } else if (lower.includes('sèche') || lower.includes('perdre')) {
        botReply = `🔥 Pour optimiser ta sèche vers ton objectif de ${state.user.targetWeight} kg (encore ${ (state.user.currentWeight - state.user.targetWeight).toFixed(1) } kg) : Maintiens un déficit calorique à ${state.targetCal} kcal, garde des protéines à au moins ${state.proteinTarget}g et bois au moins 2.5L d'eau !`;
      } else if (lower.includes('masse') || lower.includes('calcul')) {
        const h = state.user.height / 100;
        const bmi = (state.user.currentWeight / (h * h)).toFixed(1);
        botReply = `📊 Avec une taille de ${state.user.height} cm et un poids de ${state.user.currentWeight} kg, ton IMC est de ${bmi}. Ton métabolisme cible est réglé sur la routine '${state.activeRoutine}'.`;
      } else {
        botReply = `⚡ Analyse en cours... Tu as consommé ${state.consumedCal} / ${state.targetCal} kcal aujourd'hui (${Math.round((state.consumedCal / state.targetCal) * 100)}%). Continue ta rigueur pour atteindre tes ${state.user.targetWeight} kg !`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 flex flex-col justify-end">
      <div className="bg-white rounded-t-[32px] p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300 h-[80%] flex flex-col">
        
        {/* Drawer Header */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gradient-primary text-white rounded-2xl shadow-purple-glow">
              <i data-lucide="sparkles" className="w-5 h-5"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-dark">FitCoach AI Chat</h3>
              <span className="text-[10px] text-emerald-500 font-semibold">● En ligne (Contextuel)</span>
            </div>
          </div>
          <button onClick={() => setIsFitCoachOpen(false)} className="p-1.5 text-gray-muted hover:text-slate-dark">
            <i data-lucide="x" className="w-5 h-5"></i>
          </button>
        </div>

        {/* Chat History */}
        <div ref={chatHistoryRef} className="flex-1 overflow-y-auto space-y-3 no-scrollbar p-1">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={msg.sender === 'user' 
                ? "bg-purple-main text-white p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ml-auto shadow-sm"
                : "bg-[#F5F7FB] p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed text-slate-dark shadow-sm"
              }
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1 text-[10px] font-bold">
          <button onClick={() => handleSend('Quel repas prendre après ma séance ?')} className="px-3 py-1.5 bg-purple-50 text-purple-main rounded-xl flex-shrink-0">
            🥗 Idée repas post-workout
          </button>
          <button onClick={() => handleSend('Comment optimiser ma sèche ?')} className="px-3 py-1.5 bg-pink-50 text-pink-main rounded-xl flex-shrink-0">
            🔥 Conseil sèche rapide
          </button>
          <button onClick={() => handleSend('Calcule ma masse grasse idéale')} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0">
            📊 Calcul de masse grasse
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Posez une question à votre coach..." 
            className="flex-1 px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-main/30"
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          />
          <button onClick={() => handleSend()} className="p-3 bg-gradient-primary text-white rounded-2xl shadow-purple-glow active:scale-95 transition-transform">
            <i data-lucide="send" className="w-4 h-4"></i>
          </button>
        </div>

      </div>
    </div>
  );
}
