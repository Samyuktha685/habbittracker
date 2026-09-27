import React from "react";
import { useHabit } from "../context/HabitContext";
import { WEEKS_DATA, formatDisplayDate, formatShortDate, formatDateToKey } from "../utils/dateUtils";
import { MAJOR_TASKS, MINOR_TASKS, TASK_STATUS, CYCLE_STATUS } from "../utils/constants";
import { 
  Check, 
  X, 
  Minus, 
  Dumbbell, 
  BookOpen, 
  Brain, 
  Share2, 
  Droplets, 
  Footprints, 
  Sparkles, 
  Video, 
  FileText, 
  Bed, 
  Shirt,
  Award,
  Calendar
} from "lucide-react";

// Icon Renderer Map
const ICON_MAP = {
  Dumbbell,
  BookOpen,
  Brain,
  Share2,
  Droplets,
  Footprints,
  Sparkles,
  Video,
  FileText,
  Bed,
  Shirt,
};

export const HabitGrid = ({ selectedWeekId, selectedDate, setSelectedDate }) => {
  const { daysData, updateTaskStatus } = useHabit();

  const week = WEEKS_DATA.find((w) => w.id === selectedWeekId) || WEEKS_DATA[0];
  const daysInWeek = week.days;

  const renderTaskIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || Award;
    return <IconComponent className="h-4 w-4 text-indigo-400" />;
  };

  // Cell status renderer
  const renderStatusCell = (dateStr, taskId) => {
    const day = daysData[dateStr];
    const status = day?.tasks?.[taskId] || TASK_STATUS.PENDING;

    const handleCellClick = () => {
      const nextStatus = CYCLE_STATUS(status);
      updateTaskStatus(dateStr, taskId, nextStatus);
    };

    return (
      <td
        key={dateStr}
        onClick={handleCellClick}
        className="p-1.5 sm:p-2 text-center border-b border-r border-slate-800/60 cursor-pointer select-none group transition-colors hover:bg-slate-800/50"
      >
        <div className="flex items-center justify-center">
          {status === TASK_STATUS.DONE && (
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shadow-sm shadow-emerald-500/20 scale-100 group-hover:scale-110 transition-transform">
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
          )}

          {status === TASK_STATUS.MISSED && (
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 flex items-center justify-center shadow-sm shadow-red-500/20 scale-100 group-hover:scale-110 transition-transform">
              <X className="h-4 w-4 stroke-[3]" />
            </div>
          )}

          {status === TASK_STATUS.PENDING && (
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-600 group-hover:border-indigo-500/50 group-hover:text-indigo-400 flex items-center justify-center transition-all">
              <Minus className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      </td>
    );
  };

  // Calculate completion for single task row across week
  const getTaskRowCompletion = (taskId) => {
    let done = 0;
    daysInWeek.forEach((d) => {
      if (daysData[d]?.tasks?.[taskId] === TASK_STATUS.DONE) done++;
    });
    return Math.round((done / daysInWeek.length) * 100);
  };

  // Calculate day column overall completion
  const getDayColumnCompletion = (dateStr) => {
    const day = daysData[dateStr];
    if (!day || !day.tasks) return 0;
    let done = 0;
    const total = MAJOR_TASKS.length + MINOR_TASKS.length;
    [...MAJOR_TASKS, ...MINOR_TASKS].forEach((t) => {
      if (day.tasks[t.id] === TASK_STATUS.DONE) done++;
    });
    return Math.round((done / total) * 100);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl mb-6 backdrop-blur-md">
      
      {/* Table Header Info */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/50">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>Weekly Habit Execution Grid</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any cell to cycle status: <span className="text-slate-500">Pending</span> → <span className="text-emerald-400 font-semibold">Done ✓</span> → <span className="text-red-400 font-semibold">Missed ✗</span>
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <div className="h-3.5 w-3.5 rounded bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <Check className="h-2.5 w-2.5 stroke-[3]" />
            </div>
            <span className="text-slate-300 font-medium">Done</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="h-3.5 w-3.5 rounded bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
              <X className="h-2.5 w-2.5 stroke-[3]" />
            </div>
            <span className="text-slate-300 font-medium">Missed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="h-3.5 w-3.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
              <Minus className="h-2.5 w-2.5" />
            </div>
            <span className="text-slate-400">Pending</span>
          </div>
        </div>
      </div>

      {/* Overflow Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          
          {/* Table Column Headers */}
          <thead>
            <tr className="bg-slate-950/80 text-xs font-semibold text-slate-400 border-b border-slate-800">
              <th className="p-3 pl-4 border-r border-slate-800 w-56 sticky left-0 bg-slate-950 z-10 shadow-md">
                Habit / Day
              </th>
              {daysInWeek.map((dateStr) => {
                const isSelected = selectedDate === dateStr;
                const isToday = dateStr === formatDateToKey(new Date());

                return (
                  <th
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-2 sm:p-3 text-center border-r border-slate-800/80 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-indigo-600/20 text-indigo-300 border-b-2 border-b-indigo-500"
                        : "hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                        {formatShortDate(dateStr)}
                      </span>
                      <span className={`text-xs font-bold mt-0.5 ${isToday ? "text-amber-400 underline decoration-amber-400/50" : "text-slate-200"}`}>
                        {formatDisplayDate(dateStr).split(" ")[0]}
                      </span>
                    </div>
                  </th>
                );
              })}
              <th className="p-3 text-center text-slate-300 w-20">
                Row %
              </th>
            </tr>
          </thead>

          <tbody>
            
            {/* SECTION 1: MAJOR TASKS */}
            <tr className="bg-indigo-950/30 border-b border-slate-800">
              <td 
                colSpan={daysInWeek.length + 2} 
                className="p-2 pl-4 text-xs font-bold text-indigo-300 uppercase tracking-wider bg-slate-950/90"
              >
                🔥 Major Tasks (Core Priorities)
              </td>
            </tr>

            {MAJOR_TASKS.map((task) => {
              const rowPct = getTaskRowCompletion(task.id);
              return (
                <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 pl-4 border-r border-b border-slate-800/60 sticky left-0 bg-slate-900 z-10">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                        {renderTaskIcon(task.iconName)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {task.label}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {task.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  {daysInWeek.map((dateStr) => renderStatusCell(dateStr, task.id))}
                  <td className="p-3 text-center border-b border-slate-800/60 font-mono text-xs font-bold text-indigo-400 bg-slate-950/30">
                    {rowPct}%
                  </td>
                </tr>
              );
            })}

            {/* SECTION 2: MINOR TASKS */}
            <tr className="bg-purple-950/30 border-b border-slate-800">
              <td 
                colSpan={daysInWeek.length + 2} 
                className="p-2 pl-4 text-xs font-bold text-purple-300 uppercase tracking-wider bg-slate-950/90"
              >
                ✨ Minor Tasks (Daily Habits)
              </td>
            </tr>

            {MINOR_TASKS.map((task) => {
              const rowPct = getTaskRowCompletion(task.id);
              return (
                <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 pl-4 border-r border-b border-slate-800/60 sticky left-0 bg-slate-900 z-10">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                        {renderTaskIcon(task.iconName)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {task.label}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {task.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  {daysInWeek.map((dateStr) => renderStatusCell(dateStr, task.id))}
                  <td className="p-3 text-center border-b border-slate-800/60 font-mono text-xs font-bold text-purple-400 bg-slate-950/30">
                    {rowPct}%
                  </td>
                </tr>
              );
            })}

          </tbody>

          {/* TABLE FOOTER: Daily Completion % */}
          <tfoot>
            <tr className="bg-slate-950 font-bold text-xs border-t border-slate-800">
              <td className="p-3 pl-4 border-r border-slate-800 sticky left-0 bg-slate-950 z-10 text-slate-300">
                Daily Completion %
              </td>
              {daysInWeek.map((dateStr) => {
                const dayPct = getDayColumnCompletion(dateStr);
                return (
                  <td key={dateStr} className="p-2 text-center border-r border-slate-800">
                    <div className="flex flex-col items-center justify-center">
                      <span className={`font-mono text-xs ${dayPct >= 80 ? "text-emerald-400" : dayPct >= 50 ? "text-indigo-400" : "text-slate-400"}`}>
                        {dayPct}%
                      </span>
                      <div className="w-8 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                          style={{ width: `${dayPct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                );
              })}
              <td className="p-3 text-center text-emerald-400 font-mono text-xs">
                Avg
              </td>
            </tr>
          </tfoot>

        </table>
      </div>

    </div>
  );
};
