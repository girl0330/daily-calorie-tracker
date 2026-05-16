import type { FoodItem, MealType } from '../../types/types';
import { calories, nutrientsByMeal } from '../../utils/calculate';
import FoodCard from './FoodCard';
import useTodayFoods from '../../hooks/useTodayFoods';

type MealSectionProps = {
  title: string;
  mealType: MealType;
  foods: FoodItem[];
  compact?: boolean;
};

export const MealSection = ({ title, mealType, foods, compact = false }: MealSectionProps) => {
  // 날짜 필터링은 페이지에서 끝내고, MealSection은 식사 타입만 담당한다.
  const mealFoods = foods.filter(food => food.mealType === mealType);
  const mealNutrition = nutrientsByMeal(mealFoods)[mealType];
  const totalCalories = calories(mealNutrition.carbs, mealNutrition.protein, mealNutrition.fat);

  return (
    <div className="flex min-h-0 flex-col">
      {/* 헤더 영역 */}
      <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3 text-center">
        <h2
          className={compact ? 'text-lg font-bold text-(--text-primary)' : 'text-2xl font-bold text-(--text-primary)'}
        >
          {title}
        </h2>
      </div>

      {/* 영양소 요약 영역 */}
      <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-(--text-secondary)">
          <span className="text-(--text-muted)">
            carbs <span className="text-(--text-primary)">{mealNutrition.carbs}</span> g
          </span>

          <span className="text-(--text-muted)">
            protein <span className="text-(--text-primary)">{mealNutrition.protein}</span> g
          </span>

          <span className="text-(--text-muted)">
            fat <span className="text-(--text-primary)">{mealNutrition.fat}</span> g
          </span>

          <span className="text-(--neutral-3)">|</span>
          <span className="font-semibold text-(--primary-1)">총 {totalCalories} kcal</span>
        </div>
      </div>

      {/* 카드 리스트 영역: 스크롤은 카드가 아니라 리스트가 담당한다. */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {mealFoods.length > 0 ? (
          mealFoods.map(food => <FoodCard key={food.id} food={food} />)
        ) : (
          <p className="py-6 text-center text-sm text-(--text-muted)">등록된 음식이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
