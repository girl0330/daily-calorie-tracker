import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { UserId } from '../../types/types';
import DateNavigator from '../../features/tracker/components/DateNavigator';
import FoodInputForm from '../../features/foods/components/FoodInputForm';
import { CardBoard } from '../../features/tracker/components/meal-board/CardBoard';
import { NutritionChart } from '../../features/tracker/components/nutrition/NutritionChart';
import { useAuthStore } from '../../store/authStore';
import { useFoods } from '../../features/foods/hooks/useFoods';
import useTodayFoods from '../../features/tracker/hooks/useTodayFoods';
import { toRecordDate as formatRecordDate, parseRecordDate } from '../../utils/date';

export default function DailyTrackerPage() {
  const userFromStore = useAuthStore(state => state.user);

  const [searchParams, setSearchParams] = useSearchParams();
  const dateFromUrl = searchParams.get('date');

  const selectedDate = parseRecordDate(dateFromUrl ?? formatRecordDate(new Date()));

  const selectedRecordDate = formatRecordDate(selectedDate);

  const { data: foods = [], isLoading, isError, error } = useFoods(userFromStore?.id);

  // 선택된 날짜의 음식 데이터
  const selectedDateFoods = useTodayFoods(foods, selectedRecordDate);

  const handleDateSelect = (date: Date) => {
    setSearchParams({
      date: formatRecordDate(date),
    });
  };

  if (!userFromStore) {
    return null;
  }

  if (isLoading) {
    return <div>음식 데이터를 불러오는 중입니다.</div>;
  }

  if (isError) {
    return <div>음식 데이터를 불러오지 못했습니다: {error.message}</div>;
  }

  const userId = userFromStore.id as UserId;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* 주간 날짜 영역 */}
      <DateNavigator foods={foods} selectedDate={selectedDate} onDateSelect={handleDateSelect} />

      {/* 상단 보조 영역: 음식 추가 + 영양소 차트 */}
      <div className="grid shrink-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <FoodInputForm userId={userId} recordDate={selectedRecordDate} />

        <NutritionChart foods={selectedDateFoods} />
      </div>

      {/* 하단 메인 영역: 식사별 카드 보드 */}
      <div className="min-h-0 flex-1">
        <CardBoard foods={selectedDateFoods} className="h-full" />
      </div>
    </div>
  );
}
