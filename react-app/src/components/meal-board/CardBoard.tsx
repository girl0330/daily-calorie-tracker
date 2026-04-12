import type { Dispatch, SetStateAction } from 'react';
import type { FoodItem } from '../../types/types';
import { MealSection } from './MealSection';

type CardBoardProp = {
  foods: FoodItem[];
  setFoods: Dispatch<SetStateAction<FoodItem[]>>;
};

export const CardBoard = ({ foods, setFoods }: CardBoardProp) => {
  //   console.log('foods 확인::: ', foods[0].foodName);

  return (
    <section className="rounded-md border border-(--neutral-4) bg-(--bg-section)">
      <div className="grid h-full grid-cols-3 divide-x divide-(--neutral-4)">
        <MealSection title="아침" mealType="breakfast" foods={foods} setFoods={setFoods} />
        <MealSection title="점심" mealType="lunch" foods={foods} setFoods={setFoods} />
        <MealSection title="저녁" mealType="dinner" foods={foods} setFoods={setFoods} />
      </div>
    </section>
  );
};
