import { useState, type ReactNode } from 'react';

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
  // 접기/펼치기 기능을 사용할 섹션인지 여부
  collapsible?: boolean;
  // 접기/펼치기 섹션의 초기 펼침 상태
  defaultExpanded?: boolean;
};

const SectionLayout = ({
  title,
  description,
  children,
  className = '',
  contentClassName = '',
  headerAction,
  collapsible = false,
  defaultExpanded = true,
}: SectionLayoutProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const sectionClassName = [
    // 모든 섹션이 공유하는 기본 박스 스타일
    'flex min-h-0 flex-col rounded-[24px] border border-(--neutral-4) bg-(--bg-section) px-6 py-5 shadow-sm',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const contentClassNames = ['min-h-0', contentClassName].filter(Boolean).join(' ');

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

          {(headerAction || collapsible) && (
            <div className="flex shrink-0 items-center gap-2">
              {headerAction}

              {collapsible && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(prev => !prev)}
                  aria-expanded={isExpanded}
                  className="rounded-md border border-(--neutral-4) px-3 py-1.5 text-sm font-medium text-(--text-secondary) transition hover:bg-(--neutral-5)"
                >
                  {isExpanded ? '접기' : '펼치기'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* collapsible이 아니거나 펼쳐진 상태일 때만 콘텐츠를 렌더링 */}
      {(!collapsible || isExpanded) && <div className={contentClassNames}>{children}</div>}
    </section>
  );
};

export default SectionLayout;
