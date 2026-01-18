
import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, Goal } from '../types';

interface ProfileSettingsProps {
  profile?: UserProfile;
  onSave: (profile: UserProfile) => void;
  isSetup?: boolean;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onSave, isSetup }) => {
  const [formData, setFormData] = useState<UserProfile>(profile || {
    name: '',
    age: 25,
    gender: 'male',
    height: 175,
    weight: 70,
    activityLevel: 'moderately_active',
    goal: 'maintain'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-slate-600 mb-1">Display Name</label>
          <input 
            type="text" 
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="How should we call you?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Age</label>
          <input 
            type="number" 
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Gender</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value as Gender})}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Height (cm)</label>
          <input 
            type="number" 
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
            value={formData.height}
            onChange={(e) => setFormData({...formData, height: parseInt(e.target.value)})}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Weight (kg)</label>
          <input 
            type="number" 
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">Activity Level</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
              { id: 'lightly_active', label: 'Lightly Active', desc: 'Exercise 1-3 days/week' },
              { id: 'moderately_active', label: 'Moderately Active', desc: 'Exercise 3-5 days/week' },
              { id: 'very_active', label: 'Very Active', desc: 'Exercise 6-7 days/week' },
            ].map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setFormData({...formData, activityLevel: level.id as ActivityLevel})}
                className={`flex justify-between items-center p-4 rounded-xl border text-left transition-all ${
                  formData.activityLevel === level.id 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold">{level.label}</div>
                  <div className="text-xs opacity-70">{level.desc}</div>
                </div>
                {formData.activityLevel === level.id && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">Weight Goal</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'lose_weight', label: 'Lose' },
              { id: 'maintain', label: 'Maintain' },
              { id: 'gain_weight', label: 'Gain' },
            ].map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setFormData({...formData, goal: goal.id as Goal})}
                className={`py-3 rounded-xl border font-bold transition-all text-sm ${
                  formData.goal === goal.id 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200"
      >
        {isSetup ? 'Start Journey' : 'Save Profile'}
      </button>
    </form>
  );
};

export default ProfileSettings;
