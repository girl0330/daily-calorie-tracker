import type { Dispatch, SetStateAction } from 'react';
import type { FoodItem } from '../../types/types';
import { MealSection } from './MealSection';

type CardBoardProp = {
  userId: string;
  foods: FoodItem[];
  setFoods: Dispatch<SetStateAction<FoodItem[]>>;
};

export const CardBoard = ({ userId, foods, setFoods }: CardBoardProp) => {
  return (
    <section className="rounded-md border border-(--neutral-4) bg-(--bg-section)">
      <div className="grid h-full grid-cols-3 divide-x divide-(--neutral-4)">
        <MealSection userId={userId} title="아침" mealType="breakfast" foods={foods} setFoods={setFoods} />
        <MealSection userId={userId} title="점심" mealType="lunch" foods={foods} setFoods={setFoods} />
        <MealSection userId={userId} title="저녁" mealType="dinner" foods={foods} setFoods={setFoods} />
      </div>
    </section>
  );
};
