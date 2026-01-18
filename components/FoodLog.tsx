
import React from 'react';
import { LogEntry } from '../types';

interface FoodLogProps {
  logs: LogEntry[];
  onDelete: (id: string) => void;
}

const FoodLog: React.FC<FoodLogProps> = ({ logs, onDelete }) => {
  // Group logs by date
  const groupedLogs = logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, LogEntry[]>);

  const sortedDates = Object.keys(groupedLogs).sort((a, b) => b.localeCompare(a));

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
          <i className="fa-solid fa-clipboard-list text-4xl"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Your log is empty</h3>
        <p className="text-slate-500 max-w-xs">Start logging your meals to track your progress throughout the day.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">History</h2>
      {sortedDates.map(date => {
        const dateObj = new Date(date);
        const displayDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        const dayTotal = groupedLogs[date].reduce((sum, log) => sum + log.calories, 0);

        return (
          <div key={date} className="space-y-4">
            <div className="flex justify-between items-end border-b border-slate-200 pb-2">
              <h3 className="text-lg font-bold text-slate-700">{displayDate}</h3>
              <span className="text-sm font-semibold text-emerald-600">{dayTotal} kcal total</span>
            </div>
            <div className="space-y-3">
              {groupedLogs[date].map(log => (
                <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="text-xs uppercase font-black text-slate-300 transform -rotate-90 w-6">
                      {log.mealType.substring(0, 3)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{log.foodName}</h4>
                      <p className="text-xs text-slate-400">{log.servingSize}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-slate-800">{log.calories} kcal</span>
                    <button 
                      onClick={() => onDelete(log.id)}
                      className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FoodLog;
