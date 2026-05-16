import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip, type ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { FoodItem } from '../../types/types';
import { calories, totalNutrients } from '../../utils/calculate';
import useTodayFoods from '../../hooks/useTodayFoods';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type NutritionChartProps = {
  foods: FoodItem[];
  className?: string;
};

const rootStyles = getComputedStyle(document.documentElement);

const chartColors = {
  carbs: rootStyles.getPropertyValue('--chart-carb').trim(),
  protein: rootStyles.getPropertyValue('--chart-protein').trim(),
  fat: rootStyles.getPropertyValue('--chart-fat').trim(),
};

export const NutritionChart = ({ foods, className = '' }: NutritionChartProps) => {
  // 오늘 섭취한 음식만 필터링
  const todayFoods = useTodayFoods(foods);

  // 오늘 섭취한 음식들의 영양소 합계
  const nutrition = totalNutrients(todayFoods);

  // 오늘 총 칼로리 계산
  const totalCalories = calories(nutrition.carbs, nutrition.protein, nutrition.fat);

  const sectionClassName = ['rounded-[24px] border border-(--neutral-4) bg-(--bg-section) p-5 shadow-sm', className]
    .filter(Boolean)
    .join(' ');

  const data = {
    labels: ['탄수화물', '단백질', '지방'],
    datasets: [
      {
        data: [nutrition.carbs, nutrition.protein, nutrition.fat],
        backgroundColor: [chartColors.carbs, chartColors.protein, chartColors.fat],
        borderRadius: 999,
        barThickness: 18,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(34, 34, 34, 0.92)',
        padding: 10,
        displayColors: false,
        callbacks: {
          label: context => `${context.raw}g`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: rootStyles.getPropertyValue('--neutral-4').trim(),
        },
        ticks: {
          color: rootStyles.getPropertyValue('--text-muted').trim(),
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: rootStyles.getPropertyValue('--text-secondary').trim(),
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <section className={sectionClassName}>
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-(--text-primary)">영양소 그래프</h2>
        <p className="mt-1 text-sm text-(--text-muted)">오늘 영양소 그래프를 확인해 보세요.</p>
      </div>

      {/* Summary + Chart */}
      <div className="grid grid-cols-1 gap-4 rounded-md p-4 md:grid-cols-[240px_1fr]">
        {/* Calorie summary */}
        <div className="flex flex-col justify-center rounded-2xl bg-(--neutral-5) px-5 py-4">
          <div className="mt-2 flex items-end gap-1">
            <span className="pb-1 text-sm font-semibold text-(--text-muted)">총</span>
            <strong className="text-3xl font-black tracking-[-0.04em] text-(--text-primary)">{totalCalories}</strong>
            <span className="pb-1 text-sm font-semibold text-(--text-muted)">kcal</span>
          </div>

          {/* Nutrition chips */}
          <div className="mt-4 flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-(--text-secondary)">
              <span className="h-2 w-2 rounded-full bg-(--chart-carb)" />
              탄수화물 {nutrition.carbs}g
            </span>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-(--text-secondary)">
              <span className="h-2 w-2 rounded-full bg-(--chart-protein)" />
              단백질 {nutrition.protein}g
            </span>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-(--text-secondary)">
              <span className="h-2 w-2 rounded-full bg-(--chart-fat)" />
              지방 {nutrition.fat}g
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="min-h-[180px]">
          <Bar options={options} data={data} />
        </div>
      </div>
    </section>
  );
};
