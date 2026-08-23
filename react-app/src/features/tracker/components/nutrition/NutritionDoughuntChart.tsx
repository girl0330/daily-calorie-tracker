import { ArcElement, Chart as ChartJS, Tooltip, type ChartOptions, type Plugin } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { NutrientCalories } from '../../../../utils/calculate';

ChartJS.register(ArcElement, Tooltip);

type NutritionDoughnutChartProps = {
  nutrientCalories: NutrientCalories;
  totalCalories: number;
  className?: string;
};

const getCssVariable = (name: string, fallback: string) => {
  if (typeof document === 'undefined') {
    return fallback;
  }

  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
};

export const NutritionDoughnutChart = ({
  nutrientCalories,
  totalCalories,
  className = '',
}: NutritionDoughnutChartProps) => {
  const hasNutritionData = nutrientCalories.carbs > 0 || nutrientCalories.protein > 0 || nutrientCalories.fat > 0;

  const chartColors = {
    carbs: getCssVariable('--chart-carbs', '#f59e0b'),
    protein: getCssVariable('--chart-protein', '#22c55e'),
    fat: getCssVariable('--chart-fat', '#ef4444'),
  };

  const data = {
    labels: hasNutritionData ? ['탄수화물', '단백질', '지방'] : ['기록 없음'],

    datasets: [
      {
        data: hasNutritionData ? [nutrientCalories.carbs, nutrientCalories.protein, nutrientCalories.fat] : [1],

        backgroundColor: hasNutritionData
          ? [chartColors.carbs, chartColors.protein, chartColors.fat]
          : [getCssVariable('--neutral-4', '#e5e7eb')],

        borderWidth: 0,
        hoverOffset: hasNutritionData ? 2 : 0,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      tooltip: {
        enabled: hasNutritionData,
        backgroundColor: 'rgba(34, 34, 34, 0.92)',
        padding: 10,
        displayColors: false,

        callbacks: {
          label: context => {
            const value = Number(context.raw);

            return `${context.label}: ${value.toLocaleString()}kcal`;
          },
        },
      },
    },
  };

  const centerTextPlugin: Plugin<'doughnut'> = {
    id: 'centerText',

    afterDraw(chart) {
      const { ctx, chartArea, width } = chart;

      if (!chartArea) {
        return;
      }

      const isCompact = width <= 80;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = getCssVariable('--text-primary', '#222222');
      ctx.font = `600 ${isCompact ? 11 : 15}px sans-serif`;
      ctx.fillText(totalCalories.toLocaleString(), centerX, centerY - (isCompact ? 5 : 7));

      ctx.fillStyle = getCssVariable('--text-secondary', '#6f675f');
      ctx.font = `500 ${isCompact ? 8 : 10}px sans-serif`;
      ctx.fillText('kcal', centerX, centerY + (isCompact ? 8 : 10));

      ctx.restore();
    },
  };

  const chartClassName = ['h-24 w-24 shrink-0', 'max-[440px]:h-20 max-[440px]:w-20', 'md:h-36 md:w-36', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={chartClassName}>
      <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
};
