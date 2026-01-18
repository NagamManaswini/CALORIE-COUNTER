
import React, { useState } from 'react';
import { MealType, LogEntry } from '../types';
import { COMMON_FOODS } from '../constants';
import { searchFoodCalories } from '../services/geminiService';
import { formatDate } from '../utils/calculations';

interface FoodEntryModalProps {
  onClose: () => void;
  onAdd: (entry: Omit<LogEntry, 'id'>) => void;
  defaultMealType: MealType;
}

const FoodEntryModal: React.FC<FoodEntryModalProps> = ({ onClose, onAdd, defaultMealType }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{name: string, calories: number}[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealType>(defaultMealType);
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCals, setCustomCals] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsSearching(true);
    // Filter local common foods
    const local = COMMON_FOODS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Supplement with AI if no local results or for extra "smartness"
    if (local.length < 3 && searchQuery.length > 2) {
      const aiResult = await searchFoodCalories(searchQuery);
      setSearchResults([...local, aiResult]);
    } else {
      setSearchResults(local);
    }
    setIsSearching(false);
  };

  const handleSelect = (item: {name: string, calories: number}) => {
    onAdd({
      date: formatDate(new Date()),
      mealType: selectedMeal,
      foodName: item.name,
      calories: item.calories,
      servingSize: '1 serving'
    });
    onClose();
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customCals) return;
    onAdd({
      date: formatDate(new Date()),
      mealType: selectedMeal,
      foodName: customName,
      calories: parseInt(customCals),
      servingSize: '1 serving'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Add Food</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="p-6">
          {/* Meal Type Selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {(['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as MealType[]).map(meal => (
              <button
                key={meal}
                onClick={() => setSelectedMeal(meal)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedMeal === meal 
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {meal}
              </button>
            ))}
          </div>

          {!customMode ? (
            <>
              <form onSubmit={handleSearch} className="relative mb-6">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search food (e.g. Avocado, Pizza)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <button 
                  type="submit" 
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-white p-2 rounded-xl hover:bg-emerald-600 disabled:bg-slate-300 transition-colors"
                >
                  {isSearching ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-arrow-right"></i>}
                </button>
              </form>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item)}
                      className="w-full flex justify-between items-center p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all text-left group"
                    >
                      <span className="font-semibold text-slate-700">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-emerald-600">{item.calories} kcal</span>
                        <i className="fa-solid fa-plus text-slate-300 group-hover:text-emerald-500 transition-colors"></i>
                      </div>
                    </button>
                  ))
                ) : (
                  !isSearching && (
                    <div className="text-center py-8">
                      <p className="text-slate-400 mb-4">No results yet. Try searching or add custom entry.</p>
                      <button 
                        onClick={() => setCustomMode(true)}
                        className="text-emerald-600 font-bold hover:underline"
                      >
                        Add Custom Entry
                      </button>
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleCustomAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Food Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. My Grandma's Lasagna"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Calories (kcal)</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 450"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={customCals}
                  onChange={(e) => setCustomCals(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setCustomMode(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
                >
                  Add Food
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodEntryModal;
