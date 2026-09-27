import React from "react";
import { WEEKS_DATA } from "../utils/dateUtils";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export const WeekSelector = ({ selectedWeekId, setSelectedWeekId }) => {
  const currentWeek = WEEKS_DATA.find((w) => w.id === selectedWeekId) || WEEKS_DATA[0];

  const handlePrev = () => {
    if (selectedWeekId > 1) setSelectedWeekId(selectedWeekId - 1);
  };

  const handleNext = () => {
    if (selectedWeekId < 15) setSelectedWeekId(selectedWeekId + 1);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4 mb-6 backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Active Week Info Header */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrev}
            disabled={selectedWeekId === 1}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800/80 transition"
            title="Previous Week"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">
                  Week {currentWeek.id}
                </h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {currentWeek.days.length} Days
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {currentWeek.rangeLabel}
              </p>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={selectedWeekId === 15}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800/80 transition"
            title="Next Week"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Horizontal Scrollable Week Tabs */}
        <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          <div className="flex items-center space-x-1.5 min-w-max">
            {WEEKS_DATA.map((week) => {
              const isActive = week.id === selectedWeekId;
              return (
                <button
                  key={week.id}
                  onClick={() => setSelectedWeekId(week.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex flex-col items-center ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 scale-[1.03]"
                      : "bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/60"
                  }`}
                >
                  <span>W{week.id}</span>
                  <span className="text-[9px] opacity-75 font-normal">
                    {week.id === 1 ? "8d" : week.id === 15 ? "1d" : "7d"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
