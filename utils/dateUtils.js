import { START_DATE_STR, END_DATE_STR, TOTAL_DAYS_COUNT } from "./constants";

// Helper to format Date to YYYY-MM-DD in local time
export const formatDateToKey = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Generate all 100 date strings
export const generateAll100Days = () => {
  const days = [];
  const start = new Date(2026, 8, 23); // Month 8 is September (0-indexed)
  for (let i = 0; i < TOTAL_DAYS_COUNT; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    days.push(formatDateToKey(current));
  }
  return days;
};

export const ALL_100_DAYS = generateAll100Days();

// Format date for UI display (e.g. "Wed, 23 Sep")
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return `${weekday} ${d} ${month}`;
};

export const formatShortDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return `${d} ${month}`;
};

// Generate week structures 1 to 15
export const WEEKS_DATA = (() => {
  const weeks = [];
  let dayIndex = 0;

  for (let weekNum = 1; weekNum <= 15; weekNum++) {
    let dayCount = 7;
    if (weekNum === 1) dayCount = 8; // Week 1 = Sep 23-30 (8 days)
    if (weekNum === 15) dayCount = 1; // Week 15 = Dec 31 (1 day)

    const weekDays = ALL_100_DAYS.slice(dayIndex, dayIndex + dayCount);
    const startDate = weekDays[0];
    const endDate = weekDays[weekDays.length - 1];

    weeks.push({
      id: weekNum,
      label: `Week ${weekNum}`,
      rangeLabel: `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`,
      days: weekDays,
      startDate,
      endDate,
    });

    dayIndex += dayCount;
  }
  return weeks;
})();

// Get default week based on today's date or start date
export const getDefaultWeekId = () => {
  const today = formatDateToKey(new Date());
  const foundWeek = WEEKS_DATA.find((w) => w.days.includes(today));
  return foundWeek ? foundWeek.id : 1;
};

// Find today's date if within 100 days, else default to first day
export const getDefaultSelectedDate = (weekId) => {
  const week = WEEKS_DATA.find((w) => w.id === weekId) || WEEKS_DATA[0];
  const today = formatDateToKey(new Date());
  if (week.days.includes(today)) return today;
  return week.days[0];
};
