import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import DashboardScreen from './components/DashboardScreen';
import TrackerScreen from './components/TrackerScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import ProfileScreen from './components/ProfileScreen';
import BottomNav from './components/BottomNav';
import FitCoachDrawer from './components/FitCoachDrawer';
import NotificationsDrawer from './components/NotificationsDrawer';
import AddFoodModal from './components/AddFoodModal';
import AddWorkoutModal from './components/AddWorkoutModal';
import AddWeightModal from './components/AddWeightModal';
import BadgeModal from './components/BadgeModal';

function ToastContainer() {
  const { toasts } = useApp();

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [toasts]);

  return (
    <div id="toast-container" className="absolute top-4 left-4 right-4 z-50 pointer-events-none flex flex-col gap-2">
      {toasts.map(toast => (
        <div key={toast.id} className="bg-slate-dark text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between border border-white/10 animate-in fade-in duration-200 pointer-events-auto">
          <span>{toast.message}</span>
          <i data-lucide="check-circle" className="w-4 h-4 text-pink-main"></i>
        </div>
      ))}
    </div>
  );
}

function MainLayout() {
  return (
    <>
      <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none z-[100]"></canvas>

      <div id="app-container" className="w-full max-w-md h-full sm:h-[860px] bg-[#F5F7FB] sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(100,90,140,0.18)] overflow-hidden flex flex-col relative">
        <ToastContainer />
        <NotificationsDrawer />
        <FitCoachDrawer />

        <div className="flex-1 overflow-y-auto no-scrollbar relative pb-36">
          <DashboardScreen />
          <TrackerScreen />
          <AnalyticsScreen />
          <ProfileScreen />
        </div>

        <BottomNav />

        <AddFoodModal />
        <AddWorkoutModal />
        <AddWeightModal />
        <BadgeModal />
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
