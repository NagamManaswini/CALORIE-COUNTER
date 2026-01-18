
import { UserProfile } from '../types';
import { ACTIVITY_MULTIPLIERS, GOAL_ADJUSTMENTS } from '../constants';

export const calculateBMR = (profile: UserProfile): number => {
  const { weight, height, age, gender } = profile;
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const calculateDailyTarget = (profile: UserProfile): number => {
  const bmr = calculateBMR(profile);
  const tdee = bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel];
  const target = tdee + GOAL_ADJUSTMENTS[profile.goal];
  return Math.round(target);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDayName = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};
