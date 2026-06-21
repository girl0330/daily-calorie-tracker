import type { FoodItem } from '../../../../types/types';
import SectionLayout from '../../../../components/common/SectionLayout';
import { MealSection } from './MealSection';

type CardBoardProps = {
  foods: FoodItem[];
  className?: string;
  // variant?: CardBoardVariant;
  defaultExpanded?: boolean;
};

export const CardBoard = ({ foods, className = '' }: CardBoardProps) => {
  return (
    <SectionLayout
      title="음식 카드"
      description="오늘 식단을 아침, 점심, 저녁으로 나눠 확인해 보세요."
      className={className}
      contentClassName="flex-1"
    >
      <div className="grid h-full min-h-[420px] grid-cols-3 divide-x divide-(--neutral-4) rounded-[24px] border border-(--neutral-4)">
        <MealSection title="아침" mealType="breakfast" foods={foods} />
        <MealSection title="점심" mealType="lunch" foods={foods} />
        <MealSection title="저녁" mealType="dinner" foods={foods} />
      </div>
    </SectionLayout>
  );
};
