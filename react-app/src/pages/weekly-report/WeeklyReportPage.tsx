import { Link, useSearchParams } from 'react-router-dom';
import { NutritionDoughnutChart } from '../../features/tracker/components/nutrition/NutritionDoughuntChart';
import { useWeeklyReport } from '../../features/tracker/hooks/useWeeklyReport';
import { useAuthStore } from '../../store/authStore';
import { caloriesByNutrient } from '../../utils/calculate';
import { getWeekRange, parseRecordDate, toRecordDate } from '../../utils/date';

const formatNumber = (value: number) =>
  value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const nutrientItems = [
  { key: 'carbs', label: '탄수화물', color: 'bg-(--chart-carbs)' },
  { key: 'protein', label: '단백질', color: 'bg-(--chart-protein)' },
  { key: 'fat', label: '지방', color: 'bg-(--chart-fat)' },
] as const;
export default function WeeklyReportPage() {
  const user = useAuthStore(state => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const parsedDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? parseRecordDate(dateParam) : null;
  const selectedDate = parsedDate && toRecordDate(parsedDate) === dateParam ? parsedDate : new Date();
  const week = getWeekRange(selectedDate);
  const { data: weeklyStats, isLoading, isError, isFetching, refetch } = useWeeklyReport(user?.id, selectedDate);

  const moveWeek = (offset: number) => {
    const date = parseRecordDate(week.startDate);
    date.setDate(date.getDate() + offset * 7);
    const params = new URLSearchParams(searchParams);
    params.set('date', toRecordDate(date));
    setSearchParams(params);
  };

  if (!user) return null;

  const maxCalories = Math.max(1, ...(weeklyStats?.days.map(day => day.calories) ?? []));

  const nutrientCalories = weeklyStats ? caloriesByNutrient(weeklyStats.nutrients) : null;
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-(--white)">
      <div className="mx-auto w-full max-w-[100rem] px-4 py-5 sm:px-6 lg:px-[clamp(24px,2.5vw,48px)] lg:py-10">
        <header className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">주간 리포트</h1>
          </div>
          <nav aria-label="주 선택" className="flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="이전 주"
              onClick={() => moveWeek(-1)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center text-(--text-secondary) transition hover:bg-(--neutral-5)"
            >
              <img src="/chevron-left-arrow.svg" alt="" className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold tabular-nums">
              {week.startDate.replaceAll('-', '.')} ~ {week.endDate.slice(5).replace('-', '.')}
            </span>
            <button
              type="button"
              aria-label="다음 주"
              onClick={() => moveWeek(1)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center text-(--text-secondary) transition hover:bg-(--neutral-5)"
            >
              <img src="/chevron-right-arrow.svg" alt="" className="h-4 w-4" />
            </button>
          </nav>
        </header>

        {isLoading ? (
          <div role="status" className="animate-pulse px-6 py-5 lg:py-3">
            주간 기록을 불러오는 중...
          </div>
        ) : isError ? (
          <div role="alert" className="px-6 py-5 lg:py-3">
            <p>주간 기록을 불러오지 못했습니다. 다시 시도해 주세요.</p>
            <button
              type="button"
              disabled={isFetching}
              onClick={() => void refetch()}
              className="mt-3 cursor-pointer rounded-lg bg-(--primary-1) px-4 py-2 text-white disabled:opacity-50"
            >
              {isFetching ? '불러오는 중...' : '다시 시도'}
            </button>
          </div>
        ) : weeklyStats ? (
          <>
            <p className="my-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-(--text-secondary)">
              <span>
                기록 일수 <strong>{weeklyStats.recordedDays} / 7일</strong>
              </span>
              <span className="border-l border-(--border-light) pl-4">
                총칼로리{' '}
                <strong>{weeklyStats.recordedDays ? formatNumber(weeklyStats.totalCalories) : '—'} kcal</strong>
              </span>
            </p>
            <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
              <section className="min-w-0 rounded-xl border border-(--border-light) bg-(--bg-card) p-4 sm:p-6 lg:col-start-2 lg:row-start-1">
                <h2 className="text-xl font-bold">칼로리 그래프</h2>
                <h3 className="mt-4 text-sm">영양소별 칼로리 비중</h3>
                <div className="flex items-center justify-center gap-5 py-5 sm:gap-8">
                  {nutrientCalories && (
                    <NutritionDoughnutChart
                      nutrientCalories={nutrientCalories}
                      centerLabel={
                        weeklyStats.totalCalories > 0 ? '' : weeklyStats.recordedDays ? '0 kcal' : '기록 없음'
                      }
                    />
                  )}
                  <ul className="grid gap-1.5 text-sm">
                    {nutrientItems.map(item => (
                      <li key={item.key} className="flex items-center gap-2">
                        <span aria-hidden="true" className={`size-2.5 rounded-sm ${item.color}`} />
                        <span>{item.label}</span>
                        <span className="ml-auto pl-2 tabular-nums">
                          {nutrientCalories && weeklyStats.totalCalories > 0
                            ? formatNumber((nutrientCalories[item.key] / weeklyStats.totalCalories) * 100) + '%'
                            : '—'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-(--border-light) pt-5">
                  <h3 className="text-sm">요일별 기록 칼로리</h3>
                  <div className="mt-3 flex min-h-40 items-center justify-center sm:min-h-48">
                    {weeklyStats.recordedDays ? (
                      <div
                        className="grid w-full max-w-[42rem] grid-cols-7 gap-1 text-center sm:gap-2"
                        aria-label="요일별 칼로리 (kcal)"
                      >
                        {weeklyStats.days.map((day, index) => (
                          <div key={day.recordDate} className="min-w-0">
                            <div className="flex h-28 flex-col items-center justify-end gap-1 sm:h-36">
                              <span className="text-[10px] leading-tight text-(--text-muted) tabular-nums sm:text-xs">
                                {day.hasRecord ? formatNumber(day.calories) : '기록 없음'}
                              </span>
                              <div
                                aria-hidden="true"
                                className={`w-3/5 max-w-12 rounded-t-lg ${day.hasRecord ? 'bg-(--chart-calorie)' : 'border border-dashed border-(--primary-4)'}`}
                                style={{
                                  height: day.hasRecord ? `${Math.max(2, (day.calories / maxCalories) * 72)}%` : '24px',
                                }}
                              />
                            </div>
                            <p className="border-t border-(--border-light) pt-1 text-sm">{weekdays[index]}</p>
                            <p className="text-xs text-(--text-muted)">{day.recordDate.slice(5).replace('-', '/')}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-sm text-(--text-secondary)">
                        <p>이번 주 식사 기록이 없어요.</p>
                        <p className="mt-1">식사를 기록하면 요일별 변화를 확인할 수 있어요.</p>
                        <Link
                          to={`/?date=${toRecordDate(selectedDate)}`}
                          className="mt-4 inline-block rounded-lg bg-(--primary-1) px-4 py-2 text-white"
                        >
                          식사 기록하러 가기
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </section>
              <section className="flex min-w-0 flex-col rounded-xl border border-(--border-light) bg-(--bg-card) p-4 sm:p-6 lg:col-start-1 lg:row-start-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">AI 주간 요약</h2>
                  {weeklyStats.recordedDays > 0 && (
                    <span className="rounded-full border border-(--border-light) px-3 py-1 text-xs text-(--text-secondary)">
                      준비 중
                    </span>
                  )}
                </div>
                <div className="mt-4 max-h-72 overflow-y-auto text-sm leading-relaxed wrap-anywhere text-(--text-secondary) lg:h-0 lg:max-h-none lg:flex-1">
                  {weeklyStats.recordedDays > 0 ? (
                    <p className="max-w-[55ch]">선택한 주의 식사 기록을 요약할 예정이에요.</p>
                  ) : (
                    <p className="grid h-full min-h-24 place-content-center text-center">
                      식사 기록이 쌓이면
                      <br />
                      주간 요약을 확인할 수 있어요.
                    </p>
                  )}
                </div>
              </section>
            </div>
            <nav
              aria-label="기록 화면"
              className="mt-5 flex justify-around border-t border-(--border-light) py-3 text-sm lg:hidden"
            >
              <Link to="/">일일</Link>
              <Link to="/monthly">월간</Link>
              <Link
                aria-current="page"
                className="font-semibold text-(--primary-1)"
                to={`/weekly-report?${searchParams}`}
              >
                주간
              </Link>
            </nav>
          </>
        ) : null}
      </div>
    </div>
  );
}
