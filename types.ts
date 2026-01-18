
export type Gender = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';

export type Goal = 'lose_weight' | 'maintain' | 'gain_weight';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface LogEntry {
  id: string;
  date: string; // ISO string
  mealType: MealType;
  foodName: string;
  calories: number;
  servingSize: string;
}

export interface DailySummary {
  date: string;
  totalCalories: number;
  targetCalories: number;
}
