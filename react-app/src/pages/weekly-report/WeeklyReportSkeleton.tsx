import Skeleton from '../../components/common/Skeleton';

// 막대 높이를 조금씩 달리해서 진짜 그래프처럼 보이게 해요.
const BAR_HEIGHTS = ['h-[45%]', 'h-[70%]', 'h-[55%]', 'h-[80%]', 'h-[40%]', 'h-[60%]', 'h-[30%]'];

// 주간 리포트를 불러오는 동안 보여 주는 뼈대. 날짜 헤더는 바로 그려서 여기에는 없어요.
export default function WeeklyReportSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-5 md:gap-7">
      <span role="status" className="sr-only">
        주간 기록을 불러오는 중이에요
      </span>

      {/* 4칸 요약 */}
      <div aria-hidden="true" className="grid grid-cols-2 border-t border-b border-t-(--ink) border-b-(--line) md:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className={`flex flex-col gap-2.5 border-(--line) p-3 md:px-6 md:py-4.5 ${index > 0 ? 'md:border-l' : ''} ${
              index % 2 === 1 ? 'max-md:border-l' : ''
            } ${index < 2 ? 'max-md:border-b' : ''}`}
          >
            <Skeleton className="h-3.5 w-14" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* AI 카드 */}
      <div aria-hidden="true" className="flex flex-col gap-3 rounded-[14px] bg-(--brand-soft) px-4 py-4.5 md:px-6 md:py-5.5">
        <Skeleton className="h-5 w-32 bg-(--surface)" />
        <Skeleton className="h-5.5 w-[70%] bg-(--surface)" />
        <Skeleton className="h-3.5 w-[84%] bg-(--surface)" />
      </div>

      <div aria-hidden="true" className="grid gap-x-12 gap-y-7 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* 막대 */}
        <div>
          <div className="h-8 border-b border-(--ink)" />
          <div className="grid h-[232px] grid-cols-7 items-end gap-2 border-b border-(--line) pb-8 max-md:h-48">
            {BAR_HEIGHTS.map(height => (
              <span key={height} className={`mx-auto block w-[min(44px,60%)] ${height}`}>
                <Skeleton className="size-full rounded-t-md rounded-b-none" />
              </span>
            ))}
          </div>
        </div>

        {/* 영양소 */}
        <div className="flex flex-col gap-3.5">
          <div className="h-8 border-b border-(--ink)" />
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="grid grid-cols-[64px_minmax(0,1fr)_96px] items-center gap-3">
              <Skeleton className="h-3.5 w-12" />
              <Skeleton className="h-2 rounded-full" />
              <Skeleton className="ml-auto h-3.5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
