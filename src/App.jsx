import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Global State & Helpers
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
          window.renderWeightChart();
          window.renderWeeklyCalChart();
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
        btnLogin.className = "flex-1 py-2 text-xs font-bold rounded-xl bg-white text-slate-dark shadow-sm transition-all";
        btnRegister.className = "flex-1 py-2 text-xs font-bold rounded-xl text-gray-muted hover:text-slate-dark transition-all";
        fieldName.classList.add('hidden');
        submitBtn.querySelector('span').innerText = "Se Connecter";
      } else {
        btnRegister.className = "flex-1 py-2 text-xs font-bold rounded-xl bg-white text-slate-dark shadow-sm transition-all";
        btnLogin.className = "flex-1 py-2 text-xs font-bold rounded-xl text-gray-muted hover:text-slate-dark transition-all";
        fieldName.classList.remove('hidden');
        submitBtn.querySelector('span').innerText = "Créer mon Compte";
      }
    };

    window.handleAuthSubmit = function(e) {
      e.preventDefault();
      const email = document.getElementById('auth-input-email').value;
      const name = document.getElementById('auth-input-name').value || "Alexandre M.";
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
        document.getElementById('active-routine-name').innerText = routineNames[type];
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
      document.getElementById('water-status').innerText = `${appState.water.toFixed(2)} L / ${appState.waterTarget.toFixed(2)} L`;
      document.getElementById('water-slider').value = appState.water;
    };

    window.toggleFastingTimer = function() {
      appState.fastingActive = !appState.fastingActive;
      const btn = document.getElementById('fasting-btn');
      const label = document.getElementById('fasting-status-label');
      if (appState.fastingActive) {
        btn.innerText = "Stopper";
        label.innerText = "Période de Jeûne en cours";
        window.showToast("Jeûne démarré");
      } else {
        btn.innerText = "Démarrer";
        label.innerText = "Jeûne en pause";
        window.showToast("Jeûne interrompu");
      }
      saveStateToStorage();
    };

    window.toggleFitCoachDrawer = function() {
      document.getElementById('fitcoach-drawer').classList.toggle('hidden');
    };

    window.askFitCoach = function(questionText) {
      document.getElementById('fitcoach-input').value = questionText;
      window.sendFitCoachMessage();
    };

    window.sendFitCoachMessage = function() {
      const input = document.getElementById('fitcoach-input');
      const text = input.value.trim();
      if (!text) return;

      const history = document.getElementById('fitcoach-chat-history');

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
        btnManual.className = "flex-1 py-1.5 rounded-xl bg-white text-purple-main shadow-sm";
        btnScanner.className = "flex-1 py-1.5 rounded-xl text-gray-muted flex items-center justify-center gap-1";
        containerManual.classList.remove('hidden');
        containerScanner.classList.add('hidden');
      } else {
        btnScanner.className = "flex-1 py-1.5 rounded-xl bg-white text-purple-main shadow-sm flex items-center justify-center gap-1";
        btnManual.className = "flex-1 py-1.5 rounded-xl text-gray-muted";
        containerScanner.classList.remove('hidden');
        containerManual.classList.add('hidden');
      }
    };

    window.applyFoodPreset = function(name, category, cal, protein, carbs, fat) {
      document.getElementById('food-name').value = name;
      document.getElementById('food-category').value = category;
      document.getElementById('food-cal').value = cal;
      document.getElementById('food-protein').value = protein;
      document.getElementById('food-carbs').value = carbs;
      document.getElementById('food-fat').value = fat;
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
          <button onclick="deleteMeal(${meal.id})" class="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
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

    window.openAddFoodModal = function() { document.getElementById('add-food-modal').classList.remove('hidden'); };
    window.closeAddFoodModal = function() { document.getElementById('add-food-modal').classList.add('hidden'); };

    window.handleAddFood = function(e) {
      e.preventDefault();
      const name = document.getElementById('food-name').value;
      const category = document.getElementById('food-category').value;
      const cal = parseInt(document.getElementById('food-cal').value);
      const protein = parseInt(document.getElementById('food-protein').value);
      const carbs = parseInt(document.getElementById('food-carbs').value);
      const fat = parseInt(document.getElementById('food-fat').value);

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

    window.openAddWorkoutModal = function() { document.getElementById('add-workout-modal').classList.remove('hidden'); };
    window.closeAddWorkoutModal = function() { document.getElementById('add-workout-modal').classList.add('hidden'); };

    window.handleAddWorkout = function(e) {
      e.preventDefault();
      const name = document.getElementById('workout-type').value;
      const duration = parseInt(document.getElementById('workout-duration').value);
      const calBurned = parseInt(document.getElementById('workout-calories').value);

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

    window.openWeightModal = function() { document.getElementById('add-weight-modal').classList.remove('hidden'); };
    window.closeWeightModal = function() { document.getElementById('add-weight-modal').classList.add('hidden'); };

    window.handleAddWeight = function(e) {
      e.preventDefault();
      const val = parseFloat(document.getElementById('new-weight-val').value);
      const dateStr = document.getElementById('new-weight-date').value || "Aujourd'hui";

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
            <button onclick="deleteWeightEntry(${realIdx})" class="text-gray-300 hover:text-red-500">
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
      document.getElementById('header-user-name').innerText = appState.user.name;
      document.getElementById('dash-current-weight').innerText = appState.user.currentWeight.toFixed(1);
      document.getElementById('dash-target-weight').innerText = appState.user.targetWeight.toFixed(1);

      const rem = (appState.user.currentWeight - appState.user.targetWeight).toFixed(1);
      document.getElementById('dash-weight-rem').innerHTML = `<i data-lucide="target" class="w-3 h-3"></i> Reste ${rem} kg`;

      const left = Math.max(0, appState.targetCal - appState.consumedCal);
      document.getElementById('dash-cal-left').innerText = left;

      document.getElementById('p-val').innerText = appState.protein;
      document.getElementById('p-target').innerText = appState.proteinTarget;
      document.getElementById('p-bar').style.width = `${Math.min(100, (appState.protein / appState.proteinTarget) * 100)}%`;

      document.getElementById('c-val').innerText = appState.carbs;
      document.getElementById('c-target').innerText = appState.carbsTarget;
      document.getElementById('c-bar').style.width = `${Math.min(100, (appState.carbs / appState.carbsTarget) * 100)}%`;

      document.getElementById('f-val').innerText = appState.fat;
      document.getElementById('f-target').innerText = appState.fatTarget;
      document.getElementById('f-bar').style.width = `${Math.min(100, (appState.fat / appState.fatTarget) * 100)}%`;

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

      document.getElementById('tracker-cal-consumed').innerText = appState.consumedCal;
      document.getElementById('tracker-cal-target').innerText = appState.targetCal;
      document.getElementById('target-display-sm').innerText = `${appState.targetCal} kcal`;
      document.getElementById('tracker-status-label').innerText = `${Math.round((appState.consumedCal / appState.targetCal) * 100)}% atteint`;

      document.getElementById('analytics-current-weight').innerText = `${appState.user.currentWeight} kg`;

      window.updateWaterUI();
      window.renderMealsList();
      window.renderWorkoutsList();
      window.renderWeightHistoryList();
      window.calculateHealthMetrics();

      if (window.lucide) window.lucide.createIcons();
    };

    window.updateUserProfileUI = function() {
      document.getElementById('edit-user-name').value = appState.user.name;
      document.getElementById('edit-user-height').value = appState.user.height;
      document.getElementById('edit-user-age').value = appState.user.age;
      document.getElementById('edit-user-gender').value = appState.user.gender;
      document.getElementById('edit-user-weight').value = appState.user.currentWeight;
      document.getElementById('edit-user-target-weight').value = appState.user.targetWeight;
      document.getElementById('profile-name-display').innerText = appState.user.name;
      document.getElementById('profile-email-display').innerText = appState.user.email;
    };

    window.saveUserProfile = function() {
      appState.user.name = document.getElementById('edit-user-name').value;
      appState.user.height = parseInt(document.getElementById('edit-user-height').value);
      appState.user.age = parseInt(document.getElementById('edit-user-age').value);
      appState.user.gender = document.getElementById('edit-user-gender').value;
      appState.user.currentWeight = parseFloat(document.getElementById('edit-user-weight').value);
      appState.user.targetWeight = parseFloat(document.getElementById('edit-user-target-weight').value);

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
      document.getElementById('notifications-drawer').classList.toggle('hidden');
    };

    window.showBadgeModal = function(type) {
      const modal = document.getElementById('badge-modal');
      const title = document.getElementById('badge-modal-title');
      const desc = document.getElementById('badge-modal-desc');

      if (type === 'streak') {
        title.innerText = 'Série de 14 Jours';
        desc.innerText = 'Vous avez suivi vos repas avec assiduité durant 14 jours consécutifs. Votre rigueur paie !';
      } else {
        title.innerText = 'Cap des -2 kg Franchi';
        desc.innerText = 'Excellente progression ! Vous avez perdu 2.1 kg depuis votre première pesée.';
      }
      modal.classList.remove('hidden');
    };

    window.closeBadgeModal = function() {
      document.getElementById('badge-modal').classList.add('hidden');
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

    // Initialize UI
    window.changeTheme(appState.theme || 'default', false);
    window.updateAllUI();
    window.updateUserProfileUI();
    if (window.lucide) window.lucide.createIcons();
  }, []);

  return (
    <>
      <canvas id="confetti-canvas" class="fixed inset-0 pointer-events-none z-[100]"></canvas>

      <div id="app-container" class="w-full max-w-md h-full sm:h-[860px] bg-[#F5F7FB] sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(100,90,140,0.18)] overflow-hidden flex flex-col relative">

        <div id="toast-container" class="absolute top-4 left-4 right-4 z-50 pointer-events-none flex flex-col gap-2"></div>

        {/* Notifications Drawer */}
        <div id="notifications-drawer" class="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 hidden flex flex-col justify-start">
          <div class="bg-white rounded-b-[28px] p-5 shadow-2xl space-y-4 animate-in slide-in-from-top duration-300">
            <div class="flex justify-between items-center pb-2 border-b border-gray-100">
              <div class="flex items-center space-x-2">
                <i data-lucide="bell" class="w-5 h-5 text-purple-main"></i>
                <h3 class="text-sm font-bold text-slate-dark">Notifications FitPulse</h3>
              </div>
              <button onclick="window.toggleNotificationsDrawer()" class="p-1.5 text-gray-muted hover:text-slate-dark">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <div class="space-y-2.5 max-h-64 overflow-y-auto no-scrollbar">
              <div class="p-3 bg-purple-50/60 rounded-2xl flex items-start space-x-3">
                <div class="p-2 bg-purple-100 text-purple-main rounded-xl mt-0.5">
                  <i data-lucide="trophy" class="w-4 h-4"></i>
                </div>
                <div class="flex-1">
                  <h4 class="text-xs font-bold text-slate-dark">Nouveau Badge Débloqué !</h4>
                  <p class="text-[11px] text-gray-600">Vous avez atteint 14 jours consécutifs de suivi nutritionnel.</p>
                  <span class="text-[9px] text-gray-muted font-semibold mt-1 block">Il y a 2 heures</span>
                </div>
              </div>

              <div class="p-3 bg-blue-50/60 rounded-2xl flex items-start space-x-3">
                <div class="p-2 bg-blue-100 text-blue-600 rounded-xl mt-0.5">
                  <i data-lucide="droplet" class="w-4 h-4"></i>
                </div>
                <div class="flex-1">
                  <h4 class="text-xs font-bold text-slate-dark">Rappel Hydratation</h4>
                  <p class="text-[11px] text-gray-600">Pensez à boire 250ml d'eau pour atteindre vos 2.5L aujourd'hui.</p>
                  <span class="text-[9px] text-gray-muted font-semibold mt-1 block">Il y a 4 heures</span>
                </div>
              </div>
            </div>

            <button onclick="window.toggleNotificationsDrawer()" class="w-full py-2.5 bg-gray-100 text-slate-dark font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors">
              Fermer
            </button>
          </div>
        </div>

        {/* FitCoach AI Drawer */}
        <div id="fitcoach-drawer" class="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 hidden flex flex-col justify-end">
          <div class="bg-white rounded-t-[32px] p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300 h-[80%] flex flex-col">
            <div class="flex justify-between items-center pb-2 border-b border-gray-100">
              <div class="flex items-center space-x-2.5">
                <div class="p-2 bg-gradient-primary text-white rounded-2xl shadow-purple-glow">
                  <i data-lucide="sparkles" class="w-5 h-5"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-dark">FitCoach AI Chat</h3>
                  <span class="text-[10px] text-emerald-500 font-semibold">● En ligne</span>
                </div>
              </div>
              <button onclick="window.toggleFitCoachDrawer()" class="p-1.5 text-gray-muted hover:text-slate-dark">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <div id="fitcoach-chat-history" class="flex-1 overflow-y-auto space-y-3 no-scrollbar p-1">
              <div class="bg-[#F5F7FB] p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed text-slate-dark">
                👋 Bonjour Alexandre ! Je suis votre coach personnel propulsé par l'IA. Comment puis-je vous aider aujourd'hui ?
              </div>
            </div>

            <div class="flex space-x-2 overflow-x-auto no-scrollbar py-1 text-[10px] font-bold">
              <button onclick="window.askFitCoach('Quel repas prendre après ma séance ?')" class="px-3 py-1.5 bg-purple-50 text-purple-main rounded-xl flex-shrink-0">
                🥗 Idée repas post-workout
              </button>
              <button onclick="window.askFitCoach('Comment optimiser ma sèche ?')" class="px-3 py-1.5 bg-pink-50 text-pink-main rounded-xl flex-shrink-0">
                🔥 Conseil sèche rapide
              </button>
              <button onclick="window.askFitCoach('Calcule ma masse grasse idéale')" class="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0">
                📊 Calcul de masse grasse
              </button>
            </div>

            <div class="flex items-center space-x-2 pt-2 border-t border-gray-100">
              <input type="text" id="fitcoach-input" placeholder="Posez une question à votre coach..." 
                     class="flex-1 px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-main/30"
                     onkeydown="if(event.key==='Enter') window.sendFitCoachMessage()" />
              <button onclick="window.sendFitCoachMessage()" class="p-3 bg-gradient-primary text-white rounded-2xl shadow-purple-glow">
                <i data-lucide="send" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Main Screens Container */}
        <div class="flex-1 overflow-y-auto no-scrollbar relative pb-36">

          {/* SCREEN 0: LOGIN */}
          <section id="screen-login" class="screen-view min-h-full flex flex-col justify-end p-6 relative">
            <div class="absolute inset-0 z-0 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop" 
                   alt="Sport background" class="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.1]" />
              <div class="absolute inset-0 bg-gradient-to-t from-[#6C5CE7]/95 via-[#6C5CE7]/40 to-transparent"></div>
            </div>

            <div class="relative z-10 text-white mb-6 pt-8">
              <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
                FitPulse AI v3.0
              </span>
              <h1 class="text-3xl font-extrabold leading-tight">Sculptez votre<br/>corps idéal.</h1>
              <p class="text-white/80 text-xs mt-1">Suivi nutritionnel, jeûne & performances sportives.</p>
            </div>

            <div class="relative z-10 bg-white/95 backdrop-blur-xl rounded-[28px] p-6 shadow-soft-card border border-white">
              <div class="flex bg-[#F5F7FB] p-1 rounded-2xl mb-5">
                <button onclick="window.toggleAuthTab('login')" id="tab-btn-login" class="flex-1 py-2 text-xs font-bold rounded-xl bg-white text-slate-dark shadow-sm transition-all">
                  Connexion
                </button>
                <button onclick="window.toggleAuthTab('register')" id="tab-btn-register" class="flex-1 py-2 text-xs font-bold rounded-xl text-gray-muted hover:text-slate-dark transition-all">
                  Inscription
                </button>
              </div>

              <form id="login-form" onsubmit="window.handleAuthSubmit(event)" class="space-y-3.5">
                <div id="field-name" class="hidden">
                  <div class="relative flex items-center">
                    <i data-lucide="user" class="w-4 h-4 absolute left-4 text-violet-soft"></i>
                    <input type="text" id="auth-input-name" defaultValue="Alexandre M." 
                           class="w-full pl-11 pr-4 py-3 bg-[#F5F7FB] border border-transparent focus:border-purple-main/30 rounded-2xl text-xs font-medium focus:outline-none transition-all"
                           placeholder="Prénom & Nom" />
                  </div>
                </div>

                <div>
                  <div class="relative flex items-center">
                    <i data-lucide="mail" class="w-4 h-4 absolute left-4 text-violet-soft"></i>
                    <input type="email" id="auth-input-email" required defaultValue="alex.athlete@fitpulse.app" 
                           class="w-full pl-11 pr-4 py-3 bg-[#F5F7FB] border border-transparent focus:border-purple-main/30 rounded-2xl text-xs font-medium focus:outline-none transition-all"
                           placeholder="Adresse email" />
                  </div>
                </div>

                <div>
                  <div class="relative flex items-center">
                    <i data-lucide="lock" class="w-4 h-4 absolute left-4 text-violet-soft"></i>
                    <input type="password" required defaultValue="••••••••••••" 
                           class="w-full pl-11 pr-4 py-3 bg-[#F5F7FB] border border-transparent focus:border-purple-main/30 rounded-2xl text-xs font-medium focus:outline-none transition-all"
                           placeholder="Mot de passe" />
                  </div>
                </div>

                <button type="submit" id="auth-submit-btn"
                        class="w-full py-3.5 bg-gradient-primary text-white font-bold text-sm rounded-2xl shadow-purple-glow active:scale-[0.98] transition-transform flex items-center justify-center gap-2 mt-2">
                  <span>Se Connecter</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
              </form>

              <div class="mt-4 text-center">
                <button onclick="window.handleQuickDemo()" class="text-xs font-semibold text-purple-main hover:underline">
                  Accès rapide Démo (Sans connexion)
                </button>
              </div>
            </div>
          </section>

          {/* SCREEN 1: DASHBOARD */}
          <section id="screen-dashboard" class="screen-view screen-hidden p-5 space-y-5">
            <div class="flex items-center justify-between pt-1">
              <div class="flex items-center space-x-3 cursor-pointer" onclick="window.switchScreen('screen-profile')">
                <div class="relative">
                  <img id="header-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                       alt="Avatar" class="w-11 h-11 rounded-2xl object-cover ring-2 ring-pink-main/30 shadow-sm" />
                  <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <span class="text-[11px] font-medium text-gray-muted block">Ravi de vous voir,</span>
                  <h2 id="header-user-name" class="text-base font-bold text-slate-dark leading-none">Alexandre M.</h2>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button onclick="window.toggleFitCoachDrawer()" class="p-2.5 bg-gradient-primary text-white rounded-2xl shadow-purple-glow hover:opacity-95 transition-all flex items-center gap-1.5">
                  <i data-lucide="sparkles" class="w-4 h-4"></i>
                  <span class="text-xs font-bold">FitCoach</span>
                </button>

                <button onclick="window.toggleNotificationsDrawer()" class="relative p-2.5 bg-white rounded-2xl shadow-soft-card text-gray-muted hover:text-slate-dark transition-colors">
                  <i data-lucide="bell" class="w-5 h-5 text-purple-main"></i>
                  <span class="absolute top-2 right-2 w-2 h-2 bg-pink-main rounded-full"></span>
                </button>
              </div>
            </div>

            <div class="bg-gradient-primary text-white p-4 rounded-[28px] shadow-purple-glow flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-sm">
                  Nv.4
                </div>
                <div>
                  <span class="text-[10px] uppercase font-bold text-white/80 tracking-wider">Rang Actuel</span>
                  <h4 class="text-xs font-extrabold text-white">Athlète Bronze (850 / 1000 XP)</h4>
                  <div class="w-36 h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
                    <div class="h-full bg-white rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
              <button onclick="window.showToast('Remplissez vos objectifs quotidiens pour passer Nv.5 !')" class="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-xl backdrop-blur-md">
                +150 XP
              </button>
            </div>

            <div onclick="window.switchScreen('screen-analytics')" class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white/60 cursor-pointer hover:border-purple-main/20 transition-all">
              <div class="grid grid-cols-2 gap-4 divide-x divide-gray-100">
                <div class="pr-2">
                  <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-muted block mb-0.5">Poids Actuel</span>
                  <div class="flex items-baseline space-x-1">
                    <span class="text-2xl font-extrabold text-slate-dark" id="dash-current-weight">76.4</span>
                    <span class="text-xs font-semibold text-gray-muted">kg</span>
                  </div>
                  <span class="text-[10px] font-semibold text-emerald-500 inline-flex items-center gap-0.5 mt-1">
                    <i data-lucide="trending-down" class="w-3 h-3"></i> -0.8 kg cette semaine
                  </span>
                </div>

                <div class="pl-4">
                  <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-muted block mb-0.5">Objectif Sèche</span>
                  <div class="flex items-baseline space-x-1">
                    <span class="text-2xl font-extrabold text-slate-dark" id="dash-target-weight">73.0</span>
                    <span class="text-xs font-semibold text-gray-muted">kg</span>
                  </div>
                  <span class="text-[10px] font-semibold text-purple-main inline-flex items-center gap-0.5 mt-1" id="dash-weight-rem">
                    <i data-lucide="target" class="w-3 h-3"></i> Reste 3.4 kg
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-2 px-1">
                <h3 class="text-xs font-bold text-slate-dark uppercase tracking-wider">Routines Métaboliques</h3>
                <span class="text-[11px] text-purple-main font-semibold" id="active-routine-name">Training Day</span>
              </div>
              <div class="flex space-x-2.5 overflow-x-auto no-scrollbar pb-1">
                <button onclick="window.setActiveRoutine('training')" id="routine-training" 
                        class="routine-btn flex-shrink-0 px-4 py-3 rounded-2xl bg-gradient-primary text-white shadow-pill-active flex items-center space-x-2.5 transition-all">
                  <div class="p-1.5 bg-white/20 rounded-xl">
                    <i data-lucide="dumbbell" class="w-4 h-4 text-white"></i>
                  </div>
                  <div class="text-left">
                    <span class="text-xs font-bold block leading-tight">Training Day</span>
                    <span class="text-[10px] opacity-90 block">2 500 kcal</span>
                  </div>
                </button>

                <button onclick="window.setActiveRoutine('rest')" id="routine-rest" 
                        class="routine-btn flex-shrink-0 px-4 py-3 rounded-2xl bg-white text-slate-dark shadow-soft-card border border-gray-100 flex items-center space-x-2.5 transition-all">
                  <div class="p-1.5 bg-purple-100 rounded-xl">
                    <i data-lucide="coffee" class="w-4 h-4 text-purple-main"></i>
                  </div>
                  <div class="text-left">
                    <span class="text-xs font-bold block leading-tight">Jour Repos</span>
                    <span class="text-[10px] text-gray-muted block">2 000 kcal</span>
                  </div>
                </button>

                <button onclick="window.setActiveRoutine('cut')" id="routine-cut" 
                        class="routine-btn flex-shrink-0 px-4 py-3 rounded-2xl bg-white text-slate-dark shadow-soft-card border border-gray-100 flex items-center space-x-2.5 transition-all">
                  <div class="p-1.5 bg-pink-100 rounded-xl">
                    <i data-lucide="flame" class="w-4 h-4 text-pink-main"></i>
                  </div>
                  <div class="text-left">
                    <span class="text-xs font-bold block leading-tight">Sèche Express</span>
                    <span class="text-[10px] text-gray-muted block">1 800 kcal</span>
                  </div>
                </button>

                <button onclick="window.setActiveRoutine('cheat')" id="routine-cheat" 
                        class="routine-btn flex-shrink-0 px-4 py-3 rounded-2xl bg-white text-slate-dark shadow-soft-card border border-gray-100 flex items-center space-x-2.5 transition-all">
                  <div class="p-1.5 bg-amber-100 rounded-xl">
                    <i data-lucide="utensils" class="w-4 h-4 text-amber-600"></i>
                  </div>
                  <div class="text-left">
                    <span class="text-xs font-bold block leading-tight">Cheat Day</span>
                    <span class="text-[10px] text-gray-muted block">2 900 kcal</span>
                  </div>
                </button>
              </div>
            </div>

            <div class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white/60">
              <div class="flex justify-between items-center mb-3">
                <div>
                  <h3 class="text-sm font-bold text-slate-dark">Bilan Nutritionnel</h3>
                  <p class="text-[10px] text-gray-muted" id="current-date-label">Aujourd'hui</p>
                </div>
                <button onclick="window.switchScreen('screen-tracker')" class="text-xs font-bold text-purple-main hover:text-pink-main transition-colors flex items-center gap-1">
                  <span>Ajuster</span>
                  <i data-lucide="chevron-right" class="w-4 h-4"></i>
                </button>
              </div>

              <div class="flex items-center justify-between">
                <div class="relative w-28 h-28 flex items-center justify-center">
                  <svg class="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#F0F2FA" strokeWidth="10" fill="transparent" />
                    <circle id="dash-circle-progress" class="gauge-circle" cx="50" cy="50" r="40" 
                            stroke="url(#dashGradient)" strokeWidth="10" strokeLinecap="round" fill="transparent" 
                            strokeDasharray="251.2" strokeDashoffset="80" />
                    <defs>
                      <linearGradient id="dashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-primary)" />
                        <stop offset="100%" stopColor="var(--color-secondary)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span class="text-[10px] text-gray-muted font-medium">Restant</span>
                    <span class="text-lg font-extrabold text-slate-dark leading-tight" id="dash-cal-left">820</span>
                    <span class="text-[9px] font-bold text-purple-main uppercase">kcal</span>
                  </div>
                </div>

                <div class="flex-1 pl-5 space-y-2.5">
                  <div>
                    <div class="flex justify-between text-[11px] font-semibold mb-1">
                      <span class="text-slate-dark">Protéines</span>
                      <span class="text-purple-main"><span id="p-val">120</span> / <span id="p-target">160</span>g</span>
                    </div>
                    <div class="w-full h-2 bg-[#F0F2FA] rounded-full overflow-hidden">
                      <div id="p-bar" class="h-full bg-gradient-primary rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between text-[11px] font-semibold mb-1">
                      <span class="text-slate-dark">Glucides</span>
                      <span class="text-pink-main"><span id="c-val">180</span> / <span id="c-target">240</span>g</span>
                    </div>
                    <div class="w-full h-2 bg-[#F0F2FA] rounded-full overflow-hidden">
                      <div id="c-bar" class="h-full bg-gradient-pill rounded-full transition-all duration-500" style={{ width: '70%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between text-[11px] font-semibold mb-1">
                      <span class="text-slate-dark">Lipides</span>
                      <span class="text-amber-500"><span id="f-val">48</span> / <span id="f-target">65</span>g</span>
                    </div>
                    <div class="w-full h-2 bg-[#F0F2FA] rounded-full overflow-hidden">
                      <div id="f-bar" class="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white/60">
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center space-x-2.5">
                  <div class="p-2 bg-purple-50 text-purple-main rounded-2xl">
                    <i data-lucide="timer" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-dark">Jeûne Intermittent 16:8</h3>
                    <span class="text-xs text-gray-muted" id="fasting-status-label">Période de Jeûne en cours</span>
                  </div>
                </div>
                <button onclick="window.toggleFastingTimer()" id="fasting-btn" class="px-3 py-1.5 bg-gradient-primary text-white font-bold text-xs rounded-xl shadow-purple-glow">
                  Stopper
                </button>
              </div>

              <div class="flex items-center justify-between pt-2">
                <div class="flex-1 bg-[#F5F7FB] p-2.5 rounded-2xl text-center mr-2">
                  <span class="text-[9px] font-bold text-gray-muted block uppercase">Temps Écoulé</span>
                  <span class="text-sm font-extrabold text-slate-dark" id="fasting-elapsed">11h 24m</span>
                </div>
                <div class="flex-1 bg-purple-50 p-2.5 rounded-2xl text-center ml-2">
                  <span class="text-[9px] font-bold text-purple-main block uppercase">Restant (Cible 16h)</span>
                  <span class="text-sm font-extrabold text-purple-main" id="fasting-remaining">04h 36m</span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white/60">
              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center space-x-2.5">
                  <div class="p-2 bg-pink-50 text-pink-main rounded-2xl">
                    <i data-lucide="flame" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-dark">Entraînements du jour</h3>
                    <span class="text-xs text-gray-muted" id="workout-summary-text">1 séance • -450 kcal</span>
                  </div>
                </div>
                <button onclick="window.openAddWorkoutModal()" class="px-3 py-1.5 bg-pink-50 text-pink-main font-bold text-xs rounded-xl hover:bg-pink-100 transition-colors flex items-center gap-1">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i> Ajouter
                </button>
              </div>

              <div id="workout-list" class="space-y-2"></div>
            </div>

            <div class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white/60">
              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center space-x-2.5">
                  <div class="p-2 bg-blue-50 text-blue-500 rounded-2xl">
                    <i data-lucide="droplet" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-dark">Hydratation</h3>
                    <span class="text-xs text-gray-muted" id="water-status">1.75 L / 2.50 L</span>
                  </div>
                </div>
                <div class="flex items-center space-x-1.5">
                  <button onclick="window.addWater(-0.25)" class="px-2.5 py-1.5 bg-gray-100 text-slate-dark font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors">
                    -250ml
                  </button>
                  <button onclick="window.addWater(0.25)" class="px-3 py-1.5 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1">
                    <i data-lucide="plus" class="w-3.5 h-3.5"></i> 250ml
                  </button>
                </div>
              </div>

              <div class="mt-2">
                <input type="range" id="water-slider" min="0" max="4.0" step="0.25" defaultValue="1.75" oninput="window.updateWaterFromSlider(this.value)" />
                <div class="flex justify-between text-[10px] text-gray-muted font-semibold mt-1">
                  <span>0L</span>
                  <span>1.5L</span>
                  <span>2.5L (Objectif)</span>
                  <span>4.0L</span>
                </div>
              </div>
            </div>

            <div class="space-y-2.5">
              <div class="flex justify-between items-center px-1">
                <h3 class="text-xs font-bold text-slate-dark uppercase tracking-wider">Repas enregistrés</h3>
                <button onclick="window.openAddFoodModal()" class="text-xs font-bold text-purple-main flex items-center gap-1">
                  <i data-lucide="plus-circle" class="w-4 h-4"></i> Ajouter
                </button>
              </div>

              <div class="flex space-x-1.5 overflow-x-auto no-scrollbar text-[11px] font-semibold">
                <button onclick="window.filterMeals('all')" id="meal-filter-all" class="px-3 py-1 rounded-xl bg-purple-main text-white">Tous</button>
                <button onclick="window.filterMeals('breakfast')" id="meal-filter-breakfast" class="px-3 py-1 rounded-xl bg-white text-gray-muted shadow-sm">Petit-déj</button>
                <button onclick="window.filterMeals('lunch')" id="meal-filter-lunch" class="px-3 py-1 rounded-xl bg-white text-gray-muted shadow-sm">Déjeuner</button>
                <button onclick="window.filterMeals('dinner')" id="meal-filter-dinner" class="px-3 py-1 rounded-xl bg-white text-gray-muted shadow-sm">Dîner</button>
                <button onclick="window.filterMeals('snack')" id="meal-filter-snack" class="px-3 py-1 rounded-xl bg-white text-gray-muted shadow-sm">Snacks</button>
              </div>

              <div id="logged-meals-list" class="space-y-2"></div>
            </div>
          </section>

          {/* SCREEN 2: TRACKER */}
          <section id="screen-tracker" class="screen-view screen-hidden p-5 space-y-5">
            <div class="flex items-center justify-between pt-1">
              <button onclick="window.switchScreen('screen-dashboard')" class="p-2.5 bg-white rounded-2xl shadow-soft-card text-gray-muted hover:text-slate-dark">
                <i data-lucide="arrow-left" class="w-5 h-5"></i>
              </button>
              <h2 class="text-base font-bold text-slate-dark">Contrôle Nutritionnel</h2>
              <button onclick="window.openAddFoodModal()" class="p-2.5 bg-white rounded-2xl shadow-soft-card text-purple-main">
                <i data-lucide="plus" class="w-5 h-5"></i>
              </button>
            </div>

            <div class="bg-white rounded-[32px] p-6 shadow-soft-card border border-white/80 text-center relative overflow-hidden">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-muted block mb-1">Cadran Énergétique</span>

              <div class="relative w-56 h-56 mx-auto my-2 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="78" stroke="#F5F7FB" strokeWidth="16" fill="none" strokeLinecap="round" />
                  <circle id="tracker-gauge-circle" class="gauge-circle" cx="100" cy="100" r="78" 
                          stroke="url(#trackerGradient)" strokeWidth="16" fill="none" strokeLinecap="round"
                          strokeDasharray="490" strokeDashoffset="180" />
                  <defs>
                    <linearGradient id="trackerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primary)" />
                      <stop offset="100%" stopColor="var(--color-secondary)" />
                    </linearGradient>
                  </defs>
                </svg>

                <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span class="text-3xl font-extrabold text-slate-dark tracking-tight" id="tracker-cal-consumed">1 680</span>
                  <span class="text-xs font-bold text-purple-main uppercase tracking-widest mt-0.5">/ <span id="tracker-cal-target">2 500</span> kcal</span>
                  
                  <div class="mt-2 px-3 py-1 bg-pink-50 rounded-full flex items-center space-x-1">
                    <i data-lucide="flame" class="w-3.5 h-3.5 text-pink-main"></i>
                    <span class="text-[11px] font-bold text-pink-main" id="tracker-status-label">67% atteint</span>
                  </div>
                </div>
              </div>

              <div class="flex justify-center items-center space-x-6 mt-3">
                <button onclick="window.adjustCalorieTarget(-100)" class="w-11 h-11 rounded-2xl bg-[#F5F7FB] text-slate-dark font-extrabold text-xl flex items-center justify-center hover:bg-purple-100 transition-colors shadow-sm active:scale-95">
                  -
                </button>
                <div class="text-center">
                  <span class="text-[10px] text-gray-muted font-bold block uppercase">Cible Quotidienne</span>
                  <span class="text-sm font-extrabold text-slate-dark" id="target-display-sm">2500 kcal</span>
                </div>
                <button onclick="window.adjustCalorieTarget(100)" class="w-11 h-11 rounded-2xl bg-[#F5F7FB] text-slate-dark font-extrabold text-xl flex items-center justify-center hover:bg-purple-100 transition-colors shadow-sm active:scale-95">
                  +
                </button>
              </div>

              <div class="flex justify-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <button onclick="window.quickAddCalories(100)" class="px-3 py-1.5 bg-purple-50 text-purple-main font-bold text-xs rounded-xl hover:bg-purple-100 transition-colors">
                  +100 kcal
                </button>
                <button onclick="window.quickAddCalories(250)" class="px-3 py-1.5 bg-purple-50 text-purple-main font-bold text-xs rounded-xl hover:bg-purple-100 transition-colors">
                  +250 kcal
                </button>
                <button onclick="window.quickAddCalories(500)" class="px-3 py-1.5 bg-pink-50 text-pink-main font-bold text-xs rounded-xl hover:bg-pink-100 transition-colors">
                  +500 kcal
                </button>
              </div>
            </div>

            <div class="bg-white rounded-[28px] p-4 shadow-soft-card border border-white">
              <span class="text-xs font-bold text-slate-dark block mb-3 px-1">Répartition des Macronutriments</span>
              <div class="grid grid-cols-3 gap-2">
                <button onclick="window.setMacroMode('high-protein')" id="macro-btn-protein" 
                        class="p-3 rounded-2xl bg-gradient-primary text-white text-center shadow-pill-active transition-all">
                  <i data-lucide="shield-check" class="w-5 h-5 mx-auto mb-1"></i>
                  <span class="text-xs font-bold block">Protéiné</span>
                  <span class="text-[9px] opacity-80">40P / 40G / 20L</span>
                </button>

                <button onclick="window.setMacroMode('balanced')" id="macro-btn-balanced" 
                        class="p-3 rounded-2xl bg-[#F5F7FB] text-slate-dark text-center transition-all hover:bg-gray-100">
                  <i data-lucide="scale" class="w-5 h-5 mx-auto mb-1 text-purple-main"></i>
                  <span class="text-xs font-bold block">Équilibré</span>
                  <span class="text-[9px] text-gray-muted">30P / 50G / 20L</span>
                </button>

                <button onclick="window.setMacroMode('keto')" id="macro-btn-keto" 
                        class="p-3 rounded-2xl bg-[#F5F7FB] text-slate-dark text-center transition-all hover:bg-gray-100">
                  <i data-lucide="zap" class="w-5 h-5 mx-auto mb-1 text-pink-main"></i>
                  <span class="text-xs font-bold block">Low Carb</span>
                  <span class="text-[9px] text-gray-muted">35P / 15G / 50L</span>
                </button>
              </div>
            </div>

            <div class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-slate-dark">Dépense physique du jour</span>
                <span class="text-xs font-extrabold text-purple-main" id="activity-level-text">Intense (+650 kcal)</span>
              </div>
              <input type="range" min="1" max="4" defaultValue="3" id="activity-slider" oninput="window.updateActivityLevel(this.value)" />
              <div class="flex justify-between text-[9px] font-bold text-gray-muted mt-2 uppercase">
                <span>Repos</span>
                <span>Léger</span>
                <span>Intense</span>
                <span>Extrême</span>
              </div>
            </div>
          </section>

          {/* SCREEN 3: ANALYTICS */}
          <section id="screen-analytics" class="screen-view screen-hidden p-5 space-y-5">
            <div class="flex items-center justify-between pt-1">
              <button onclick="window.switchScreen('screen-dashboard')" class="p-2.5 bg-white rounded-2xl shadow-soft-card text-gray-muted">
                <i data-lucide="arrow-left" class="w-5 h-5"></i>
              </button>
              <h2 class="text-base font-bold text-slate-dark">Progression & Analytics</h2>
              <button onclick="window.openWeightModal()" class="p-2.5 bg-gradient-primary text-white rounded-2xl shadow-purple-glow">
                <i data-lucide="plus" class="w-5 h-5"></i>
              </button>
            </div>

            <div class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white">
              <div class="flex justify-between items-center mb-3">
                <div>
                  <span class="text-xs font-bold text-gray-muted block">Évolution du Poids</span>
                  <div class="flex items-baseline space-x-2">
                    <span class="text-2xl font-extrabold text-slate-dark" id="analytics-current-weight">76.4 kg</span>
                    <span class="text-xs font-bold text-emerald-500" id="analytics-weight-diff">-2.1 kg</span>
                  </div>
                </div>
                
                <div class="flex bg-[#F5F7FB] p-1 rounded-xl text-[10px] font-bold">
                  <button onclick="window.setWeightGraphFilter('7d')" id="filter-7d" class="px-2.5 py-1 rounded-lg text-gray-muted">7J</button>
                  <button onclick="window.setWeightGraphFilter('30d')" id="filter-30d" class="px-2.5 py-1 rounded-lg bg-white text-purple-main shadow-sm">30J</button>
                  <button onclick="window.setWeightGraphFilter('90d')" id="filter-90d" class="px-2.5 py-1 rounded-lg text-gray-muted">90J</button>
                </div>
              </div>

              <div class="relative w-full h-40 mt-2">
                <canvas id="weightCanvas" class="w-full h-full"></canvas>
              </div>
            </div>

            <div class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white">
              <div class="flex justify-between items-center mb-2">
                <div>
                  <h3 class="text-xs font-bold text-slate-dark uppercase tracking-wider">Calories Consommées vs Cible</h3>
                  <span class="text-[10px] text-gray-muted">Moyenne cette semaine : 2 240 kcal</span>
                </div>
                <span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold text-[10px] rounded-lg">92% Réussite</span>
              </div>

              <div class="relative w-full h-36 mt-3">
                <canvas id="weeklyCalCanvas" class="w-full h-full"></canvas>
              </div>
            </div>

            <div class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white space-y-3">
              <div class="flex justify-between items-center">
                <h3 class="text-xs font-bold text-slate-dark uppercase tracking-wider">Historique des pesées</h3>
                <button onclick="window.openWeightModal()" class="text-xs font-bold text-purple-main">+ Nouvelle pesée</button>
              </div>
              
              <div id="weight-history-list" class="space-y-2 max-h-48 overflow-y-auto no-scrollbar"></div>
            </div>

            <div class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white">
              <h3 class="text-xs font-bold text-slate-dark mb-3 uppercase tracking-wider">Récompenses & Discipline</h3>
              
              <div class="grid grid-cols-2 gap-3">
                <div onclick="window.showBadgeModal('streak')" class="p-3 bg-[#F5F7FB] rounded-2xl flex items-center space-x-3 cursor-pointer hover:bg-purple-50 transition-colors">
                  <div class="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                    <i data-lucide="award" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <span class="text-xs font-extrabold text-slate-dark block">14 Jours</span>
                    <span class="text-[10px] text-gray-muted">Série de Log</span>
                  </div>
                </div>

                <div onclick="window.showBadgeModal('loss')" class="p-3 bg-[#F5F7FB] rounded-2xl flex items-center space-x-3 cursor-pointer hover:bg-pink-50 transition-colors">
                  <div class="p-2.5 bg-pink-100 text-pink-main rounded-xl">
                    <i data-lucide="zap" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <span class="text-xs font-extrabold text-slate-dark block">-2.1 kg</span>
                    <span class="text-[10px] text-gray-muted">Perte Totale</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white space-y-2.5">
              <h3 class="text-xs font-bold text-slate-dark uppercase tracking-wider">Indicateurs Physiologiques</h3>
              
              <div class="flex justify-between items-center py-2 border-b border-gray-50 text-xs">
                <span class="text-gray-muted font-medium">Métabolisme de Base (MB)</span>
                <span class="font-bold text-slate-dark" id="bmr-val">1 740 kcal/j</span>
              </div>

              <div class="flex justify-between items-center py-2 border-b border-gray-50 text-xs">
                <span class="text-gray-muted font-medium">Dépense Totale (TDEE)</span>
                <span class="font-bold text-purple-main" id="tdee-val">2 480 kcal/j</span>
              </div>

              <div class="flex justify-between items-center py-2 text-xs">
                <span class="text-gray-muted font-medium">Indice de Masse Corporelle (IMC)</span>
                <span class="font-bold text-emerald-500" id="bmi-val">23.6 (Normal)</span>
              </div>
            </div>
          </section>

          {/* SCREEN 4: PROFILE */}
          <section id="screen-profile" class="screen-view screen-hidden p-5 space-y-5">
            <div class="flex items-center justify-between pt-1">
              <button onclick="window.switchScreen('screen-dashboard')" class="p-2.5 bg-white rounded-2xl shadow-soft-card text-gray-muted">
                <i data-lucide="arrow-left" class="w-5 h-5"></i>
              </button>
              <h2 class="text-base font-bold text-slate-dark">Mon Profil</h2>
              <button onclick="window.saveUserProfile()" class="p-2.5 bg-gradient-primary text-white rounded-2xl shadow-purple-glow">
                <i data-lucide="check" class="w-5 h-5"></i>
              </button>
            </div>

            <div class="bg-white rounded-[28px] p-6 shadow-soft-card border border-white text-center">
              <div class="relative w-20 h-20 mx-auto mb-3">
                <img id="profile-page-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                     alt="Avatar" class="w-full h-full rounded-3xl object-cover ring-4 ring-purple-main/20 shadow-md" />
                <button onclick="window.showToast('Option photo active')" class="absolute -bottom-1 -right-1 p-1.5 bg-gradient-primary text-white rounded-xl shadow-md">
                  <i data-lucide="camera" class="w-3.5 h-3.5"></i>
                </button>
              </div>
              <h3 class="text-lg font-extrabold text-slate-dark" id="profile-name-display">Alexandre M.</h3>
              <p class="text-xs text-purple-main font-semibold" id="profile-email-display">alex.athlete@fitpulse.app</p>
            </div>

            <div class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white space-y-3">
              <h3 class="text-xs font-bold text-slate-dark uppercase tracking-wider">Thème Visuel</h3>
              <div class="grid grid-cols-3 gap-2">
                <button onclick="window.changeTheme('default')" class="p-2.5 rounded-2xl border-2 border-purple-main bg-purple-50 flex flex-col items-center">
                  <div class="w-6 h-6 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#FD79A8] mb-1"></div>
                  <span class="text-[10px] font-bold text-slate-dark">Violet/Rose</span>
                </button>
                <button onclick="window.changeTheme('emerald')" class="p-2.5 rounded-2xl border-2 border-transparent bg-gray-50 flex flex-col items-center hover:bg-emerald-50">
                  <div class="w-6 h-6 rounded-full bg-gradient-to-r from-[#00B894] to-[#00CEC9] mb-1"></div>
                  <span class="text-[10px] font-bold text-slate-dark">Émeraude</span>
                </button>
                <button onclick="window.changeTheme('sunset')" class="p-2.5 rounded-2xl border-2 border-transparent bg-gray-50 flex flex-col items-center hover:bg-orange-50">
                  <div class="w-6 h-6 rounded-full bg-gradient-to-r from-[#FF7675] to-[#E17055] mb-1"></div>
                  <span class="text-[10px] font-bold text-slate-dark">Sunset</span>
                </button>
              </div>
            </div>

            <div class="bg-white rounded-[28px] p-5 shadow-soft-card border border-white space-y-4">
              <h3 class="text-xs font-bold text-slate-dark uppercase tracking-wider">Données Physiologiques</h3>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[10px] font-bold text-gray-muted block mb-1">Prénom / Nom</label>
                  <input type="text" id="edit-user-name" defaultValue="Alexandre M." 
                         class="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-muted block mb-1">Taille (cm)</label>
                  <input type="number" id="edit-user-height" defaultValue="180" 
                         class="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[10px] font-bold text-gray-muted block mb-1">Âge (ans)</label>
                  <input type="number" id="edit-user-age" defaultValue="26" 
                         class="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-muted block mb-1">Genre</label>
                  <select id="edit-user-gender" defaultValue="male" class="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none">
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[10px] font-bold text-gray-muted block mb-1">Poids Actuel (kg)</label>
                  <input type="number" step="0.1" id="edit-user-weight" defaultValue="76.4" 
                         class="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-muted block mb-1">Objectif Poids (kg)</label>
                  <input type="number" step="0.1" id="edit-user-target-weight" defaultValue="73.0" 
                         class="w-full px-3.5 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-bold text-slate-dark focus:outline-none" />
                </div>
              </div>

              <button onclick="window.saveUserProfile()" class="w-full py-3 bg-gradient-primary text-white font-bold text-xs rounded-2xl shadow-purple-glow mt-2">
                Enregistrer les modifications
              </button>
            </div>

            <button onclick="window.handleResetData()" class="w-full py-3 bg-gray-100 text-gray-600 font-bold text-xs rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
              <span>Réinitialiser la journée</span>
            </button>

            <button onclick="window.handleLogout()" class="w-full py-3 bg-red-50 text-red-500 font-bold text-xs rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
              <i data-lucide="log-out" class="w-4 h-4"></i>
              <span>Déconnexion</span>
            </button>
          </section>

        </div>

        {/* Floating Bottom Nav */}
        <nav id="bottom-nav" class="absolute bottom-3 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-3xl p-2 shadow-soft-card border border-white/80 flex justify-around items-center z-40">
          <button onclick="window.switchScreen('screen-dashboard')" id="nav-dashboard" 
                  class="nav-btn flex flex-col items-center p-2 text-purple-main transition-colors">
            <i data-lucide="layout-grid" class="w-5 h-5"></i>
            <span class="text-[9px] font-bold mt-1">Accueil</span>
          </button>

          <button onclick="window.switchScreen('screen-tracker')" id="nav-tracker" 
                  class="nav-btn flex flex-col items-center p-2 text-gray-muted hover:text-purple-main transition-colors">
            <i data-lucide="pie-chart" class="w-5 h-5"></i>
            <span class="text-[9px] font-bold mt-1">Calories</span>
          </button>

          <button onclick="window.openAddFoodModal()" 
                  class="w-11 h-11 bg-gradient-primary text-white rounded-2xl shadow-purple-glow flex items-center justify-center -mt-5 active:scale-90 transition-transform">
            <i data-lucide="plus" class="w-6 h-6"></i>
          </button>

          <button onclick="window.switchScreen('screen-analytics')" id="nav-analytics" 
                  class="nav-btn flex flex-col items-center p-2 text-gray-muted hover:text-purple-main transition-colors">
            <i data-lucide="line-chart" class="w-5 h-5"></i>
            <span class="text-[9px] font-bold mt-1">Analytics</span>
          </button>

          <button onclick="window.switchScreen('screen-profile')" id="nav-profile" 
                  class="nav-btn flex flex-col items-center p-2 text-gray-muted hover:text-purple-main transition-colors">
            <i data-lucide="user" class="w-5 h-5"></i>
            <span class="text-[9px] font-bold mt-1">Profil</span>
          </button>
        </nav>

        {/* Modal Add Food */}
        <div id="add-food-modal" class="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 hidden flex items-end justify-center">
          <div class="bg-white w-full rounded-t-[32px] p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85%] overflow-y-auto no-scrollbar">
            <div class="flex justify-between items-center">
              <h3 class="text-base font-bold text-slate-dark">Ajouter un Aliment</h3>
              <button onclick="window.closeAddFoodModal()" class="p-1.5 text-gray-muted hover:text-slate-dark">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <div class="flex bg-[#F5F7FB] p-1 rounded-2xl text-xs font-bold">
              <button onclick="window.toggleFoodInputTab('manual')" id="food-tab-manual" class="flex-1 py-1.5 rounded-xl bg-white text-purple-main shadow-sm">Saisie / Presets</button>
              <button onclick="window.toggleFoodInputTab('scanner')" id="food-tab-scanner" class="flex-1 py-1.5 rounded-xl text-gray-muted flex items-center justify-center gap-1">
                <i data-lucide="camera" class="w-3.5 h-3.5"></i>
                <span>Scan Repas IA</span>
              </button>
            </div>

            <div id="food-scanner-container" class="hidden space-y-3">
              <div class="relative w-full h-44 bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center text-center p-4">
                <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop" 
                     alt="Scan meal" class="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div class="absolute inset-x-0 h-1 bg-gradient-primary shadow-lg scanner-laser"></div>
                <div class="relative z-10 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl text-white">
                  <i data-lucide="scan" class="w-6 h-6 mx-auto mb-1 animate-pulse text-pink-main"></i>
                  <span class="text-[11px] font-bold block">Pointez votre assiette ou code-barres</span>
                </div>
              </div>
              <button onclick="window.simulateIAScan()" class="w-full py-3 bg-gradient-primary text-white font-bold text-xs rounded-2xl shadow-purple-glow">
                Lancer l'Analyse IA Instantanée
              </button>
            </div>

            <div id="food-manual-container" class="space-y-3">
              <div>
                <span class="text-[10px] font-bold text-gray-muted block mb-1.5 uppercase">Aliments Populaires (1-Clic)</span>
                <div class="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                  <button onclick="window.applyFoodPreset('Blanc de Poulet (150g)', 'lunch', 240, 46, 0, 4)" class="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                    🍗 Poulet (150g)
                  </button>
                  <button onclick="window.applyFoodPreset('Riz Basmati Cuit (200g)', 'lunch', 260, 5, 56, 1)" class="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                    🍚 Riz (200g)
                  </button>
                  <button onclick="window.applyFoodPreset('Œufs Durs (x2)', 'breakfast', 155, 13, 1, 11)" class="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                    🥚 2 Œufs
                  </button>
                  <button onclick="window.applyFoodPreset('Shaker Whey (30g)', 'snack', 120, 24, 2, 2)" class="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                    🥤 Whey (30g)
                  </button>
                  <button onclick="window.applyFoodPreset('Flocons d\'Avoine (60g)', 'breakfast', 230, 8, 40, 4)" class="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                    🥣 Avoine (60g)
                  </button>
                </div>
              </div>

              <form onsubmit="window.handleAddFood(event)" class="space-y-3">
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <label class="text-[10px] font-bold text-gray-muted block">Nom de l'aliment</label>
                  </div>
                  <input type="text" id="food-name" required placeholder="ex: Omelette & Avocat" 
                         class="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-main/30" />
                </div>

                <div>
                  <label class="text-[10px] font-bold text-gray-muted block mb-1">Type de repas</label>
                  <select id="food-category" defaultValue="lunch" class="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-semibold text-slate-dark focus:outline-none">
                    <option value="breakfast">Petit-déjeuner</option>
                    <option value="lunch">Déjeuner</option>
                    <option value="dinner">Dîner</option>
                    <option value="snack">Collation / Snack</option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-[10px] font-bold text-gray-muted block mb-1">Calories (kcal)</label>
                    <input type="number" id="food-cal" required placeholder="450" 
                           class="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-main/30" />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-gray-muted block mb-1">Protéines (g)</label>
                    <input type="number" id="food-protein" required placeholder="35" 
                           class="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-main/30" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-[10px] font-bold text-gray-muted block mb-1">Glucides (g)</label>
                    <input type="number" id="food-carbs" required placeholder="40" 
                           class="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-main/30" />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-gray-muted block mb-1">Lipides (g)</label>
                    <input type="number" id="food-fat" required placeholder="15" 
                           class="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-main/30" />
                  </div>
                </div>

                <button type="submit" class="w-full py-3.5 bg-gradient-primary text-white font-bold text-sm rounded-2xl shadow-purple-glow mt-2">
                  Enregistrer le Repas
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Modal Workout */}
        <div id="add-workout-modal" class="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 hidden flex items-end justify-center">
          <div class="bg-white w-full rounded-t-[32px] p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div class="flex justify-between items-center">
              <h3 class="text-base font-bold text-slate-dark">Enregistrer un Entraînement</h3>
              <button onclick="window.closeAddWorkoutModal()" class="p-1.5 text-gray-muted hover:text-slate-dark">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <form onsubmit="window.handleAddWorkout(event)" class="space-y-3">
              <div>
                <label class="text-[10px] font-bold text-gray-muted block mb-1">Type d'activité</label>
                <select id="workout-type" defaultValue="Musculation Pectoraux & Triceps" class="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-semibold text-slate-dark focus:outline-none">
                  <option value="Musculation Pectoraux & Triceps">Musculation (Pecs/Triceps)</option>
                  <option value="Musculation Dos & Biceps">Musculation (Dos/Biceps)</option>
                  <option value="Séance Jambes & Abdos">Musculation (Legday)</option>
                  <option value="Course à pied (5km)">Course à pied</option>
                  <option value="Session HIIT Cardio">Session HIIT</option>
                  <option value="Natation 45min">Natation</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[10px] font-bold text-gray-muted block mb-1">Durée (minutes)</label>
                  <input type="number" id="workout-duration" required placeholder="60" defaultValue="45" 
                         class="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none" />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-muted block mb-1">Calories brûlées (kcal)</label>
                  <input type="number" id="workout-calories" required placeholder="450" defaultValue="420" 
                         class="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none" />
                </div>
              </div>

              <button type="submit" class="w-full py-3.5 bg-gradient-primary text-white font-bold text-sm rounded-2xl shadow-purple-glow mt-2">
                Valider la Séance
              </button>
            </form>
          </div>
        </div>

        {/* Modal Weight */}
        <div id="add-weight-modal" class="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 hidden flex items-end justify-center">
          <div class="bg-white w-full rounded-t-[32px] p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div class="flex justify-between items-center">
              <h3 class="text-base font-bold text-slate-dark">Enregistrer une Pesée</h3>
              <button onclick="window.closeWeightModal()" class="p-1.5 text-gray-muted hover:text-slate-dark">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>

            <form onsubmit="window.handleAddWeight(event)" class="space-y-3">
              <div>
                <label class="text-[10px] font-bold text-gray-muted block mb-1">Poids relevé (kg)</label>
                <input type="number" step="0.1" id="new-weight-val" required placeholder="76.0" 
                       class="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-sm font-bold text-slate-dark focus:outline-none focus:ring-2 focus:ring-purple-main/30" />
              </div>

              <div>
                <label class="text-[10px] font-bold text-gray-muted block mb-1">Date de la pesée</label>
                <input type="date" id="new-weight-date" required 
                       class="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold text-slate-dark focus:outline-none" />
              </div>

              <button type="submit" class="w-full py-3.5 bg-gradient-primary text-white font-bold text-sm rounded-2xl shadow-purple-glow mt-2">
                Valider la Pesée
              </button>
            </form>
          </div>
        </div>

        {/* Modal Badge */}
        <div id="badge-modal" class="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-6">
          <div class="bg-white w-full rounded-[32px] p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <i data-lucide="trophy" class="w-8 h-8" id="badge-modal-icon"></i>
            </div>
            <h3 class="text-lg font-extrabold text-slate-dark" id="badge-modal-title">Série de 14 Jours</h3>
            <p class="text-xs text-gray-muted leading-relaxed" id="badge-modal-desc">Vous avez suivi vos repas avec assiduité durant 14 jours consécutifs. Votre rigueur paie !</p>
            <button onclick="window.closeBadgeModal()" class="w-full py-3 bg-gradient-primary text-white font-bold text-xs rounded-2xl shadow-purple-glow">
              Génial !
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
