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
    <SectionLayout title="식사 기록" className={cardClassName} contentClassName="flex-1">
      <div className="grid grid-cols-1 gap-2 xl:h-full xl:min-h-105 xl:grid-cols-3 xl:gap-0 xl:divide-x xl:divide-(--border-light) xl:overflow-hidden xl:rounded-xl xl:border xl:border-(--border-light)">
        <MealSection title="아침" mealType="breakfast" foods={foods} />
        <MealSection title="점심" mealType="lunch" foods={foods} />
        <MealSection title="저녁" mealType="dinner" foods={foods} />
      </div>
    </SectionLayout>
  );
};
