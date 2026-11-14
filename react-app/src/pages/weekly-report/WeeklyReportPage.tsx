import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { addWeeks, format } from 'date-fns';
import Button from '../../components/common/Button';
import DateHeader from '../../components/common/DateHeader';
import { useGoalSettings } from '../../features/goals/hooks/useGoalSettings';
import { getActiveGoal } from '../../features/goals/utils/goalCalc';
import WeeklyAiCard from '../../features/tracker/components/weekly/WeeklyAiCard';
import WeeklyCalorieChart from '../../features/tracker/components/weekly/WeeklyCalorieChart';
import WeeklyNutritionPanel from '../../features/tracker/components/weekly/WeeklyNutritionPanel';
import WeeklyStats from '../../features/tracker/components/weekly/WeeklyStats';
import { useWeeklyReport } from '../../features/tracker/hooks/useWeeklyReport';
import { getWeekOfMonth } from '../../features/tracker/utils/weeklyReport';
import { useAuthStore } from '../../store/authStore';
import { getWeekRange, parseRecordDate, toRecordDate } from '../../utils/date';
import WeeklyReportSkeleton from './WeeklyReportSkeleton';

// 주의 범위 글자. 같은 달이면 '11월 2일~8일', 달이 바뀌면 '10월 26일~11월 1일'
const formatWeekRange = (start: Date, end: Date) =>
  start.getMonth() === end.getMonth()
    ? `${format(start, 'M월 d일')}~${format(end, 'd일')}`
    : `${format(start, 'M월 d일')}~${format(end, 'M월 d일')}`;

// 주간 리포트: 날짜 헤더 → 4칸 요약 → AI 카드 → 막대 + 영양소 묶음
export default function WeeklyReportPage() {
  const userId = useAuthStore(state => state.user?.id);
  const [searchParams, setSearchParams] = useSearchParams();

  // 주소의 ?date=가 올바른 날짜가 아니면 오늘이 들어 있는 주를 보여 줘요.
  const dateParam = searchParams.get('date');
  const parsedDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? parseRecordDate(dateParam) : null;
  const selectedWeekDate = parsedDate && toRecordDate(parsedDate) === dateParam ? parsedDate : new Date();

  const today = new Date();
  const week = getWeekRange(selectedWeekDate);
  const monday = parseRecordDate(week.startDate);
  const isCurrentWeek = week.startDate === getWeekRange(today).startDate;
  const { week: weekNumber } = getWeekOfMonth(monday);

  const { data: report, isLoading, isError, isFetching, refetch } = useWeeklyReport(userId, selectedWeekDate);
  const { data: goalSettings, isLoading: isGoalLoading, isError: isGoalError } = useGoalSettings(userId);

  // 막대에서 고른 날(YYYY-MM-DD). null이면 일주일 보기예요.
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (!userId) return null;

  const goal = getActiveGoal(goalSettings);

  const moveToWeek = (date: Date) => {
    setSelectedDate(null);
    setSearchParams({ date: toRecordDate(date) });
  };

  // 같은 막대를 다시 누르면 일주일 보기로 돌아가요.
  const handleSelectDate = (recordDate: string | null) =>
    setSelectedDate(prev => (recordDate !== null && prev === recordDate ? null : recordDate));

  const selectedDay = report?.days.find(day => day.recordDate === selectedDate && day.hasRecord) ?? null;
  const lastRecordedDay = report ? ([...report.days].reverse().find(day => day.hasRecord) ?? null) : null;

  return (
    <div className="mx-auto flex w-full max-w-300 flex-col gap-5 px-4 pt-5 pb-12 md:gap-7 md:px-6 md:pt-8">
      <div className="flex h-[55px] justify-center md:h-24 md:justify-start">
        <DateHeader
          number={String(weekNumber).padStart(2, '0')}
          caption={formatWeekRange(monday, parseRecordDate(week.endDate))}
          label="주차"
          isCurrent={isCurrentWeek}
          currentLabel="이번 주로 이동"
          prevLabel="이전 주"
          nextLabel="다음 주"
          isNextDisabled={isCurrentWeek}
          onPrev={() => moveToWeek(addWeeks(monday, -1))}
          onNext={() => moveToWeek(addWeeks(monday, 1))}
          onCurrent={() => moveToWeek(new Date())}
        />
      </div>

      {isError ? (
        <div role="alert" className="flex flex-col items-start gap-3 text-sm text-(--ink-2)">
          <p className="m-0">주간 기록을 불러오지 못했어요.</p>
          <Button onClick={() => void refetch()} disabled={isFetching}>
            다시 시도
          </Button>
        </div>
      ) : isLoading || isGoalLoading || !report ? (
        <WeeklyReportSkeleton />
      ) : (
        <>
          <WeeklyStats report={report} goal={goal} today={today} />

          {/* 목표를 못 불러왔을 때는 '정하라'고 안내하지 않아요. */}
          {!goal && !isGoalError && (
            <p className="m-0 -mt-2 text-[13px] break-keep text-(--ink-2)">
              목표를 정하면 목표를 넘은 날과 달성률을 보여 줘요.{' '}
              <Link to="/mypage" className="font-bold text-(--brand) underline underline-offset-3">
                목표 설정하기
              </Link>
            </p>
          )}

          <WeeklyAiCard recordedDays={report.recordedDays} isCurrentWeek={isCurrentWeek} />

          <div className="grid items-start gap-x-12 gap-y-7 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <WeeklyCalorieChart
              days={report.days}
              goal={goal}
              today={today}
              selectedDate={selectedDay?.recordDate ?? null}
              onSelectDate={handleSelectDate}
            />
            <WeeklyNutritionPanel
              report={report}
              goal={goal}
              selectedDay={selectedDay}
              dayTabTarget={selectedDay ?? lastRecordedDay}
              onSelectDate={recordDate => setSelectedDate(recordDate)}
            />
          </div>
        </>
      )}
    </div>
  );
}
