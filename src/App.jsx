import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
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

    function loadStateFromStorage() {
      try {
        const saved = localStorage.getItem('fitpulse_app_state');
        return saved ? JSON.parse(saved) : defaultState;
      } catch (e) {
        return defaultState;
      }
    }

    function saveStateToStorage() {
      try {
        localStorage.setItem('fitpulse_app_state', JSON.stringify(appState));
      } catch (e) {
        console.error(e);
      }
    }

    let appState = loadStateFromStorage();
    window.appState = appState;

    window.switchScreen = function(screenId) {
      document.querySelectorAll('.screen-view').forEach(el => {
        el.classList.add('screen-hidden');
      });
      const target = document.getElementById(screenId);
      if (target) {
        target.classList.remove('screen-hidden');
      }

      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-purple-main');
        btn.classList.add('text-gray-muted');
      });

      const navMap = {
        'screen-dashboard': 'nav-dashboard',
        'screen-tracker': 'nav-tracker',
        'screen-analytics': 'nav-analytics',
        'screen-profile': 'nav-profile',
      };

      if (navMap[screenId]) {
        const activeNav = document.getElementById(navMap[screenId]);
        if (activeNav) {
          activeNav.classList.remove('text-gray-muted');
          activeNav.classList.add('text-purple-main');
        }
      }

      if (screenId === 'screen-analytics') {
        setTimeout(() => {
          if (window.renderWeightChart) window.renderWeightChart();
          if (window.renderWeeklyCalChart) window.renderWeeklyCalChart();
        }, 50);
      }

      if (window.lucide) window.lucide.createIcons();
    };

    window.changeTheme = function(themeName, notify = true) {
      appState.theme = themeName;
      document.body.classList.remove('theme-emerald', 'theme-sunset');
      if (themeName === 'emerald') document.body.classList.add('theme-emerald');
      if (themeName === 'sunset') document.body.classList.add('theme-sunset');
      saveStateToStorage();
      if (notify && window.showToast) window.showToast(`Thème appliqué : ${themeName}`);
    };

    window.toggleAuthTab = function(mode) {
      const btnLogin = document.getElementById('tab-btn-login');
      const btnRegister = document.getElementById('tab-btn-register');
      const fieldName = document.getElementById('field-name');
      const submitBtn = document.getElementById('auth-submit-btn');

      if (mode === 'login') {
        if (btnLogin) btnLogin.className = "flex-1 py-2 text-xs font-bold rounded-xl bg-white text-slate-dark shadow-sm transition-all";
        if (btnRegister) btnRegister.className = "flex-1 py-2 text-xs font-bold rounded-xl text-gray-muted hover:text-slate-dark transition-all";
        if (fieldName) fieldName.classList.add('hidden');
        if (submitBtn && submitBtn.querySelector('span')) submitBtn.querySelector('span').innerText = "Se Connecter";
      } else {
        if (btnRegister) btnRegister.className = "flex-1 py-2 text-xs font-bold rounded-xl bg-white text-slate-dark shadow-sm transition-all";
        if (btnLogin) btnLogin.className = "flex-1 py-2 text-xs font-bold rounded-xl text-gray-muted hover:text-slate-dark transition-all";
        if (fieldName) fieldName.classList.remove('hidden');
        if (submitBtn && submitBtn.querySelector('span')) submitBtn.querySelector('span').innerText = "Créer mon Compte";
      }
    };

    window.handleAuthSubmit = function(e) {
      if (e) e.preventDefault();
      const emailInput = document.getElementById('auth-input-email');
      const nameInput = document.getElementById('auth-input-name');
      const email = emailInput ? emailInput.value : 'alex.athlete@fitpulse.app';
      const name = nameInput && nameInput.value ? nameInput.value : "Alexandre M.";
      appState.user.email = email;
      appState.user.name = name;
      saveStateToStorage();
      window.updateUserProfileUI();
      window.switchScreen('screen-dashboard');
      window.showToast(`Bienvenue ${name} !`);
    };

    window.handleQuickDemo = function() {
      window.switchScreen('screen-dashboard');
      window.showToast("Mode Démo activé");
    };

    window.handleLogout = function() {
      window.switchScreen('screen-login');
      window.showToast("Vous avez été déconnecté");
    };

    window.handleResetData = function() {
      if (confirm("Réinitialiser les données de la journée ?")) {
        appState.consumedCal = 0;
        appState.protein = 0;
        appState.carbs = 0;
        appState.fat = 0;
        appState.water = 0;
        appState.meals = [];
        appState.workouts = [];
        saveStateToStorage();
        window.updateAllUI();
        window.showToast("Journée réinitialisée");
      }
    };

    window.setActiveRoutine = function(type) {
      appState.activeRoutine = type;
      document.querySelectorAll('.routine-btn').forEach(btn => {
        btn.className = "routine-btn flex-shrink-0 px-4 py-3 rounded-2xl bg-white text-slate-dark shadow-soft-card border border-gray-100 flex items-center space-x-2.5 transition-all";
      });

      const activeBtn = document.getElementById(`routine-${type}`);
      if (activeBtn) {
        activeBtn.className = "routine-btn flex-shrink-0 px-4 py-3 rounded-2xl bg-gradient-primary text-white shadow-pill-active flex items-center space-x-2.5 transition-all";
      }

      const routineCal = { training: 2500, rest: 2000, cut: 1800, cheat: 2900 };
      const routineNames = { training: 'Training Day', rest: 'Jour Repos', cut: 'Sèche Express', cheat: 'Cheat Day' };
      
      if (routineCal[type]) {
        appState.targetCal = routineCal[type];
        const elName = document.getElementById('active-routine-name');
        if (elName) elName.innerText = routineNames[type];
        window.recalculateMacrosTargets();
        window.updateAllUI();
        saveStateToStorage();
        window.showToast(`Routine : ${routineNames[type]} (${routineCal[type]} kcal)`);
      }
    };

    window.setMacroMode = function(mode) {
      ['protein', 'balanced', 'keto'].forEach(m => {
        const btn = document.getElementById(`macro-btn-${m}`);
        if (btn) btn.className = "p-3 rounded-2xl bg-[#F5F7FB] text-slate-dark text-center transition-all hover:bg-gray-100";
      });

      const active = document.getElementById(`macro-btn-${mode}`);
      if (active) active.className = "p-3 rounded-2xl bg-gradient-primary text-white text-center shadow-pill-active transition-all";

      if (mode === 'high-protein') {
        appState.proteinTarget = Math.round((appState.targetCal * 0.40) / 4);
        appState.carbsTarget = Math.round((appState.targetCal * 0.40) / 4);
        appState.fatTarget = Math.round((appState.targetCal * 0.20) / 9);
      } else if (mode === 'balanced') {
        appState.proteinTarget = Math.round((appState.targetCal * 0.30) / 4);
        appState.carbsTarget = Math.round((appState.targetCal * 0.50) / 4);
        appState.fatTarget = Math.round((appState.targetCal * 0.20) / 9);
      } else if (mode === 'keto') {
        appState.proteinTarget = Math.round((appState.targetCal * 0.35) / 4);
        appState.carbsTarget = Math.round((appState.targetCal * 0.15) / 4);
        appState.fatTarget = Math.round((appState.targetCal * 0.50) / 9);
      }

      window.updateAllUI();
      saveStateToStorage();
    };

    window.recalculateMacrosTargets = function() {
      appState.proteinTarget = Math.round((appState.targetCal * 0.30) / 4);
      appState.carbsTarget = Math.round((appState.targetCal * 0.45) / 4);
      appState.fatTarget = Math.round((appState.targetCal * 0.25) / 9);
    };

    window.adjustCalorieTarget = function(amount) {
      appState.targetCal = Math.max(1200, appState.targetCal + amount);
      window.recalculateMacrosTargets();
      window.updateAllUI();
      saveStateToStorage();
    };

    window.quickAddCalories = function(amount) {
      appState.consumedCal += amount;
      window.updateAllUI();
      saveStateToStorage();
      window.showToast(`+${amount} kcal ajoutées`);
    };

    window.addWater = function(amount) {
      appState.water = Math.max(0, Math.min(5.0, appState.water + amount));
      window.updateWaterUI();
      saveStateToStorage();
      if (appState.water >= appState.waterTarget) window.launchConfetti();
    };

    window.updateWaterFromSlider = function(val) {
      appState.water = parseFloat(val);
      window.updateWaterUI();
      saveStateToStorage();
    };

    window.updateWaterUI = function() {
      const elStatus = document.getElementById('water-status');
      const elSlider = document.getElementById('water-slider');
      if (elStatus) elStatus.innerText = `${appState.water.toFixed(2)} L / ${appState.waterTarget.toFixed(2)} L`;
      if (elSlider) elSlider.value = appState.water;
    };

    window.toggleFastingTimer = function() {
      appState.fastingActive = !appState.fastingActive;
      const btn = document.getElementById('fasting-btn');
      const label = document.getElementById('fasting-status-label');
      if (appState.fastingActive) {
        if (btn) btn.innerText = "Stopper";
        if (label) label.innerText = "Période de Jeûne en cours";
        window.showToast("Jeûne démarré");
      } else {
        if (btn) btn.innerText = "Démarrer";
        if (label) label.innerText = "Jeûne en pause";
        window.showToast("Jeûne interrompu");
      }
      saveStateToStorage();
    };

    window.toggleFitCoachDrawer = function() {
      const drawer = document.getElementById('fitcoach-drawer');
      if (drawer) drawer.classList.toggle('hidden');
    };

    window.askFitCoach = function(questionText) {
      const input = document.getElementById('fitcoach-input');
      if (input) input.value = questionText;
      window.sendFitCoachMessage();
    };

    window.sendFitCoachMessage = function() {
      const input = document.getElementById('fitcoach-input');
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;

      const history = document.getElementById('fitcoach-chat-history');
      if (!history) return;

      const userMsg = document.createElement('div');
      userMsg.className = "bg-purple-main text-white p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ml-auto shadow-sm";
      userMsg.innerText = text;
      history.appendChild(userMsg);

      input.value = '';
      history.scrollTop = history.scrollHeight;

      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = "bg-[#F5F7FB] p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed text-slate-dark shadow-sm";

        if (text.toLowerCase().includes('repas') || text.toLowerCase().includes('post')) {
          botMsg.innerText = "💡 Post-workout idéal : 150g de Blanc de Poulet avec 180g de Riz basmati et du Brocoli à la vapeur pour recharger le glycogène et stimuler la synthèse protéique.";
        } else if (text.toLowerCase().includes('sèche')) {
          botMsg.innerText = "🔥 Pour optimiser votre sèche : Maintenez un déficit de 300-500 kcal, gardez des protéines élevées (2.0g/kg) et hydratez-vous avec 3L d'eau par jour.";
        } else {
          botMsg.innerText = "⚡ Analyse effectuée ! Votre métabolisme fonctionne de manière optimale. Continuez de suivre vos macros pour atteindre vos 73.0 kg.";
        }

        history.appendChild(botMsg);
        history.scrollTop = history.scrollHeight;
      }, 600);
    };

    window.toggleFoodInputTab = function(tab) {
      const btnManual = document.getElementById('food-tab-manual');
      const btnScanner = document.getElementById('food-tab-scanner');
      const containerManual = document.getElementById('food-manual-container');
      const containerScanner = document.getElementById('food-scanner-container');

      if (tab === 'manual') {
        if (btnManual) btnManual.className = "flex-1 py-1.5 rounded-xl bg-white text-purple-main shadow-sm";
        if (btnScanner) btnScanner.className = "flex-1 py-1.5 rounded-xl text-gray-muted flex items-center justify-center gap-1";
        if (containerManual) containerManual.classList.remove('hidden');
        if (containerScanner) containerScanner.classList.add('hidden');
      } else {
        if (btnScanner) btnScanner.className = "flex-1 py-1.5 rounded-xl bg-white text-purple-main shadow-sm flex items-center justify-center gap-1";
        if (btnManual) btnManual.className = "flex-1 py-1.5 rounded-xl text-gray-muted";
        if (containerScanner) containerScanner.classList.remove('hidden');
        if (containerManual) containerManual.classList.add('hidden');
      }
    };

    window.applyFoodPreset = function(name, category, cal, protein, carbs, fat) {
      const elName = document.getElementById('food-name');
      const elCat = document.getElementById('food-category');
      const elCal = document.getElementById('food-cal');
      const elP = document.getElementById('food-protein');
      const elC = document.getElementById('food-carbs');
      const elF = document.getElementById('food-fat');

      if (elName) elName.value = name;
      if (elCat) elCat.value = category;
      if (elCal) elCal.value = cal;
      if (elP) elP.value = protein;
      if (elC) elC.value = carbs;
      if (elF) elF.value = fat;
    };

    window.simulateIAScan = function() {
      window.showToast("Analyse IA de l'image...");
      setTimeout(() => {
        window.applyFoodPreset("Poke Bowl Saumon & Avocat", "lunch", 580, 32, 62, 18);
        window.toggleFoodInputTab('manual');
        window.showToast("Repas détecté avec succès !");
      }, 1200);
    };

    window.filterMeals = function(category) {
      appState.activeFilterMeal = category;
      ['all', 'breakfast', 'lunch', 'dinner', 'snack'].forEach(c => {
        const btn = document.getElementById(`meal-filter-${c}`);
        if (btn) {
          btn.className = (c === category) ? "px-3 py-1 rounded-xl bg-purple-main text-white" : "px-3 py-1 rounded-xl bg-white text-gray-muted shadow-sm";
        }
      });
      window.renderMealsList();
    };

    window.renderMealsList = function() {
      const container = document.getElementById('logged-meals-list');
      if (!container) return;
      container.innerHTML = '';

      const filtered = appState.activeFilterMeal === 'all' 
        ? appState.meals 
        : appState.meals.filter(m => m.category === appState.activeFilterMeal);

      if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center py-6 text-xs text-gray-muted">Aucun repas enregistré dans cette catégorie.</div>`;
        return;
      }

      filtered.forEach(meal => {
        const div = document.createElement('div');
        div.className = "bg-white p-3.5 rounded-2xl shadow-soft-card border border-white/60 flex justify-between items-center";
        div.innerHTML = `
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-main font-bold text-xs">
              ${meal.cal}
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-dark">${meal.name}</h4>
              <span class="text-[10px] text-gray-muted">P:${meal.protein}g • G:${meal.carbs}g • L:${meal.fat}g • ${meal.time || '12:00'}</span>
            </div>
          </div>
          <button onclick="window.deleteMeal(${meal.id})" class="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        `;
        container.appendChild(div);
      });

      if (window.lucide) window.lucide.createIcons();
    };

    window.deleteMeal = function(id) {
      const meal = appState.meals.find(m => m.id === id);
      if (meal) {
        appState.consumedCal = Math.max(0, appState.consumedCal - meal.cal);
        appState.protein = Math.max(0, appState.protein - meal.protein);
        appState.carbs = Math.max(0, appState.carbs - meal.carbs);
        appState.fat = Math.max(0, appState.fat - meal.fat);
        appState.meals = appState.meals.filter(m => m.id !== id);
        window.updateAllUI();
        saveStateToStorage();
        window.showToast("Repas supprimé");
      }
    };

    window.openAddFoodModal = function() { const m = document.getElementById('add-food-modal'); if (m) m.classList.remove('hidden'); };
    window.closeAddFoodModal = function() { const m = document.getElementById('add-food-modal'); if (m) m.classList.add('hidden'); };

    window.handleAddFood = function(e) {
      if (e) e.preventDefault();
      const elName = document.getElementById('food-name');
      const elCat = document.getElementById('food-category');
      const elCal = document.getElementById('food-cal');
      const elP = document.getElementById('food-protein');
      const elC = document.getElementById('food-carbs');
      const elF = document.getElementById('food-fat');

      if (!elName || !elCal) return;

      const name = elName.value;
      const category = elCat ? elCat.value : 'lunch';
      const cal = parseInt(elCal.value) || 0;
      const protein = parseInt(elP ? elP.value : 0) || 0;
      const carbs = parseInt(elC ? elC.value : 0) || 0;
      const fat = parseInt(elF ? elF.value : 0) || 0;

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newMeal = { id: Date.now(), name, category, cal, protein, carbs, fat, time: timeStr };
      appState.meals.unshift(newMeal);

      appState.consumedCal += cal;
      appState.protein += protein;
      appState.carbs += carbs;
      appState.fat += fat;

      window.closeAddFoodModal();
      window.updateAllUI();
      saveStateToStorage();
      window.showToast(`${name} ajouté !`);
      window.launchConfetti();
    };

    window.openAddWorkoutModal = function() { const m = document.getElementById('add-workout-modal'); if (m) m.classList.remove('hidden'); };
    window.closeAddWorkoutModal = function() { const m = document.getElementById('add-workout-modal'); if (m) m.classList.add('hidden'); };

    window.handleAddWorkout = function(e) {
      if (e) e.preventDefault();
      const elType = document.getElementById('workout-type');
      const elDur = document.getElementById('workout-duration');
      const elCal = document.getElementById('workout-calories');

      const name = elType ? elType.value : 'Musculation';
      const duration = parseInt(elDur ? elDur.value : 45) || 45;
      const calBurned = parseInt(elCal ? elCal.value : 400) || 400;

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      appState.workouts.unshift({ id: Date.now(), name, duration, calBurned, time: timeStr });
      window.closeAddWorkoutModal();
      window.renderWorkoutsList();
      saveStateToStorage();
      window.showToast("Séance d'entraînement ajoutée !");
    };

    window.renderWorkoutsList = function() {
      const container = document.getElementById('workout-list');
      if (!container) return;
      container.innerHTML = '';

      let totalBurned = 0;
      appState.workouts.forEach(w => {
        totalBurned += w.calBurned;
        const div = document.createElement('div');
        div.className = "p-3 bg-[#F5F7FB] rounded-2xl flex items-center justify-between text-xs";
        div.innerHTML = `
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-pink-100 text-pink-main rounded-xl">
              <i data-lucide="dumbbell" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-dark">${w.name}</h4>
              <span class="text-[10px] text-gray-muted">${w.duration} min • ${w.time || '10:00'}</span>
            </div>
          </div>
          <span class="font-extrabold text-pink-main">-${w.calBurned} kcal</span>
        `;
        container.appendChild(div);
      });

      const summary = document.getElementById('workout-summary-text');
      if (summary) summary.innerText = `${appState.workouts.length} séance(s) • -${totalBurned} kcal`;

      if (window.lucide) window.lucide.createIcons();
    };

    window.openWeightModal = function() { const m = document.getElementById('add-weight-modal'); if (m) m.classList.remove('hidden'); };
    window.closeWeightModal = function() { const m = document.getElementById('add-weight-modal'); if (m) m.classList.add('hidden'); };

    window.handleAddWeight = function(e) {
      if (e) e.preventDefault();
      const elVal = document.getElementById('new-weight-val');
      const elDate = document.getElementById('new-weight-date');

      const val = parseFloat(elVal ? elVal.value : 76.0) || 76.0;
      const dateStr = (elDate && elDate.value) ? elDate.value : "Aujourd'hui";

      appState.user.currentWeight = val;
      appState.weightsHistory.push({ date: dateStr, weight: val });

      window.closeWeightModal();
      window.updateAllUI();
      saveStateToStorage();
      window.showToast(`Pesée de ${val} kg enregistrée`);
      window.launchConfetti();
    };

    window.deleteWeightEntry = function(idx) {
      appState.weightsHistory.splice(idx, 1);
      if (appState.weightsHistory.length > 0) {
        appState.user.currentWeight = appState.weightsHistory[appState.weightsHistory.length - 1].weight;
      }
      window.updateAllUI();
      saveStateToStorage();
    };

    window.renderWeightHistoryList = function() {
      const container = document.getElementById('weight-history-list');
      if (!container) return;
      container.innerHTML = '';

      [...appState.weightsHistory].reverse().forEach((item, index) => {
        const realIdx = appState.weightsHistory.length - 1 - index;
        const div = document.createElement('div');
        div.className = "flex justify-between items-center p-2.5 bg-[#F5F7FB] rounded-xl text-xs";
        div.innerHTML = `
          <span class="font-semibold text-slate-dark">${item.date}</span>
          <div class="flex items-center space-x-3">
            <span class="font-extrabold text-purple-main">${item.weight} kg</span>
            <button onclick="window.deleteWeightEntry(${realIdx})" class="text-gray-300 hover:text-red-500">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `;
        container.appendChild(div);
      });

      if (window.lucide) window.lucide.createIcons();
    };

    window.setWeightGraphFilter = function(range) {
      appState.weightGraphRange = range;
      ['7d', '30d', '90d'].forEach(r => {
        const btn = document.getElementById(`filter-${r}`);
        if (btn) btn.className = (r === range) ? "px-2.5 py-1 rounded-lg bg-white text-purple-main shadow-sm" : "px-2.5 py-1 rounded-lg text-gray-muted";
      });
      window.renderWeightChart();
    };

    window.updateAllUI = function() {
      const elHeaderName = document.getElementById('header-user-name');
      const elDashWeight = document.getElementById('dash-current-weight');
      const elDashTarget = document.getElementById('dash-target-weight');
      const elDashRem = document.getElementById('dash-weight-rem');
      const elCalLeft = document.getElementById('dash-cal-left');

      if (elHeaderName) elHeaderName.innerText = appState.user.name;
      if (elDashWeight) elDashWeight.innerText = appState.user.currentWeight.toFixed(1);
      if (elDashTarget) elDashTarget.innerText = appState.user.targetWeight.toFixed(1);

      const rem = (appState.user.currentWeight - appState.user.targetWeight).toFixed(1);
      if (elDashRem) elDashRem.innerHTML = `<i data-lucide="target" class="w-3 h-3"></i> Reste ${rem} kg`;

      const left = Math.max(0, appState.targetCal - appState.consumedCal);
      if (elCalLeft) elCalLeft.innerText = left;

      const pVal = document.getElementById('p-val');
      const pT = document.getElementById('p-target');
      const pBar = document.getElementById('p-bar');
      if (pVal) pVal.innerText = appState.protein;
      if (pT) pT.innerText = appState.proteinTarget;
      if (pBar) pBar.style.width = `${Math.min(100, (appState.protein / appState.proteinTarget) * 100)}%`;

      const cVal = document.getElementById('c-val');
      const cT = document.getElementById('c-target');
      const cBar = document.getElementById('c-bar');
      if (cVal) cVal.innerText = appState.carbs;
      if (cT) cT.innerText = appState.carbsTarget;
      if (cBar) cBar.style.width = `${Math.min(100, (appState.carbs / appState.carbsTarget) * 100)}%`;

      const fVal = document.getElementById('f-val');
      const fT = document.getElementById('f-target');
      const fBar = document.getElementById('f-bar');
      if (fVal) fVal.innerText = appState.fat;
      if (fT) fT.innerText = appState.fatTarget;
      if (fBar) fBar.style.width = `${Math.min(100, (appState.fat / appState.fatTarget) * 100)}%`;

      const circleDash = document.getElementById('dash-circle-progress');
      if (circleDash) {
        const pct = Math.min(1, appState.consumedCal / appState.targetCal);
        circleDash.style.strokeDashoffset = 251.2 * (1 - pct);
      }

      const trackerGauge = document.getElementById('tracker-gauge-circle');
      if (trackerGauge) {
        const pct = Math.min(1, appState.consumedCal / appState.targetCal);
        trackerGauge.style.strokeDashoffset = 490 * (1 - pct);
      }

      const elTrkCons = document.getElementById('tracker-cal-consumed');
      const elTrkTarget = document.getElementById('tracker-cal-target');
      const elTgtSm = document.getElementById('target-display-sm');
      const elTrkLbl = document.getElementById('tracker-status-label');

      if (elTrkCons) elTrkCons.innerText = appState.consumedCal;
      if (elTrkTarget) elTrkTarget.innerText = appState.targetCal;
      if (elTgtSm) elTgtSm.innerText = `${appState.targetCal} kcal`;
      if (elTrkLbl) elTrkLbl.innerText = `${Math.round((appState.consumedCal / appState.targetCal) * 100)}% atteint`;

      const elAnalyticsWeight = document.getElementById('analytics-current-weight');
      if (elAnalyticsWeight) elAnalyticsWeight.innerText = `${appState.user.currentWeight} kg`;

      window.updateWaterUI();
      window.renderMealsList();
      window.renderWorkoutsList();
      window.renderWeightHistoryList();
      window.calculateHealthMetrics();

      if (window.lucide) window.lucide.createIcons();
    };

    window.updateUserProfileUI = function() {
      const elName = document.getElementById('edit-user-name');
      const elHeight = document.getElementById('edit-user-height');
      const elAge = document.getElementById('edit-user-age');
      const elGender = document.getElementById('edit-user-gender');
      const elWeight = document.getElementById('edit-user-weight');
      const elTargetWeight = document.getElementById('edit-user-target-weight');
      const elProfName = document.getElementById('profile-name-display');
      const elProfEmail = document.getElementById('profile-email-display');

      if (elName) elName.value = appState.user.name;
      if (elHeight) elHeight.value = appState.user.height;
      if (elAge) elAge.value = appState.user.age;
      if (elGender) elGender.value = appState.user.gender;
      if (elWeight) elWeight.value = appState.user.currentWeight;
      if (elTargetWeight) elTargetWeight.value = appState.user.targetWeight;
      if (elProfName) elProfName.innerText = appState.user.name;
      if (elProfEmail) elProfEmail.innerText = appState.user.email;
    };

    window.saveUserProfile = function() {
      const elName = document.getElementById('edit-user-name');
      const elHeight = document.getElementById('edit-user-height');
      const elAge = document.getElementById('edit-user-age');
      const elGender = document.getElementById('edit-user-gender');
      const elWeight = document.getElementById('edit-user-weight');
      const elTargetWeight = document.getElementById('edit-user-target-weight');

      if (elName) appState.user.name = elName.value;
      if (elHeight) appState.user.height = parseInt(elHeight.value) || 180;
      if (elAge) appState.user.age = parseInt(elAge.value) || 26;
      if (elGender) appState.user.gender = elGender.value;
      if (elWeight) appState.user.currentWeight = parseFloat(elWeight.value) || 76.4;
      if (elTargetWeight) appState.user.targetWeight = parseFloat(elTargetWeight.value) || 73.0;

      window.updateAllUI();
      window.updateUserProfileUI();
      saveStateToStorage();
      window.showToast("Profil mis à jour");
    };

    window.calculateHealthMetrics = function() {
      const h = appState.user.height / 100;
      const w = appState.user.currentWeight;
      const bmi = (w / (h * h)).toFixed(1);

      let bmr = (10 * w) + (6.25 * appState.user.height) - (5 * appState.user.age);
      bmr = appState.user.gender === 'male' ? bmr + 5 : bmr - 161;

      const tdee = Math.round(bmr * 1.45);

      const bmrEl = document.getElementById('bmr-val');
      if (bmrEl) bmrEl.innerText = `${Math.round(bmr)} kcal/j`;
      const tdeeEl = document.getElementById('tdee-val');
      if (tdeeEl) tdeeEl.innerText = `${tdee} kcal/j`;
      const bmiEl = document.getElementById('bmi-val');
      if (bmiEl) bmiEl.innerText = `${bmi} (${bmi < 25 ? 'Normal' : 'Surpoids'})`;
    };

    window.updateActivityLevel = function(val) {
      const labels = ['Léger (+200 kcal)', 'Modéré (+400 kcal)', 'Intense (+650 kcal)', 'Extrême (+900 kcal)'];
      const txt = document.getElementById('activity-level-text');
      if (txt) txt.innerText = labels[val - 1] || labels[2];
    };

    window.renderWeightChart = function() {
      const canvas = document.getElementById('weightCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const data = appState.weightsHistory.map(h => h.weight);
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
    };

    window.renderWeeklyCalChart = function() {
      const canvas = document.getElementById('weeklyCalCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const cals = [2300, 2450, 2100, 2550, 2200, 2600, appState.consumedCal];
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
    };

    window.toggleNotificationsDrawer = function() {
      const drawer = document.getElementById('notifications-drawer');
      if (drawer) drawer.classList.toggle('hidden');
    };

    window.showBadgeModal = function(type) {
      const modal = document.getElementById('badge-modal');
      const title = document.getElementById('badge-modal-title');
      const desc = document.getElementById('badge-modal-desc');
      if (!modal) return;

      if (type === 'streak') {
        if (title) title.innerText = 'Série de 14 Jours';
        if (desc) desc.innerText = 'Vous avez suivi vos repas avec assiduité durant 14 jours consécutifs. Votre rigueur paie !';
      } else {
        if (title) title.innerText = 'Cap des -2 kg Franchi';
        if (desc) desc.innerText = 'Excellente progression ! Vous avez perdu 2.1 kg depuis votre première pesée.';
      }
      modal.classList.remove('hidden');
    };

    window.closeBadgeModal = function() {
      const modal = document.getElementById('badge-modal');
      if (modal) modal.classList.add('hidden');
    };

    window.launchConfetti = function() {
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

    window.showToast = function(message) {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = "bg-slate-dark text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between border border-white/10 animate-in fade-in duration-200 pointer-events-auto";
      toast.innerHTML = `
        <span>${message}</span>
        <i data-lucide="check-circle" class="w-4 h-4 text-pink-main"></i>
      `;
      container.appendChild(toast);
      if (window.lucide) window.lucide.createIcons();

      setTimeout(() => {
        toast.remove();
      }, 3000);
    };

    // Initial UI load
    window.changeTheme(appState.theme || 'default', false);
    window.updateAllUI();
    window.updateUserProfileUI();
    window.switchScreen('screen-login');
    if (window.lucide) window.lucide.createIcons();
  }, []);

  return (
    <>
      <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none z-[100]"></canvas>

      <div id="app-container" className="w-full max-w-md h-full sm:h-[860px] bg-[#F5F7FB] sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(100,90,140,0.18)] overflow-hidden flex flex-col relative">

        <div id="toast-container" className="absolute top-4 left-4 right-4 z-50 pointer-events-none flex flex-col gap-2"></div>

        {/* Notifications Drawer */}
        <div id="notifications-drawer" className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 hidden flex flex-col justify-start">
          <div className="bg-white rounded-b-[28px] p-5 shadow-2xl space-y-4 animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <i data-lucide="bell" className="w-5 h-5 text-purple-main"></i>
                <h3 className="text-sm font-bold text-slate-dark">Notifications FitPulse</h3>
              </div>
              <button onClick={() => window.toggleNotificationsDrawer()} className="p-1.5 text-gray-muted hover:text-slate-dark">
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

            <button onClick={() => window.toggleNotificationsDrawer()} className="w-full py-2.5 bg-gray-100 text-slate-dark font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors">
              Fermer
            </button>
          </div>
        </div>

        {/* FitCoach AI Drawer */}
        <div id="fitcoach-drawer" className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 hidden flex flex-col justify-end">
          <div className="bg-white rounded-t-[32px] p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300 h-[80%] flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-gradient-primary text-white rounded-2xl shadow-purple-glow">
                  <i data-lucide="sparkles" className="w-5 h-5"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-dark">FitCoach AI Chat</h3>
                  <span className="text-[10px] text-emerald-500 font-semibold">● En ligne</span>
                </div>
              </div>
              <button onClick={() => window.toggleFitCoachDrawer()} className="p-1.5 text-gray-muted hover:text-slate-dark">
                <i data-lucide="x" className="w-5 h-5"></i>
              </button>
            </div>

            <div id="fitcoach-chat-history" className="flex-1 overflow-y-auto space-y-3 no-scrollbar p-1">
              <div className="bg-[#F5F7FB] p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed text-slate-dark">
                👋 Bonjour Alexandre ! Je suis votre coach personnel propulsé par l'IA. Comment puis-je vous aider aujourd'hui ?
              </div>
            </div>

            <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1 text-[10px] font-bold">
              <button onClick={() => window.askFitCoach('Quel repas prendre après ma séance ?')} className="px-3 py-1.5 bg-purple-50 text-purple-main rounded-xl flex-shrink-0">
                🥗 Idée repas post-workout
              </button>
              <button onClick={() => window.askFitCoach('Comment optimiser ma sèche ?')} className="px-3 py-1.5 bg-pink-50 text-pink-main rounded-xl flex-shrink-0">
                🔥 Conseil sèche rapide
              </button>
              <button onClick={() => window.askFitCoach('Calcule ma masse grasse idéale')} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0">
                📊 Calcul de masse grasse
              </button>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
              <input type="text" id="fitcoach-input" placeholder="Posez une question à votre coach..." 
                     className="flex-1 px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-main/30"
                     onKeyDown={(e) => { if (e.key === 'Enter') window.sendFitCoachMessage(); }} />
              <button onClick={() => window.sendFitCoachMessage()} className="p-3 bg-gradient-primary text-white rounded-2xl shadow-purple-glow">
                <i data-lucide="send" className="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Main Screens Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative pb-36">

          {/* SCREEN 0: LOGIN */}
          <section id="screen-login" className="screen-view min-h-full flex flex-col justify-end p-6 relative">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop" 
                   alt="Sport background" className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.1]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#6C5CE7]/95 via-[#6C5CE7]/40 to-transparent"></div>
            </div>

            <div className="relative z-10 text-white mb-6 pt-8">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
                FitPulse AI v3.0
              </span>
              <h1 className="text-3xl font-extrabold leading-tight">Sculptez votre<br/>corps idéal.</h1>
              <p className="text-white/80 text-xs mt-1">Suivi nutritionnel, jeûne & performances sportives.</p>
            </div>

            <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-[28px] p-6 shadow-soft-card border border-white">
              <div className="flex bg-[#F5F7FB] p-1 rounded-2xl mb-5">
                <button onClick={() => window.toggleAuthTab('login')} id="tab-btn-login" className="flex-1 py-2 text-xs font-bold rounded-xl bg-white text-slate-dark shadow-sm transition-all">
                  Connexion
                </button>
                <button onClick={() => window.toggleAuthTab('register')} id="tab-btn-register" className="flex-1 py-2 text-xs font-bold rounded-xl text-gray-muted hover:text-slate-dark transition-all">
                  Inscription
                </button>
              </div>

              <form id="login-form" onSubmit={(e) => window.handleAuthSubmit(e)} className="space-y-3.5">
                <div id="field-name" className="hidden">
                  <div className="relative flex items-center">
                    <i data-lucide="user" className="w-4 h-4 absolute left-4 text-violet-soft"></i>
                    <input type="text" id="auth-input-name" defaultValue="Alexandre M." 
                           className="w-full pl-11 pr-4 py-3 bg-[#F5F7FB] border border-transparent focus:border-purple-main/30 rounded-2xl text-xs font-medium focus:outline-none transition-all"
                           placeholder="Prénom & Nom" />
                  </div>
                </div>

                <div>
                  <div className="relative flex items-center">
                    <i data-lucide="mail" className="w-4 h-4 absolute left-4 text-violet-soft"></i>
                    <input type="email" id="auth-input-email" required defaultValue="alex.athlete@fitpulse.app" 
                           className="w-full pl-11 pr-4 py-3 bg-[#F5F7FB] border border-transparent focus:border-purple-main/30 rounded-2xl text-xs font-medium focus:outline-none transition-all"
                           placeholder="Adresse email" />
                  </div>
                </div>

                <div>
                  <div className="relative flex items-center">
                    <i data-lucide="lock" className="w-4 h-4 absolute left-4 text-violet-soft"></i>
                    <input type="password" required defaultValue="••••••••••••" 
                           className="w-full pl-11 pr-4 py-3 bg-[#F5F7FB] border border-transparent focus:border-purple-main/30 rounded-2xl text-xs font-medium focus:outline-none transition-all"
                           placeholder="Mot de passe" />
                  </div>
                </div>

                <button type="submit" id="auth-submit-btn"
                        className="w-full py-3.5 bg-gradient-primary text-white font-bold text-sm rounded-2xl shadow-purple-glow active:scale-[0.98] transition-transform flex items-center justify-center gap-2 mt-2">
                  <span>Se Connecter</span>
                  <i data-lucide="arrow-right" className="w-4 h-4"></i>
                </button>
              </form>

              <div className="mt-4 text-center">
                <button onClick={() => window.handleQuickDemo()} className="text-xs font-semibold text-purple-main hover:underline">
                  Accès rapide Démo (Sans connexion)
                </button>
              </div>
            </div>
          </section>

          {/* SCREEN 1: DASHBOARD */}
          <section id="screen-dashboard" className="screen-view screen-hidden p-5 space-y-5">
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.switchScreen('screen-profile')}>
                <div className="relative">
                  <img id="header-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                       alt="Avatar" className="w-11 h-11 rounded-2xl object-cover ring-2 ring-pink-main/30 shadow-sm" />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-gray-muted block">Ravi de vous voir,</span>
                  <h2 id="header-user-name" className="text-base font-bold text-slate-dark leading-none">Alexandre M.</h2>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button onClick={() => window.toggleFitCoachDrawer()} className="p-2.5 bg-gradient-primary text-white rounded-2xl shadow-purple-glow hover:opacity-95 transition-all flex items-center gap-1.5">
                  <i data-lucide="sparkles" className="w-4 h-4"></i>
                  <span className="text-xs font-bold">FitCoach</span>
                </button>

                <button onClick={() => window.toggleNotificationsDrawer()} className="relative p-2.5 bg-white rounded-2xl shadow-soft-card text-gray-muted hover:text-slate-dark transition-colors">
                  <i data-lucide="bell" className="w-5 h-5 text-purple-main"></i>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-pink-main rounded-full"></span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-primary text-white p-4 rounded-[28px] shadow-purple-glow flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-sm">
                  Nv.4
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Rang Actuel</span>
                  <h4 className="text-xs font-extrabold text-white">Athlète Bronze (850 / 1000 XP)</h4>
                  <div className="w-36 h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
              <button onClick={() => window.showToast('Remplissez vos objectifs quotidiens pour passer Nv.5 !')} className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-xl backdrop-blur-md">
                +150 XP
              </button>
            </div>

            <div onClick={() => window.switchScreen('screen-analytics')} className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white/60 cursor-pointer hover:border-purple-main/20 transition-all">
              <div className="grid grid-cols-2 gap-4 divide-x divide-gray-100">
                <div className="pr-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-muted block mb-0.5">Poids Actuel</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-extrabold text-slate-dark" id="dash-current-weight">76.4</span>
                    <span className="text-xs font-semibold text-gray-muted">kg</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-500 inline-flex items-center gap-0.5 mt-1">
                    <i data-lucide="trending-down" className="w-3 h-3"></i> -0.8 kg cette semaine
                  </span>
                </div>

                <div className="pl-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-muted block mb-0.5">Objectif Sèche</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-extrabold text-slate-dark" id="dash-target-weight">73.0</span>
                    <span className="text-xs font-semibold text-gray-muted">kg</span>
                  </div>
                  <span className="text-[10px] font-semibold text-purple-main inline-flex items-center gap-0.5 mt-1" id="dash-weight-rem">
                    <i data-lucide="target" className="w-3 h-3"></i> Reste 3.4 kg
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <h3 className="text-xs font-bold text-slate-dark uppercase tracking-wider">Routines Métaboliques</h3>
                <span className="text-[11px] text-purple-main font-semibold" id="active-routine-name">Training Day</span>
              </div>
              <div className="flex space-x-2.5 overflow-x-auto no-scrollbar pb-1">
                <button onClick={() => window.setActiveRoutine('training')} id="routine-training" 
                        className="routine-btn flex-shrink-0 px-4 py-3 rounded-2xl bg-gradient-primary text-white shadow-pill-active flex items-center space-x-2.5 transition-all">
                  <div className="p-1.5 bg-white/20 rounded-xl">
                    <i data-lucide="dumbbell" className="w-4 h-4 text-white"></i>
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block leading-tight">Training Day</span>
                    <span className="text-[10px] opacity-90 block">2 500 kcal</span>
                  </div>
                </button>

                <button onClick={() => window.setActiveRoutine('rest')} id="routine-rest" 
                        className="routine-btn flex-shrink-0 px-4 py-3 rounded-2xl bg-white text-slate-dark shadow-soft-card border border-gray-100 flex items-center space-x-2.5 transition-all">
                  <div className="p-1.5 bg-purple-100 rounded-xl">
                    <i data-lucide="coffee" className="w-4 h-4 text-purple-main"></i>
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block leading-tight">Jour Repos</span>
                    <span className="text-[10px] text-gray-muted block">2 000 kcal</span>
                  </div>
                </button>

                <button onClick={() => window.setActiveRoutine('cut')} id="routine-cut" 
                        className="routine-btn flex-shrink-0 px-4 py-3 rounded-2xl bg-white text-slate-dark shadow-soft-card border border-gray-100 flex items-center space-x-2.5 transition-all">
                  <div className="p-1.5 bg-pink-100 rounded-xl">
                    <i data-lucide="flame" className="w-4 h-4 text-pink-main"></i>
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block leading-tight">Sèche Express</span>
                    <span className="text-[10px] text-gray-muted block">1 800 kcal</span>
                  </div>
                </button>

                <button onClick={() => window.setActiveRoutine('cheat')} id="routine-cheat" 
                        className="routine-btn flex-shrink-0 px-4 py-3 rounded-2xl bg-white text-slate-dark shadow-soft-card border border-gray-100 flex items-center space-x-2.5 transition-all">
                  <div className="p-1.5 bg-amber-100 rounded-xl">
                    <i data-lucide="utensils" className="w-4 h-4 text-amber-600"></i>
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block leading-tight">Cheat Day</span>
                    <span className="text-[10px] text-gray-muted block">2 900 kcal</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white/60">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-dark">Bilan Nutritionnel</h3>
                  <p className="text-[10px] text-gray-muted" id="current-date-label">Aujourd'hui</p>
                </div>
                <button onClick={() => window.switchScreen('screen-tracker')} className="text-xs font-bold text-purple-main hover:text-pink-main transition-colors flex items-center gap-1">
                  <span>Ajuster</span>
                  <i data-lucide="chevron-right" className="w-4 h-4"></i>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#F0F2FA" strokeWidth="10" fill="transparent" />
                    <circle id="dash-circle-progress" className="gauge-circle" cx="50" cy="50" r="40" 
                            stroke="url(#dashGradient)" strokeWidth="10" strokeLinecap="round" fill="transparent" 
                            strokeDasharray="251.2" strokeDashoffset="80" />
                    <defs>
                      <linearGradient id="dashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-primary)" />
                        <stop offset="100%" stopColor="var(--color-secondary)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-gray-muted font-medium">Restant</span>
                    <span className="text-lg font-extrabold text-slate-dark leading-tight" id="dash-cal-left">820</span>
                    <span className="text-[9px] font-bold text-purple-main uppercase">kcal</span>
                  </div>
                </div>

                <div className="flex-1 pl-5 space-y-2.5">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold mb-1">
                      <span className="text-slate-dark">Protéines</span>
                      <span className="text-purple-main"><span id="p-val">120</span> / <span id="p-target">160</span>g</span>
                    </div>
                    <div className="w-full h-2 bg-[#F0F2FA] rounded-full overflow-hidden">
                      <div id="p-bar" className="h-full bg-gradient-primary rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold mb-1">
                      <span className="text-slate-dark">Glucides</span>
                      <span className="text-pink-main"><span id="c-val">180</span> / <span id="c-target">240</span>g</span>
                    </div>
                    <div className="w-full h-2 bg-[#F0F2FA] rounded-full overflow-hidden">
                      <div id="c-bar" className="h-full bg-gradient-pill rounded-full transition-all duration-500" style={{ width: '70%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold mb-1">
                      <span className="text-slate-dark">Lipides</span>
                      <span className="text-amber-500"><span id="f-val">48</span> / <span id="f-target">65</span>g</span>
                    </div>
                    <div className="w-full h-2 bg-[#F0F2FA] rounded-full overflow-hidden">
                      <div id="f-bar" className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white/60">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-purple-50 text-purple-main rounded-2xl">
                    <i data-lucide="timer" className="w-5 h-5"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-dark">Jeûne Intermittent 16:8</h3>
                    <span className="text-xs text-gray-muted" id="fasting-status-label">Période de Jeûne en cours</span>
                  </div>
                </div>
                <button onClick={() => window.toggleFastingTimer()} id="fasting-btn" className="px-3 py-1.5 bg-gradient-primary text-white font-bold text-xs rounded-xl shadow-purple-glow">
                  Stopper
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex-1 bg-[#F5F7FB] p-2.5 rounded-2xl text-center mr-2">
                  <span className="text-[9px] font-bold text-gray-muted block uppercase">Temps Écoulé</span>
                  <span className="text-sm font-extrabold text-slate-dark" id="fasting-elapsed">11h 24m</span>
                </div>
                <div className="flex-1 bg-purple-50 p-2.5 rounded-2xl text-center ml-2">
                  <span className="text-[9px] font-bold text-purple-main block uppercase">Restant (Cible 16h)</span>
                  <span className="text-sm font-extrabold text-purple-main" id="fasting-remaining">04h 36m</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white/60">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-pink-50 text-pink-main rounded-2xl">
                    <i data-lucide="flame" className="w-5 h-5"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-dark">Entraînements du jour</h3>
                    <span className="text-xs text-gray-muted" id="workout-summary-text">1 séance • -450 kcal</span>
                  </div>
                </div>
                <button onClick={() => window.openAddWorkoutModal()} className="px-3 py-1.5 bg-pink-50 text-pink-main font-bold text-xs rounded-xl hover:bg-pink-100 transition-colors flex items-center gap-1">
                  <i data-lucide="plus" className="w-3.5 h-3.5"></i> Ajouter
                </button>
              </div>

              <div id="workout-list" className="space-y-2"></div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white/60">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-2xl">
                    <i data-lucide="droplet" className="w-5 h-5"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-dark">Hydratation</h3>
                    <span className="text-xs text-gray-muted" id="water-status">1.75 L / 2.50 L</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button onClick={() => window.addWater(-0.25)} className="px-2.5 py-1.5 bg-gray-100 text-slate-dark font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors">
                    -250ml
                  </button>
                  <button onClick={() => window.addWater(0.25)} className="px-3 py-1.5 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1">
                    <i data-lucide="plus" className="w-3.5 h-3.5"></i> 250ml
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <input type="range" id="water-slider" min="0" max="4.0" step="0.25" defaultValue="1.75" onInput={(e) => window.updateWaterFromSlider(e.target.value)} />
                <div className="flex justify-between text-[10px] text-gray-muted font-semibold mt-1">
                  <span>0L</span>
                  <span>1.5L</span>
                  <span>2.5L (Objectif)</span>
                  <span>4.0L</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold text-slate-dark uppercase tracking-wider">Repas enregistrés</h3>
                <button onClick={() => window.openAddFoodModal()} className="text-xs font-bold text-purple-main flex items-center gap-1">
                  <i data-lucide="plus-circle" className="w-4 h-4"></i> Ajouter
                </button>
              </div>

              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar text-[11px] font-semibold">
                <button onClick={() => window.filterMeals('all')} id="meal-filter-all" className="px-3 py-1 rounded-xl bg-purple-main text-white">Tous</button>
                <button onClick={() => window.filterMeals('breakfast')} id="meal-filter-breakfast" className="px-3 py-1 rounded-xl bg-white text-gray-muted shadow-sm">Petit-déj</button>
                <button onClick={() => window.filterMeals('lunch')} id="meal-filter-lunch" className="px-3 py-1 rounded-xl bg-white text-gray-muted shadow-sm">Déjeuner</button>
                <button onClick={() => window.filterMeals('dinner')} id="meal-filter-dinner" className="px-3 py-1 rounded-xl bg-white text-gray-muted shadow-sm">Dîner</button>
                <button onClick={() => window.filterMeals('snack')} id="meal-filter-snack" className="px-3 py-1 rounded-xl bg-white text-gray-muted shadow-sm">Snacks</button>
              </div>

              <div id="logged-meals-list" className="space-y-2"></div>
            </div>
          </section>

          {/* SCREEN 2: TRACKER */}
          <section id="screen-tracker" className="screen-view screen-hidden p-5 space-y-5">
            <div className="flex items-center justify-between pt-1">
              <button onClick={() => window.switchScreen('screen-dashboard')} className="p-2.5 bg-white rounded-2xl shadow-soft-card text-gray-muted hover:text-slate-dark">
                <i data-lucide="arrow-left" className="w-5 h-5"></i>
              </button>
              <h2 className="text-base font-bold text-slate-dark">Contrôle Nutritionnel</h2>
              <button onClick={() => window.openAddFoodModal()} className="p-2.5 bg-white rounded-2xl shadow-soft-card text-purple-main">
                <i data-lucide="plus" className="w-5 h-5"></i>
              </button>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-soft-card border border-white/80 text-center relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-muted block mb-1">Cadran Énergétique</span>

              <div className="relative w-56 h-56 mx-auto my-2 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="78" stroke="#F5F7FB" strokeWidth="16" fill="none" strokeLinecap="round" />
                  <circle id="tracker-gauge-circle" className="gauge-circle" cx="100" cy="100" r="78" 
                          stroke="url(#trackerGradient)" strokeWidth="16" fill="none" strokeLinecap="round"
                          strokeDasharray="490" strokeDashoffset="180" />
                  <defs>
                    <linearGradient id="trackerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primary)" />
                      <stop offset="100%" stopColor="var(--color-secondary)" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-extrabold text-slate-dark tracking-tight" id="tracker-cal-consumed">1 680</span>
                  <span className="text-xs font-bold text-purple-main uppercase tracking-widest mt-0.5">/ <span id="tracker-cal-target">2 500</span> kcal</span>
                  
                  <div className="mt-2 px-3 py-1 bg-pink-50 rounded-full flex items-center space-x-1">
                    <i data-lucide="flame" className="w-3.5 h-3.5 text-pink-main"></i>
                    <span className="text-[11px] font-bold text-pink-main" id="tracker-status-label">67% atteint</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center space-x-6 mt-3">
                <button onClick={() => window.adjustCalorieTarget(-100)} className="w-11 h-11 rounded-2xl bg-[#F5F7FB] text-slate-dark font-extrabold text-xl flex items-center justify-center hover:bg-purple-100 transition-colors shadow-sm active:scale-95">
                  -
                </button>
                <div className="text-center">
                  <span className="text-[10px] text-gray-muted font-bold block uppercase">Cible Quotidienne</span>
                  <span className="text-sm font-extrabold text-slate-dark" id="target-display-sm">2500 kcal</span>
                </div>
                <button onClick={() => window.adjustCalorieTarget(100)} className="w-11 h-11 rounded-2xl bg-[#F5F7FB] text-slate-dark font-extrabold text-xl flex items-center justify-center hover:bg-purple-100 transition-colors shadow-sm active:scale-95">
                  +
                </button>
              </div>

              <div className="flex justify-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <button onClick={() => window.quickAddCalories(100)} className="px-3 py-1.5 bg-purple-50 text-purple-main font-bold text-xs rounded-xl hover:bg-purple-100 transition-colors">
                  +100 kcal
                </button>
                <button onClick={() => window.quickAddCalories(250)} className="px-3 py-1.5 bg-purple-50 text-purple-main font-bold text-xs rounded-xl hover:bg-purple-100 transition-colors">
                  +250 kcal
                </button>
                <button onClick={() => window.quickAddCalories(500)} className="px-3 py-1.5 bg-pink-50 text-pink-main font-bold text-xs rounded-xl hover:bg-pink-100 transition-colors">
                  +500 kcal
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-4 shadow-soft-card border border-white">
              <span className="text-xs font-bold text-slate-dark block mb-3 px-1">Répartition des Macronutriments</span>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => window.setMacroMode('high-protein')} id="macro-btn-protein" 
                        className="p-3 rounded-2xl bg-gradient-primary text-white text-center shadow-pill-active transition-all">
                  <i data-lucide="shield-check" className="w-5 h-5 mx-auto mb-1"></i>
                  <span className="text-xs font-bold block">Protéiné</span>
                  <span className="text-[9px] opacity-80">40P / 40G / 20L</span>
                </button>

                <button onClick={() => window.setMacroMode('balanced')} id="macro-btn-balanced" 
                        className="p-3 rounded-2xl bg-[#F5F7FB] text-slate-dark text-center transition-all hover:bg-gray-100">
                  <i data-lucide="scale" className="w-5 h-5 mx-auto mb-1 text-purple-main"></i>
                  <span className="text-xs font-bold block">Équilibré</span>
                  <span className="text-[9px] text-gray-muted">30P / 50G / 20L</span>
                </button>

                <button onClick={() => window.setMacroMode('keto')} id="macro-btn-keto" 
                        className="p-3 rounded-2xl bg-[#F5F7FB] text-slate-dark text-center transition-all hover:bg-gray-100">
                  <i data-lucide="zap" className="w-5 h-5 mx-auto mb-1 text-pink-main"></i>
                  <span className="text-xs font-bold block">Low Carb</span>
                  <span className="text-[9px] text-gray-muted">35P / 15G / 50L</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-dark">Dépense physique du jour</span>
                <span className="text-xs font-extrabold text-purple-main" id="activity-level-text">Intense (+650 kcal)</span>
              </div>
              <input type="range" min="1" max="4" defaultValue="3" id="activity-slider" onInput={(e) => window.updateActivityLevel(e.target.value)} />
              <div className="flex justify-between text-[9px] font-bold text-gray-muted mt-2 uppercase">
                <span>Repos</span>
                <span>Léger</span>
                <span>Intense</span>
                <span>Extrême</span>
              </div>
            </div>
          </section>

          {/* SCREEN 3: ANALYTICS */}
          <section id="screen-analytics" className="screen-view screen-hidden p-5 space-y-5">
            <div className="flex items-center justify-between pt-1">
              <button onClick={() => window.switchScreen('screen-dashboard')} className="p-2.5 bg-white rounded-2xl shadow-soft-card text-gray-muted">
                <i data-lucide="arrow-left" className="w-5 h-5"></i>
              </button>
              <h2 className="text-base font-bold text-slate-dark">Progression & Analytics</h2>
              <button onClick={() => window.openWeightModal()} className="p-2.5 bg-gradient-primary text-white rounded-2xl shadow-purple-glow">
                <i data-lucide="plus" className="w-5 h-5"></i>
              </button>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-xs font-bold text-gray-muted block">Évolution du Poids</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-slate-dark" id="analytics-current-weight">76.4 kg</span>
                    <span className="text-xs font-bold text-emerald-500" id="analytics-weight-diff">-2.1 kg</span>
                  </div>
                </div>
                
                <div className="flex bg-[#F5F7FB] p-1 rounded-xl text-[10px] font-bold">
                  <button onClick={() => window.setWeightGraphFilter('7d')} id="filter-7d" className="px-2.5 py-1 rounded-lg text-gray-muted">7J</button>
                  <button onClick={() => window.setWeightGraphFilter('30d')} id="filter-30d" className="px-2.5 py-1 rounded-lg bg-white text-purple-main shadow-sm">30J</button>
                  <button onClick={() => window.setWeightGraphFilter('90d')} id="filter-90d" className="px-2.5 py-1 rounded-lg text-gray-muted">90J</button>
                </div>
              </div>

              <div className="relative w-full h-40 mt-2">
                <canvas id="weightCanvas" className="w-full h-full"></canvas>
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-dark uppercase tracking-wider">Calories Consommées vs Cible</h3>
                  <span className="text-[10px] text-gray-muted">Moyenne cette semaine : 2 240 kcal</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold text-[10px] rounded-lg">92% Réussite</span>
              </div>

              <div className="relative w-full h-36 mt-3">
                <canvas id="weeklyCalCanvas" className="w-full h-full"></canvas>
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-dark uppercase tracking-wider">Historique des pesées</h3>
                <button onClick={() => window.openWeightModal()} className="text-xs font-bold text-purple-main">+ Nouvelle pesée</button>
              </div>
              
              <div id="weight-history-list" className="space-y-2 max-h-48 overflow-y-auto no-scrollbar"></div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white">
              <h3 className="text-xs font-bold text-slate-dark mb-3 uppercase tracking-wider">Récompenses & Discipline</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div onClick={() => window.showBadgeModal('streak')} className="p-3 bg-[#F5F7FB] rounded-2xl flex items-center space-x-3 cursor-pointer hover:bg-purple-50 transition-colors">
                  <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                    <i data-lucide="award" className="w-5 h-5"></i>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-dark block">14 Jours</span>
                    <span className="text-[10px] text-gray-muted">Série de Log</span>
                  </div>
                </div>

                <div onClick={() => window.showBadgeModal('loss')} className="p-3 bg-[#F5F7FB] rounded-2xl flex items-center space-x-3 cursor-pointer hover:bg-pink-50 transition-colors">
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

            <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white space-y-2.5">
              <h3 className="text-xs font-bold text-slate-dark uppercase tracking-wider">Indicateurs Physiologiques</h3>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-50 text-xs">
                <span className="text-gray-muted font-medium">Métabolisme de Base (MB)</span>
                <span className="font-bold text-slate-dark" id="bmr-val">1 740 kcal/j</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50 text-xs">
                <span className="text-gray-muted font-medium">Dépense Totale (TDEE)</span>
                <span className="font-bold text-purple-main" id="tdee-val">2 480 kcal/j</span>
              </div>

              <div className="flex justify-between items-center py-2 text-xs">
                <span className="text-gray-muted font-medium">Indice de Masse Corporelle (IMC)</span>
                <span className="font-bold text-emerald-500" id="bmi-val">23.6 (Normal)</span>
              </div>
            </div>
          </section>

          {/* SCREEN 4: PROFILE */}
          <section id="screen-profile" className="screen-view screen-hidden p-5 space-y-5">
            <div className="flex items-center justify-between pt-1">
              <button onClick={() => window.switchScreen('screen-dashboard')} className="p-2.5 bg-white rounded-2xl shadow-soft-card text-gray-muted">
                <i data-lucide="arrow-left" className="w-5 h-5"></i>
              </button>
              <h2 className="text-base font-bold text-slate-dark">Mon Profil</h2>
              <button onClick={() => window.saveUserProfile()} className="p-2.5 bg-gradient-primary text-white rounded-2xl shadow-purple-glow">
                <i data-lucide="check" className="w-5 h-5"></i>
              </button>
            </div>

            <div className="bg-white rounded-[28px] p-6 shadow-soft-card border border-white text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <img id="profile-page-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                     alt="Avatar" className="w-full h-full rounded-3xl object-cover ring-4 ring-purple-main/20 shadow-md" />
                <button onClick={() => window.showToast('Option photo active')} className="absolute -bottom-1 -right-1 p-1.5 bg-gradient-primary text-white rounded-xl shadow-md">
                  <i data-lucide="camera" className="w-3.5 h-3.5"></i>
                </button>
              </div>
              <h3 className="text-lg font-extrabold text-slate-dark" id="profile-name-display">Alexandre M.</h3>
              <p className="text-xs text-purple-main font-semibold" id="profile-email-display">alex.athlete@fitpulse.app</p>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white space-y-3">
              <h3 className="text-xs font-bold text-slate-dark uppercase tracking-wider">Thème Visuel</h3>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => window.changeTheme('default')} className="p-2.5 rounded-2xl border-2 border-purple-main bg-purple-50 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#FD79A8] mb-1"></div>
                  <span className="text-[10px] font-bold text-slate-dark">Violet/Rose</span>
                </button>
                <button onClick={() => window.changeTheme('emerald')} className="p-2.5 rounded-2xl border-2 border-transparent bg-gray-50 flex flex-col items-center hover:bg-emerald-50">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00B894] to-[#00CEC9] mb-1"></div>
                  <span className="text-[10px] font-bold text-slate-dark">Émeraude</span>
                </button>
                <button onClick={() => window.changeTheme('sunset')} className="p-2.5 rounded-2xl border-2 border-transparent bg-gray-50 flex flex-col items-center hover:bg-orange-50">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FF7675] to-[#E17055] mb-1"></div>
                  <span className="text-[10px] font-bold text-slate-dark">Sunset</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-soft-card border border-white space-y-4">
              <h3 className="text-xs font-bold text-slate-dark uppercase tracking-wider">Données Physiologiques</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-muted block mb-1">Prénom / Nom</label>
                  <input type="text" id="edit-user-name" defaultValue="Alexandre M." 
                         className="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-muted block mb-1">Taille (cm)</label>
                  <input type="number" id="edit-user-height" defaultValue="180" 
                         className="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-muted block mb-1">Âge (ans)</label>
                  <input type="number" id="edit-user-age" defaultValue="26" 
                         className="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-muted block mb-1">Genre</label>
                  <select id="edit-user-gender" defaultValue="male" className="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none">
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-muted block mb-1">Poids Actuel (kg)</label>
                  <input type="number" step="0.1" id="edit-user-weight" defaultValue="76.4" 
                         className="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-muted block mb-1">Objectif Poids (kg)</label>
                  <input type="number" step="0.1" id="edit-user-target-weight" defaultValue="73.0" 
                         className="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" />
                </div>
              </div>

              <button onClick={() => window.saveUserProfile()} className="w-full py-3 bg-gradient-primary text-white font-bold text-xs rounded-2xl shadow-purple-glow mt-2">
                Enregistrer les modifications
              </button>
            </div>

            <button onClick={() => window.handleResetData()} className="w-full py-3 bg-gray-100 text-gray-600 font-bold text-xs rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <i data-lucide="refresh-cw" className="w-4 h-4"></i>
              <span>Réinitialiser la journée</span>
            </button>

            <button onClick={() => window.handleLogout()} className="w-full py-3 bg-red-50 text-red-500 font-bold text-xs rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
              <i data-lucide="log-out" className="w-4 h-4"></i>
              <span>Déconnexion</span>
            </button>
          </section>

        </div>

        {/* Floating Bottom Nav */}
        <nav id="bottom-nav" className="absolute bottom-3 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-3xl p-2 shadow-soft-card border border-white/80 flex justify-around items-center z-40">
          <button onClick={() => window.switchScreen('screen-dashboard')} id="nav-dashboard" 
                  className="nav-btn flex flex-col items-center p-2 text-purple-main transition-colors">
            <i data-lucide="layout-grid" className="w-5 h-5"></i>
            <span className="text-[9px] font-bold mt-1">Accueil</span>
          </button>

          <button onClick={() => window.switchScreen('screen-tracker')} id="nav-tracker" 
                  className="nav-btn flex flex-col items-center p-2 text-gray-muted hover:text-purple-main transition-colors">
            <i data-lucide="pie-chart" className="w-5 h-5"></i>
            <span className="text-[9px] font-bold mt-1">Calories</span>
          </button>

          <button onClick={() => window.openAddFoodModal()} 
                  className="w-11 h-11 bg-gradient-primary text-white rounded-2xl shadow-purple-glow flex items-center justify-center -mt-5 active:scale-90 transition-transform">
            <i data-lucide="plus" className="w-6 h-6"></i>
          </button>

          <button onClick={() => window.switchScreen('screen-analytics')} id="nav-analytics" 
                  className="nav-btn flex flex-col items-center p-2 text-gray-muted hover:text-purple-main transition-colors">
            <i data-lucide="line-chart" className="w-5 h-5"></i>
            <span className="text-[9px] font-bold mt-1">Analytics</span>
          </button>

          <button onClick={() => window.switchScreen('screen-profile')} id="nav-profile" 
                  className="nav-btn flex flex-col items-center p-2 text-gray-muted hover:text-purple-main transition-colors">
            <i data-lucide="user" className="w-5 h-5"></i>
            <span className="text-[9px] font-bold mt-1">Profil</span>
          </button>
        </nav>

        {/* Modal Add Food */}
        <div id="add-food-modal" className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 hidden flex items-end justify-center">
          <div className="bg-white w-full rounded-t-[32px] p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85%] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-dark">Ajouter un Aliment</h3>
              <button onClick={() => window.closeAddFoodModal()} className="p-1.5 text-gray-muted hover:text-slate-dark">
                <i data-lucide="x" className="w-5 h-5"></i>
              </button>
            </div>

            <div className="flex bg-[#F5F7FB] p-1 rounded-2xl text-xs font-bold">
              <button onClick={() => window.toggleFoodInputTab('manual')} id="food-tab-manual" className="flex-1 py-1.5 rounded-xl bg-white text-purple-main shadow-sm">Saisie / Presets</button>
              <button onClick={() => window.toggleFoodInputTab('scanner')} id="food-tab-scanner" className="flex-1 py-1.5 rounded-xl text-gray-muted flex items-center justify-center gap-1">
                <i data-lucide="camera" className="w-3.5 h-3.5"></i>
                <span>Scan Repas IA</span>
              </button>
            </div>

            <div id="food-scanner-container" className="hidden space-y-3">
              <div className="relative w-full h-44 bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center text-center p-4">
                <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop" 
                     alt="Scan meal" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="absolute inset-x-0 h-1 bg-gradient-primary shadow-lg scanner-laser"></div>
                <div className="relative z-10 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl text-white">
                  <i data-lucide="scan" className="w-6 h-6 mx-auto mb-1 animate-pulse text-pink-main"></i>
                  <span className="text-[11px] font-bold block">Pointez votre assiette ou code-barres</span>
                </div>
              </div>
              <button onClick={() => window.simulateIAScan()} className="w-full py-3 bg-gradient-primary text-white font-bold text-xs rounded-2xl shadow-purple-glow">
                Lancer l'Analyse IA Instantanée
              </button>
            </div>

            <div id="food-manual-container" className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-gray-muted block mb-1.5 uppercase">Aliments Populaires (1-Clic)</span>
                <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                  <button onClick={() => window.applyFoodPreset('Blanc de Poulet (150g)', 'lunch', 240, 46, 0, 4)} className="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                    🍗 Poulet (150g)
                  </button>
                  <button onClick={() => window.applyFoodPreset('Riz Basmati Cuit (200g)', 'lunch', 260, 5, 56, 1)} className="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                    🍚 Riz (200g)
                  </button>
                  <button onClick={() => window.applyFoodPreset('Œufs Durs (x2)', 'breakfast', 155, 13, 1, 11)} className="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                    🥚 2 Œufs
                  </button>
                  <button onClick={() => window.applyFoodPreset('Shaker Whey (30g)', 'snack', 120, 24, 2, 2)} className="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                    🥤 Whey (30g)
                  </button>
                  <button onClick={() => window.applyFoodPreset('Flocons d\'Avoine (60g)', 'breakfast', 230, 8, 40, 4)} className="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                    🥣 Avoine (60g)
                  </button>
                </div>
              </div>

              <form onSubmit={(e) => window.handleAddFood(e)} className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-gray-muted block">Nom de l'aliment</label>
                  </div>
                  <input type="text" id="food-name" required placeholder="ex: Omelette & Avocat" 
                         className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-main/30" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-muted block mb-1">Type de repas</label>
                  <select id="food-category" defaultValue="lunch" className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-semibold text-slate-dark focus:outline-none">
                    <option value="breakfast">Petit-déjeuner</option>
                    <option value="lunch">Déjeuner</option>
                    <option value="dinner">Dîner</option>
                    <option value="snack">Collation / Snack</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-muted block mb-1">Calories (kcal)</label>
                    <input type="number" id="food-cal" required placeholder="450" 
                           className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-main/30" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-muted block mb-1">Protéines (g)</label>
                    <input type="number" id="food-protein" required placeholder="35" 
                           className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-main/30" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-muted block mb-1">Glucides (g)</label>
                    <input type="number" id="food-carbs" required placeholder="40" 
                           className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-main/30" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-muted block mb-1">Lipides (g)</label>
                    <input type="number" id="food-fat" required placeholder="15" 
                           className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-main/30" />
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 bg-gradient-primary text-white font-bold text-sm rounded-2xl shadow-purple-glow mt-2">
                  Enregistrer le Repas
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Modal Workout */}
        <div id="add-workout-modal" className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 hidden flex items-end justify-center">
          <div className="bg-white w-full rounded-t-[32px] p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-dark">Enregistrer un Entraînement</h3>
              <button onClick={() => window.closeAddWorkoutModal()} className="p-1.5 text-gray-muted hover:text-slate-dark">
                <i data-lucide="x" className="w-5 h-5"></i>
              </button>
            </div>

            <form onSubmit={(e) => window.handleAddWorkout(e)} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-muted block mb-1">Type d'activité</label>
                <select id="workout-type" defaultValue="Musculation Pectoraux & Triceps" className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-semibold text-slate-dark focus:outline-none">
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
                  <input type="number" id="workout-duration" required placeholder="60" defaultValue="45" 
                         className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-muted block mb-1">Calories brûlées (kcal)</label>
                  <input type="number" id="workout-calories" required placeholder="450" defaultValue="420" 
                         className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 bg-gradient-primary text-white font-bold text-sm rounded-2xl shadow-purple-glow mt-2">
                Valider la Séance
              </button>
            </form>
          </div>
        </div>

        {/* Modal Weight */}
        <div id="add-weight-modal" className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 hidden flex items-end justify-center">
          <div className="bg-white w-full rounded-t-[32px] p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-dark">Enregistrer une Pesée</h3>
              <button onClick={() => window.closeWeightModal()} className="p-1.5 text-gray-muted hover:text-slate-dark">
                <i data-lucide="x" className="w-5 h-5"></i>
              </button>
            </div>

            <form onSubmit={(e) => window.handleAddWeight(e)} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-muted block mb-1">Poids relevé (kg)</label>
                <input type="number" step="0.1" id="new-weight-val" required placeholder="76.0" 
                       className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-sm font-bold text-slate-dark focus:outline-none focus:ring-2 focus:ring-purple-main/30" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-muted block mb-1">Date de la pesée</label>
                <input type="date" id="new-weight-date" required 
                       className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold text-slate-dark focus:outline-none" />
              </div>

              <button type="submit" className="w-full py-3.5 bg-gradient-primary text-white font-bold text-sm rounded-2xl shadow-purple-glow mt-2">
                Valider la Pesée
              </button>
            </form>
          </div>
        </div>

        {/* Modal Badge */}
        <div id="badge-modal" className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-6">
          <div className="bg-white w-full rounded-[32px] p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <i data-lucide="trophy" className="w-8 h-8" id="badge-modal-icon"></i>
            </div>
            <h3 className="text-lg font-extrabold text-slate-dark" id="badge-modal-title">Série de 14 Jours</h3>
            <p className="text-xs text-gray-muted leading-relaxed" id="badge-modal-desc">Vous avez suivi vos repas avec assiduité durant 14 jours consécutifs. Votre rigueur paie !</p>
            <button onClick={() => window.closeBadgeModal()} className="w-full py-3 bg-gradient-primary text-white font-bold text-xs rounded-2xl shadow-purple-glow">
              Génial !
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
