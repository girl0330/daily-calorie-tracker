import { useState } from 'react';
import type { FoodItem, MealType } from '../../../../types/types';
import { calories, nutrientsByMeal } from '../../../../utils/calculate';
import FoodCard from '../../../foods/components/FoodCard';

type MealSectionProps = {
  title: string;
  mealType: MealType;
  foods: FoodItem[];
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
  const foodNames = mealFoods.map(food => food.foodName).join(', ');

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex min-h-0 flex-col">
      {/* 식사 요약 영역 - Desktop */}
      <div className="hidden h-[60px] shrink-0 grid-cols-[auto_auto] items-center justify-center border-b border-(--neutral-4) bg-(--white) lg:grid">
        <div className="shrink-0 justify-self-end">
          <img src={mealImages[mealType]} alt={title} className="h-7 w-7" />
        </div>

        <h2 className="ml-2 shrink-0 text-xl font-bold text-(--text-primary)">{title}</h2>

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

      {/* 식사 요약 영역 - Tablet / Mobile */}
      <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 border border-(--neutral-4) bg-(--white) px-4 py-3 lg:hidden">
        <div className="row-span-2 flex flex-col items-center justify-center">
          <img src={mealImages[mealType]} alt={title} className="h-10 w-10" />

          <span className="mt-1 text-sm font-semibold text-(--text-primary)">{title}</span>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-x-2 text-sm">
          <span className="md:hidden">탄 {mealNutrition.carbs}g</span>
          <span className="hidden md:inline">탄수화물 {mealNutrition.carbs}g</span>

          <span className="md:hidden">단 {mealNutrition.protein}g</span>
          <span className="hidden md:inline">단백질 {mealNutrition.protein}g</span>

          <span className="md:hidden">지 {mealNutrition.fat}g</span>
          <span className="hidden md:inline">지방 {mealNutrition.fat}g</span>

          <span className="text-(--neutral-3)">|</span>

          <span className="font-semibold text-(--primary-1)">
            <span className="hidden md:inline">총 </span>
            {totalCalories} kcal
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          aria-label={`${title} 음식 목록 ${isExpanded ? '접기' : '펼치기'}`}
          className="row-span-2 flex items-center justify-center"
        >
          <img
            src={isExpanded ? '/chevron-up.svg' : '/chevron-down.svg'}
            alt={isExpanded ? '접기' : '펼치기'}
            className="h-5 w-5"
          />
        </button>

        {/* 음식 이름 목록 */}
        <p className="min-w-0 truncate text-sm text-(--text-muted)">{foodNames || '등록된 음식이 없습니다.'}</p>
      </div>

      {/* 카드 리스트 영역 */}
      <div
        className={`[container-type:inline-size] min-h-0 flex-1 overflow-y-auto p-4 ${isExpanded ? '' : 'hidden'} lg:block`}
      >
        {mealFoods.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 @[676px]:grid-cols-2 @[1022px]:grid-cols-3">
            {mealFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-(--text-muted)">등록된 음식이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
