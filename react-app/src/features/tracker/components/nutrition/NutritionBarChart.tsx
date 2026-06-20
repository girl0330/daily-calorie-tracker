import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip, type ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { NutritionTotals } from './NutritionSummary';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type NutritionBarChartProps = {
  nutrition: NutritionTotals;
  className?: string;
};

const getCssVariable = (name: string, fallback: string) => {
  // 테스트나 SSR 환경에서는 document가 없을 수 있으므로 기본값을 반환한다.
  if (typeof document === 'undefined') {
    return fallback;
  }

  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
};

export const NutritionBarChart = ({ nutrition, className = '' }: NutritionBarChartProps) => {
  const chartColors = {
    carbs: getCssVariable('--chart-carbs', '#f59e0b'),
    protein: getCssVariable('--chart-protein', '#22c55e'),
    fat: getCssVariable('--chart-fat', '#ef4444'),
  };

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
          color: getCssVariable('--neutral-4', '#e5e7eb'),
        },
        ticks: {
          color: getCssVariable('--text-muted', '#8c8278'),
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: getCssVariable('--text-secondary', '#6f675f'),
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
    },
  };

  const chartClassName = ['min-h-[180px] flex-1', className].filter(Boolean).join(' ');

  return (
    <div className={chartClassName}>
      <Bar options={options} data={data} />
    </div>
  );
};
