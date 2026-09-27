import React from "react";
import { useAuth } from "../context/AuthContext";
import { useHabit } from "../context/HabitContext";
import { 
  Flame, 
  LogOut, 
  LayoutDashboard, 
  Grid3X3, 
  Settings, 
  CloudCheck, 
  CloudOff, 
  Sparkles,
  UserCheck
} from "lucide-react";

export const Navbar = ({ activeView, setActiveView, onOpenSetupModal }) => {
  const { currentUser, logout, isFirebaseConfigured } = useAuth();
  const { currentStreak, syncing } = useHabit();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-extrabold bg-gradient-to-r from-white via-indigo-100 to-slate-300 bg-clip-text text-transparent">
              HabitTracker<span className="text-indigo-500">100</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">100-Day Discipline Sprint</p>
          </div>
        </div>

        {/* View Switcher Tabs (Desktop) */}
        <div className="hidden md:flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800/80 shadow-inner space-x-1">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeView === "dashboard"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Weekly Tracker</span>
          </button>
          
          <button
            onClick={() => setActiveView("heatmap")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeView === "heatmap"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            <span>100-Day Heatmap</span>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Streak Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-sm">
            <Flame className={`h-4 w-4 text-amber-500 ${currentStreak > 0 ? "animate-bounce" : ""}`} />
            <span className="text-xs font-bold">{currentStreak} Day Streak</span>
          </div>

          {/* Sync / Firebase Status Pill */}
          <button
            onClick={onOpenSetupModal}
            title={isFirebaseConfigured ? "Connected to Firebase Firestore" : "Using Local Demo Storage - Click to configure Firebase"}
            className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isFirebaseConfigured 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" 
                : "bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {isFirebaseConfigured ? (
              <>
                <CloudCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{syncing ? "Syncing..." : "Cloud Firestore"}</span>
              </>
            ) : (
              <>
                <CloudOff className="h-3.5 w-3.5 text-amber-400" />
                <span>Setup Firebase</span>
              </>
            )}
          </button>

          {/* Settings / Config Button */}
          <button
            onClick={onOpenSetupModal}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition"
            title="Firebase & App Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* User Account Info & Logout */}
          <div className="flex items-center pl-2 border-l border-slate-800 space-x-2">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-medium text-slate-200 truncate max-w-[140px]">
                {currentUser?.email || "User"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentUser?.isDemo ? "Demo User" : "Firebase Auth"}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold transition"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden mt-3 bg-slate-950 p-1 rounded-xl border border-slate-800 justify-between">
        <button
          onClick={() => setActiveView("dashboard")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold ${
            activeView === "dashboard"
              ? "bg-indigo-600 text-white"
              : "text-slate-400"
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span>Weekly Tracker</span>
        </button>
        <button
          onClick={() => setActiveView("heatmap")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold ${
            activeView === "heatmap"
              ? "bg-indigo-600 text-white"
              : "text-slate-400"
          }`}
        >
          <Grid3X3 className="h-3.5 w-3.5" />
          <span>100-Day Heatmap</span>
        </button>
      </div>
    </header>
  );
};
