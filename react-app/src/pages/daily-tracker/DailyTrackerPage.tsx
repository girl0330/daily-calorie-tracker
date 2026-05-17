import { useState } from 'react';
import type { UserId } from '../../types/types';
import WeeklyDayBar from '../../features/tracker/components/weekly/WeeklyDayBar';
import FoodInputForm from '../../features/foods/components/FoodInputForm';
import { CardBoard } from '../../features/tracker/components/meal-board/CardBoard';
import { NutritionChart } from '../../features/tracker/components/nutrition/NutritionChart';
import { useAuthStore } from '../../store/authStore';
import { useFoods } from '../../features/foods/hooks/useFoods';
import useTodayFoods from '../../features/tracker/hooks/useTodayFoods';
import { toRecordDate } from '../../utils/date';

export default function DailyTrackerPage() {
  const userFromStore = useAuthStore(state => state.user);
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const { data: foods = [], isLoading, isError, error } = useFoods(userFromStore?.id);

  // 날짜 기준 데이터는 페이지에서 한 번만 계산해서 하위 컴포넌트로 내려준다.
  // createdAt이 아니라 사용자가 선택한 recordDate 기준으로 필터링한다.
  const selectedDateFoods = useTodayFoods(foods, undefined, selectedDate);
  const selectedRecordDate = toRecordDate(selectedDate);

  // 로그인 유저가 없으면 페이지를 렌더링하지 않음
  if (!userFromStore) {
    return null;
  }

  // 음식 데이터 조회 중 상태
  if (isLoading) {
    return <div>음식 데이터를 불러오는 중입니다.</div>;
  }

  // 음식 데이터 조회 실패 상태
  if (isError) {
    return <div>음식 데이터를 불러오지 못했습니다: {error.message}</div>;
  }

  const userId = userFromStore.id as UserId;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* 주간 날짜 영역 */}
      <WeeklyDayBar foods={foods} selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {/* 상단 보조 영역: 음식 추가 + 영양소 차트 */}
      <div className="grid shrink-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <FoodInputForm userId={userId} recordDate={selectedRecordDate} />

        <NutritionChart foods={selectedDateFoods} variant="full" />
      </div>

      {/* 하단 메인 영역: 식사별 카드 보드 */}
      <div className="min-h-0 flex-1">
        <CardBoard foods={selectedDateFoods} variant="daily" className="h-full" />
      </div>
    </div>
  );
}
