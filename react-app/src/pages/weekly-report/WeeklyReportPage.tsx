import { formatNumber } from '../../utils/formatNumber';
import { Link, useSearchParams } from 'react-router-dom';
import { NutritionDoughnutChart } from '../../features/tracker/components/nutrition/NutritionDoughuntChart';
import { useWeeklyReport } from '../../features/tracker/hooks/useWeeklyReport';
import { useAuthStore } from '../../store/authStore';
import { caloriesByNutrient } from '../../utils/calculate';
import { getWeekRange, parseRecordDate, toRecordDate } from '../../utils/date';

const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const nutrientItems = [
  { key: 'carbs', label: '탄수화물', color: 'bg-(--chart-carbs)' },
  { key: 'protein', label: '단백질', color: 'bg-(--chart-protein)' },
  { key: 'fat', label: '지방', color: 'bg-(--chart-fat)' },
] as const;
const weekNavButtonClassName =
  'flex size-10 cursor-pointer items-center justify-center rounded-sm text-(--text-secondary) transition-colors duration-150 hover:bg-(--bg-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)';

export default function WeeklyReportPage() {
  const user = useAuthStore(state => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const parsedDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? parseRecordDate(dateParam) : null;
  const selectedDate = parsedDate && toRecordDate(parsedDate) === dateParam ? parsedDate : new Date();
  const week = getWeekRange(selectedDate);
  const today = toRecordDate(new Date());
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
    <div className="flex min-h-0 flex-1 flex-col bg-(--surface)">
      <div className="mx-auto w-full max-w-400 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-semibold lg:text-3xl lg:tracking-tight">주간 리포트</h1>
          <nav aria-label="주 선택" className="flex items-center justify-between gap-2">
            <button type="button" aria-label="이전 주" onClick={() => moveWeek(-1)} className={weekNavButtonClassName}>
              <img src="/chevron-left-arrow.svg" alt="" className="size-4" />
            </button>
            <span className="text-sm font-medium tabular-nums">
              {week.startDate.replaceAll('-', '.')} ~ {week.endDate.slice(5).replace('-', '.')}
            </span>
            <button type="button" aria-label="다음 주" onClick={() => moveWeek(1)} className={weekNavButtonClassName}>
              <img src="/chevron-right-arrow.svg" alt="" className="size-4" />
            </button>
          </nav>
        </header>

        {isLoading ? (
          <p role="status" className="py-6 text-sm text-(--text-secondary)">
            주간 기록을 불러오는 중
          </p>
        ) : isError ? (
          <div role="alert" className="py-6 text-sm text-(--text-secondary)">
            <p>주간 기록을 불러오지 못했어요. 다시 시도해 주세요.</p>
            <button
              type="button"
              disabled={isFetching}
              onClick={() => void refetch()}
              className="mt-4 cursor-pointer rounded-sm bg-(--brand) px-4 py-2 text-(--text-on-primary) transition-colors duration-150 hover:bg-(--brand-hover) disabled:opacity-50"
            >
              {isFetching ? '불러오는 중' : '다시 시도'}
            </button>
          </div>
        ) : weeklyStats ? (
          <>
            <dl className="mt-4 flex gap-8 lg:mt-6">
              <div>
                <dt className="text-sm text-(--text-secondary)">기록 일수</dt>
                <dd className="mt-1 text-2xl font-medium tabular-nums">
                  {weeklyStats.recordedDays}
                  <span className="ml-1 text-sm font-normal text-(--text-muted)">/ 7일</span>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-(--text-secondary)">총칼로리</dt>
                <dd className="mt-1 text-2xl font-medium tabular-nums">
                  {weeklyStats.recordedDays ? formatNumber(weeklyStats.totalCalories) : '—'}
                  <span className="ml-1 text-sm font-normal text-(--text-muted)">kcal</span>
                </dd>
              </div>
            </dl>
            <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-6">
              <section className="min-w-0 rounded-xl border border-(--border-light) bg-(--bg-card) p-4 sm:p-6 lg:col-start-2 lg:row-start-1">
                <h2 className="text-lg font-semibold">칼로리 그래프</h2>
                <h3 className="mt-4 text-sm text-(--text-secondary)">영양소별 칼로리 비중</h3>
                <div className="flex items-center justify-center gap-6 py-6 sm:gap-8">
                  {nutrientCalories && (
                    <NutritionDoughnutChart
                      nutrientCalories={nutrientCalories}
                      centerLabel={
                        weeklyStats.totalCalories > 0
                          ? ''
                          : weeklyStats.recordedDays
                            ? `${formatNumber(0)} kcal`
                            : '기록 없음'
                      }
                    />
                  )}
                  <ul className="grid gap-2 text-sm">
                    {nutrientItems.map(item => (
                      <li key={item.key} className="flex items-center gap-2">
                        <span aria-hidden="true" className={`size-2.5 rounded-full ${item.color}`} />
                        <span>{item.label}</span>
                        <span className="ml-auto pl-4 text-(--text-secondary) tabular-nums">
                          {nutrientCalories && weeklyStats.totalCalories > 0
                            ? formatNumber((nutrientCalories[item.key] / weeklyStats.totalCalories) * 100) + '%'
                            : '—'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-(--border-light) pt-6">
                  <h3 className="text-sm text-(--text-secondary)">요일별 기록 칼로리</h3>
                  <div className="mt-4 flex min-h-40 items-center justify-center sm:min-h-48">
                    {weeklyStats.recordedDays ? (
                      <div
                        className="grid w-full max-w-3xl grid-cols-7 gap-1 text-center sm:gap-2"
                        aria-label="요일별 칼로리 (kcal)"
                      >
                        {weeklyStats.days.map((day, index) => {
                          const isToday = day.recordDate === today;
                          return (
                            <div key={day.recordDate} className="min-w-0">
                              <div className="flex h-28 flex-col items-center justify-end gap-1 sm:h-36">
                                <span
                                  className={`text-[11px] leading-tight tabular-nums sm:text-xs ${isToday ? 'font-medium text-(--text-primary)' : 'text-(--text-muted)'}`}
                                >
                                  {day.hasRecord ? (
                                    formatNumber(day.calories)
                                  ) : (
                                    <>
                                      <span aria-hidden="true">—</span>
                                      <span className="sr-only">기록 없음</span>
                                    </>
                                  )}
                                </span>
                                <div
                                  aria-hidden="true"
                                  className={`w-3/5 max-w-12 rounded-t-[4px] ${
                                    day.hasRecord
                                      ? isToday
                                        ? 'bg-(--brand)'
                                        : 'bg-(--brand-bar)'
                                      : 'border border-dashed border-(--border-medium)'
                                  }`}
                                  style={{
                                    height: day.hasRecord
                                      ? `${Math.max(2, (day.calories / maxCalories) * 72)}%`
                                      : '24px',
                                  }}
                                />
                              </div>
                              <p
                                className={`border-t border-(--border-light) pt-1 text-sm ${isToday ? 'font-medium text-(--brand)' : ''}`}
                              >
                                {weekdays[index]}
                              </p>
                              <p className="text-xs text-(--text-muted) tabular-nums">
                                {isToday ? '오늘' : day.recordDate.slice(5).replace('-', '/')}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-sm text-(--text-secondary)">
                        <p>이번 주 식사 기록이 없어요</p>
                        <p className="mt-1">식사를 기록하면 요일별 변화를 확인할 수 있어요</p>
                        <Link
                          to={`/?date=${toRecordDate(selectedDate)}`}
                          className="mt-4 inline-block rounded-sm bg-(--brand) px-4 py-2 text-(--text-on-primary) transition-colors duration-150 hover:bg-(--brand-hover)"
                        >
                          식사 기록하러 가기
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </section>
              <section className="flex min-w-0 flex-col rounded-xl border border-(--border-light) bg-(--bg-card) p-4 sm:p-6 lg:col-start-1 lg:row-start-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-lg font-semibold">AI 주간 요약</h2>
                  {weeklyStats.recordedDays > 0 && <span className="text-xs text-(--text-muted)">준비 중</span>}
                </div>
                <div className="mt-4 max-h-72 overflow-y-auto text-sm leading-relaxed wrap-anywhere text-(--text-secondary) lg:h-0 lg:max-h-none lg:flex-1">
                  {weeklyStats.recordedDays > 0 ? (
                    <p className="max-w-[55ch]">선택한 주의 식사 기록을 요약할 예정이에요</p>
                  ) : (
                    <p className="grid h-full min-h-24 place-content-center text-center">
                      식사 기록이 쌓이면
                      <br />
                      주간 요약을 확인할 수 있어요
                    </p>
                  )}
                </div>
              </section>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
