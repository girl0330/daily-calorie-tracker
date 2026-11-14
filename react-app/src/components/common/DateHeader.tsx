type DateHeaderProps = {
  /** 크게 보여 줄 숫자. 일일은 날짜(05), 월간은 월(11), 주간은 주차(1) */
  number: string;
  /** 숫자 오른쪽 윗줄. 예: '2026년 11월' */
  caption: string;
  /** 숫자 오른쪽 아랫줄. 예: '목요일', '월', '주차' */
  label: string;
  /** 오늘(이번 달, 이번 주)을 보고 있으면 '돌아가기' 배지를 숨겨요. */
  isCurrent: boolean;
  currentLabel: string;
  prevLabel: string;
  nextLabel: string;
  /** 더 갈 곳이 없을 때(월간에서 이번 달) 다음 버튼을 흐리게 하고 눌러도 아무 일도 없게 해요. */
  isNextDisabled?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onCurrent: () => void;
};

const arrowProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  'aria-hidden': true,
} as const;

const navButtonClassName =
  'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-(--ink) transition-colors duration-150 hover:bg-(--skel)';

// 시안의 .date: 일일·월간·주간 페이지 맨 위의 큰 숫자 헤더
export default function DateHeader({
  number,
  caption,
  label,
  isCurrent,
  currentLabel,
  prevLabel,
  nextLabel,
  isNextDisabled = false,
  onPrev,
  onNext,
  onCurrent,
}: DateHeaderProps) {
  // disabled 대신 aria-disabled를 써요. 다음 버튼을 눌러 이번 달에 닿는 순간 disabled가 되면
  // 브라우저가 포커스를 빼앗아 body로 보내서, 키보드로 쓰던 사람이 위치를 잃어요.
  const handleNext = () => {
    if (!isNextDisabled) onNext();
  };

  return (
    <div className="flex items-center gap-2 md:mt-5 md:gap-4">
      <button type="button" onClick={onPrev} aria-label={prevLabel} className={navButtonClassName}>
        <svg {...arrowProps}>
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      {/* 숫자 길이가 바뀌어도 화살표 위치가 그대로이도록 폭을 고정해요. */}
      <div className="flex w-53.5 items-end justify-center gap-2.5 md:w-64 md:gap-3.5">
        <span className="text-[60px] leading-[0.9] font-bold tracking-[-0.05em] tabular-nums md:text-[84px]">
          {number}
        </span>

        <span className="flex shrink-0 flex-col leading-tight md:pb-1">
          <span className="text-sm text-(--ink-2)">{caption}</span>
          <span className="flex items-center gap-2">
            <strong className="text-xl">{label}</strong>
            {/* 숨길 때도 자리는 남겨서 글자가 움직이지 않게 해요. */}
            <button
              type="button"
              onClick={onCurrent}
              aria-label={currentLabel}
              title={currentLabel}
              disabled={isCurrent}
              className={`inline-flex size-5.5 cursor-pointer items-center justify-center rounded-[5px] border border-(--brand) text-(--brand) transition-colors duration-150 hover:bg-(--brand-soft) ${
                isCurrent ? 'invisible' : ''
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 14L4 9l5-5" />
                <path d="M4 9h11a5 5 0 010 10h-3" />
              </svg>
            </button>
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={handleNext}
        aria-label={nextLabel}
        aria-disabled={isNextDisabled || undefined}
        className={`${navButtonClassName} aria-disabled:cursor-default aria-disabled:opacity-30 aria-disabled:hover:bg-transparent`}
      >
        <svg {...arrowProps}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
