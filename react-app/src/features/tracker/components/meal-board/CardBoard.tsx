import { useState } from 'react';
import type { FoodItem } from '../../../../types/types';
import SectionLayout from '../../../../components/common/SectionLayout';
import { MealSection } from './MealSection';

type CardBoardVariant = 'daily' | 'compact' | 'expandable';

type CardBoardProps = {
  foods: FoodItem[];
  className?: string;
  variant?: CardBoardVariant;
  defaultExpanded?: boolean;
};

type CardBoardVariantConfig = {
  description: string;
  sectionClassName: string;
  contentClassName: string;
  boardClassName: string;
  density: 'comfortable' | 'compact';
};

const cardBoardVariantConfig: Record<CardBoardVariant, CardBoardVariantConfig> = {
  daily: {
    description: '오늘 식단을 아침, 점심, 저녁으로 나눠 확인해 보세요.',
    sectionClassName: '',
    contentClassName: 'flex-1',
    boardClassName:
      'grid h-full min-h-[420px] grid-cols-3 divide-x divide-(--neutral-4) rounded-[24px] border border-(--neutral-4)',
    density: 'comfortable',
  },
  compact: {
    description: '식사별 기록을 간단히 확인해 보세요.',
    sectionClassName: '',
    contentClassName: 'h-full min-h-0 flex-1',
    boardClassName:
      'grid h-full min-h-0 grid-cols-3 divide-x divide-(--neutral-4) rounded-[20px] border border-(--neutral-4)',
    density: 'compact',
  },
  expandable: {
    description: '처음에는 고정 높이로 보고, 필요할 때 전체 기록을 펼쳐보세요.',
    sectionClassName: '',
    contentClassName: 'flex-1',
    boardClassName: 'grid min-h-0 grid-cols-3 divide-x divide-(--neutral-4) rounded-[24px] border border-(--neutral-4)',
    density: 'comfortable',
  },
};

export const CardBoard = ({ foods, className = '', variant = 'daily', defaultExpanded = false }: CardBoardProps) => {
  const config = cardBoardVariantConfig[variant];
  const isExpandable = variant === 'expandable';
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // expandable은 접힌 상태에서 보드 높이를 고정하고, 펼치면 내용 길이만큼 자연스럽게 늘어나게 한다.
  const expandableHeightClassName = isExpandable ? (isExpanded ? 'min-h-[320px]' : 'h-[320px]') : '';
  const boardClassName = [config.boardClassName, expandableHeightClassName].filter(Boolean).join(' ');
  const sectionClassName = [config.sectionClassName, className].filter(Boolean).join(' ');

  return (
    <SectionLayout
      title="음식 카드"
      description={config.description}
      className={sectionClassName}
      contentClassName={config.contentClassName}
      headerAction={
        isExpandable ? (
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            aria-expanded={isExpanded}
            className="rounded-md border border-(--neutral-4) px-3 py-1.5 text-sm font-medium text-(--text-secondary) transition hover:bg-(--neutral-5)"
          >
            {isExpanded ? '접기' : '펼치기'}
          </button>
        ) : undefined
      }
    >
      <div className={boardClassName}>
        <MealSection title="아침" mealType="breakfast" foods={foods} density={config.density} />
        <MealSection title="점심" mealType="lunch" foods={foods} density={config.density} />
        <MealSection title="저녁" mealType="dinner" foods={foods} density={config.density} />
      </div>
    </SectionLayout>
  );
};
