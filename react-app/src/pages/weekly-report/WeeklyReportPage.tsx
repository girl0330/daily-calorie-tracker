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

  const nutrientCalories = report ? caloriesByNutrient(report.nutrients) : null;
  const proportions = report
    ? proportionType === 'meal'
      ? report.meals.map(meal => ({
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
          percentage: report.totalCalories > 0 ? (nutrientCalories![item.key] / report.totalCalories) * 100 : null,
          color: item.color,
        }))
    : [];

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-(--white)">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-(--neutral-4) px-6 py-5">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">한 주의 기록을 돌아보세요</h1>
          <p className="mt-2 text-(--text-secondary)">기록한 식사를 주간 통계로 확인해요.</p>
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
        <div role="status" className="animate-pulse px-6 py-5">
          주간 기록을 불러오는 중...
        </div>
      ) : isError ? (
        <div role="alert" className="px-6 py-5">
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
            <p role="status" className="border-b border-(--neutral-4) px-6 py-5 text-(--text-secondary)">
              이번 주에 기록한 음식이 없어요. 일간 기록에서 식사를 추가해 주세요.
            </p>
          )}
          <div className="grid border-b border-(--neutral-4) xl:grid-cols-[2fr_1fr]">
            <SectionLayout
              title="AI가 정리한 이번 주"
              className="min-h-72 border-b border-(--neutral-4) bg-(--white) xl:border-r xl:border-b-0"
              contentClassName="flex flex-1 items-center"
              description="AI 요약 준비 중"
            >
              <p className="text-(--text-secondary)">
                AI 요약은 추후 제공될 예정이에요. 아래에서 실제 기록의 집계 결과를 확인해 주세요.
              </p>
            </SectionLayout>
            <SectionLayout title="기록 비중" className="bg-(--white)">
              <div className="mb-3 flex" role="group" aria-label="기록 비중 기준">
                {proportionTabs.map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    aria-pressed={proportionType === tab.key}
                    onClick={() => setProportionType(tab.key)}
                    className={`cursor-pointer border-b-2 px-3 py-2 text-sm transition ${proportionType === tab.key ? 'border-(--primary-1) font-semibold text-(--primary-1)' : 'border-(--neutral-4) text-(--text-muted) hover:text-(--text-primary)'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <p className="mb-5 text-sm text-(--text-muted)">기록된 총 칼로리 기준</p>
              <div className="flex flex-col gap-6">
                {proportions.map(item => (
                  <div key={item.key}>
                    <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                      <span>{item.label}</span>
                      <span className="tabular-nums">
                        {item.percentage === null ? '계산 불가' : `${formatNumber(item.percentage)}%`}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-(--surface-3)" aria-hidden="true">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.percentage ?? 0}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs text-(--text-muted)">{formatNumber(item.calories)} kcal</p>
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
          <SectionLayout
            title="요일별 기록 칼로리"
            className="border-b border-(--neutral-4) bg-(--white)"
            contentClassName="flex flex-1 flex-col justify-end"
          >
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
        </>
      ) : null}
    </div>
  );
}
