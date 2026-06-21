import type { FoodItem } from '../types/types';

// 식사 때에 따른 영양소 g계산
export const nutrientsByMeal = (foods: FoodItem[]) => {
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

// 영양소에 따른 영양소 g 계산
export const totalNutrients = (foods: FoodItem[]) => {
  const result = foods.reduce(
    (sum, cur) => {
      sum.carbs += cur.carbs;
      sum.protein += cur.protein;
      sum.fat += cur.fat;
      return sum;
    },
    { carbs: 0, protein: 0, fat: 0 }
  );
  return result;
};

// 칼로리 계산
export const calories = (carbs: number = 0, protein: number = 0, fat: number = 0): number => {
  return carbs * 4 + protein * 4 + fat * 9;
};
