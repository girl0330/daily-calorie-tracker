import { Link } from 'react-router-dom';
import type { Goal } from '../../../goals/types';
import { formatInteger } from '../../../../utils/formatNumber';
import { NUTRIENTS } from '../../utils/monthlyCalendar';

type MonthlyGoalProps = {
  /** 목표 설정이 꺼져 있으면 null. 그때는 '목표 설정하기' 안내를 보여 줘요. */
  goal: Goal | null;
  /** 데스크톱: 날짜 헤더 오른쪽 / 모바일: 달력 바로 위 한 줄 */
  layout: 'desktop' | 'mobile';
};

const linkClassName = 'font-bold text-(--brand) underline underline-offset-3';

// 화면 읽기 프로그램용 한 문장. 눈에 보이는 '탄 324g' 같은 줄임말 대신 읽어요.
const goalSentence = (goal: Goal) =>
  `하루 목표 ${formatInteger(goal.kcal)}kcal, ${NUTRIENTS.map(({ key, label }) => `${label} ${formatInteger(goal[key])}g`).join(', ')}`;

// 시안의 월간 목표: 지금 설정한 하루 목표를 보여 줘요. 달력 칸과 비교하지는 않아요.
export default function MonthlyGoal({ goal, layout }: MonthlyGoalProps) {
  if (layout === 'desktop') {
    // 날짜 줄 높이(76px)를 차지하고 아래쪽, '월' 글자 높이에 맞춰요.
    const boxClassName = 'mt-5 flex min-h-19 pb-1 tabular-nums';

    if (!goal) {
      return (
        <p className={`${boxClassName} mb-0 items-end gap-1 text-[13px] text-(--ink-2)`}>
          하루 목표가 꺼져 있어요.
          <Link to="/mypage" className={linkClassName}>
            목표 설정하기
          </Link>
        </p>
      );
    }

    return (
      <div className={`${boxClassName} flex-col items-end justify-end gap-0.5`}>
        <p className="sr-only">{goalSentence(goal)}</p>
        <span aria-hidden="true" className="text-xs text-(--muted)">
          하루 목표
        </span>
        <span aria-hidden="true" className="text-[22px] leading-tight font-bold tracking-[-0.02em]">
          {formatInteger(goal.kcal)}
          <small className="ml-[3px] text-[13px] font-normal text-(--ink-2)">kcal</small>
        </span>
        <span aria-hidden="true" className="flex gap-2.5 text-xs text-(--ink-2)">
          {NUTRIENTS.map(({ key, short, dotClassName }) => (
            <span key={key} className="inline-flex items-center gap-1 whitespace-nowrap">
              <i className={`inline-block size-[7px] rounded-full ${dotClassName}`} />
              {short} <b className="text-(--ink)">{formatInteger(goal[key])}</b>g
            </span>
          ))}
        </span>
      </div>
    );
  }

  // 모바일 한 줄. 켜짐·꺼짐 모두 높이 36px, 가운데 정렬이라 바꿔도 달력과 글씨가 움직이지 않아요.
  const rowClassName =
    'm-0 flex h-9 shrink-0 items-center justify-center gap-3 rounded-lg bg-(--brand-soft) px-3 text-xs leading-5 whitespace-nowrap text-(--ink-2) tabular-nums';

  if (!goal) {
    return (
      <p className={rowClassName}>
        하루 목표가 꺼져 있어요.
        <Link to="/mypage" className={linkClassName}>
          목표 설정하기
        </Link>
      </p>
    );
  }

  return (
    <div className={rowClassName}>
      <p className="sr-only">{goalSentence(goal)}</p>
      <span aria-hidden="true">
        하루 목표 <b className="text-sm text-(--ink)">{formatInteger(goal.kcal)}</b> kcal
      </span>
      <span aria-hidden="true" className="flex gap-2">
        {NUTRIENTS.map(({ key, short, dotClassName }) => (
          <span key={key} className="inline-flex items-center gap-[3px]">
            <i className={`inline-block size-1.5 rounded-full ${dotClassName}`} />
            {short} {formatInteger(goal[key])}g
          </span>
        ))}
      </span>
    </div>
  );
}
