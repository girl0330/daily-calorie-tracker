import { format, isSameDay, isSameMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import Skeleton from '../../../../components/common/Skeleton';
import { formatGram, formatInteger } from '../../../../utils/formatNumber';
import { toRecordDate } from '../../../../utils/date';
import { NUTRIENTS, getMonthGridDates, type DaySummary } from '../../utils/monthlyCalendar';

type MonthlyCalendarProps = {
  month: Date;
  today: Date;
  /** 날짜별 합계. 불러오는 중이면 null이고, 칸마다 뼈대(스켈레톤)를 보여 줘요. */
  summaries: Map<string, DaySummary> | null;
  onSelectDate: (date: Date) => void;
};

const WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

// 시안의 월간 달력: 맨 위 진한 선, 칸 사이 옅은 선. 칸 높이는 화면 높이를 6줄로 나눠요.
export default function MonthlyCalendar({ month, today, summaries, onSelectDate }: MonthlyCalendarProps) {
  const isLoading = summaries === null;

  return (
    <section
      aria-label="월간 캘린더"
      aria-busy={isLoading}
      className="flex min-h-0 flex-1 flex-col border-t border-b border-t-(--ink) border-b-(--line) tabular-nums"
    >
      <div aria-hidden="true" className="grid grid-cols-7 border-b border-(--line)">
        {WEEK_LABELS.map(label => (
          <span key={label} className="px-2.5 py-2 text-[13px] text-(--ink-2) max-md:px-1 max-md:py-1.5 max-md:text-center">
            {label}
          </span>
        ))}
      </div>

      {isLoading && <p className="sr-only" role="status">기록을 불러오는 중이에요</p>}

      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-[repeat(6,minmax(0,1fr))]">
        {getMonthGridDates(month).map((date, index) => {
          const isOut = !isSameMonth(date, month);
          const isTodayCell = isSameDay(date, today);
          const isFuture = date > today;
          const day = summaries?.get(toRecordDate(date));
          const showSkeleton = isLoading && !isOut && !isFuture;
          // 기록한 영양소만 보여 줘요. 0g인 영양소는 점도 숫자도 없어요.
          const nutrients = day ? NUTRIENTS.filter(({ key }) => day[key] > 0) : [];

          const label = [
            `${format(date, 'M월 d일 EEEE', { locale: ko })}${isTodayCell ? ', 오늘' : ''}`,
            day &&
              `${formatInteger(day.kcal)}kcal, ${nutrients.map(({ key, label: name }) => `${name} ${formatGram(day[key])}g`).join(' ')}`,
          ]
            .filter(Boolean)
            .join(', ');

          const lineClassName = [
            index % 7 > 0 ? 'border-l border-l-(--line-soft)' : '',
            index < 35 ? 'border-b border-b-(--line-soft)' : '',
          ].join(' ');

          return (
            <button
              key={date.getTime()}
              type="button"
              onClick={() => onSelectDate(date)}
              disabled={isFuture || isLoading}
              aria-label={label}
              className={[
                // 데스크톱: 2칸 격자. 왼쪽 칸은 두 자리 숫자 폭(2ch)으로 고정해서, 같은 열의 kcal·탄단지가 모두 같은 위치에서 시작해요.
                // 오늘 표시(동그라미)는 이 폭보다 넓지만 kcal이 다음 줄에 있어서 겹치지 않아요.
                'group grid min-h-0 text-sm min-w-0 cursor-pointer grid-cols-[2ch_minmax(0,1fr)] content-start gap-y-1 overflow-hidden px-2.5 py-1.5 text-left transition-colors duration-150 [container-type:size]',
                'enabled:hover:bg-(--brand-soft) focus-visible:bg-(--brand-soft) disabled:cursor-default',
                'max-md:flex max-md:flex-col max-md:items-center max-md:gap-0 max-md:px-1 max-md:py-2',
                isOut ? 'bg-(--out)' : 'bg-transparent',
                lineClassName,
              ].join(' ')}
            >
              {/* 데스크톱에서는 이 묶음을 풀어서(contents) 날짜와 kcal이 격자 칸에 바로 놓여요. */}
              <span className="contents max-md:flex max-md:flex-col max-md:items-center">
                <span
                  className={[
                    'col-start-1 justify-self-start text-sm leading-6 max-md:text-[13px] max-md:leading-[22px]',
                    isTodayCell
                      ? 'inline-flex h-6 min-w-6.5 items-center justify-center rounded-full px-1.5 max-md:h-[22px] max-md:min-w-[22px] max-md:px-[5px]'
                      : '',
                    isTodayCell ? (isOut ? 'bg-(--faint) text-(--bg)' : 'bg-(--brand) text-(--bg)') : '',
                    !isTodayCell && isOut ? 'text-(--faint)' : '',
                    !isTodayCell && !isOut && isFuture ? 'text-(--muted)' : '',
                    !isTodayCell && !isOut && !isFuture ? 'group-hover:text-(--brand)' : '',
                  ].join(' ')}
                >
                  {date.getDate()}
                </span>

                {showSkeleton && <Skeleton className="col-start-2 row-start-2 h-5 w-16 max-md:mt-[3px] max-md:h-3.5 max-md:w-6.5" />}

                {day && (
                  <span
                    className={`col-start-2 row-start-2 text-[15px] leading-5 font-bold tracking-[-0.01em] whitespace-nowrap max-md:mt-[3px] max-md:text-[11px] max-md:leading-3.5 max-md:font-medium max-md:tracking-[-0.02em] ${
                      isOut ? 'text-(--faint)' : 'max-md:text-(--ink-2)'
                    }`}
                  >
                    {formatInteger(day.kcal)}
                    <small className={`ml-0.5 text-[11px] font-normal max-md:hidden ${isOut ? '' : 'text-(--ink-2)'}`}>kcal</small>
                  </span>
                )}
              </span>

              {/* 데스크톱: 탄·단·지 g. 칸이 낮으면(92px 이하) 숨겨요. */}
              {showSkeleton && (
                <span className="col-start-2 row-start-3 flex flex-col gap-1 max-md:hidden [@container_(max-height:92px)]:hidden">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-13" />
                </span>
              )}
              {day && nutrients.length > 0 && (
                <span
                  className={`col-start-2 row-start-3 flex flex-col text-xs leading-[15px] max-md:hidden [@container_(max-height:92px)]:hidden ${
                    isOut ? 'text-(--faint)' : 'text-(--ink-2)'
                  }`}
                >
                  {nutrients.map(({ key, short, dotClassName }) => (
                    <span key={key} className="inline-flex items-center gap-1 whitespace-nowrap">
                      <i className={`inline-block size-[7px] shrink-0 rounded-full ${dotClassName} ${isOut ? 'opacity-50' : ''}`} />
                      {short} <b className={isOut ? '' : 'text-(--ink)'}>{formatGram(day[key])}</b>g
                    </span>
                  ))}
                </span>
              )}

              {/* 모바일: 숫자 대신 색 점만. 무슨 색인지는 달력 아래 설명에 있어요. */}
              {(day || showSkeleton) && (
                <span aria-hidden="true" className="mt-[5px] hidden justify-center gap-[3px] self-stretch max-md:flex">
                  {(showSkeleton ? NUTRIENTS : nutrients).map(({ key, dotClassName }) => (
                    <i
                      key={key}
                      className={`inline-block size-1.5 rounded-full ${
                        showSkeleton ? 'animate-skeleton bg-(--skel) motion-reduce:animate-none' : dotClassName
                      } ${isOut ? 'opacity-50' : ''}`}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
