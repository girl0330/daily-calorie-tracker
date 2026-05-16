import { useState } from 'react';

type SectionLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  // 접기/펼치기 기능을 사용할 섹션인지 여부
  collapsible?: boolean;
};

const SectionLayout = ({ title, description, children, collapsible = false }: SectionLayoutProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section>
      {/* Title */}
      <div className="mb-5">
        {/* title과 button만 같은 줄로 배치 */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-(--text-primary)">{title}</h2>

          {collapsible && (
            <button
              type="button"
              onClick={() => setIsExpanded(prev => !prev)}
              aria-expanded={isExpanded}
              className="shrink-0 rounded-md border border-(--neutral-4) px-3 py-1.5 text-sm font-medium text-(--text-secondary) transition hover:bg-(--neutral-5)"
            >
              {isExpanded ? '접기' : '펼치기'}
            </button>
          )}
        </div>

        {description && <p className="mt-1 text-sm text-(--text-muted)">{description}</p>}
      </div>

      {/* Content */}
      <div>{children}</div>
    </section>
  );
};

export default SectionLayout;
