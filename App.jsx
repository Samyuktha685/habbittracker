import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { HabitProvider } from "./context/HabitContext";
import { Navbar } from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { DashboardView } from "./components/DashboardView";
import { HeatmapView } from "./components/HeatmapView";
import { FirebaseConfigModal } from "./components/FirebaseConfigModal";
import { Sparkles } from "lucide-react";

const MainLayout = () => {
  const { currentUser, loading } = useAuth();

  // Active View State: "dashboard" | "heatmap"
  const [activeView, setActiveView] = useState("dashboard");
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Navigation target state passed from Heatmap click
  const [targetWeekId, setTargetWeekId] = useState(null);
  const [targetDate, setTargetDate] = useState(null);

  const handleHeatmapNavigate = (weekId, dateStr) => {
    setTargetWeekId(weekId);
    setTargetDate(dateStr);
    setActiveView("dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 animate-pulse">
          <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-indigo-400" />
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium animate-pulse">
          Loading 100-Day Habit Tracker...
        </p>
      </div>
    );
  }

  // Logged-out users CANNOT access tracker data
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        <AuthModal onOpenSetupModal={() => setIsSetupModalOpen(true)} />
        <FirebaseConfigModal
          isOpen={isSetupModalOpen}
          onClose={() => setIsSetupModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSetupModal={() => setIsSetupModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeView === "dashboard" ? (
          <DashboardView
            key={`${targetWeekId}-${targetDate}`}
            initialWeekId={targetWeekId}
            initialDate={targetDate}
          />
        ) : (
          <HeatmapView onSelectDateAndNavigate={handleHeatmapNavigate} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HabitTracker100 &copy; 2026 — 100-Day Personal Goal Sprint</span>
          <button
            onClick={() => setIsSetupModalOpen(true)}
            className="hover:text-indigo-400 transition underline"
          >
            Firebase & Firestore Security Rules Setup
          </button>
        </div>
      </footer>

      {/* Setup & Firebase Settings Modal */}
      <FirebaseConfigModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HabitProvider>
        <MainLayout />
      </HabitProvider>
    </AuthProvider>
  );
}
