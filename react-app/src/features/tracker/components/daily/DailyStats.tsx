import type { Goal } from '../../../goals/types';
import { formatGram, formatInteger } from '../../../../utils/formatNumber';

// 하루 합계. kcal은 탄·단·지에서 계산한 값이에요.
export type DailyTotals = {
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
};

type DailyStatsProps = {
  totals: DailyTotals;
  /** 목표 설정이 꺼져 있으면 null. 남은 칼로리, 막대, 달성률을 모두 숨겨요. */
  goal: Goal | null;
  /** 방금 추가한 음식의 값. 잠깐 '+N 방금 추가'로 보여 줘요. */
  recentDelta: DailyTotals | null;
};

const CELLS = [
  { key: 'kcal', label: '칼로리', unit: 'kcal', bar: 'bg-(--kcal)', format: formatInteger },
  { key: 'carbs', label: '탄수화물', unit: 'g', bar: 'bg-(--carbs)', format: formatGram },
  { key: 'protein', label: '단백질', unit: 'g', bar: 'bg-(--protein)', format: formatGram },
  { key: 'fat', label: '지방', unit: 'g', bar: 'bg-(--fat)', format: formatGram },
] as const;

// 시안의 .stats: 오늘 먹은 칼로리·탄·단·지 4칸. 모바일은 2×2로 나눠요.
export default function DailyStats({ totals, goal, recentDelta }: DailyStatsProps) {
  return (
    <dl className="m-0 grid grid-cols-2 border-t border-b border-t-(--ink) border-b-(--line) md:grid-cols-4">
      {CELLS.map(({ key, label, unit, bar, format }, index) => {
        const value = totals[key];
        const target = goal?.[key];
        const delta = recentDelta?.[key] ?? 0;

        // 칸 사이 선: 데스크톱은 왼쪽 선, 모바일 2×2는 오른쪽 칸에 왼쪽 선 + 윗줄에 아래 선
        const borderClassName = [
          index > 0 ? 'md:border-l' : '',
          index % 2 === 1 ? 'max-md:border-l' : '',
          index < 2 ? 'max-md:border-b' : '',
        ].join(' ');

        let note: string | null = null;
        if (target !== undefined) {
          if (key === 'kcal') {
            const left = Math.round(target - value);
            note = left >= 0 ? `${formatInteger(left)}kcal 남음` : `${formatInteger(-left)}kcal 초과`;
          } else {
            note = `${Math.round((value / target) * 100)}%`;
          }
        }

        return (
          <div key={key} className={`flex min-w-0 flex-col gap-1.5 border-(--line) p-3 md:px-6 md:py-4.5 ${borderClassName}`}>
            <dt className="text-[13px] text-(--ink-2)">{label}</dt>
            <dd className="m-0 text-[22px] font-bold tracking-[-0.02em] tabular-nums md:text-[28px]">
              {format(value)}
              <small className="text-sm font-normal text-(--ink-2)">
                {target !== undefined ? ` / ${format(target)}${unit}` : ` ${unit}`}
              </small>
            </dd>

            {target !== undefined && (
              <dd aria-hidden="true" className="m-0 h-1 bg-(--track)">
                <span
                  className={`block h-full transition-[width] duration-400 motion-reduce:transition-none ${bar}`}
                  style={{ width: `${Math.min(100, (value / target) * 100)}%` }}
                />
              </dd>
            )}

            {delta > 0 ? (
              <dd className="m-0 text-xs font-bold text-(--ok)">+{format(delta)} 방금 추가</dd>
            ) : (
              note && <dd className="m-0 text-xs text-(--ink-2)">{note}</dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}
