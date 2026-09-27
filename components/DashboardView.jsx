import React, { useState } from "react";
import { useHabit } from "../context/HabitContext";
import { getDefaultWeekId, getDefaultSelectedDate } from "../utils/dateUtils";
import { WeekSelector } from "./WeekSelector";
import { HabitGrid } from "./HabitGrid";
import { DailyTodoPanel } from "./DailyTodoPanel";
import { WeeklySummary } from "./WeeklySummary";
import { Flame, Trophy, Target, Sparkles, Award } from "lucide-react";

export const DashboardView = ({ initialWeekId, initialDate }) => {
  const { totalStats, currentStreak } = useHabit();

  const [selectedWeekId, setSelectedWeekId] = useState(() => initialWeekId || getDefaultWeekId());
  const [selectedDate, setSelectedDate] = useState(() => initialDate || getDefaultSelectedDate(selectedWeekId));

  // Sync selected date when week changes if selected date is not in new week
  const handleWeekChange = (newWeekId) => {
    setSelectedWeekId(newWeekId);
    setSelectedDate(getDefaultSelectedDate(newWeekId));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Stats Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Stat 1: 100-Day Progress */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>100-Day Sprint</span>
              <Target className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {totalStats.overallPercentage}%
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500" 
                style={{ width: `${totalStats.overallPercentage}%` }} 
              />
            </div>
          </div>

          {/* Stat 2: Streak Counter */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Current Streak</span>
              <Flame className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {currentStreak} Days
            </div>
            <p className="text-[10px] text-slate-400 mt-1">All 4 Major tasks done</p>
          </div>

          {/* Stat 3: Major Habits Success */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Major Tasks Rate</span>
              <Trophy className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {totalStats.majorPercentage}%
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Core priorities executed</p>
          </div>

          {/* Stat 4: Minor Habits Success */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Minor Tasks Rate</span>
              <Sparkles className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-400 font-mono">
              {totalStats.minorPercentage}%
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Daily routine discipline</p>
          </div>

        </div>
      </div>

      {/* Week Selector Bar */}
      <WeekSelector
        selectedWeekId={selectedWeekId}
        setSelectedWeekId={handleWeekChange}
      />

      {/* Interactive Habit Grid */}
      <HabitGrid
        selectedWeekId={selectedWeekId}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* Daily Freeform To-Do Panel */}
      <DailyTodoPanel
        selectedWeekId={selectedWeekId}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* Weekly Analytics Summary */}
      <WeeklySummary selectedWeekId={selectedWeekId} />

    </div>
  );
};
