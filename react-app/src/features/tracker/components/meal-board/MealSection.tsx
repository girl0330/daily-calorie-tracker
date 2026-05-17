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

const mealSectionStyle = {
  comfortable: {
    title: 'text-2xl font-bold text-(--text-primary)',
    header: 'px-4 py-3',
    summary: 'px-4 py-3',
    summaryText: 'text-sm',
    list: 'space-y-4 p-4',
    empty: 'py-6 text-sm',
  },
  compact: {
    title: 'text-lg font-bold text-(--text-primary)',
    header: 'px-3 py-2',
    summary: 'px-3 py-2',
    summaryText: 'text-[11px]',
    list: 'space-y-3 p-3',
    empty: 'py-4 text-xs',
  },
} satisfies Record<MealSectionDensity, Record<string, string>>;

export const MealSection = ({ title, mealType, foods, density = 'comfortable' }: MealSectionProps) => {
  const styles = mealSectionStyle[density];

  // 날짜 필터링은 페이지에서 끝내고, MealSection은 식사 타입만 담당한다.
  const mealFoods = foods.filter(food => food.mealType === mealType);
  const mealNutrition = nutrientsByMeal(mealFoods)[mealType];
  const totalCalories = calories(mealNutrition.carbs, mealNutrition.protein, mealNutrition.fat);

  return (
    <div className="flex min-h-0 flex-col">
      {/* 헤더 영역 */}
      <div className={`shrink-0 border-b border-(--neutral-4) text-center ${styles.header}`}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {/* 영양소 요약 영역 */}
      <div className={`shrink-0 border-b border-(--neutral-4) ${styles.summary}`}>
        <div
          className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-(--text-secondary) ${styles.summaryText}`}
        >
          <span className="text-(--text-muted)">
            탄 <span className="text-(--text-primary)">{mealNutrition.carbs}</span>g
          </span>

          <span className="text-(--text-muted)">
            단 <span className="text-(--text-primary)">{mealNutrition.protein}</span>g
          </span>

          <span className="text-(--text-muted)">
            지 <span className="text-(--text-primary)">{mealNutrition.fat}</span>g
          </span>

          <span className="text-(--neutral-3)">|</span>
          <span className="font-semibold text-(--primary-1)">총 {totalCalories} kcal</span>
        </div>
      </div>

      {/* 카드 리스트 영역: 스크롤은 카드가 아니라 리스트가 담당한다. */}
      <div className={`min-h-0 flex-1 overflow-y-auto ${styles.list}`}>
        {mealFoods.length > 0 ? (
          mealFoods.map(food => <FoodCard key={food.id} food={food} compact={density === 'compact'} />)
        ) : (
          <p className={`text-center text-(--text-muted) ${styles.empty}`}>등록된 음식이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
