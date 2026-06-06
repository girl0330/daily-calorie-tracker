import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { UserId } from '../../types/types';
import WeeklyDayBar from '../../features/tracker/components/weekly/WeeklyDayBar';
import FoodInputForm from '../../features/foods/components/FoodInputForm';
import { CardBoard } from '../../features/tracker/components/meal-board/CardBoard';
import { NutritionChart } from '../../features/tracker/components/nutrition/NutritionChart';
import { useAuthStore } from '../../store/authStore';
import { useFoods } from '../../features/foods/hooks/useFoods';
import useTodayFoods from '../../features/tracker/hooks/useTodayFoods';
import { toRecordDate as formatRecordDate, parseRecordDate } from '../../utils/date';

export default function DailyTrackerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userFromStore = useAuthStore(state => state.user);

  const dateFromUrl = searchParams.get('date');

  const [selectedDate, setSelectedDate] = useState(() => parseRecordDate(dateFromUrl ?? formatRecordDate(new Date())));

  // URL의 date가 바뀌면 selectedDate state도 같이 변경한다.
  useEffect(() => {
    if (!dateFromUrl) {
      setSelectedDate(new Date());
      return;
    }

    console.log(`${dateFromUrl}를 확인`);

    setSelectedDate(parseRecordDate(dateFromUrl));
  }, [dateFromUrl]);

  const selectedRecordDate = formatRecordDate(selectedDate);

  const { data: foods = [], isLoading, isError, error } = useFoods(userFromStore?.id);

  // 날짜 기준 데이터는 페이지에서 한 번만 계산해서 하위 컴포넌트로 내려준다.
  // 선택된 날짜로 필터링된 foods
  const selectedDateFoods = useTodayFoods(foods, selectedRecordDate);

  const handleDateSelect = (date: Date) => {
    const recordDate = formatRecordDate(date);

    setSelectedDate(date);
    setSearchParams({ date: recordDate });
  };

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
      <WeeklyDayBar foods={selectedDateFoods} selectedDate={selectedDate} onDateSelect={handleDateSelect} />

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
