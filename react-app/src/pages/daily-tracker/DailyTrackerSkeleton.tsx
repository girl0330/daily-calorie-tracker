import Skeleton from '../../components/common/Skeleton';

const STAT_COUNT = 4;
// 줄마다 음식 이름 길이를 조금씩 달리해서 진짜 표처럼 보이게 해요.
const ROW_NAME_WIDTHS = ['w-[55%]', 'w-[40%]', 'w-[62%]', 'w-[48%]'];

// 일일 기록을 불러오는 동안 보여 주는 뼈대. 날짜 헤더는 바로 그려서 여기에는 없어요.
export default function DailyTrackerSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4.5 md:gap-6.5">
      <span role="status" className="sr-only">
        기록을 불러오는 중이에요
      </span>

      {/* 4칸 요약 */}
      <div aria-hidden="true" className="grid grid-cols-2 border-t border-b border-t-(--ink) border-b-(--line) md:grid-cols-4">
        {Array.from({ length: STAT_COUNT }, (_, index) => (
          <div
            key={index}
            className={`flex flex-col gap-2.5 border-(--line) p-3 md:px-6 md:py-4.5 ${index > 0 ? 'md:border-l' : ''} ${
              index % 2 === 1 ? 'max-md:border-l' : ''
            } ${index < 2 ? 'max-md:border-b' : ''}`}
          >
            <Skeleton className="h-3.5 w-14" />
            <Skeleton className="h-7 w-24" />
          </div>
        ))}
      </div>

      {/* 음식 입력 줄 */}
      <Skeleton className="h-14 w-full rounded-xl" />

      {/* 시간대별 표 */}
      <div aria-hidden="true">
        <div className="h-10 border-b border-(--ink)" />
        {ROW_NAME_WIDTHS.map((width, index) => (
          <div
            key={width}
            className="grid min-h-13 grid-cols-[56px_minmax(0,1fr)_56px_84px] items-center border-b border-(--line-soft) *:px-2 md:grid-cols-[90px_minmax(0,1fr)_100px_100px_100px_100px_96px]"
          >
            <span>{index !== 1 && <Skeleton className="h-3 w-8" />}</span>
            <span>
              <Skeleton className={`h-3.5 ${width}`} />
            </span>
            {Array.from({ length: 3 }, (_, cell) => (
              <span key={cell} className="flex justify-end max-md:hidden">
                <Skeleton className="h-3 w-10" />
              </span>
            ))}
            <span className="flex justify-end">
              <Skeleton className="h-3 w-10" />
            </span>
            <span />
          </div>
        ))}
      </div>
    </div>
  );
}
