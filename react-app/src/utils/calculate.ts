import type { FoodItem } from '../types/types';

export type NutrientAmounts = {
  carbs: number;
  protein: number;
  fat: number;
};

export type NutrientCalories = {
  carbs: number;
  protein: number;
  fat: number;
};

const KCAL_PER_GRAM = {
  carbs: 4,
  protein: 4,
  fat: 9,
} as const;

// 식사 유형별 영양소 섭취량(g) 집계
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

// 전체 영양소 섭취량(g) 집계
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

// 영양소별 칼로리(kcal) 계산
export const caloriesByNutrient = ({ carbs, protein, fat }: NutrientAmounts): NutrientCalories => {
  return {
    carbs: carbs * KCAL_PER_GRAM.carbs,
    protein: protein * KCAL_PER_GRAM.protein,
    fat: fat * KCAL_PER_GRAM.fat,
  };
};

// 영양소 섭취량(g)을 전체 칼로리(kcal)로 변환
export const calories = (carbs: number = 0, protein: number = 0, fat: number = 0): number => {
  const nutrientCalories = caloriesByNutrient({
    carbs,
    protein,
    fat,
  });

  return nutrientCalories.carbs + nutrientCalories.protein + nutrientCalories.fat;
};
