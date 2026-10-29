import type { FoodItem, MealType } from '../../../types/types';
import { calories, nutrientsByMeal, totalNutrients } from '../../../utils/calculate';
import { getWeekRange } from '../../../utils/date';

// 호출하는 쪽에서 로그인 사용자의 음식 목록을 전달한다.
// 다른 주의 음식이 섞여 있어도 선택한 주의 기록만 집계한다.
// 수치는 표시 직전까지 반올림하지 않고, 기록 없음과 0kcal 기록을 구분한다.
export const getWeeklyReport = (foods: FoodItem[], selectedDate: Date = new Date()) => {
  const week = getWeekRange(selectedDate);
  const weekDates = new Set(week.dates);
  const weekFoods = foods.filter(food => weekDates.has(food.recordDate));
  const nutrients = totalNutrients(weekFoods);
  const totalCalories = calories(nutrients.carbs, nutrients.protein, nutrients.fat);

  const days = week.dates.map(recordDate => {
    const dayFoods = weekFoods.filter(food => food.recordDate === recordDate);
    const dayNutrients = totalNutrients(dayFoods);

    return {
      recordDate,
      hasRecord: dayFoods.length > 0,
      nutrients: dayNutrients,
      calories: calories(dayNutrients.carbs, dayNutrients.protein, dayNutrients.fat),
    };
  });

  const mealNutrients = nutrientsByMeal(weekFoods);
  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];
  const meals = mealTypes.map(mealType => {
    const amounts = mealNutrients[mealType];
    const mealCalories = calories(amounts.carbs, amounts.protein, amounts.fat);

    return {
      mealType,
      nutrients: amounts,
      calories: mealCalories,
      // 총 칼로리가 0이면 비중을 계산할 수 없으므로 null을 반환한다.
      caloriePercentage: totalCalories > 0 ? (mealCalories / totalCalories) * 100 : null,
    };
  });

  return {
    startDate: week.startDate,
    endDate: week.endDate,
    recordedDays: days.filter(day => day.hasRecord).length,
    nutrients,
    totalCalories,
    days,
    meals,
  };
};
