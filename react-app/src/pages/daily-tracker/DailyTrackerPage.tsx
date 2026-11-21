import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { addDays, format, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import Button from '../../components/common/Button';
import DateHeader from '../../components/common/DateHeader';
import GuestGuard from '../../components/common/GuestGuard';
import FoodAddBar from '../../features/foods/components/FoodAddBar';
import FoodTable from '../../features/foods/components/FoodTable';
import { useFoods } from '../../features/foods/hooks/useFoods';
import { getMealByTime } from '../../features/foods/utils/foodForm';
import { useGoalSettings } from '../../features/goals/hooks/useGoalSettings';
import { getActiveGoal } from '../../features/goals/utils/goalCalc';
import DailyStats, { type DailyTotals } from '../../features/tracker/components/daily/DailyStats';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../store/toastStore';
import type { FoodItem, MealType } from '../../types/types';
import { calories, totalNutrients } from '../../utils/calculate';
import { parseRecordDate, toRecordDate } from '../../utils/date';
import DailyTrackerSkeleton from './DailyTrackerSkeleton';

// 방금 추가하거나 고친 줄. 줄은 반짝이고, 추가했을 때만 4칸 요약에 '+N 방금 추가'가 떠요.
type Highlight = { id: number; delta: DailyTotals | null };

const HIGHLIGHT_MS = 2600;

const toTotals = (nutrients: { carbs: number; protein: number; fat: number }): DailyTotals => ({
  ...nutrients,
  kcal: calories(nutrients.carbs, nutrients.protein, nutrients.fat),
});

// 일일 기록: 날짜 헤더 → 4칸 요약 → 검색창 → 시간대별 표
export default function DailyTrackerPage() {
  const userId = useAuthStore(state => state.user?.id);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDate = parseRecordDate(searchParams.get('date') ?? toRecordDate(new Date()));
  const recordDate = toRecordDate(selectedDate);

  const { data: allFoods = [], isLoading, isError, refetch } = useFoods(userId);
  const { data: goalSettings, isLoading: isGoalLoading, isError: isGoalError } = useGoalSettings(userId);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [addMeal, setAddMeal] = useState<MealType>(() => getMealByTime());
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const addInputRef = useRef<HTMLInputElement>(null);
  // 표의 '+ 추가'로 연 새 줄의 시간대. 추가 중에도 날짜를 못 바꾸게 페이지가 들고 있어요.
  const [addingMeal, setAddingMeal] = useState<MealType | null>(null);

  useEffect(() => {
    if (!highlight) return;
    const timer = setTimeout(() => setHighlight(null), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [highlight]);

  const foods = allFoods.filter(food => food.recordDate === recordDate);
  const totals = toTotals(totalNutrients(foods));
  const goal = getActiveGoal(goalSettings);

  const changeDate = (date: Date) => {
    // 고치던 값을 잃지 않게, 수정 중에는 날짜를 못 바꿔요.
    if (editingId !== null) {
      showToast('수정 중인 기록을 저장(✓)하거나 취소(✕)한 뒤에 날짜를 바꿀 수 있어요');
      return;
    }
    if (addingMeal !== null) {
      showToast('추가 중인 기록을 저장(✓)하거나 취소(✕)한 뒤에 날짜를 바꿀 수 있어요');
      return;
    }
    setHighlight(null);
    setSearchParams({ date: toRecordDate(date) });
  };

  const handleAdded = (food: FoodItem) => setHighlight({ id: food.id, delta: toTotals(food) });
  const handleEdited = (food: FoodItem) => setHighlight({ id: food.id, delta: null });

  return (
    <div className="mx-auto flex w-full max-w-300 flex-col gap-4.5 px-4 pt-5 pb-18 md:gap-6.5 md:px-6 md:pt-8 md:pb-20">
      <div className="flex h-[55px] justify-center md:h-24 md:justify-start">
        <DateHeader
          number={format(selectedDate, 'dd')}
          caption={format(selectedDate, 'yyyy년 M월')}
          label={format(selectedDate, 'EEEE', { locale: ko })}
          isCurrent={isToday(selectedDate)}
          currentLabel="오늘로 이동"
          prevLabel="이전 날"
          nextLabel="다음 날"
          onPrev={() => changeDate(addDays(selectedDate, -1))}
          onNext={() => changeDate(addDays(selectedDate, 1))}
          onCurrent={() => changeDate(new Date())}
        />
      </div>

      {isError ? (
        <div role="alert" className="flex flex-col items-start gap-3 text-sm text-(--ink-2)">
          <p className="m-0">식사 기록을 불러오지 못했어요.</p>
          <Button onClick={() => void refetch()}>다시 시도</Button>
        </div>
      ) : isLoading || isGoalLoading ? (
        <DailyTrackerSkeleton />
      ) : (
        <>
          <DailyStats totals={totals} goal={goal} recentDelta={highlight?.delta ?? null} />

          {/* 목표를 못 불러왔을 때는 '정하라'고 안내하지 않아요. */}
          {!goal && !isGoalError && (
            <GuestGuard>
              <p className="m-0 -mt-2 text-[13px] text-(--ink-2)">
                목표를 정하면 남은 칼로리와 달성률을 보여 줘요.{' '}
                <Link to="/mypage" className="font-bold text-(--brand) underline underline-offset-3">
                  목표 설정하기
                </Link>
              </p>
            </GuestGuard>
          )}

          {/* 로그인 안 한 사람은 검색창과 표를 볼 수만 있어요. 누르면 로그인 안내창이 떠요. */}
          <GuestGuard>
            {/* 날짜를 바꾸면 key가 바뀌어서 검색창과 열린 검색판이 처음 상태로 돌아가요. */}
            <FoodAddBar
              key={recordDate}
              userId={userId ?? ''}
              recordDate={recordDate}
              meal={addMeal}
              onMealChange={setAddMeal}
              inputRef={addInputRef}
              onAdded={handleAdded}
            />

            <FoodTable
              userId={userId ?? ''}
              foods={foods}
              totals={totals}
              editingId={editingId}
              onEditingChange={setEditingId}
              highlightId={highlight?.id ?? null}
              onEdited={handleEdited}
              recordDate={recordDate}
              addingMeal={addingMeal}
              onAddingChange={setAddingMeal}
              onAdded={handleAdded}
            />
          </GuestGuard>
        </>
      )}
    </div>
  );
}
