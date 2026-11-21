import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { addWeeks, format } from 'date-fns';
import Button from '../../components/common/Button';
import DateHeader from '../../components/common/DateHeader';
import GuestGuard from '../../components/common/GuestGuard';
import { useGoalSettings } from '../../features/goals/hooks/useGoalSettings';
import { getActiveGoal } from '../../features/goals/utils/goalCalc';
import WeeklyAiCard from '../../features/tracker/components/weekly/WeeklyAiCard';
import WeeklyCalorieChart from '../../features/tracker/components/weekly/WeeklyCalorieChart';
import WeeklyNutritionPanel from '../../features/tracker/components/weekly/WeeklyNutritionPanel';
import WeeklyStats from '../../features/tracker/components/weekly/WeeklyStats';
import { useWeeklyReport } from '../../features/tracker/hooks/useWeeklyReport';
import { getWeekOfMonth, getWeeklyReport } from '../../features/tracker/utils/weeklyReport';
import { useAuthStore } from '../../store/authStore';
import { getWeekRange, parseRecordDate, toRecordDate } from '../../utils/date';
import WeeklyReportSkeleton from './WeeklyReportSkeleton';

// 주의 범위 글자. 같은 달이면 '11월 2일~8일', 달이 바뀌면 '10월 26일~11월 1일'
const formatWeekRange = (start: Date, end: Date) =>
  start.getMonth() === end.getMonth()
    ? `${format(start, 'M월 d일')}~${format(end, 'd일')}`
    : `${format(start, 'M월 d일')}~${format(end, 'M월 d일')}`;

// 주간 리포트: 날짜 헤더 → 4칸 요약 → AI 카드 → 칼로리 막대 → 영양소 세 칸
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

  const { data: fetchedReport, isLoading, isError, isFetching, refetch } = useWeeklyReport(userId, selectedWeekDate);
  // 로그인 안 한 사람은 서버에 묻지 않고, 기록이 하나도 없는 빈 주로 보여 줘요.
  const report = userId ? fetchedReport : getWeeklyReport([], monday);
  const { data: goalSettings, isLoading: isGoalLoading, isError: isGoalError } = useGoalSettings(userId);

  // 지금 보고 있는 날(YYYY-MM-DD). null이면 일주일 보기예요.
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // 막대에서 마지막으로 누른 날. 날짜 탭이 이 날을 가리켜요. null이면 기본 날(아래 defaultDay)이에요.
  const [pickedDate, setPickedDate] = useState<string | null>(null);

  const goal = getActiveGoal(goalSettings);

  const moveToWeek = (date: Date) => {
    setSelectedDate(null);
    setPickedDate(null);
    setSearchParams({ date: toRecordDate(date) });
  };

  // 막대를 누르면 그날을 보고, 같은 막대를 다시 누르면 일주일 보기로 돌아가요.
  const handleSelectBar = (recordDate: string) => {
    setPickedDate(recordDate);
    setSelectedDate(prev => (prev === recordDate ? null : recordDate));
  };

  const findDay = (recordDate: string | null) => report?.days.find(day => day.recordDate === recordDate) ?? null;
  // 날짜 탭의 기본 날: 이번 주면 오늘, 지난주면 마지막으로 기록한 날(없으면 일요일)
  const defaultDay = report
    ? isCurrentWeek
      ? findDay(toRecordDate(today))
      : ([...report.days].reverse().find(day => day.hasRecord) ?? report.days[report.days.length - 1])
    : null;
  const selectedDay = findDay(selectedDate);
  const pickedDay = findDay(pickedDate) ?? defaultDay;

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
          <p className="m-0">주간 리포트를 불러오지 못했어요.</p>
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
            <GuestGuard>
              <p className="m-0 -mt-2 text-[13px] break-keep text-(--ink-2)">
                목표를 정하면 목표를 넘은 날과 달성률을 보여 줘요.{' '}
                <Link to="/mypage" className="font-bold text-(--brand) underline underline-offset-3">
                  목표 설정하기
                </Link>
              </p>
            </GuestGuard>
          )}

          {/* 로그인 안 한 사람은 AI 리포트를 만들 수 없어요. 버튼을 누르면 로그인 안내창이 떠요. */}
          <GuestGuard>
            <WeeklyAiCard userId={userId ?? ''} report={report} goal={goal} isCurrentWeek={isCurrentWeek} />
          </GuestGuard>

          {/* 칼로리 막대를 위에 길게 두고, 그 아래에 영양소 세 칸을 나란히 둬요. */}
          <WeeklyCalorieChart
            days={report.days}
            goal={goal}
            today={today}
            selectedDate={selectedDay?.recordDate ?? null}
            onSelectDate={handleSelectBar}
          />
          <WeeklyNutritionPanel
            report={report}
            goal={goal}
            selectedDay={selectedDay}
            pickedDay={pickedDay}
            onSelectDate={recordDate => setSelectedDate(recordDate)}
          />
        </>
      )}
    </div>
  );
}
