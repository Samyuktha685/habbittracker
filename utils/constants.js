export const START_DATE_STR = "2026-09-23";
export const END_DATE_STR = "2026-12-31";
export const TOTAL_DAYS_COUNT = 100;

export const TASK_STATUS = {
  PENDING: "pending",
  DONE: "done",
  MISSED: "missed",
};

export const MAJOR_TASKS = [
  { id: "workout", label: "Workout", category: "major", iconName: "Dumbbell", description: "Daily physical training" },
  { id: "reading", label: "Book Reading", category: "major", iconName: "BookOpen", description: "Read at least 20 pages" },
  { id: "skill", label: "Skill Learning", category: "major", iconName: "Brain", description: "Deep work on core skill" },
  { id: "content_posting", label: "Content Posting", category: "major", iconName: "Share2", description: "Publish daily update/content" },
];

export const MINOR_TASKS = [
  { id: "water", label: "Drink 3L Water", category: "minor", iconName: "Droplets", description: "Stay hydrated all day" },
  { id: "steps", label: "Walk 10K Steps", category: "minor", iconName: "Footprints", description: "Movement goal" },
  { id: "skincare", label: "Skincare", category: "minor", iconName: "Sparkles", description: "Morning & evening routine" },
  { id: "edit_video", label: "Edit Video", category: "minor", iconName: "Video", description: "Video editing progress" },
  { id: "write_content", label: "Write Content", category: "minor", iconName: "FileText", description: "Draft post or script" },
  { id: "clean_bed", label: "Clean Bed", category: "minor", iconName: "Bed", description: "Make bed every morning" },
  { id: "clothes", label: "Keep Clothes in Place", category: "minor", iconName: "Shirt", description: "Organize wardrobe & laundry" },
];

export const ALL_TASKS = [...MAJOR_TASKS, ...MINOR_TASKS];

export const CYCLE_STATUS = (currentStatus) => {
  if (currentStatus === TASK_STATUS.PENDING) return TASK_STATUS.DONE;
  if (currentStatus === TASK_STATUS.DONE) return TASK_STATUS.MISSED;
  return TASK_STATUS.PENDING;
};
