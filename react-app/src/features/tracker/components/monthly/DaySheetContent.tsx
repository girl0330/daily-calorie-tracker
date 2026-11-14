import type { MealType } from '../../../../types/types';
import { formatGram, formatInteger } from '../../../../utils/formatNumber';
import { NUTRIENTS, type DaySummary } from '../../utils/monthlyCalendar';

type DaySheetContentProps = {
  /** 기록이 없는 날이면 null */
  day: DaySummary | null;
  /** 그날 일일 기록으로 이동해요. */
  onOpenDaily: () => void;
};

const MEALS: { key: MealType; label: string }[] = [
  { key: 'breakfast', label: '아침' },
  { key: 'lunch', label: '점심' },
  { key: 'dinner', label: '저녁' },
];

const captionClassName = 'mt-3.5 mb-1 text-xs text-(--muted)';
const valueClassName = 'text-right text-[13px] whitespace-nowrap text-(--ink-2) tabular-nums';

// 모바일 월간에서 날짜를 누르면 바텀시트 안에 보여 줘요. 목표와 비교하지 않고 먹은 양만 보여 줘요.
export default function DaySheetContent({ day, onOpenDaily }: DaySheetContentProps) {
  return (
    <>
      {day ? (
        <>
          <p className="m-0 border-b border-(--line) py-3.5">
            <b className="text-[30px] tracking-[-0.03em] tabular-nums">{formatInteger(day.kcal)}</b>
            <small className="ml-1 text-sm text-(--ink-2)">kcal</small>
          </p>

          <h3 className={`${captionClassName} font-normal`}>섭취량</h3>
          <dl className="m-0 flex flex-col gap-3 pt-1.5">
            {NUTRIENTS.map(({ key, label }) => (
              <div key={key} className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-3 text-sm">
                <dt>{label}</dt>
                <dd className={`m-0 ${valueClassName}`}>
                  <b className="text-[15px] text-(--ink)">{formatGram(day[key])}</b> g
                </dd>
              </div>
            ))}
          </dl>

          <h3 className={`${captionClassName} font-normal`}>식사별 칼로리</h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0 pt-1.5">
            {MEALS.map(({ key, label }) => {
              const kcal = day.mealKcal[key];
              const percent = day.kcal > 0 ? Math.round((kcal / day.kcal) * 100) : 0;

              return (
                <li key={key} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 text-sm">
                  <span>{label}</span>
                  <span aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-(--line-soft)">
                    <i className="block h-full rounded-full bg-(--kcal)" style={{ width: `${percent}%` }} />
                  </span>
                  <span className={valueClassName}>
                    <b className="text-[15px] text-(--ink)">{formatInteger(kcal)}</b> kcal · {percent}%
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="m-0 pt-5 pb-1.5 text-sm text-(--ink-2)">이날은 기록이 없어요.</p>
      )}

      {/* 시안의 .go 버튼 색은 라이트·다크 모두 같은 고정값이에요. */}
      <button
        type="button"
        onClick={onOpenDaily}
        className="mt-5.5 flex h-12 w-full cursor-pointer items-center justify-center rounded-[9px] bg-[#dbc0a7] text-[15px] font-bold whitespace-nowrap text-[#2b2623] transition-colors duration-150 hover:bg-[#cfae90] focus-visible:outline-offset-3"
      >
        {day ? '일일 기록에서 자세히 보기' : '일일 기록에서 기록하기'}
      </button>
    </>
  );
}
