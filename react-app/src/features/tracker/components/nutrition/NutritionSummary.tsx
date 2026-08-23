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
    shortLabel: '탄',
  },
  {
    key: 'protein',
    label: '단백질',
    shortLabel: '단',
  },
  {
    key: 'fat',
    label: '지방',
    shortLabel: '지',
  },
] as const;

export const NutritionSummary = ({ nutrition, totalCalories, className = '' }: NutritionSummaryProps) => {
  const summaryClassName = ['flex min-w-0 flex-col justify-center', className].filter(Boolean).join(' ');

  return (
    <div className={summaryClassName}>
      <div className="flex items-end gap-1">
        <strong className="text-3xl font-medium tracking-[-0.04em] text-(--text-primary)">
          {totalCalories.toLocaleString()}
        </strong>

        <span className="pb-1 text-xs text-(--text-secondary)">kcal</span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-8 max-[420px]:mt-2 max-[420px]:gap-4">
        {nutrientItems.map(({ key, label, shortLabel }) => (
          <div key={key} className="min-w-0">
            <p className="text-xs text-(--text-secondary)">
              <span className="max-[420px]:hidden">{label}</span>

              <span className="hidden max-[420px]:inline">{shortLabel}</span>
            </p>

            <p className="mt-1 text-sm font-medium text-(--text-primary)">{nutrition[key].toLocaleString()}g</p>
          </div>
        ))}
      </div>
    </div>
  );
};
