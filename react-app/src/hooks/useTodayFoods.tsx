import { useMemo } from 'react';
import type { FoodItem, MealType } from '../types/types';
import { isSameDay } from 'date-fns';

const useTodayFoods = (foods: FoodItem[], mealType?: MealType) => {
  const todayFoods = useMemo(() => {
    const today = new Date();

    return foods.filter(food => {
      const isToday = isSameDay(new Date(food.createdAt), today);

      if (!mealType) {
        return isToday;
      }

      return isToday && food.mealType === mealType;
    });
  }, [foods, mealType]);
  return todayFoods;
};

export default useTodayFoods;
