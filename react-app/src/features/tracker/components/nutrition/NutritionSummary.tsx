export type NutritionTotals = {
  carbs: number;
  protein: number;
  fat: number;
};

type NutritionSummaryProps = {
  nutrition: NutritionTotals;
  totalCalories: number;
  className?: string;
};

const nutrientItems = [
  {
    key: 'carbs',
    label: '탄수화물',
    colorClassName: 'bg-(--chart-carbs)',
  },
  {
    key: 'protein',
    label: '단백질',
    colorClassName: 'bg-(--chart-protein)',
  },
  {
    key: 'fat',
    label: '지방',
    colorClassName: 'bg-(--chart-fat)',
  },
] as const;

export const NutritionSummary = ({ nutrition, totalCalories, className = '' }: NutritionSummaryProps) => {
  const summaryClassName = [
    // 차트가 없어도 단독 카드처럼 보이도록 요약 UI 자체에 배경과 여백을 둔다.
    'flex flex-col justify-center rounded-2xl bg-(--neutral-5) px-5 py-4',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={summaryClassName}>
      <div className="flex items-end gap-1">
        <span className="pb-1 text-sm font-semibold text-(--text-muted)">총</span>
        <strong className="text-3xl font-black tracking-[-0.04em] text-(--text-primary)">{totalCalories}</strong>
        <span className="pb-1 text-sm font-semibold text-(--text-muted)">kcal</span>
      </div>

      {/* 영양소 뱃지는 같은 데이터 구조에서 반복 렌더링해서 항목 추가/수정이 쉽도록 한다. */}
      <div className="mt-4 flex flex-col gap-2">
        {nutrientItems.map(({ key, label, colorClassName }) => (
          <span
            key={key}
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-(--text-secondary)"
          >
            <span className={['h-2 w-2 rounded-full', colorClassName].join(' ')} />
            {label} {nutrition[key]}g
          </span>
        ))}
      </div>
    </div>
  );
};
