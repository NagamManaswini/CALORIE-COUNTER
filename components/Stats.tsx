
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { LogEntry } from '../types';
import { formatDate, getDayName } from '../utils/calculations';

interface StatsProps {
  logs: LogEntry[];
  dailyTarget: number;
}

const Stats: React.FC<StatsProps> = ({ logs, dailyTarget }) => {
  const chartData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      
      const dayLogs = logs.filter(l => l.date === dateStr);
      const consumed = dayLogs.reduce((sum, l) => sum + l.calories, 0);
      
      last7Days.push({
        name: getDayName(dateStr),
        consumed: consumed,
        target: dailyTarget
      });
    }
    return last7Days;
  }, [logs, dailyTarget]);

  const averageCalories = Math.round(
    chartData.reduce((sum, day) => sum + day.consumed, 0) / 7
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Insights</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Weekly Average</p>
          <h3 className="text-2xl font-bold text-slate-800">{averageCalories} <span className="text-xs text-slate-400 font-normal">kcal/day</span></h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Compliance</p>
          <h3 className="text-2xl font-bold text-emerald-600">
            {Math.round((chartData.filter(d => d.consumed <= d.target && d.consumed > 0).length / 7) * 100)}%
          </h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-6">Last 7 Days Consumption</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
              />
              <ReferenceLine y={dailyTarget} stroke="#10b981" strokeDasharray="3 3" />
              <Bar 
                dataKey="consumed" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-2 justify-center mt-4">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-xs text-slate-400">Consumed Calories</span>
          <div className="w-8 h-0.5 border-t border-emerald-500 border-dashed ml-4"></div>
          <span className="text-xs text-slate-400">Daily Goal</span>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">Pro Tip</h3>
          <p className="opacity-90 leading-relaxed italic">
            "Consistency is more important than perfection. Keep logging every day, and you'll hit your goals before you know it!"
          </p>
        </div>
        <i className="fa-solid fa-lightbulb absolute bottom-0 right-0 text-8xl -mb-6 -mr-6 text-white/10"></i>
      </div>
    </div>
  );
};

export default Stats;
