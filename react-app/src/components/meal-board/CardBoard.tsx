import type { FoodItem } from '../../types/types';
import SectionLayout from '../common/SectionLayout';
import { MealSection } from './MealSection';

type CardBoardVariant = 'default' | 'compact';

type CardBoardProps = {
  foods: FoodItem[];
  className?: string;
  variant?: CardBoardVariant;
  collapsible?: boolean;
};

export const CardBoard = ({ foods, className = '', variant = 'default', collapsible = false }: CardBoardProps) => {
  const isCompact = variant === 'compact';

  return (
    <SectionLayout
      title="음식 카드"
      className={className}
      contentClassName="flex-1"
      collapsible={collapsible}
      defaultExpanded={!collapsible}
    >
      <div className="grid h-full min-h-0 grid-cols-3 divide-x divide-(--neutral-4) rounded-[24px] border border-(--neutral-4)">
        <MealSection title="아침" mealType="breakfast" foods={foods} compact={isCompact} />
        <MealSection title="점심" mealType="lunch" foods={foods} compact={isCompact} />
        <MealSection title="저녁" mealType="dinner" foods={foods} compact={isCompact} />
      </div>
    </SectionLayout>
  );
};
