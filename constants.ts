
import { ActivityLevel, Goal } from './types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  lose_weight: -500,
  maintain: 0,
  gain_weight: 500,
};

export const COMMON_FOODS = [
  { name: 'Apple (Medium)', calories: 95 },
  { name: 'Banana (Medium)', calories: 105 },
  { name: 'Chicken Breast (100g)', calories: 165 },
  { name: 'Egg (Large)', calories: 78 },
  { name: 'White Rice (1 cup cooked)', calories: 205 },
  { name: 'Brown Rice (1 cup cooked)', calories: 216 },
  { name: 'Oatmeal (1 cup cooked)', calories: 158 },
  { name: 'Greek Yogurt (1 cup)', calories: 150 },
  { name: 'Almonds (1 oz / 28g)', calories: 164 },
  { name: 'Peanut Butter (1 tbsp)', calories: 94 },
  { name: 'Avocado (Medium)', calories: 240 },
  { name: 'Whole Wheat Bread (1 slice)', calories: 69 },
  { name: 'Salmon (100g)', calories: 208 },
  { name: 'Black Coffee', calories: 2 },
  { name: 'Orange Juice (1 cup)', calories: 112 },
];
