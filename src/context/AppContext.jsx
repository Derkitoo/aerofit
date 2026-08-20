import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const defaultState = {
  user: {
    name: 'Alexandre M.',
    email: 'alex.athlete@fitpulse.app',
    height: 180,
    age: 26,
    gender: 'male',
    currentWeight: 76.4,
    targetWeight: 73.0,
  },
  theme: 'default',
  targetCal: 2500,
  consumedCal: 1680,
  protein: 120,
  proteinTarget: 160,
  carbs: 180,
  carbsTarget: 240,
  fat: 48,
  fatTarget: 65,
  water: 1.75,
  waterTarget: 2.5,
  activeRoutine: 'training',
  activeFilterMeal: 'all',
  weightGraphRange: '30d',
  fastingActive: true,
  currentScreen: 'screen-dashboard',
  meals: [
    { id: 1, name: 'Avoine, Protéine Whey & Banane', category: 'breakfast', cal: 520, protein: 38, carbs: 65, fat: 8, time: '08:30' },
    { id: 2, name: 'Poulet Grillé, Riz Basmati & Brocolis', category: 'lunch', cal: 660, protein: 52, carbs: 70, fat: 12, time: '12:45' },
    { id: 3, name: 'Shaker Isolate & Poignée d\'Amandes', category: 'snack', cal: 300, protein: 30, carbs: 10, fat: 14, time: '16:30' },
  ],
  workouts: [
    { id: 101, name: 'Musculation Pectoraux & Triceps', duration: 50, calBurned: 450, time: '10:15' }
  ],
  weightsHistory: [
    { date: '19 Jul', weight: 78.5 },
    { date: '26 Jul', weight: 78.1 },
    { date: '02 Aôu', weight: 77.6 },
    { date: '09 Aôu', weight: 77.0 },
    { date: '18 Aôu', weight: 76.4 }
  ]
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('fitpulse_app_state');
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch (e) {
      return defaultState;
    }
  });

  const [toasts, setToasts] = useState([]);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [isAddWeightOpen, setIsAddWeightOpen] = useState(false);
  const [isFitCoachOpen, setIsFitCoachOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [badgeModal, setBadgeModal] = useState({ open: false, type: 'streak' });

  useEffect(() => {
    try {
      localStorage.setItem('fitpulse_app_state', JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  }, [state]);

  useEffect(() => {
    document.body.classList.remove('theme-emerald', 'theme-sunset');
    if (state.theme === 'emerald') document.body.classList.add('theme-emerald');
    if (state.theme === 'sunset') document.body.classList.add('theme-sunset');
  }, [state.theme]);

  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const launchConfetti = () => {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#6C5CE7', '#FD79A8', '#FF7675', '#00CEC9', '#FDCB6E'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.alpha -= 0.015;

        if (p.alpha > 0) {
          active = true;
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (active) requestAnimationFrame(animate);
    }
    animate();
  };

  const switchScreen = (screenId) => {
    setState(prev => ({ ...prev, currentScreen: screenId }));
  };

  const changeTheme = (themeName) => {
    setState(prev => ({ ...prev, theme: themeName }));
    showToast(`Thème appliqué : ${themeName}`);
  };

  const setActiveRoutine = (type) => {
    const routineCal = { training: 2500, rest: 2000, cut: 1800, cheat: 2900 };
    const routineNames = { training: 'Training Day', rest: 'Jour Repos', cut: 'Sèche Express', cheat: 'Cheat Day' };
    
    if (routineCal[type]) {
      const targetCal = routineCal[type];
      const proteinTarget = Math.round((targetCal * 0.30) / 4);
      const carbsTarget = Math.round((targetCal * 0.45) / 4);
      const fatTarget = Math.round((targetCal * 0.25) / 9);

      setState(prev => ({
        ...prev,
        activeRoutine: type,
        targetCal,
        proteinTarget,
        carbsTarget,
        fatTarget
      }));
      showToast(`Routine : ${routineNames[type]} (${targetCal} kcal)`);
    }
  };

  const setMacroMode = (mode) => {
    let pPct = 0.30, cPct = 0.50, fPct = 0.20;
    if (mode === 'high-protein') { pPct = 0.40; cPct = 0.40; fPct = 0.20; }
    if (mode === 'keto') { pPct = 0.35; cPct = 0.15; fPct = 0.50; }

    setState(prev => ({
      ...prev,
      proteinTarget: Math.round((prev.targetCal * pPct) / 4),
      carbsTarget: Math.round((prev.targetCal * cPct) / 4),
      fatTarget: Math.round((prev.targetCal * fPct) / 9),
    }));
  };

  const adjustCalorieTarget = (amount) => {
    setState(prev => {
      const targetCal = Math.max(1200, prev.targetCal + amount);
      return {
        ...prev,
        targetCal,
        proteinTarget: Math.round((targetCal * 0.30) / 4),
        carbsTarget: Math.round((targetCal * 0.45) / 4),
        fatTarget: Math.round((targetCal * 0.25) / 9),
      };
    });
  };

  const quickAddCalories = (amount) => {
    setState(prev => ({ ...prev, consumedCal: prev.consumedCal + amount }));
    showToast(`+${amount} kcal ajoutées`);
  };

  const addWater = (amount) => {
    setState(prev => {
      const water = Math.max(0, Math.min(5.0, prev.water + amount));
      if (water >= prev.waterTarget && prev.water < prev.waterTarget) {
        launchConfetti();
      }
      return { ...prev, water };
    });
  };

  const updateWater = (val) => {
    setState(prev => ({ ...prev, water: parseFloat(val) || 0 }));
  };

  const toggleFastingTimer = () => {
    setState(prev => {
      const fastingActive = !prev.fastingActive;
      showToast(fastingActive ? "Jeûne démarré" : "Jeûne en pause");
      return { ...prev, fastingActive };
    });
  };

  const addMeal = (meal) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMeal = { id: Date.now(), time: timeStr, ...meal };

    setState(prev => ({
      ...prev,
      consumedCal: prev.consumedCal + meal.cal,
      protein: prev.protein + meal.protein,
      carbs: prev.carbs + meal.carbs,
      fat: prev.fat + meal.fat,
      meals: [newMeal, ...prev.meals]
    }));

    showToast(`${meal.name} ajouté !`);
    launchConfetti();
  };

  const deleteMeal = (id) => {
    setState(prev => {
      const meal = prev.meals.find(m => m.id === id);
      if (!meal) return prev;
      return {
        ...prev,
        consumedCal: Math.max(0, prev.consumedCal - meal.cal),
        protein: Math.max(0, prev.protein - meal.protein),
        carbs: Math.max(0, prev.carbs - meal.carbs),
        fat: Math.max(0, prev.fat - meal.fat),
        meals: prev.meals.filter(m => m.id !== id)
      };
    });
    showToast("Repas supprimé");
  };

  const addWorkout = (workout) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newWorkout = { id: Date.now(), time: timeStr, ...workout };

    setState(prev => ({
      ...prev,
      workouts: [newWorkout, ...prev.workouts]
    }));
    showToast("Séance d'entraînement ajoutée !");
  };

  const addWeight = (weightVal, dateStr) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, currentWeight: weightVal },
      weightsHistory: [...prev.weightsHistory, { date: dateStr || "Aujourd'hui", weight: weightVal }]
    }));
    showToast(`Pesée de ${weightVal} kg enregistrée`);
    launchConfetti();
  };

  const deleteWeight = (idx) => {
    setState(prev => {
      const updated = prev.weightsHistory.filter((_, i) => i !== idx);
      const currentWeight = updated.length > 0 ? updated[updated.length - 1].weight : prev.user.currentWeight;
      return {
        ...prev,
        user: { ...prev.user, currentWeight },
        weightsHistory: updated
      };
    });
  };

  const updateUserProfile = (userData) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, ...userData }
    }));
    showToast("Profil mis à jour");
  };

  const resetDayData = () => {
    if (confirm("Réinitialiser les données de la journée ?")) {
      setState(prev => ({
        ...prev,
        consumedCal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        water: 0,
        meals: [],
        workouts: []
      }));
      showToast("Journée réinitialisée");
    }
  };

  const setFilterMeal = (cat) => {
    setState(prev => ({ ...prev, activeFilterMeal: cat }));
  };

  const setWeightGraphRange = (range) => {
    setState(prev => ({ ...prev, weightGraphRange: range }));
  };

  return (
    <AppContext.Provider value={{
      state,
      toasts,
      isAddFoodOpen, setIsAddFoodOpen,
      isAddWorkoutOpen, setIsAddWorkoutOpen,
      isAddWeightOpen, setIsAddWeightOpen,
      isFitCoachOpen, setIsFitCoachOpen,
      isNotificationsOpen, setIsNotificationsOpen,
      badgeModal, setBadgeModal,
      showToast,
      launchConfetti,
      switchScreen,
      changeTheme,
      setActiveRoutine,
      setMacroMode,
      adjustCalorieTarget,
      quickAddCalories,
      addWater,
      updateWater,
      toggleFastingTimer,
      addMeal,
      deleteMeal,
      addWorkout,
      addWeight,
      deleteWeight,
      updateUserProfile,
      resetDayData,
      setFilterMeal,
      setWeightGraphRange
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
