import { useMemo } from 'react';
import type { FoodItem, MealType } from '../../../types/types';
import { toRecordDate } from '../../../utils/date';

// 전달받은 날짜의 음식만 추려낸다.
// 화면의 기준 날짜는 createdAt(등록 시간)이 아니라 recordDate(음식 기록 날짜)를 사용한다.
const useTodayFoods = (foods: FoodItem[], mealType?: MealType, targetRecordDate: string = toRecordDate(new Date())) => {
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const isTargetDate = food.recordDate === targetRecordDate;

      if (!mealType) {
        return isTargetDate;
      }

      return isTargetDate && food.mealType === mealType;
    });
  }, [foods, mealType, targetRecordDate]);

  return filteredFoods;
};

export default useTodayFoods;
