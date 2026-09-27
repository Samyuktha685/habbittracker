import React from "react";
import { useHabit } from "../context/HabitContext";
import { WEEKS_DATA } from "../utils/dateUtils";
import { MAJOR_TASKS, MINOR_TASKS, TASK_STATUS, ALL_TASKS } from "../utils/constants";
import { BarChart3, TrendingUp, CheckCircle2, AlertCircle, Target, Award } from "lucide-react";

export const WeeklySummary = ({ selectedWeekId }) => {
  const { daysData } = useHabit();

  const week = WEEKS_DATA.find((w) => w.id === selectedWeekId) || WEEKS_DATA[0];
  const daysInWeek = week.days;
  const totalDays = daysInWeek.length;

  // Calculate stats for current week
  let totalTasksPossible = totalDays * ALL_TASKS.length;
  let totalTasksDone = 0;

  let majorTasksPossible = totalDays * MAJOR_TASKS.length;
  let majorTasksDone = 0;

  let minorTasksPossible = totalDays * MINOR_TASKS.length;
  let minorTasksDone = 0;

  // Task-by-task breakdown: { [taskId]: { doneCount, pct } }
  const taskBreakdown = {};
  ALL_TASKS.forEach((t) => {
    let count = 0;
    daysInWeek.forEach((d) => {
      if (daysData[d]?.tasks?.[t.id] === TASK_STATUS.DONE) count++;
    });
    taskBreakdown[t.id] = {
      label: t.label,
      category: t.category,
      doneCount: count,
      percentage: Math.round((count / totalDays) * 100)
    };

    if (t.category === "major") majorTasksDone += count;
    else minorTasksDone += count;
    totalTasksDone += count;
  });

  const overallPct = Math.round((totalTasksDone / totalTasksPossible) * 100);
  const majorPct = Math.round((majorTasksDone / majorTasksPossible) * 100);
  const minorPct = Math.round((minorTasksDone / minorTasksPossible) * 100);

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl mb-6 backdrop-blur-md">
      
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-800 mb-5">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">
            Week {week.id} Analytics & Progress Summary
          </h3>
          <p className="text-xs text-slate-400">
            Completion metrics for {week.rangeLabel} ({totalDays} Days)
          </p>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        
        {/* Overall Week KPI */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Overall Week Goal
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {overallPct}%
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {totalTasksDone} of {totalTasksPossible} tasks executed
            </p>
          </div>
          <div className="h-12 w-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center font-mono font-bold text-xs text-indigo-400">
            {overallPct}%
          </div>
        </div>

        {/* Major Habits KPI */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
              Major Tasks Rate
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {majorPct}%
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {majorTasksDone} of {majorTasksPossible} core habits
            </p>
          </div>
          <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
            {majorPct}%
          </div>
        </div>

        {/* Minor Habits KPI */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
              Minor Tasks Rate
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {minorPct}%
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {minorTasksDone} of {minorTasksPossible} daily routines
            </p>
          </div>
          <div className="h-12 w-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 flex items-center justify-center font-mono font-bold text-xs text-purple-400">
            {minorPct}%
          </div>
        </div>

      </div>

      {/* Habit Completion Progress Bars */}
      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
        Per-Task Completion Breakdown
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {ALL_TASKS.map((t) => {
          const stats = taskBreakdown[t.id];
          return (
            <div key={t.id} className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-200">
                  {t.label}
                </span>
                <span className="font-mono text-slate-400">
                  {stats.doneCount}/{totalDays} ({stats.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    t.category === "major"
                      ? "bg-gradient-to-r from-indigo-500 to-emerald-400"
                      : "bg-gradient-to-r from-purple-500 to-pink-400"
                  }`}
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
