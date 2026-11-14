import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import PillTabs from '../../../../components/common/PillTabs';
import type { MealType } from '../../../../types/types';
import type { Goal } from '../../../goals/types';
import { formatInteger } from '../../../../utils/formatNumber';
import { NUTRIENTS, type NutrientKey } from '../../utils/nutrients';
import { getCalorieRatio, type WeekDay, type WeeklyReport } from '../../utils/weeklyReport';
import WeeklySection from './WeeklySection';

type WeeklyNutritionPanelProps = {
  report: WeeklyReport;
  goal: Goal | null;
  /** 막대에서 고른 날. 일주일 보기면 null */
  selectedDay: WeekDay | null;
  /** 날짜 탭이 가리킬 날: 고른 날, 없으면 마지막으로 기록한 날 */
  dayTabTarget: WeekDay | null;
  onSelectDate: (recordDate: string | null) => void;
};

const MEALS: { key: MealType; label: string }[] = [
  { key: 'breakfast', label: '아침' },
  { key: 'lunch', label: '점심' },
  { key: 'dinner', label: '저녁' },
];

const rowClassName = 'grid items-center gap-3 text-sm';
const trackClassName = 'h-2 overflow-hidden rounded-full bg-(--track)';
const valueClassName = 'text-right text-[13px] whitespace-nowrap text-(--ink-2) tabular-nums';

// 시안의 주간 오른쪽 묶음: 영양소 · 칼로리 비율 · 식사별 영양소. 막대에서 날을 고르면 그날 기준으로 바뀌어요.
export default function WeeklyNutritionPanel({
  report,
  goal,
  selectedDay,
  dayTabTarget,
  onSelectDate,
}: WeeklyNutritionPanelProps) {
  const [mealNutrient, setMealNutrient] = useState<NutrientKey>('carbs');

  const amounts = selectedDay ? selectedDay.nutrients : report.averageNutrients;
  const mealNutrients = selectedDay ? selectedDay.mealNutrients : report.mealNutrients;
  const ratio = getCalorieRatio(amounts);
  const dayLabel = selectedDay ? format(selectedDay.date, 'M월 d일', { locale: ko }) : '';

  const amountCaption = goal
    ? selectedDay
      ? '섭취량 / 목표 · 달성률'
      : '평균 섭취량 / 목표 · 달성률'
    : selectedDay
      ? '섭취량'
      : '평균 섭취량';

  const mealTotal = MEALS.reduce((sum, { key }) => sum + mealNutrients[key][mealNutrient], 0);
  const mealColor = NUTRIENTS.find(({ key }) => key === mealNutrient)?.dotClassName ?? '';

  return (
    <div className="flex min-w-0 flex-col gap-7">
      <WeeklySection
        title={selectedDay ? `${dayLabel} 영양소` : '일주일 영양소'}
        caption={amountCaption}
        action={
          <PillTabs
            ariaLabel="보는 기간"
            value={selectedDay ? 'day' : 'week'}
            onChange={value => onSelectDate(value === 'day' ? (dayTabTarget?.recordDate ?? null) : null)}
            tabs={[
              { value: 'week', label: '일주일' },
              {
                value: 'day',
                label: dayTabTarget ? format(dayTabTarget.date, 'M/d(EEEEE)', { locale: ko }) : '날짜 선택',
                disabled: !dayTabTarget,
              },
            ]}
          />
        }
      >
        <div className="flex flex-col gap-3.5 pt-3.5">
          {NUTRIENTS.map(({ key, label, dotClassName }) => {
            const value = Math.round(amounts[key]);
            const target = goal?.[key];

            if (!target) {
              return (
                <div key={key} className={`${rowClassName} grid-cols-[64px_minmax(0,1fr)]`}>
                  <span>{label}</span>
                  <span className={valueClassName}>
                    <b className="text-[15px] text-(--ink)">{formatInteger(value)}</b> g
                  </span>
                </div>
              );
            }

            const percent = Math.round((value / target) * 100);
            return (
              <div key={key} className={`${rowClassName} grid-cols-[64px_minmax(0,1fr)_128px]`}>
                <span>{label}</span>
                <span aria-hidden="true" className={trackClassName}>
                  <i className={`block h-full rounded-full ${dotClassName}`} style={{ width: `${Math.min(100, percent)}%` }} />
                </span>
                <span className={valueClassName}>
                  <b className="text-[15px] text-(--ink)">{formatInteger(value)}</b> / {formatInteger(target)}g · {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </WeeklySection>

      <WeeklySection title="칼로리 비율" caption="먹은 칼로리 중 각 영양소가 차지하는 비중">
        <div className="flex flex-col gap-3 pt-3.5">
          <div aria-hidden="true" className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-(--track)">
            {NUTRIENTS.map(({ key, dotClassName }) => (
              <i key={key} className={dotClassName} style={{ flex: ratio[key] }} />
            ))}
          </div>
          <p className="m-0 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-(--ink-2)">
            {NUTRIENTS.map(({ key, label, short, dotClassName }) => (
              <span key={key} className="inline-flex items-center gap-1.5">
                <i aria-hidden="true" className={`inline-block size-2 rounded-full ${dotClassName}`} />
                <span aria-hidden="true">{short}</span>
                <span className="sr-only">{label}</span>
                <b className="text-(--ink) tabular-nums">{ratio[key]}%</b>
              </span>
            ))}
          </p>
        </div>
      </WeeklySection>

      <WeeklySection
        title="식사별 영양소"
        caption={selectedDay ? `${dayLabel} 기준` : '이번 주 합계 기준'}
        action={
          <PillTabs
            ariaLabel="영양소 고르기"
            value={mealNutrient}
            onChange={setMealNutrient}
            tabs={NUTRIENTS.map(({ key, label, dotClassName }) => ({ value: key, label, dotClassName }))}
          />
        }
      >
        <div role="tabpanel" className="flex flex-col gap-3.5 pt-3.5">
          {MEALS.map(({ key, label }) => {
            const grams = mealNutrients[key][mealNutrient];
            const percent = mealTotal > 0 ? Math.round((grams / mealTotal) * 100) : 0;

            return (
              <div key={key} className={`${rowClassName} grid-cols-[64px_minmax(0,1fr)_128px]`}>
                <span>{label}</span>
                <span aria-hidden="true" className={trackClassName}>
                  <i className={`block h-full rounded-full ${mealColor}`} style={{ width: `${percent}%` }} />
                </span>
                <span className={valueClassName}>
                  <b className="text-[15px] text-(--ink)">{formatInteger(grams)}g</b> · {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </WeeklySection>
    </div>
  );
}
