import React, { useState } from "react";
import { useHabit } from "../context/HabitContext";
import { formatDisplayDate, WEEKS_DATA } from "../utils/dateUtils";
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Calendar, 
  ListTodo,
  Sparkles
} from "lucide-react";

export const DailyTodoPanel = ({ selectedWeekId, selectedDate, setSelectedDate }) => {
  const { daysData, addTodoItem, toggleTodoDone, editTodoText, deleteTodoItem } = useHabit();

  const week = WEEKS_DATA.find((w) => w.id === selectedWeekId) || WEEKS_DATA[0];
  const daysInWeek = week.days;

  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const currentDayData = daysData[selectedDate] || { todos: [] };
  const todos = currentDayData.todos || [];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addTodoItem(selectedDate, newText);
    setNewText("");
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const handleSaveEdit = (todoId) => {
    if (editingText.trim()) {
      editTodoText(selectedDate, todoId, editingText);
    }
    setEditingId(null);
  };

  const completedCount = todos.filter((t) => t.done).length;
  const totalCount = todos.length;
  const todoPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl mb-6 backdrop-blur-md">
      
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <ListTodo className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Daily To-Do List</span>
              {totalCount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {completedCount}/{totalCount} Done ({todoPct}%)
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Custom tasks & action items for {formatDisplayDate(selectedDate)}
            </p>
          </div>
        </div>

        {/* Date Selector Tabs within active week */}
        <div className="w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center space-x-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {daysInWeek.map((d) => {
              const isSelected = d === selectedDate;
              const [y, m, dayNum] = d.split("-");
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add New Item Form */}
      <form onSubmit={handleAddSubmit} className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder={`Add a new task for ${formatDisplayDate(selectedDate)}...`}
            className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
        <button
          type="submit"
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* To-Do Items List */}
      <div className="mt-4 space-y-2">
        {todos.length === 0 ? (
          <div className="py-8 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800/80">
            <Sparkles className="h-6 w-6 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No to-do items added for this date yet.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Type above to add custom daily goals.</p>
          </div>
        ) : (
          todos.map((todo) => {
            const isEditing = editingId === todo.id;
            return (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  todo.done
                    ? "bg-slate-950/40 border-slate-800/60 opacity-75"
                    : "bg-slate-950/80 border-slate-800/90 hover:border-slate-700"
                }`}
              >
                {/* Checkbox & Text */}
                <div className="flex items-center space-x-3 flex-1 min-w-0 pr-3">
                  <button
                    onClick={() => toggleTodoDone(selectedDate, todo.id)}
                    className={`flex-shrink-0 transition-transform active:scale-90 ${
                      todo.done ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {todo.done ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>

                  {isEditing ? (
                    <input
                      type="text"
                      autoFocus
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(todo.id)}
                      className="flex-1 px-3 py-1 bg-slate-900 border border-indigo-500 rounded-lg text-xs text-white focus:outline-none"
                    />
                  ) : (
                    <span
                      onClick={() => toggleTodoDone(selectedDate, todo.id)}
                      className={`text-xs cursor-pointer truncate ${
                        todo.done ? "line-through text-slate-500" : "text-slate-200"
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {isEditing ? (
                    <button
                      onClick={() => handleSaveEdit(todo.id)}
                      className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                      title="Save"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(todo)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                      title="Edit"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => deleteTodoItem(selectedDate, todo.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
