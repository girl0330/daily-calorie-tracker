import { MealSection } from './MealSection';

export const CardBoard = () => {
  return (
    <section className="rounded-md border border-(--neutral-4) bg-(--bg-section)">
      <div className="grid h-full grid-cols-3 divide-x divide-(--neutral-4)">
        <MealSection title="아침" mealType="breakfast" />
        <MealSection title="점심" mealType="lunch" />
        <MealSection title="저녁" mealType="dinner" />
      </div>
    </section>
  );
};
