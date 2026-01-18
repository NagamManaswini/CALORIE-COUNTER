
import React, { useState } from 'react';
import { UserProfile, LogEntry, MealType } from '../types';
import { formatDate } from '../utils/calculations';
import FoodEntryModal from './FoodEntryModal';

interface DashboardProps {
  profile: UserProfile;
  logs: LogEntry[];
  onAddLog: (entry: Omit<LogEntry, 'id'>) => void;
  dailyTarget: number;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, onAddLog, dailyTarget }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('Breakfast');

  const today = formatDate(new Date());
  const todayLogs = logs.filter(log => log.date === today);
  const consumed = todayLogs.reduce((sum, log) => sum + log.calories, 0);
  const remaining = Math.max(0, dailyTarget - consumed);
  const percentage = Math.min(100, (consumed / dailyTarget) * 100);

  const mealStats = (type: MealType) => {
    return todayLogs
      .filter(log => log.mealType === type)
      .reduce((sum, log) => sum + log.calories, 0);
  };

  const handleQuickAdd = (type: MealType) => {
    setSelectedMealType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Hero Stats Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 font-medium">Daily Goal</p>
              <h1 className="text-4xl font-extrabold text-slate-900">{dailyTarget} <span className="text-lg font-normal text-slate-400">kcal</span></h1>
            </div>
            <div className="text-right">
              <p className="text-slate-500 font-medium">Remaining</p>
              <h2 className={`text-3xl font-bold ${remaining < 100 ? 'text-orange-500' : 'text-emerald-500'}`}>{remaining}</h2>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-slate-600">
              <span>Consumed: {consumed} kcal</span>
              <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 z-0"></div>
      </div>

      {/* Meal Groups */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as MealType[]).map((meal) => (
          <div key={meal} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group hover:border-emerald-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                <i className={`fa-solid ${
                  meal === 'Breakfast' ? 'fa-coffee' : 
                  meal === 'Lunch' ? 'fa-burger' : 
                  meal === 'Dinner' ? 'fa-utensils' : 'fa-apple-whole'
                } text-xl`}></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{meal}</h3>
                <p className="text-sm text-slate-500">{mealStats(meal)} kcal</p>
              </div>
            </div>
            <button 
              onClick={() => handleQuickAdd(meal)}
              className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Recent Log Teaser */}
      {todayLogs.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Today's Log</h3>
          </div>
          <div className="space-y-3">
            {todayLogs.slice(-3).reverse().map((log) => (
              <div key={log.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700">{log.foodName}</span>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{log.mealType}</span>
                </div>
                <span className="font-bold text-slate-800">{log.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <FoodEntryModal 
          onClose={() => setIsModalOpen(false)}
          onAdd={onAddLog}
          defaultMealType={selectedMealType}
        />
      )}
    </div>
  );
};

export default Dashboard;
