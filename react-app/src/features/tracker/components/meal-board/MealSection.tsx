import type { FoodItem, MealType } from '../../../../types/types';
import { calories, nutrientsByMeal } from '../../../../utils/calculate';
import FoodCard from '../../../foods/components/FoodCard';

type MealSectionDensity = 'comfortable' | 'compact';

type MealSectionProps = {
  title: string;
  mealType: MealType;
  foods: FoodItem[];
  density?: MealSectionDensity;
};

const mealImages = {
  breakfast: '/morning.svg',
  lunch: '/noon.svg',
  dinner: '/evening.svg',
};

export const MealSection = ({ title, mealType, foods }: MealSectionProps) => {
  // 날짜 필터링은 페이지에서 끝내고, MealSection은 식사 타입만 담당한다.
  const mealFoods = foods.filter(food => food.mealType === mealType);
  const mealNutrition = nutrientsByMeal(mealFoods)[mealType];
  const totalCalories = calories(mealNutrition.carbs, mealNutrition.protein, mealNutrition.fat);

  return (
    <>
      <div className="flex min-h-0 flex-col">
        {/* 식사 요약 영역 */}
        <div className="grid h-[60px] shrink-0 grid-cols-[auto_auto] items-center justify-center border-b border-(--neutral-4) bg-(--white)">
          {/* 아이콘 */}
          <div className="shrink-0 justify-self-end">
            <img src={mealImages[mealType]} alt={title} className="h-7 w-7" />
          </div>

          {/* 식사명 */}
          <h2 className="ml-2 shrink-0 text-xl font-bold text-(--text-primary)">{title}</h2>

          {/* 영양소 요약 */}
          <div className="col-span-2 flex min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
            <span className="text-(--text-muted)">
              탄수화물 <span className="text-(--text-primary)">{mealNutrition.carbs}</span>g
            </span>

            <span className="text-(--text-muted)">
              단백질 <span className="text-(--text-primary)">{mealNutrition.protein}</span>g
            </span>

            <span className="text-(--text-muted)">
              지방 <span className="text-(--text-primary)">{mealNutrition.fat}</span>g
            </span>

            <span className="text-(--neutral-3)">|</span>

            <span className="shrink-0 font-semibold text-(--primary-1)">{totalCalories} kcal</span>
          </div>
        </div>

        {/* 카드 리스트 영역 */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          {mealFoods.length > 0 ? (
            mealFoods.map(food => <FoodCard key={food.id} food={food} />)
          ) : (
            <p className="py-6 text-center text-sm text-(--text-muted)">등록된 음식이 없습니다.</p>
          )}
        </div>
      </div>
    </>
  );
};
