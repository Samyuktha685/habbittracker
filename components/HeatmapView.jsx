import React, { useState } from "react";
import { useHabit } from "../context/HabitContext";
import { ALL_100_DAYS, formatDisplayDate, formatShortDate, WEEKS_DATA } from "../utils/dateUtils";
import { MAJOR_TASKS, MINOR_TASKS, TASK_STATUS, ALL_TASKS } from "../utils/constants";
import { Grid3X3, Calendar, Flame, Trophy, Award, Sparkles, CheckCircle2 } from "lucide-react";

export const HeatmapView = ({ onSelectDateAndNavigate }) => {
  const { daysData, totalStats, currentStreak } = useHabit();
  const [hoveredDate, setHoveredDate] = useState(null);

  // Group 100 days by Month
  const monthsData = [
    { name: "September 2026 (8 Days)", days: ALL_100_DAYS.filter((d) => d.startsWith("2026-09")) },
    { name: "October 2026 (31 Days)", days: ALL_100_DAYS.filter((d) => d.startsWith("2026-10")) },
    { name: "November 2026 (30 Days)", days: ALL_100_DAYS.filter((d) => d.startsWith("2026-11")) },
    { name: "December 2026 (31 Days)", days: ALL_100_DAYS.filter((d) => d.startsWith("2026-12")) },
  ];

  // Helper to get stats for a single date
  const getDayStats = (dateStr) => {
    const day = daysData[dateStr];
    if (!day || !day.tasks) {
      return { percentage: 0, majorDone: 0, minorDone: 0, todosDone: 0, totalTodos: 0 };
    }
    let majorDone = 0;
    let minorDone = 0;

    MAJOR_TASKS.forEach((t) => {
      if (day.tasks[t.id] === TASK_STATUS.DONE) majorDone++;
    });

    MINOR_TASKS.forEach((t) => {
      if (day.tasks[t.id] === TASK_STATUS.DONE) minorDone++;
    });

    const totalTasksDone = majorDone + minorDone;
    const percentage = Math.round((totalTasksDone / ALL_TASKS.length) * 100);

    const todos = day.todos || [];
    const todosDone = todos.filter((t) => t.done).length;

    return {
      percentage,
      majorDone,
      minorDone,
      todosDone,
      totalTodos: todos.length
    };
  };

  // Heatmap color intensity class helper
  const getColorClass = (percentage) => {
    if (percentage === 0) return "bg-slate-900/90 border-slate-800 text-slate-600 hover:border-slate-600";
    if (percentage <= 30) return "bg-indigo-950/80 border-indigo-800/80 text-indigo-300 hover:border-indigo-500";
    if (percentage <= 60) return "bg-indigo-700/80 border-indigo-600 text-white hover:bg-indigo-600";
    if (percentage <= 85) return "bg-emerald-600/90 border-emerald-500 text-white hover:bg-emerald-500";
    return "bg-emerald-400 border-emerald-300 text-slate-950 font-bold shadow-md shadow-emerald-500/30 scale-105";
  };

  const handleDayClick = (dateStr) => {
    const week = WEEKS_DATA.find((w) => w.days.includes(dateStr));
    const weekId = week ? week.id : 1;
    onSelectDateAndNavigate(weekId, dateStr);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-1">
              <Sparkles className="h-4 w-4" />
              <span>100-DAY OVERALL EXECUTION HEATMAP</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              23 Sep 2026 – 31 Dec 2026 Progress Matrix
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Visual intensity map of your daily habit consistency across all 100 days. Click any tile to inspect or update that day's habits.
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex items-center space-x-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-center min-w-[110px]">
              <div className="flex items-center justify-center space-x-1 text-amber-400 text-xs font-bold mb-0.5">
                <Flame className="h-4 w-4" />
                <span>Streak</span>
              </div>
              <div className="text-xl font-extrabold text-white">{currentStreak} Days</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-center min-w-[110px]">
              <div className="flex items-center justify-center space-x-1 text-emerald-400 text-xs font-bold mb-0.5">
                <Trophy className="h-4 w-4" />
                <span>Overall %</span>
              </div>
              <div className="text-xl font-extrabold text-white">{totalStats.overallPercentage}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
          <Grid3X3 className="h-4 w-4 text-indigo-400" />
          <span>Completion Color Scale:</span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-medium">
          <span className="text-slate-400 text-[11px]">Less</span>
          
          <div className="flex items-center space-x-1.5">
            <div className="h-5 w-5 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] text-slate-500">0</div>
            <div className="h-5 w-5 rounded bg-indigo-950 border border-indigo-800 flex items-center justify-center text-[10px] text-indigo-300">25</div>
            <div className="h-5 w-5 rounded bg-indigo-700 border border-indigo-600 flex items-center justify-center text-[10px] text-white">50</div>
            <div className="h-5 w-5 rounded bg-emerald-600 border border-emerald-500 flex items-center justify-center text-[10px] text-white">75</div>
            <div className="h-5 w-5 rounded bg-emerald-400 border border-emerald-300 flex items-center justify-center text-[10px] text-slate-950 font-bold">100</div>
          </div>

          <span className="text-slate-400 text-[11px]">More (100%)</span>
        </div>
      </div>

      {/* 4 Month Grid Heatmaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {monthsData.map((month) => (
          <div 
            key={month.name}
            className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md"
          >
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2 border-b border-slate-800/80 pb-2">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <span>{month.name}</span>
            </h3>

            {/* Grid of Day Tiles */}
            <div className="grid grid-cols-7 gap-2">
              {month.days.map((dateStr) => {
                const stats = getDayStats(dateStr);
                const colorClass = getColorClass(stats.percentage);
                const dayNum = dateStr.split("-")[2];

                return (
                  <div
                    key={dateStr}
                    onClick={() => handleDayClick(dateStr)}
                    onMouseEnter={() => setHoveredDate(dateStr)}
                    onMouseLeave={() => setHoveredDate(null)}
                    className={`relative h-11 sm:h-12 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${colorClass}`}
                  >
                    <span className="text-[11px] font-bold">{dayNum}</span>
                    <span className="text-[9px] opacity-80 font-mono">
                      {stats.percentage}%
                    </span>

                    {/* Tooltip on Hover */}
                    {hoveredDate === dateStr && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-30 pointer-events-none text-left">
                        <div className="text-[11px] font-bold text-white mb-1 border-b border-slate-800 pb-1">
                          {formatDisplayDate(dateStr)}
                        </div>
                        <div className="space-y-0.5 text-[10px] text-slate-300">
                          <div className="flex justify-between">
                            <span>Major Tasks:</span>
                            <span className="font-bold text-indigo-400">{stats.majorDone}/4</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Minor Tasks:</span>
                            <span className="font-bold text-purple-400">{stats.minorDone}/7</span>
                          </div>
                          {stats.totalTodos > 0 && (
                            <div className="flex justify-between">
                              <span>To-Dos:</span>
                              <span className="font-bold text-emerald-400">{stats.todosDone}/{stats.totalTodos}</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-1 border-t border-slate-800 text-white font-bold">
                            <span>Daily Overall:</span>
                            <span>{stats.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
