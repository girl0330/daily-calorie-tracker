import { useSearchParams } from 'react-router-dom';
import SectionLayout from '../../components/common/SectionLayout';
import { useWeeklyReport } from '../../features/tracker/hooks/useWeeklyReport';
import { useAuthStore } from '../../store/authStore';
import { getWeekRange, parseRecordDate, toRecordDate } from '../../utils/date';

const formatNumber = (value: number) => value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const mealLabels = { breakfast: '아침', lunch: '점심', dinner: '저녁' };
const cardClass = 'rounded-xl border border-(--border-light) bg-(--bg-card)';

export default function WeeklyReportPage() {
  const user = useAuthStore(state => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const parsedDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? parseRecordDate(dateParam) : null;
  const selectedDate = parsedDate && toRecordDate(parsedDate) === dateParam ? parsedDate : new Date();
  const week = getWeekRange(selectedDate);
  const { data: report, isLoading, isError, isFetching, refetch } = useWeeklyReport(user?.id, selectedDate);

  const moveWeek = (offset: number) => {
    const date = parseRecordDate(week.startDate);
    date.setDate(date.getDate() + offset * 7);
    const params = new URLSearchParams(searchParams);
    params.set('date', toRecordDate(date));
    setSearchParams(params);
  };

  if (!user) return null;

  const maxCalories = Math.max(1, ...(report?.days.map(day => day.calories) ?? []));

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">한 주의 기록을 돌아보세요</h1>
          <p className="mt-2 text-(--text-secondary)">기록한 식사를 주간 통계로 확인해요.</p>
        </div>
        <nav aria-label="주 선택" className="flex items-center gap-2">
          <button
            type="button"
            aria-label="이전 주"
            onClick={() => moveWeek(-1)}
            className={`${cardClass} cursor-pointer px-3 py-2`}
          >
            〈
          </button>
          <span className={`${cardClass} px-3 py-2 text-sm tabular-nums`}>
            {week.startDate.replaceAll('-', '.')} ~ {week.endDate.replaceAll('-', '.')}
          </span>
          <button
            type="button"
            aria-label="다음 주"
            onClick={() => moveWeek(1)}
            className={`${cardClass} cursor-pointer px-3 py-2`}
          >
            〉
          </button>
        </nav>
      </header>

      {isLoading ? (
        <div role="status" className={`${cardClass} animate-pulse p-8`}>
          주간 기록을 불러오는 중...
        </div>
      ) : isError ? (
        <div role="alert" className={`${cardClass} p-6`}>
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
      ) : report ? (
        <>
          {report.recordedDays === 0 && (
            <p role="status" className={`${cardClass} p-4 text-(--text-secondary)`}>
              이번 주에 기록한 음식이 없어요. 일간 기록에서 식사를 추가해 주세요.
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: '기록한 날', value: `${report.recordedDays} / 7`, unit: '일' },
              { label: '기록된 총 칼로리', value: formatNumber(report.totalCalories), unit: 'kcal' },
              { label: '기록된 단백질', value: formatNumber(report.nutrients.protein), unit: 'g' },
            ].map(item => (
              <div key={item.label} className={`${cardClass} p-5`}>
                <p className="text-sm text-(--text-muted)">{item.label}</p>
                <p className="mt-2 text-2xl font-bold tabular-nums">
                  {item.value} <span className="text-base font-normal">{item.unit}</span>
                </p>
              </div>
            ))}
          </div>

          <SectionLayout
            title="AI가 정리한 이번 주"
            className="rounded-xl border border-(--primary-4)"
            description="AI 요약 준비 중"
          >
            <p className="text-(--text-secondary)">
              AI 요약은 추후 제공될 예정이에요. 아래에서 실제 기록의 집계 결과를 확인해 주세요.
            </p>
          </SectionLayout>

          <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
            <SectionLayout title="요일별 기록 칼로리" className={cardClass}>
              <div className="grid grid-cols-7 gap-2" aria-label="요일별 칼로리">
                {report.days.map((day, index) => (
                  <div key={day.recordDate} className="min-w-0 text-center">
                    <div className="flex h-44 flex-col justify-end gap-2">
                      <span className="text-xs text-(--text-muted) tabular-nums">
                        {day.hasRecord ? formatNumber(day.calories) : '기록 없음'}
                      </span>
                      <div
                        className={`mx-auto w-full max-w-12 rounded-t-md ${day.hasRecord ? 'bg-(--chart-calorie)' : 'border border-dashed border-(--primary-4)'}`}
                        style={{
                          height: day.hasRecord ? `${Math.max(2, (day.calories / maxCalories) * 128)}px` : '40px',
                        }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="border-t border-(--border-light) pt-2 text-sm">{weekdays[index]}</p>
                    <p className="mt-1 text-xs text-(--text-muted)">{day.recordDate.slice(5).replace('-', '/')}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-(--text-muted)">
                단위: kcal · 기록이 없는 날은 섭취량 0으로 판단하지 않아요.
              </p>
            </SectionLayout>

            <SectionLayout title="식사별 기록 비중" className={cardClass} description="기록된 총 칼로리 기준">
              <div className="flex flex-col gap-6">
                {report.meals.map(meal => (
                  <div key={meal.mealType}>
                    <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                      <span>{mealLabels[meal.mealType]}</span>
                      <span className="tabular-nums">
                        {meal.caloriePercentage === null ? '계산 불가' : `${formatNumber(meal.caloriePercentage)}%`}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-(--surface-3)" aria-hidden="true">
                      <div
                        className="h-full rounded-full bg-(--primary-3)"
                        style={{ width: `${meal.caloriePercentage ?? 0}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs text-(--text-muted)">{formatNumber(meal.calories)} kcal</p>
                  </div>
                ))}
              </div>
              {report.totalCalories === 0 && (
                <p className="mt-4 text-xs text-(--text-muted)">
                  기록된 총 칼로리가 0kcal이면 비중을 계산할 수 없어요.
                </p>
              )}
            </SectionLayout>
          </div>
        </>
      ) : null}
    </div>
  );
}
