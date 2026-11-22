import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Button from '../../../../components/common/Button';
import Skeleton from '../../../../components/common/Skeleton';
import { DailyLimitError } from '../../../../lib/aiLimit';
import type { Goal } from '../../../goals/types';
import type { UserId } from '../../../../types/types';
import { useCreateWeeklyAiReport, useWeeklyAiReport } from '../../hooks/useWeeklyAiReport';
import { getReportSignature, type WeeklyReport } from '../../utils/weeklyReport';

type WeeklyAiCardProps = {
  userId: UserId;
  report: WeeklyReport;
  goal: Goal | null;
  isCurrentWeek: boolean;
};

const COLUMNS = [
  { key: 'good', title: '잘한 점', dot: 'bg-(--ok)' },
  { key: 'bad', title: '아쉬운 점', dot: 'bg-(--err)' },
  { key: 'next', title: '다음에 해볼 것', dot: 'bg-(--brand)' },
] as const;

// AI가 만드는 동안·처음 불러오는 동안 보여 주는 회색 줄의 색. 카드 배경보다 조금 진해요.
const SKELETON_COLOR = 'bg-[color-mix(in_srgb,var(--brand)_14%,var(--surface))]';

// 카드 맨 위 제목 줄(높이 36px). 완성 화면은 오른쪽에 '다시 만들기' 버튼이 있어서 바깥 div로 한 번 더 감싸요.
function SparkTitle({ note }: { note?: string }) {
  return (
    <div className="flex min-h-9 items-center">
      <h2 id="weekly-ai-title" className="m-0 flex flex-wrap items-center gap-x-2 text-[15px] font-bold text-(--brand)">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
          <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />
        </svg>
        AI 주간 리포트
        {note && <small className="text-[13px] font-normal text-(--ink-2)">{note}</small>}
      </h2>
    </div>
  );
}

/**
 * 시안의 AI 주간 리포트 카드. 다섯 가지 화면이 있어요.
 * 처음(리포트 만들기) / 만드는 중 / 완성 / 바뀜 안내(만든 뒤 기록이나 목표가 바뀜) / 오류(다시 시도)
 * 오류 중 하루 횟수를 다 쓴 경우는 다시 시도 버튼 없이 내일 다시 만들라고 안내해요.
 */
