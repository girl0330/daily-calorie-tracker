import { useState } from 'react';
import { useFoods } from '../../features/foods';
import { MonthlyCalendarSection } from '../../features/tracker';
import { useAuthStore } from '../../store/authStore';

export default function MonthlyTrackerPage() {
  const userFromStore = useAuthStore(state => state.user);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const { data: foods = [], isLoading, isError, error } = useFoods(userFromStore?.id);

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
    <div className="flex min-h-0 flex-1 flex-col">
      <MonthlyCalendarSection foods={foods} currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
    </div>
  );
}
