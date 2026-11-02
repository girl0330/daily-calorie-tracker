import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionLayout from '../../components/common/SectionLayout';
import { useWeeklyReport } from '../../features/tracker/hooks/useWeeklyReport';
import { useAuthStore } from '../../store/authStore';
import { caloriesByNutrient } from '../../utils/calculate';
import { getWeekRange, parseRecordDate, toRecordDate } from '../../utils/date';

const formatNumber = (value: number) => value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const mealLabels = { breakfast: '아침', lunch: '점심', dinner: '저녁' };
const nutrientItems = [
  { key: 'carbs', label: '탄수화물', color: 'bg-(--chart-carbs)' },
  { key: 'protein', label: '단백질', color: 'bg-(--chart-protein)' },
  { key: 'fat', label: '지방', color: 'bg-(--chart-fat)' },
] as const;
const proportionTabs = [
  { key: 'meal', label: '식사별' },
  { key: 'nutrient', label: '영양소별' },
] as const;

export default function WeeklyReportPage() {
  const [proportionType, setProportionType] = useState<'meal' | 'nutrient'>('meal');
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
  const proportions = weeklyStats
    ? proportionType === 'meal'
      ? weeklyStats.meals.map(meal => ({
          key: meal.mealType,
          label: mealLabels[meal.mealType],
          calories: meal.calories,
          percentage: meal.caloriePercentage,
          color: 'bg-(--primary-3)',
        }))
      : nutrientItems.map(item => ({
          key: item.key,
          label: item.label,
          calories: nutrientCalories![item.key],
          percentage:
            weeklyStats.totalCalories > 0 ? (nutrientCalories![item.key] / weeklyStats.totalCalories) * 100 : null,
          color: item.color,
        }))
    : [];

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-(--white) p-3 lg:p-5">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-(--neutral-4) px-6 py-5 lg:py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">주간 리포트</h1>
        </div>
        <nav aria-label="주 선택" className="flex items-center gap-2">
          <button
            type="button"
            aria-label="이전 주"
            onClick={() => moveWeek(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center text-(--text-secondary) transition hover:bg-(--neutral-5)"
          >
            <img src="/chevron-left-arrow.svg" alt="" className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold tabular-nums">
            {week.startDate.replaceAll('-', '.')} ~ {week.endDate.replaceAll('-', '.')}
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
          {weeklyStats.recordedDays === 0 && (
            <p role="status" className="border-b border-(--neutral-4) px-6 py-5 text-(--text-secondary)">
              선택한 주에 기록한 음식이 없어요. 일간 기록에서 식사를 추가해 주세요.
            </p>
          )}
          <div className="grid border-x border-b border-(--neutral-4) lg:flex-1 lg:grid-cols-[1.28fr_1fr]">
            <section className="relative isolate flex flex-col justify-center overflow-hidden border-b border-(--neutral-4) px-6 py-8 lg:border-r lg:border-b-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-4 bottom-6 -z-10 h-24 w-1/3 -rotate-12 rounded-[50%] [mask-image:linear-gradient(35deg,transparent,black)] opacity-40 [background:radial-gradient(#bc7146_1px,transparent_1px)_0_0/10px_10px]"
              />
              <span aria-hidden="true" className="text-3xl text-[#b9704f]">
                ✦
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight lg:text-3xl">AI가 정리한 이번 주</h2>
              <span className="mt-4 self-start rounded-full border px-3 py-1 text-xs text-(--text-secondary)">
                준비 중
              </span>
              <p className="mt-4 text-(--text-secondary)">선택한 주의 식사 기록을 요약할 예정이에요.</p>
            </section>
            <section className="min-w-0 px-5 py-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold">기록 비중</h2>
                <div className="mb-3 flex lg:mb-1" role="group" aria-label="기록 비중 기준">
                  {proportionTabs.map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      aria-pressed={proportionType === tab.key}
                      onClick={() => setProportionType(tab.key)}
                      className={`cursor-pointer rounded-md px-3 py-2 text-sm transition ${proportionType === tab.key ? 'bg-(--surface-3) font-semibold text-(--primary-1)' : 'border-(--neutral-4) text-(--text-muted) hover:text-(--text-primary)'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="sr-only">기록된 총 칼로리 기준</p>
              <div className="flex flex-col gap-5">
                {proportions.map(item => (
                  <div key={item.key}>
                    <div className="mb-2 flex items-center justify-between gap-2 text-sm lg:mb-1">
                      <span>{item.label}</span>
                      <span className="ml-auto tabular-nums">
                        {item.percentage === null ? '계산 불가' : `${formatNumber(item.percentage)}%`}
                      </span>
                      <span className="text-xs text-(--text-muted)">{formatNumber(item.calories)} kcal</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-(--surface-3)" aria-hidden="true">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.percentage ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {weeklyStats.totalCalories === 0 && (
                <p className="mt-4 text-xs text-(--text-muted) lg:mt-2">
                  기록된 총 칼로리가 0kcal이면 비중을 계산할 수 없어요.
                </p>
              )}
            </section>
          </div>
          <SectionLayout
            title="요일별 기록 칼로리"
            className="border-x border-b border-(--neutral-4) bg-(--white)"
            contentClassName="flex flex-1 flex-col justify-end"
          >
            <div className="grid grid-cols-7 gap-2" aria-label="요일별 칼로리">
              {weeklyStats.days.map((day, index) => (
                <div key={day.recordDate} className="min-w-0 text-center">
                  <div className="flex h-44 flex-col justify-end gap-2 lg:h-[clamp(150px,23vh,220px)]">
                    <span className="text-xs text-(--text-muted) tabular-nums">
                      {day.hasRecord ? formatNumber(day.calories) : '기록 없음'}
                    </span>
                    <div
                      className={`mx-auto w-full max-w-12 rounded-t-xl ${day.hasRecord ? 'bg-(--chart-calorie)' : 'border border-dashed border-(--primary-4)'}`}
                      style={{
                        height: day.hasRecord ? `${Math.max(2, (day.calories / maxCalories) * 72)}%` : '40px',
                      }}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="border-t border-(--border-light) pt-2 text-sm">{weekdays[index]}</p>
                  <p className="mt-1 text-xs text-(--text-muted)">{day.recordDate.slice(5).replace('-', '/')}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-(--text-muted) lg:mt-2">
              단위: kcal · 기록이 없는 날은 섭취량 0으로 판단하지 않아요.
            </p>
          </SectionLayout>
        </>
      ) : null}
    </div>
  );
}