export default function WeeklyAiCard({ userId, report, goal, isCurrentWeek }: WeeklyAiCardProps) {
  const { data: saved, isLoading } = useWeeklyAiReport(userId, report.startDate);
  const { mutate: createReport, isPending, isError, error, variables } = useCreateWeeklyAiReport(userId);

  // 만들기 상태는 버튼을 누른 주에서만 보여요. 만드는 중에 다른 주로 가면 그 주는 원래 화면이에요.
  const isThisWeek = variables?.report.startDate === report.startDate;
  const isCreating = isPending && isThisWeek;
  const isFailed = isError && isThisWeek && !isPending;
  // 하루 횟수를 다 써서 못 만든 경우. 함수가 알려 준 횟수를 안내에 써요.
  const dailyLimit = error instanceof DailyLimitError ? error.limit : null;

  const hasRecord = report.recordedDays > 0;
  const create = () => createReport({ report, goal });

  const isStale = !!saved && saved.signature !== getReportSignature(report, goal);
  const state = isLoading ? 'loading' : isCreating ? 'creating' : isFailed ? 'error' : saved ? 'done' : 'empty';

  return (
    <section
      aria-labelledby="weekly-ai-title"
      aria-live="polite"
      aria-busy={state === 'loading' || state === 'creating'}
      className={`flex flex-col gap-4 rounded-[14px] px-4 py-4.5 md:px-6 md:py-5.5 ${state === 'error' ? 'bg-(--err-soft)' : 'bg-(--brand-soft)'}`}
    >
      {state === 'loading' && (
        <>
          <SparkTitle />
          <Skeleton className={`h-5.5 w-[70%] ${SKELETON_COLOR}`} />
          <Skeleton className={`h-3.5 w-[92%] ${SKELETON_COLOR}`} />
          <Skeleton className={`h-3.5 w-[84%] ${SKELETON_COLOR}`} />
        </>
      )}

      {state === 'creating' && (
        <>
          <SparkTitle />
          <p className="m-0 text-base font-bold">
            기록 {report.recordedDays}일을 살펴보고 있어요
            <span className="loading-dots" aria-hidden="true" />
          </p>
          <Skeleton className={`h-5.5 w-[70%] ${SKELETON_COLOR}`} />
          <Skeleton className={`h-3.5 w-[92%] ${SKELETON_COLOR}`} />
          <Skeleton className={`h-3.5 w-[84%] ${SKELETON_COLOR}`} />
          <Skeleton className={`h-3.5 w-[60%] ${SKELETON_COLOR}`} />
        </>
      )}

      {state === 'error' && (
        <>
          <SparkTitle />
          <p className="m-0 text-[17px] leading-normal font-bold tracking-[-0.01em] text-(--err) md:text-xl">
            {dailyLimit ? '오늘 리포트를 모두 만들었어요.' : '리포트를 만들지 못했어요.'}
          </p>
          <p className="m-0 -mt-2 text-sm break-keep text-(--ink-2)">
            {dailyLimit
              ? `AI 리포트는 하루 ${dailyLimit}번까지 만들 수 있어요. 내일 다시 만들어 주세요.`
              : '잠시 후 다시 시도해 주세요. 기록은 그대로 남아 있어요.'}
          </p>
          {!dailyLimit && (
            <div>
              <Button size="lg" onClick={create}>
                다시 시도
              </Button>
            </div>
          )}
        </>
      )}

      {state === 'done' && saved && (
        <>
          <div className="flex min-h-9 flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <SparkTitle
              note={`${format(new Date(saved.createdAt), 'M월 d일 a h:mm', { locale: ko })}에 만듦 · 기록 ${saved.recordedDays}일 기준`}
            />
            {/* 바뀜 안내가 있으면 버튼은 안내 띠 안으로 옮겨요. 기록이 하나도 없으면 다시 만들 수 없어서 숨겨요. */}
            {hasRecord && !isStale && <Button onClick={create}>다시 만들기</Button>}
          </div>

          {/* 바뀜 안내: 진한 띠로 눈에 띄게 하고, 아래 예전 리포트는 흐리게 보여 줘요. */}
          {isStale && (
            <div className="-mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-lg bg-(--brand) px-3.5 py-3 text-(--bg)">
              <div className="flex min-w-0 items-start gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0"
                >
                  <path d="M20 11a8 8 0 1 0-2.3 5.7" />
                  <path d="M20 4v7h-7" />
                </svg>
                <p className="m-0 text-[13px] break-keep">
                  <strong className="block text-sm font-bold">기록이나 목표가 바뀌었어요</strong>
                  아래는 예전 기록으로 만든 리포트예요. 다시 만들면 바뀐 내용으로 정리해요.
                </p>
              </div>
              {hasRecord && (
                <button
                  type="button"
                  onClick={create}
                  className="h-9 shrink-0 cursor-pointer rounded-lg border border-(--bg) bg-(--bg) px-3.5 text-[13px] font-bold whitespace-nowrap text-(--brand) transition-opacity duration-150 hover:opacity-90"
                >
                  다시 만들기
                </button>
              )}
            </div>
          )}

          <div className={`flex flex-col gap-4 transition-opacity duration-150 ${isStale ? 'opacity-45' : ''}`}>
            <p className="m-0 max-w-[44em] text-[17px] leading-normal font-bold tracking-[-0.01em] break-keep md:text-xl">
              {saved.lead}
            </p>

            <div className="grid gap-x-7 gap-y-4 border-t border-[color-mix(in_srgb,var(--brand)_25%,transparent)] pt-4 md:grid-cols-3">
              {COLUMNS.map(({ key, title, dot }) => (
                <div key={key}>
                  <h3 className="m-0 mb-2 flex items-center gap-1.5 text-[13px] font-normal text-(--ink-2)">
                    <i aria-hidden="true" className={`size-2 rounded-full ${dot}`} />
                    {title}
                  </h3>
                  <ul className="m-0 flex flex-col gap-1.5 pl-4.5 text-sm leading-[1.55] break-keep">
                    {saved[key].map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <p className="m-0 text-xs text-(--muted)">
            AI가 기록을 보고 만든 내용이라 정확하지 않을 수 있어요. 건강 상담을 대신하지 않아요.
          </p>
        </>
      )}

      {state === 'empty' && (
        <>
          <SparkTitle note={isCurrentWeek ? '이번 주 중간 점검' : undefined} />
          <p className="m-0 max-w-[44em] text-[17px] leading-normal font-bold tracking-[-0.01em] break-keep md:text-xl">
            {hasRecord
              ? `${isCurrentWeek ? '지금까지' : '이 주에'} 기록한 ${report.recordedDays}일로 리포트를 만들 수 있어요.`
              : '이 주에는 아직 기록이 없어요.'}
          </p>
          <p className="m-0 -mt-2 max-w-[44em] text-sm break-keep text-(--ink-2)">
            잘한 점, 아쉬운 점, 다음에 해볼 것을 정리해 줘요.
          </p>

          {hasRecord && (
            <div>
              <Button
                variant="go"
                size="custom"
                onClick={create}
                className="h-10.5 rounded-[9px] px-4.5 text-sm whitespace-nowrap"
              >
                리포트 만들기
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
