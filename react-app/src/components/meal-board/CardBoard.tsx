import { useEffect } from 'react';
import type { FoodItem } from '../../types/types';
import FoodCard from './FoodCard';
import { MealSection } from './MealSection';

type CardBoardProp = {
  foods: FoodItem[];
};

export const CardBoard = ({ foods }: CardBoardProp) => {
  //   console.log('foods 확인::: ', foods[0].foodName);

  return (
    <section className="rounded-md border border-(--neutral-4) bg-(--bg-section)">
      <div className="grid h-full grid-cols-3 divide-x divide-(--neutral-4)">
        {/* 아침 */}
        <MealSection title="아침" mealType="breakfast" foods={foods} />
        <MealSection title="점심" mealType="lunch" foods={foods} />
        <MealSection title="저녁" mealType="dinner" foods={foods} />

        {/* 점심 */}
        {/* <div className="flex min-h-0 flex-col">
          <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3 text-center">
            <h2 className="text-2xl font-bold text-(--text-primary)">점심</h2>
          </div>

          <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3">
            <div className="flex items-center justify-center gap-2 text-sm text-(--text-secondary)">
              <span className="text-(--text-muted)">
                carbs <span className="text-(--text-primary)">100</span> g
              </span>

              <span className="text-(--text-muted)">
                protein <span className="text-(--text-primary)">30</span> g
              </span>

              <span className="text-(--text-muted)">
                fat <span className="text-(--text-primary)">250</span> g
              </span>

              <span className="order-4 text-(--neutral-3)">|</span>
              <span className="order-5 font-semibold text-(--primary-1)">총 650 kcal</span>
            </div>
          </div>
          <FoodCard mealType="lunch" />
        </div> */}

        {/* 저녁 */}
        {/* <div className="flex min-h-0 flex-col">
          <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3 text-center">
            <h2 className="text-2xl font-bold text-(--text-primary)">저녁</h2>
          </div>

          <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3">
            <div className="flex items-center justify-center gap-2 text-sm text-(--text-secondary)">
              <span className="text-(--text-muted)">
                carbs <span className="text-(--text-primary)">100</span> g
              </span>

              <span className="text-(--text-muted)">
                protein <span className="text-(--text-primary)">30</span> g
              </span>

              <span className="text-(--text-muted)">
                fat <span className="text-(--text-primary)">250</span> g
              </span>

              <span className="order-4 text-(--neutral-3)">|</span>
              <span className="order-5 font-semibold text-(--primary-1)">총 650 kcal</span>
            </div>
          </div>

          <FoodCard mealType="dinner" />
        </div> */}
      </div>
    </section>
  );
};
