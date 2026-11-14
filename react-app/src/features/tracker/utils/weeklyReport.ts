import type { FoodItem, MealType } from '../../../types/types';
import { calories, nutrientsByMeal, totalNutrients, type NutrientAmounts } from '../../../utils/calculate';
import { getWeekRange, parseRecordDate } from '../../../utils/date';

export type MealNutrients = Record<MealType, NutrientAmounts>;

export type WeekDay = {
  recordDate: string;
  date: Date;
  /** 음식이 한 개라도 있으면 true. 0kcal 기록도 기록이에요. */
  hasRecord: boolean;
  nutrients: NutrientAmounts;
  calories: number;
  mealNutrients: MealNutrients;
};

export type WeeklyReport = {
  startDate: string;
  endDate: string;
  days: WeekDay[];
  recordedDays: number;
  totalCalories: number;
  /** 기록한 날만으로 나눈 평균. 기록한 날이 없으면 0 */
  averageCalories: number;
  averageNutrients: NutrientAmounts;
  /** 일주일 합계 */
  nutrients: NutrientAmounts;
  mealNutrients: MealNutrients;
};

// 호출하는 쪽에서 로그인 사용자의 음식 목록을 전달한다.
// 다른 주의 음식이 섞여 있어도 선택한 주의 기록만 집계한다.
// 수치는 표시 직전까지 반올림하지 않는다.
export const getWeeklyReport = (foods: FoodItem[], selectedDate: Date = new Date()): WeeklyReport => {
  const week = getWeekRange(selectedDate);
  const weekDates = new Set(week.dates);
  const weekFoods = foods.filter(food => weekDates.has(food.recordDate));

  const days = week.dates.map(recordDate => {
    const dayFoods = weekFoods.filter(food => food.recordDate === recordDate);
    const nutrients = totalNutrients(dayFoods);

    return {
      recordDate,
      date: parseRecordDate(recordDate),
      hasRecord: dayFoods.length > 0,
      nutrients,
      calories: calories(nutrients.carbs, nutrients.protein, nutrients.fat),
      mealNutrients: nutrientsByMeal(dayFoods),
    };
  });

  const recordedDays = days.filter(day => day.hasRecord).length;
  const nutrients = totalNutrients(weekFoods);
  const totalCalories = calories(nutrients.carbs, nutrients.protein, nutrients.fat);
  const divisor = recordedDays || 1;

  return {
    startDate: week.startDate,
    endDate: week.endDate,
    days,
    recordedDays,
    totalCalories,
    averageCalories: recordedDays ? totalCalories / divisor : 0,
    averageNutrients: {
      carbs: nutrients.carbs / divisor,
      protein: nutrients.protein / divisor,
      fat: nutrients.fat / divisor,
    },
    nutrients,
    mealNutrients: nutrientsByMeal(weekFoods),
  };
};

/**
 * 몇째 주인지: 그 주(월~일)의 목요일이 들어 있는 달을 기준으로 세요.
 * 예) 11월 2일~8일 → 11월 1주차, 10월 26일~11월 1일 → 10월 5주차
 */
export const getWeekOfMonth = (monday: Date) => {
  const thursday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 3);

  return {
    month: thursday.getMonth() + 1,
    week: Math.ceil(thursday.getDate() / 7),
  };
};

/** 칼로리 중 탄·단·지가 차지하는 비중(%). 합이 100이 되도록 반올림해요. 기록이 없으면 모두 0 */
export const getCalorieRatio = ({ carbs, protein, fat }: NutrientAmounts) => {
  const kcal = [carbs * 4, protein * 4, fat * 9];
  const total = kcal[0] + kcal[1] + kcal[2];
  if (total <= 0) return { carbs: 0, protein: 0, fat: 0 };

  const carbsPercent = Math.round((kcal[0] / total) * 100);
  const proteinPercent = Math.round((kcal[1] / total) * 100);

  return { carbs: carbsPercent, protein: proteinPercent, fat: Math.max(0, 100 - carbsPercent - proteinPercent) };
};
