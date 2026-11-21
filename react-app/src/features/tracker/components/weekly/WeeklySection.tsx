import { useId, type ReactNode } from 'react';

type WeeklySectionProps = {
  title: ReactNode;
  children: ReactNode;
};

// 시안의 .sh: 진한 밑줄이 있는 제목 줄 + 내용. 주간 리포트의 큰 묶음(칼로리 · 영양소)마다 써요.
export default function WeeklySection({ title, children }: WeeklySectionProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="min-w-0">
      <div className="border-b border-(--ink) pb-2">
        <h2 id={titleId} className="m-0 text-[15px] font-bold">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
