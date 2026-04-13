import type { FoodItem } from '../types/types';

// 식사에 따른 칼로리 계산
export const caloriesByMeal = (foods: FoodItem[]) => {
  const result = foods.reduce(
    (sum, cur) => {
      const key = cur.mealType;
      sum[key].carbs += cur.carbs;
      sum[key].protein += cur.protein;
      sum[key].fat += cur.fat;
      return sum;
    },
    {
      breakfast: { carbs: 0, protein: 0, fat: 0 },
      lunch: { carbs: 0, protein: 0, fat: 0 },
      dinner: { carbs: 0, protein: 0, fat: 0 },
    }
  );
  return result;
};

// 칼로리 계산산
export const calories = (carbs: number = 0, protein: number = 0, fat: number = 0): number => {
  return carbs * 4 + protein * 4 + fat * 9;
};
