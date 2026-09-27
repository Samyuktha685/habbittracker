import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { 
  db, 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  isFirebaseConfigured 
} from "../firebase/config";
import { ALL_100_DAYS, WEEKS_DATA, formatDateToKey } from "../utils/dateUtils";
import { MAJOR_TASKS, MINOR_TASKS, TASK_STATUS, ALL_TASKS } from "../utils/constants";

const HabitContext = createContext();

export const useHabit = () => useContext(HabitContext);

export const HabitProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  // Local state holding object map: { [dateStr]: { tasks: { [taskId]: status }, todos: [ {id, text, done} ] } }
  const [daysData, setDaysData] = useState({});
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Helper for localStorage cache per UID
  const getLocalStorageKey = useCallback(() => `habbit_tracker_data_${uid || "guest"}`, [uid]);

  // Load initial local data or subscribe to Firestore
  useEffect(() => {
    if (!uid) {
      setDaysData({});
      return;
    }

    // Load cached local data first for instant render
    let cached = {};
    try {
      const localStr = localStorage.getItem(getLocalStorageKey());
      if (localStr) cached = JSON.parse(localStr);
    } catch (e) {
      console.error("Error reading local cache", e);
    }
    setDaysData(cached);

    // Subscribe to Firestore if Firebase configured and non-demo user
    if (isFirebaseConfigured && !currentUser.isDemo) {
      setSyncing(true);
      const userDaysColRef = collection(db, "users", uid, "days");
      
      const unsubscribe = onSnapshot(userDaysColRef, (snapshot) => {
        const remoteData = { ...cached };
        snapshot.docs.forEach((docSnap) => {
          remoteData[docSnap.id] = docSnap.data();
        });
        setDaysData(remoteData);
        try {
          localStorage.setItem(getLocalStorageKey(), JSON.stringify(remoteData));
        } catch (e) {
          console.error("Error writing cache", e);
        }
        setSyncing(false);
      }, (err) => {
        console.error("Firestore snapshot error:", err);
        setError("Failed to sync with cloud. Offline mode active.");
        setSyncing(false);
      });

      return () => unsubscribe();
    }
  }, [uid, currentUser?.isDemo, getLocalStorageKey]);

  // Helper to persist single date updates (Firestore + LocalStorage)
  const persistDayData = async (dateStr, updatedDayObj) => {
    // 1. Optimistic local state update
    const newDaysData = {
      ...daysData,
      [dateStr]: updatedDayObj
    };
    setDaysData(newDaysData);

    // 2. LocalStorage cache
    try {
      localStorage.setItem(getLocalStorageKey(), JSON.stringify(newDaysData));
    } catch (e) {
      console.error("Failed to save local state", e);
    }

    // 3. Firestore Sync if logged into Firebase
    if (isFirebaseConfigured && uid && !currentUser.isDemo) {
      try {
        const dayDocRef = doc(db, "users", uid, "days", dateStr);
        await setDoc(dayDocRef, {
          ...updatedDayObj,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Failed to sync to Firestore:", err);
        setError("Network error syncing changes.");
      }
    }
  };

  // Toggle/Cycle task status for a specific date
  const updateTaskStatus = useCallback((dateStr, taskId, newStatus) => {
    const existingDay = daysData[dateStr] || { tasks: {}, todos: [] };
    const updatedTasks = {
      ...existingDay.tasks,
      [taskId]: newStatus
    };
    const updatedDayObj = {
      ...existingDay,
      date: dateStr,
      tasks: updatedTasks
    };
    persistDayData(dateStr, updatedDayObj);
  }, [daysData, uid]);

  // To-Do items CRUD for a date
  const addTodoItem = useCallback((dateStr, text) => {
    if (!text || !text.trim()) return;
    const existingDay = daysData[dateStr] || { tasks: {}, todos: [] };
    const newTodo = {
      id: "todo_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      text: text.trim(),
      done: false,
      createdAt: new Date().toISOString()
    };
    const updatedTodos = [...(existingDay.todos || []), newTodo];
    const updatedDayObj = {
      ...existingDay,
      date: dateStr,
      todos: updatedTodos
    };
    persistDayData(dateStr, updatedDayObj);
  }, [daysData, uid]);

  const toggleTodoDone = useCallback((dateStr, todoId) => {
    const existingDay = daysData[dateStr] || { tasks: {}, todos: [] };
    const updatedTodos = (existingDay.todos || []).map((t) => 
      t.id === todoId ? { ...t, done: !t.done } : t
    );
    const updatedDayObj = {
      ...existingDay,
      date: dateStr,
      todos: updatedTodos
    };
    persistDayData(dateStr, updatedDayObj);
  }, [daysData, uid]);

  const editTodoText = useCallback((dateStr, todoId, newText) => {
    const existingDay = daysData[dateStr] || { tasks: {}, todos: [] };
    const updatedTodos = (existingDay.todos || []).map((t) => 
      t.id === todoId ? { ...t, text: newText } : t
    );
    const updatedDayObj = {
      ...existingDay,
      date: dateStr,
      todos: updatedTodos
    };
    persistDayData(dateStr, updatedDayObj);
  }, [daysData, uid]);

  const deleteTodoItem = useCallback((dateStr, todoId) => {
    const existingDay = daysData[dateStr] || { tasks: {}, todos: [] };
    const updatedTodos = (existingDay.todos || []).filter((t) => t.id !== todoId);
    const updatedDayObj = {
      ...existingDay,
      date: dateStr,
      todos: updatedTodos
    };
    persistDayData(dateStr, updatedDayObj);
  }, [daysData, uid]);

  // Calculate day completion % (Tasks done out of total 11 tasks)
  const getDayCompletionStats = useCallback((dateStr) => {
    const day = daysData[dateStr];
    if (!day || !day.tasks) return { doneCount: 0, totalCount: ALL_TASKS.length, percentage: 0 };
    let doneCount = 0;
    ALL_TASKS.forEach((t) => {
      if (day.tasks[t.id] === TASK_STATUS.DONE) doneCount++;
    });
    const percentage = Math.round((doneCount / ALL_TASKS.length) * 100);
    return { doneCount, totalCount: ALL_TASKS.length, percentage };
  }, [daysData]);

  // Calculate Streak: consecutive days where ALL 4 major tasks were completed
  const currentStreak = useMemo(() => {
    let streak = 0;
    // Iterate through 100 days
    for (let i = 0; i < ALL_100_DAYS.length; i++) {
      const dateStr = ALL_100_DAYS[i];
      const day = daysData[dateStr];
      if (!day || !day.tasks) {
        // If no data for this day yet, streak ends if past, or breaks if we haven't reached today
        break;
      }
      const allMajorDone = MAJOR_TASKS.every((t) => day.tasks[t.id] === TASK_STATUS.DONE);
      if (allMajorDone) {
        streak++;
      } else {
        // Only count consecutive days up to first incomplete day
        streak = 0;
      }
    }
    return streak;
  }, [daysData]);

  // Total 100-day overall statistics
  const totalStats = useMemo(() => {
    let totalDone = 0;
    let totalPossible = ALL_100_DAYS.length * ALL_TASKS.length; // 100 * 11 = 1100 tasks
    let majorDone = 0;
    let totalMajorPossible = ALL_100_DAYS.length * MAJOR_TASKS.length; // 400
    let minorDone = 0;
    let totalMinorPossible = ALL_100_DAYS.length * MINOR_TASKS.length; // 700

    ALL_100_DAYS.forEach((dateStr) => {
      const day = daysData[dateStr];
      if (day && day.tasks) {
        MAJOR_TASKS.forEach((t) => {
          if (day.tasks[t.id] === TASK_STATUS.DONE) {
            totalDone++;
            majorDone++;
          }
        });
        MINOR_TASKS.forEach((t) => {
          if (day.tasks[t.id] === TASK_STATUS.DONE) {
            totalDone++;
            minorDone++;
          }
        });
      }
    });

    return {
      overallPercentage: Math.round((totalDone / totalPossible) * 100),
      totalDone,
      totalPossible,
      majorPercentage: Math.round((majorDone / totalMajorPossible) * 100),
      minorPercentage: Math.round((minorDone / totalMinorPossible) * 100),
    };
  }, [daysData]);

  const value = {
    daysData,
    syncing,
    error,
    updateTaskStatus,
    addTodoItem,
    toggleTodoDone,
    editTodoText,
    deleteTodoItem,
    getDayCompletionStats,
    currentStreak,
    totalStats
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};
