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
import { useState } from 'react';
import SectionLayout from '../../components/common/SectionLayout';
import BottomSheet from '../../components/common/BottomSheet';

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

  const [isFoodFormOpen, setIsFoodFormOpen] = useState(false);

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
    <div className="flex h-full min-h-0 flex-col">
      <DateNavigator foods={foods} selectedDate={selectedDate} onDateSelect={handleDateSelect} />

      <div className="grid shrink-0 xl:grid-cols-2">
        {/* Desktop */}
        <div className="hidden lg:block">
          <FoodInputForm userId={userId} recordDate={selectedRecordDate} />
        </div>

        <NutritionChart foods={selectedDateFoods} />
      </div>

      {/* Tablet / Mobile */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsFoodFormOpen(true)}
          className="w-full bg-(--primary-3) px-4 py-3 font-semibold text-white"
        >
          음식 추가
        </button>
      </div>

      <div className="min-h-0 flex-1">
        <CardBoard foods={selectedDateFoods} className="h-full" />
      </div>

      {/* Bottom Sheet */}
      {isFoodFormOpen && (
        <BottomSheet isOpen={isFoodFormOpen} onClose={() => setIsFoodFormOpen(false)}>
          <FoodInputForm userId={userId} recordDate={selectedRecordDate} />
        </BottomSheet>
      )}
    </div>
  );
}
