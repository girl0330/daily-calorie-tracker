import { calories, totalNutrients } from '../../utils/calculate';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { FoodItem } from '../../types/types';

type NutritionChartProps = {
  foods: FoodItem[];
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const rootStyles = getComputedStyle(document.documentElement);

const chartColors = {
  carbs: rootStyles.getPropertyValue('--chart-carb').trim(),
  protein: rootStyles.getPropertyValue('--chart-protein').trim(),
  fat: rootStyles.getPropertyValue('--chart-fat').trim(),
};

export const NutritionChart = ({ foods }: NutritionChartProps) => {
  const nutrition = totalNutrients(foods);
  console.log('nutrition은:::???', nutrition);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  const data = {
    labels: ['탄수화물', '단백질', '지방'],
    datasets: [
      {
        label: '영양소(g)',
        data: [nutrition.carbs, nutrition.protein, nutrition.fat],
        backgroundColor: [chartColors.carbs, chartColors.protein, chartColors.fat],
        barThickness: 100,
      },
    ],
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full min-h-80 flex-1 flex-col rounded-md border border-(--neutral-4) bg-(--bg-section) p-4">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-(--text-primary)">영양소 그래프</h2>
          <p className="mt-1 text-sm text-(--text-muted)">오늘 영양소 그래프를 확인해 보세요.</p>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-1 flex-col rounded-md bg-white px-4 pt-5 pb-4">
            {/* 그래프 */}
            <Bar options={options} data={data} />
            {/* 칼로리 summary */}
            <div className="mt-4 flex items-center justify-center border-t border-(--neutral-4) pt-3">
              {/* 총 칼로리 + 영양소 요약을 가운데에 나란히 배치 */}
              <div className="flex items-center gap-6">
                <p className="text-2xl font-bold text-(--chart-calorie)">
                  {calories(nutrition.carbs, nutrition.protein, nutrition.fat)}{' '}
                  <span className="text-base font-medium">kcal</span>
                </p>
                <div className="text-sm text-(--text-secondary)">
                  <span>탄수화물 {nutrition.carbs}g</span>
                  <span className="mx-2 text-(--text-muted)">/</span>
                  <span>단백질 {nutrition.protein}g</span>
                  <span className="mx-2 text-(--text-muted)">/</span>
                  <span>지방 {nutrition.fat}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
