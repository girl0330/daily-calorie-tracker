import { useState } from 'react';
import { useFoods } from '../../features/foods';
import { MonthlyCalendarSection } from '../../features/tracker';
import { useAuthStore } from '../../store/authStore';
import { toRecordDate } from '../../utils/date';

export default function MonthlyTrackerPage() {
  const userFromStore = useAuthStore(state => state.user);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const { data: foods = [], isLoading, isError, error } = useFoods(userFromStore?.id);

  // 월간 페이지의 기준 날짜는 selectedDate 하나로 통일한다.
  // 차트, 카드보드, 주간 요약이 모두 같은 날짜 데이터를 바라보게 된다.
  const selectedRecordDate = toRecordDate(selectedDate);

  if (!userFromStore) {
    return null;
  }

  if (isLoading) {
    return <div>음식 데이터를 불러오는 중입니다.</div>;
  }

  if (isError) {
    return <div>음식 데이터를 불러오지 못했습니다: {error.message}</div>;
  }

  return (
    <div className="flex min-h-0 flex-col gap-4">
      {/* 선택 날짜 요약 영역 */}
      {/* <div className="grid shrink-0 grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
        <NutritionChart foods={selectedDateFoods} variant="summary" />

        <CardBoard foods={selectedDateFoods} variant="compact" className="h-[280px]" />
      </div> */}

      {/* 월간 캘린더 + 선택 주간 요약 */}
      <MonthlyCalendarSection
        foods={foods}
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onMonthChange={setCurrentMonth}
        onDateSelect={setSelectedDate}
      />

      <p className="text-center text-sm text-(--text-muted)">
        현재 선택된 기록 날짜: <span className="font-semibold text-(--text-secondary)">{selectedRecordDate}</span>
      </p>
    </div>
  );
}
