import type { FoodItem } from '../../../../types/types';
import { calories, caloriesByNutrient, totalNutrients } from '../../../../utils/calculate';
import SectionLayout from '../../../../components/common/SectionLayout';
import { NutritionSummary } from './NutritionSummary';
import { NutritionDoughnutChart } from './NutritionDoughuntChart';

type NutritionChartProps = {
  foods: FoodItem[];
  className?: string;
};

export const NutritionChart = ({ foods, className = '' }: NutritionChartProps) => {
  // 날짜 필터링은 페이지에서 끝내고, 차트는 전달받은 foods만 요약한다.

  // 영양소 섭취량(g) 계산
  const nutrition = totalNutrients(foods);
  // 영양소별 칼로리(kcal) 계산
  const nutrientCalories = caloriesByNutrient(nutrition);
  // 전체 칼로리(kcal) 계산
  const totalCalories = calories(nutrition.carbs, nutrition.protein, nutrition.fat);

  const chartClassName = [
    // 모든 섹션이 공유하는 기본 박스 스타일
    'border-y border-(--neutral-4) bg-(--white) ',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <SectionLayout
      title="영양소 그래프"
      description="영양소를 그래프로 확인해 보세요"
      className={chartClassName}
      contentClassName="flex-1"
    >
      <div className="grid h-full min-h-0 w-full grid-cols-[minmax(0,2fr)_minmax(80px,1fr)] items-center md:px-10">
        <NutritionSummary nutrition={nutrition} totalCalories={totalCalories} className="min-w-0" />

        <div className="flex w-full justify-center">
          <NutritionDoughnutChart nutrientCalories={nutrientCalories} totalCalories={totalCalories} />
        </div>
      </div>
    </SectionLayout>
  );
};
