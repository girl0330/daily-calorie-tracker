import type { FoodItem, MealType } from '../../../types/types';
import { calories } from '../../../utils/calculate';

// 하루에 먹은 양. kcal은 탄·단·지에서 계산한 값이에요.
export type DaySummary = {
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
  /** 시간대별 kcal (바텀시트의 '식사별 칼로리') */
  mealKcal: Record<MealType, number>;
};

// 월간 화면 곳곳(달력 칸, 목표, 바텀시트)에서 같은 순서·색으로 써요.
export const NUTRIENTS = [
  { key: 'carbs', label: '탄수화물', short: '탄', dotClassName: 'bg-(--carbs)' },
  { key: 'protein', label: '단백질', short: '단', dotClassName: 'bg-(--protein)' },
  { key: 'fat', label: '지방', short: '지', dotClassName: 'bg-(--fat)' },
] as const;

// 달력은 늘 6줄 × 7칸(42칸)이에요. 달마다 줄 수가 바뀌면 달을 넘길 때 칸 높이가 출렁여서요.
const GRID_DAYS = 42;

/** 그 달 1일이 들어 있는 주의 일요일부터 42일 */
export const getMonthGridDates = (month: Date): Date[] => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay());

  return Array.from(
    { length: GRID_DAYS },
    (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)
  );
};

/** 음식 기록을 날짜(YYYY-MM-DD)별 합계로 묶어요. 기록이 없는 날은 들어 있지 않아요. */
export const summarizeByDate = (foods: FoodItem[]): Map<string, DaySummary> => {
  const byDate = new Map<string, DaySummary>();

  for (const food of foods) {
    const day = byDate.get(food.recordDate) ?? {
      kcal: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      mealKcal: { breakfast: 0, lunch: 0, dinner: 0 },
    };
    const foodKcal = calories(food.carbs, food.protein, food.fat);

    day.kcal += foodKcal;
    day.carbs += food.carbs;
    day.protein += food.protein;
    day.fat += food.fat;
    day.mealKcal[food.mealType] += foodKcal;
    byDate.set(food.recordDate, day);
  }

  return byDate;
};
