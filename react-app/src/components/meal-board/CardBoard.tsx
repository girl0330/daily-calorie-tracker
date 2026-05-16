import type { FoodItem } from '../../types/types';
import SectionLayout from '../common/SectionLayout';
import { MealSection } from './MealSection';
type CardBoardProps = {
  foods: FoodItem[];
  className?: string;
};

export const CardBoard = ({ foods, className = '' }: CardBoardProps) => {
  // Allow parent pages to control layout size without changing CardBoard's default style.
  const cardBoardClassName = [
    'min-h-0 rounded-[24px] border border-(--neutral-4) bg-(--bg-section) px-6 py-5  shadow-sm',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={cardBoardClassName}>
      <SectionLayout title="음식 카드">
        <div className="grid h-full min-h-0 grid-cols-3 divide-x divide-(--neutral-4) rounded-[24px] border border-(--neutral-4)">
          <MealSection title="아침" mealType="breakfast" foods={foods} />
          <MealSection title="점심" mealType="lunch" foods={foods} />
          <MealSection title="저녁" mealType="dinner" foods={foods} />
        </div>
      </SectionLayout>
    </section>
  );
};
