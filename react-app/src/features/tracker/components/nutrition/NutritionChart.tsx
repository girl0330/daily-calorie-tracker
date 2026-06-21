import type { FoodItem } from '../../../../types/types';
import { calories, totalNutrients } from '../../../../utils/calculate';
import SectionLayout from '../../../../components/common/SectionLayout';
import { NutritionBarChart } from './NutritionBarChart';
import { NutritionSummary } from './NutritionSummary';

type NutritionChartProps = {
  foods: FoodItem[];
  className?: string;
};

export const NutritionChart = ({ foods, className = '' }: NutritionChartProps) => {
  // 날짜 필터링은 페이지에서 끝내고, 차트는 전달받은 foods만 요약한다.
  const nutrition = totalNutrients(foods);
  const totalCalories = calories(nutrition.carbs, nutrition.protein, nutrition.fat);

  return (
    <SectionLayout
      title="영양소 그래프"
      description="영양소를 그래프로 확인해 보세요"
      className={className}
      contentClassName="flex-1"
    >
      <div className="grid h-full min-h-0 grid-cols-1 gap-4 rounded-md md:grid-cols-[240px_1fr]">
        <NutritionSummary nutrition={nutrition} totalCalories={totalCalories} />
        <NutritionBarChart nutrition={nutrition} />
      </div>
    </SectionLayout>
  );
};
