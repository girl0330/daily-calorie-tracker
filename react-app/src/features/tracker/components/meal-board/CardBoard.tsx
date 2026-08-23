import type { FoodItem } from '../../../../types/types';
import SectionLayout from '../../../../components/common/SectionLayout';
import { MealSection } from './MealSection';

type CardBoardProps = {
  foods: FoodItem[];
  className?: string;
};

export const CardBoard = ({ foods, className = '' }: CardBoardProps) => {
  const cardClassName = ['!bg-(--white)', className].filter(Boolean).join(' ');

  return (
    <SectionLayout
      title="음식 카드"
      description="오늘 식단을 아침, 점심, 저녁으로 나눠 확인해 보세요."
      className={cardClassName}
      contentClassName="flex-1"
    >
      <div className="grid grid-cols-1 lg:h-full lg:min-h-[420px] lg:grid-cols-3 lg:divide-x lg:divide-(--neutral-4) lg:border lg:border-(--neutral-4)">
        <MealSection title="아침" mealType="breakfast" foods={foods} />
        <MealSection title="점심" mealType="lunch" foods={foods} />
        <MealSection title="저녁" mealType="dinner" foods={foods} />
      </div>
    </SectionLayout>
  );
};
