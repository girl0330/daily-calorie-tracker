import { useId, type ReactNode } from 'react';

type WeeklySectionProps = {
  title: ReactNode;
  /** 제목 줄 오른쪽 (알약형 탭 등) */
  action?: ReactNode;
  /** 제목 아래 작은 설명 */
  caption?: string;
  children: ReactNode;
};

// 시안의 .sh: 진한 밑줄이 있는 제목 줄 + 내용. 주간 리포트의 묶음마다 써요.
export default function WeeklySection({ title, action, caption, children }: WeeklySectionProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="min-w-0">
      <div className="flex items-center justify-between gap-x-4 gap-y-1.5 border-b border-(--ink) pb-2">
        <h2 id={titleId} className="m-0 text-[15px] font-bold">
          {title}
        </h2>
        {action}
      </div>
      {caption && <p className="mt-2.5 mb-0.5 text-xs text-(--muted)">{caption}</p>}
      {children}
    </section>
  );
}
