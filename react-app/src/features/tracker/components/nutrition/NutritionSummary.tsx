import { formatNumber } from '../../../../utils/formatNumber';
import type { NutrientAmounts } from '../../../../utils/calculate';

type NutritionSummaryProps = {
  nutrition: NutrientAmounts;
  totalCalories: number;
  className?: string;
};

const nutrientItems = [
  {
    key: 'carbs',
    label: '탄수화물',
    dotClassName: 'bg-(--chart-carbs)',
  },
  {
    key: 'protein',
    label: '단백질',
    dotClassName: 'bg-(--chart-protein)',
  },
  {
    key: 'fat',
    label: '지방',
    dotClassName: 'bg-(--chart-fat)',
  },
] as const;

export const NutritionSummary = ({ nutrition, totalCalories, className = '' }: NutritionSummaryProps) => {
  const summaryClassName = ['flex min-w-0 flex-col justify-center', className].filter(Boolean).join(' ');

  return (
    <div className={summaryClassName}>
      <div className="flex items-baseline gap-1">
        <strong className="text-3xl font-medium tracking-tight text-(--text-primary) tabular-nums">
          {formatNumber(totalCalories)}
        </strong>

        <span className="text-sm text-(--text-muted)">kcal</span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-8 max-[420px]:mt-4 max-[420px]:gap-4">
        {nutrientItems.map(({ key, label, dotClassName }) => (
          <div key={key} className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs whitespace-nowrap text-(--text-secondary)">
              <span aria-hidden="true" className={`size-2 shrink-0 rounded-full max-[420px]:hidden ${dotClassName}`} />
              {label}
            </p>

            <p className="mt-1 text-sm font-medium text-(--text-primary) tabular-nums">
              {formatNumber(nutrition[key])}
              <span className="ml-0.5 font-normal text-(--text-muted)">g</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
