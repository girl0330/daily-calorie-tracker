import type { Goal } from '../../../goals/types';
import { formatInteger } from '../../../../utils/formatNumber';
import type { WeekDay, WeeklyReport } from '../../utils/weeklyReport';

type WeeklyStatsProps = {
  report: WeeklyReport;
  /** 목표 설정이 꺼져 있으면 null. 넷째 칸이 '가장 많이 먹은 날'로 바뀌어요. */
  goal: Goal | null;
  today: Date;
};

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

// 받침이 있으면 '은', 없으면 '는'. 예) 목은, 토는
const topicParticle = (word: string) => ((word.charCodeAt(word.length - 1) - 0xac00) % 28 ? '은' : '는');

type Cell = { label: string; value: number; unit: string; note: string; overDays?: { weekday: string; over: number }[] };

// 시안의 주간 .stats 4칸. 모바일은 2×2로 나눠요.
export default function WeeklyStats({ report, goal, today }: WeeklyStatsProps) {
  const weekdayOf = (day: WeekDay) => WEEKDAYS[report.days.indexOf(day)];
  const recorded = report.days.filter(day => day.hasRecord);
  const empty = report.days.filter(day => !day.hasRecord);
  const missing = empty.filter(day => day.date <= today).map(weekdayOf).join('·');
  const future = empty.filter(day => day.date > today).map(weekdayOf).join('·');

  const recordNote = missing
    ? `${missing} 기록이 비었어요`
    : future
      ? `${future}${topicParticle(future)} 기록이 없어요`
      : '빠진 날 없이 기록했어요';

  let fourth: Cell;
  if (goal) {
    const overDays = recorded
      .filter(day => day.calories > goal.kcal)
      .map(day => ({ weekday: weekdayOf(day), over: day.calories - goal.kcal }));
    fourth = {
      label: '목표 넘은 날',
      value: overDays.length,
      unit: '일',
      note: overDays.length ? '' : '없어요',
      overDays,
    };
  } else {
    const top = recorded.reduce<WeekDay | null>((max, day) => (!max || day.calories > max.calories ? day : max), null);
    fourth = {
      label: '가장 많이 먹은 날',
      value: top?.calories ?? 0,
      unit: ' kcal',
      note: top ? `${weekdayOf(top)}요일` : '기록이 없어요',
    };
  }

  const cells: Cell[] = [
    { label: '기록한 날', value: report.recordedDays, unit: ' / 7일', note: recordNote },
    { label: '총 칼로리', value: report.totalCalories, unit: ' kcal', note: '기록한 날 합계' },
    {
      label: '하루 평균',
      value: report.averageCalories,
      unit: ' kcal',
      note: goal ? `목표 ${formatInteger(goal.kcal)}kcal` : '기록한 날 평균',
    },
    fourth,
  ];

  return (
    <dl className="m-0 grid grid-cols-2 border-t border-b border-t-(--ink) border-b-(--line) md:grid-cols-4">
      {cells.map(({ label, value, unit, note, overDays }, index) => {
        // 칸 사이 선: 데스크톱은 왼쪽 선, 모바일 2×2는 오른쪽 칸에 왼쪽 선 + 윗줄에 아래 선
        const borderClassName = [
          index > 0 ? 'md:border-l' : '',
          index % 2 === 1 ? 'max-md:border-l' : '',
          index < 2 ? 'max-md:border-b' : '',
        ].join(' ');

        return (
          <div
            key={label}
            className={`grid min-w-0 grid-cols-[auto_minmax(0,1fr)] content-start gap-x-3 gap-y-1.5 border-(--line) p-3 md:px-6 md:py-4.5 ${borderClassName}`}
          >
            <dt className="col-start-1 text-[13px] text-(--ink-2)">{label}</dt>
            <dd className="col-start-1 m-0 text-[22px] font-bold tracking-[-0.02em] tabular-nums md:text-[28px]">
              {formatInteger(value)}
              <small className="text-sm font-normal text-(--ink-2)">{unit}</small>
            </dd>
            {note && <dd className="col-start-1 m-0 text-xs break-keep text-(--ink-2)">{note}</dd>}

            {/* 목표 넘은 날: 오른쪽에 요일별로 얼마나 넘었는지. 4일 이상이면 많이 넘은 2일 + '외 N일' */}
            {overDays && overDays.length > 0 && (
              <dd className="col-start-2 row-span-3 row-start-1 m-0 self-start justify-self-end">
                <ul aria-label="목표를 넘은 날" className="m-0 flex list-none flex-col items-end gap-0.5 p-0 text-xs text-(--ink-2) tabular-nums">
                  {(overDays.length <= 3 ? overDays : [...overDays].sort((a, b) => b.over - a.over).slice(0, 2)).map(
                    ({ weekday, over }) => (
                      <li key={weekday}>
                        {weekday} <b className="text-(--err)">+{formatInteger(over)}</b>
                      </li>
                    )
                  )}
                  {overDays.length > 3 && <li className="text-(--muted)">외 {overDays.length - 2}일</li>}
                </ul>
              </dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}
