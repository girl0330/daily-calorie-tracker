import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Goal } from '../../../goals/types';
import { formatInteger } from '../../../../utils/formatNumber';
import type { WeekDay } from '../../utils/weeklyReport';
import WeeklySection from './WeeklySection';

type WeeklyCalorieChartProps = {
  days: WeekDay[];
  goal: Goal | null;
  today: Date;
  /** 고른 날(YYYY-MM-DD). 일주일 보기면 null */
  selectedDate: string | null;
  onSelectDate: (recordDate: string) => void;
};

// 막대 높이의 기준. 이보다 많이 먹은 날이나 목표가 더 높으면 그 값에 맞춰요.
const BASE_MAX_KCAL = 2400;
// 막대 위 숫자 줄(20px) + 간격(6px) + 위 여백(12px): 목표선 위치를 계산할 때 써요.
const COLUMN_TOP = 38;

const overBarClassName = 'bg-[color-mix(in_srgb,var(--err)_55%,var(--brand-bar))]';

// 시안의 하루 섭취 칼로리 막대 7개. 목표선은 점선이고, 막대를 누르면 그날을 골라요.
export default function WeeklyCalorieChart({ days, goal, today, selectedDate, onSelectDate }: WeeklyCalorieChartProps) {
  const maxKcal = Math.max(BASE_MAX_KCAL, goal?.kcal ?? 0, ...days.map(day => day.calories));
  const isPicking = selectedDate !== null;

  return (
    <WeeklySection
      title={
        <>
          하루 섭취 칼로리 <small className="text-xs font-normal text-(--ink-2)">(kcal)</small>
        </>
      }
    >
      {/* --col: 막대 영역 높이. 목표선도 같은 값으로 위치를 잡아요. */}
      <div
        role="group"
        aria-label="하루 섭취 칼로리, 막대를 누르면 그날 영양소가 보여요"
        className="relative grid grid-cols-7 gap-2 border-b border-(--line) pt-3 pb-1.5 [--col:180px] max-md:[--col:140px]"
      >
        {days.map(day => {
          const isSelected = day.recordDate === selectedDate;
          const isToday = isSameDay(day.date, today);
          const isOver = !!goal && day.hasRecord && day.calories > goal.kcal;
          const label = format(day.date, 'M월 d일 EEEE', { locale: ko });

          const barClassName = !day.hasRecord
            ? 'bg-(--bar-empty)'
            : isSelected
              ? isOver
                ? 'bg-(--err)'
                : 'bg-(--brand)'
              : `${isOver ? overBarClassName : 'bg-(--brand-bar)'} group-hover:bg-(--brand) ${isPicking ? 'opacity-45' : ''}`;

          return (
            <button
              key={day.recordDate}
              type="button"
              onClick={() => onSelectDate(day.recordDate)}
              disabled={!day.hasRecord}
              aria-pressed={isSelected}
              aria-label={`${label}, ${
                day.hasRecord ? `${formatInteger(day.calories)}kcal${isOver ? ', 목표 넘음' : ''}` : day.date > today ? '아직 오지 않은 날' : '기록 없음'
              }`}
              className={`group flex cursor-pointer flex-col items-center gap-1.5 rounded-lg pb-1 transition-colors duration-150 enabled:hover:bg-(--brand-soft) disabled:cursor-default ${
                isSelected ? 'bg-(--brand-soft)' : 'bg-transparent'
              }`}
            >
              <span className="h-5 text-[13px] text-(--ink-2) tabular-nums max-md:text-[11px]">
                {day.hasRecord ? formatInteger(day.calories) : ''}
              </span>
              <span className="flex h-(--col) w-full items-end justify-center">
                <span
                  className={`block w-[min(44px,60%)] rounded-t-md ${barClassName}`}
                  style={{ height: day.hasRecord ? `max(6px, ${(day.calories / maxKcal) * 100}%)` : '2px' }}
                />
              </span>
              <span
                className={`border-b-2 pb-0.5 text-[13px] max-md:text-xs ${
                  isToday || isSelected ? 'font-bold text-(--ink)' : 'text-(--ink-2)'
                } ${isToday ? 'border-(--brand)' : 'border-transparent'}`}
              >
                {format(day.date, 'd(EEEEE)', { locale: ko })}
              </span>
            </button>
          );
        })}

        {goal && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-(--kcal)"
            style={{ top: `calc(${COLUMN_TOP}px + var(--col) * ${1 - Math.min(goal.kcal, maxKcal) / maxKcal})` }}
          />
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 max-md:flex-col max-md:items-end">
        <p className="m-0 text-xs text-(--muted)">막대를 누르면 그날 영양소를 볼 수 있어요.</p>
        <span aria-hidden="true" className="flex flex-wrap items-center gap-1.5 text-xs text-(--ink-2)">
          <i className="inline-block size-2.5 rounded-xs bg-(--brand-bar)" />
          섭취량
          {goal && (
            <>
              <i className={`ml-2 inline-block size-2.5 rounded-xs ${overBarClassName}`} />
              목표 넘음
              <i className="ml-2 inline-block w-4 border-t-2 border-dashed border-(--kcal)" />
              목표 {formatInteger(goal.kcal)}
            </>
          )}
        </span>
      </div>
    </WeeklySection>
  );
}
