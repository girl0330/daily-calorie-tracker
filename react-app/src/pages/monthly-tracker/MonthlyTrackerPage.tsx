import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMonths, format, isSameMonth, startOfMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import BottomSheet from '../../components/common/BottomSheet';
import Button from '../../components/common/Button';
import DateHeader from '../../components/common/DateHeader';
import Skeleton from '../../components/common/Skeleton';
import { useFoods } from '../../features/foods/hooks/useFoods';
import { useGoalSettings } from '../../features/goals/hooks/useGoalSettings';
import { getActiveGoal } from '../../features/goals/utils/goalCalc';
import DaySheetContent from '../../features/tracker/components/monthly/DaySheetContent';
import MonthlyCalendar from '../../features/tracker/components/monthly/MonthlyCalendar';
import MonthlyGoal from '../../features/tracker/components/monthly/MonthlyGoal';
import { NUTRIENTS, summarizeByDate } from '../../features/tracker/utils/monthlyCalendar';
import { useAuthStore } from '../../store/authStore';
import { toRecordDate } from '../../utils/date';

// Tailwind md(768px)보다 좁으면 모바일이에요. 모바일은 날짜를 누르면 바텀시트를 먼저 열어요.
const MOBILE_QUERY = '(max-width: 767.98px)';

// 월간 기록: 날짜 헤더 + 지금 목표 → 한 달 달력. 화면 높이에 달력을 꽉 채워요.
export default function MonthlyTrackerPage() {
  const userId = useAuthStore(state => state.user?.id);
  const navigate = useNavigate();

  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [sheetDate, setSheetDate] = useState<Date | null>(null);

  const { data: foods, isLoading, isError, refetch } = useFoods(userId);
  const { data: goalSettings, isLoading: isGoalLoading, isError: isGoalError } = useGoalSettings(userId);

  const summaries = useMemo(() => (foods ? summarizeByDate(foods) : null), [foods]);

  if (!userId) return null;

  const today = new Date();
  const isThisMonth = isSameMonth(month, today);
  const goal = getActiveGoal(goalSettings);
  // 목표를 불러오는 중이거나 못 불러왔으면 목표 자리를 비워 둬요. 못 불러왔는데 '정하라'고 안내하지 않으려고요.
  const showGoal = !isGoalLoading && !isGoalError;

  const openDaily = (date: Date) => navigate(`/?date=${toRecordDate(date)}`);

  const handleSelectDate = (date: Date) => {
    if (window.matchMedia(MOBILE_QUERY).matches) setSheetDate(date);
    else openDaily(date);
  };

  const sheetDay = sheetDate ? (summaries?.get(toRecordDate(sheetDate)) ?? null) : null;

  return (
    <div className="mx-auto flex h-[calc(100dvh-56px)] min-h-140 w-full max-w-300 flex-col gap-3 px-4 pt-5 pb-4 md:gap-4 md:px-6 md:pt-8 md:pb-6 lg:h-dvh">
      <div className="mb-2 flex h-[55px] shrink-0 items-start justify-center md:mb-3 md:h-24 md:justify-between">
        <DateHeader
          number={format(month, 'MM')}
          caption={format(month, 'yyyy년')}
          label="월"
          isCurrent={isThisMonth}
          currentLabel="이번 달로 이동"
          prevLabel="이전 달"
          nextLabel="다음 달"
          isNextDisabled={isThisMonth}
          onPrev={() => setMonth(prev => addMonths(prev, -1))}
          onNext={() => setMonth(prev => addMonths(prev, 1))}
          onCurrent={() => setMonth(startOfMonth(new Date()))}
        />

        <div className="max-md:hidden">{showGoal && <MonthlyGoal goal={goal} layout="desktop" />}</div>
      </div>

      <div className="md:hidden">
        {isGoalLoading && <Skeleton className="h-9 rounded-lg" />}
        {showGoal && <MonthlyGoal goal={goal} layout="mobile" />}
      </div>

      {isError ? (
        <div role="alert" className="flex flex-col items-start gap-3 text-sm text-(--ink-2)">
          <p className="m-0">식사 기록을 불러오지 못했어요.</p>
          <Button onClick={() => void refetch()}>다시 시도</Button>
        </div>
      ) : (
        <>
          <MonthlyCalendar
            month={month}
            today={today}
            summaries={isLoading ? null : (summaries ?? new Map())}
            onSelectDate={handleSelectDate}
          />

          {/* 모바일 칸의 색 점 설명 */}
          <p aria-hidden="true" className="m-0 flex shrink-0 items-center justify-end gap-3 text-[10px] text-(--ink-2) md:hidden">
            kcal
            {NUTRIENTS.map(({ key, short, dotClassName }) => (
              <span key={key} className="inline-flex items-center gap-1">
                <i className={`inline-block size-[7px] rounded-full ${dotClassName}`} />
                {short}
              </span>
            ))}
          </p>
        </>
      )}

      <BottomSheet
        open={sheetDate !== null}
        title={sheetDate ? format(sheetDate, 'M월 d일 EEEE', { locale: ko }) : ''}
        onClose={() => setSheetDate(null)}
      >
        {sheetDate && (
          <DaySheetContent
            day={sheetDay}
            onOpenDaily={() => {
              setSheetDate(null);
              openDaily(sheetDate);
            }}
          />
        )}
      </BottomSheet>
    </div>
  );
}
