
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, LogEntry, MealType } from './types';
import { calculateDailyTarget, formatDate } from './utils/calculations';
import Dashboard from './components/Dashboard';
import FoodLog from './components/FoodLog';
import ProfileSettings from './components/ProfileSettings';
import Stats from './components/Stats';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'stats' | 'profile'>('dashboard');
  
  // Persistence Layer
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('vitality_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('vitality_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (profile) localStorage.setItem('vitality_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('vitality_logs', JSON.stringify(logs));
  }, [logs]);

  const dailyTarget = useMemo(() => {
    return profile ? calculateDailyTarget(profile) : 2000;
  }, [profile]);

  const addLog = (entry: Omit<LogEntry, 'id'>) => {
    const newEntry = { ...entry, id: crypto.randomUUID() };
    setLogs(prev => [...prev, newEntry]);
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setActiveTab('dashboard');
  };

  // If no profile, force profile setup
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome!</h1>
            <p className="text-slate-500 mb-6">Let's set up your profile to calculate your daily calorie goals.</p>
            <ProfileSettings 
              onSave={updateProfile} 
              isSetup={true}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <i className="fa-solid fa-bolt-lightning text-xl"></i>
            </div>
            <span className="text-xl font-bold text-slate-800">Vitality</span>
          </div>
          <button 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <span className="font-medium hidden sm:inline">{profile.name}</span>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <i className="fa-solid fa-user text-slate-400"></i>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            profile={profile}
            logs={logs}
            onAddLog={addLog}
            dailyTarget={dailyTarget}
          />
        )}
        {activeTab === 'log' && (
          <FoodLog 
            logs={logs}
            onDelete={deleteLog}
          />
        )}
        {activeTab === 'stats' && (
          <Stats 
            logs={logs}
            dailyTarget={dailyTarget}
          />
        )}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile Settings</h2>
            <ProfileSettings 
              profile={profile} 
              onSave={updateProfile}
              isSetup={false}
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors w-1/4 ${activeTab === 'dashboard' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-house text-lg"></i>
          <span className="text-xs mt-1 font-medium">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('log')}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors w-1/4 ${activeTab === 'log' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-list text-lg"></i>
          <span className="text-xs mt-1 font-medium">Log</span>
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors w-1/4 ${activeTab === 'stats' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-chart-line text-lg"></i>
          <span className="text-xs mt-1 font-medium">Stats</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors w-1/4 ${activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-gear text-lg"></i>
          <span className="text-xs mt-1 font-medium">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
