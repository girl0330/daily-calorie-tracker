import { formatNumber } from '../../../../utils/formatNumber';
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

  const macroSummary = (
    <p className="flex flex-wrap gap-x-3 text-xs text-(--text-muted) tabular-nums">
      <span>
        탄수화물 <span className="text-(--text-secondary)">{formatNumber(mealNutrition.carbs)}g</span>
      </span>
      <span>
        단백질 <span className="text-(--text-secondary)">{formatNumber(mealNutrition.protein)}g</span>
      </span>
      <span>
        지방 <span className="text-(--text-secondary)">{formatNumber(mealNutrition.fat)}g</span>
      </span>
    </p>
  );

  const calorieSummary = (
    <span className="shrink-0 text-base font-medium text-(--text-primary) tabular-nums">
      {formatNumber(totalCalories)}
      <span className="ml-1 text-xs font-normal text-(--text-muted)">kcal</span>
    </span>
  );

  return (
    <div className="flex min-h-0 flex-col overflow-hidden bg-(--surface) max-xl:rounded-xl max-xl:border max-xl:border-(--border-light)">
      {/* 식사 요약 영역 - Desktop */}
      <div className="hidden shrink-0 border-b border-(--border-light) px-4 py-3 xl:block">
        <div className="flex items-center gap-2">
          <img src={mealImages[mealType]} alt="" className="size-5" />
          <h3 className="text-base font-semibold text-(--text-primary)">{title}</h3>
          <span className="ml-auto">{calorieSummary}</span>
        </div>
        <div className="mt-1 pl-7">{macroSummary}</div>
      </div>

      {/* 식사 요약 영역 - Tablet / Mobile */}
      <button
        type="button"
        onClick={() => setIsExpanded(prev => !prev)}
        aria-expanded={isExpanded}
        aria-label={`${title} 음식 목록 ${isExpanded ? '접기' : '펼치기'}`}
        className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-x-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-(--bg-section) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--brand) xl:hidden"
      >
        <img src={mealImages[mealType]} alt="" className="size-6" />

        <span className="flex min-w-0 items-center gap-2">
          <span className="text-base font-semibold text-(--text-primary)">{title}</span>
          <span className="ml-auto">{calorieSummary}</span>
        </span>

        <img src={isExpanded ? '/chevron-up.svg' : '/chevron-down.svg'} alt="" className="size-5" />

        <span className="col-start-2 mt-1 min-w-0">
          <span className="block truncate text-sm text-(--text-secondary)">{foodNames || '등록된 음식이 없어요'}</span>
          <span className="mt-0.5 block">{macroSummary}</span>
        </span>
      </button>

      {/* 카드 리스트 영역 */}
      <div
        className={`[container-type:inline-size] min-h-0 flex-1 overflow-y-auto p-4 max-xl:border-t max-xl:border-(--border-light) ${isExpanded ? '' : 'hidden'} xl:block`}
      >
        {mealFoods.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 @[676px]:grid-cols-2 @[1022px]:grid-cols-3">
            {mealFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-(--text-muted)">등록된 음식이 없어요</p>
        )}
      </div>
    </div>
  );
};
