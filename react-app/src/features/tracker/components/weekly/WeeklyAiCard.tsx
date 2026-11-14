import { showToast } from '../../../../store/toastStore';

type WeeklyAiCardProps = {
  recordedDays: number;
  isCurrentWeek: boolean;
};

// 시안의 AI 주간 리포트 카드. 7단계에서는 처음 상태 화면만 있어요. 실제 리포트 만들기는 8단계에서 붙여요.
export default function WeeklyAiCard({ recordedDays, isCurrentWeek }: WeeklyAiCardProps) {
  const hasRecord = recordedDays > 0;

  return (
    <section aria-labelledby="weekly-ai-title" className="flex flex-col gap-4 rounded-[14px] bg-(--brand-soft) px-4 py-4.5 md:px-6 md:py-5.5">
      <div className="flex min-h-9 flex-wrap items-center gap-x-2">
        <h2 id="weekly-ai-title" className="m-0 flex items-center gap-2 text-[15px] font-bold text-(--brand)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
            <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />
          </svg>
          AI 주간 리포트
        </h2>
        {isCurrentWeek && <small className="text-[13px] text-(--ink-2)">이번 주 중간 점검</small>}
      </div>

      <p className="m-0 max-w-[44em] text-[17px] break-keep leading-normal font-bold tracking-[-0.01em] md:text-xl">
        {hasRecord
          ? `${isCurrentWeek ? '지금까지' : '이 주에'} 기록한 ${recordedDays}일로 리포트를 만들 수 있어요.`
          : '이 주에는 아직 기록이 없어요.'}
      </p>
      <p className="m-0 -mt-2 max-w-[44em] text-sm break-keep text-(--ink-2)">
        잘한 점, 아쉬운 점, 다음에 해볼 것을 정리해 줘요. 지난주 리포트는 월요일 아침에 자동으로 만들어져요.
      </p>

      {hasRecord && (
        <div>
          {/* 시안의 .ai-go 버튼 색은 라이트·다크 모두 같은 고정값이에요. */}
          <button
            type="button"
            onClick={() => showToast('AI 리포트는 곧 만들 수 있어요')}
            className="h-10.5 cursor-pointer rounded-[9px] bg-[#dbc0a7] px-4.5 text-sm font-bold whitespace-nowrap text-[#2b2623] transition-colors duration-150 hover:bg-[#cfae90]"
          >
            리포트 만들기
          </button>
        </div>
      )}
    </section>
  );
}
