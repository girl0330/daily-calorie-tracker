import { type ReactNode } from 'react';

type SectionLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  // 섹션 전체 박스에 추가로 적용할 클래스
  className?: string;
  // 제목 아래 실제 콘텐츠 영역에 추가로 적용할 클래스
  contentClassName?: string;
  // 제목 오른쪽에 들어갈 버튼/액션 영역
  headerAction?: ReactNode;
};

const SectionLayout = ({
  title,
  description,
  children,
  className = '',
  contentClassName = '',
  headerAction,
}: SectionLayoutProps) => {
  const sectionClassName = [
    // 모든 섹션이 공유하는 기본 박스 스타일
    'flex min-h-0 flex-col bg-(--bg-section) px-6 py-5',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={sectionClassName}>
      {/* Title */}
      <div className="mb-5 shrink-0">
        {/* title과 header action만 같은 줄로 배치 */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-(--text-primary)">{title}</h2>
            {description && <p className="mt-1 text-sm text-(--text-muted)">{description}</p>}
          </div>

          {headerAction && <div className="flex shrink-0 items-center gap-2">{headerAction}</div>}
        </div>
      </div>
      <div className={`${contentClassName}`}>{children}</div>
    </section>
  );
};

export default SectionLayout;
