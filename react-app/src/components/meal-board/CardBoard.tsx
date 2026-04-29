import type { FoodItem } from '../../types/types';
import { MealSection } from './MealSection';

export const CardBoard = ({ foods }: { foods: FoodItem[] }) => {
  return (
    <section className="rounded-md border border-(--neutral-4) bg-(--bg-section)">
      <div className="grid h-full grid-cols-3 divide-x divide-(--neutral-4)">
        <MealSection title="아침" mealType="breakfast" foods={foods} />
        <MealSection title="점심" mealType="lunch" foods={foods} />
        <MealSection title="저녁" mealType="dinner" foods={foods} />
      </div>
    </section>
  );
};
