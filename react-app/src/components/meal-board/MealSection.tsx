import type { FoodItem, MealType } from '../../types/types';
import { calories, caloriesByMeal } from '../../utils/calculate';
import FoodCard from './FoodCard';

type MealSectionProps = {
  title: string;
  mealType: MealType;
  foods: FoodItem[];
};
export const MealSection = ({ title, mealType, foods }: MealSectionProps) => {
  const mealFoods = foods.filter(food => {
    return food.mealType === mealType;
  });
  console.log('mealFoods의 배열 확인 ::: ', mealFoods);
  const mealNutrition = caloriesByMeal(foods)[mealType];

  return (
    <div className="flex min-h-0 flex-col">
      <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3 text-center">
        <h2 className="text-2xl font-bold text-(--text-primary)">{title}</h2>
      </div>

      <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3">
        <div className="flex items-center justify-center gap-2 text-sm text-(--text-secondary)">
          <span className="text-(--text-muted)">
            carbs <span className="text-(--text-primary)">{mealNutrition.carbs}</span> g
          </span>

          <span className="text-(--text-muted)">
            protein <span className="text-(--text-primary)">{mealNutrition.protein}</span> g
          </span>

          <span className="text-(--text-muted)">
            fat <span className="text-(--text-primary)">{mealNutrition.fat}</span> g
          </span>

          <span className="order-4 text-(--neutral-3)">|</span>
          <span className="order-5 font-semibold text-(--primary-1)">
            총 {calories(mealNutrition.carbs, mealNutrition.protein, mealNutrition.fat)} kcal
          </span>
        </div>
      </div>
      {mealFoods.map(food => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
};
