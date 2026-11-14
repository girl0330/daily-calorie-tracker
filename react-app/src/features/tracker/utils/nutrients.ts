// 월간·주간 화면 곳곳에서 같은 순서·색으로 써요.
export const NUTRIENTS = [
  { key: 'carbs', label: '탄수화물', short: '탄', dotClassName: 'bg-(--carbs)' },
  { key: 'protein', label: '단백질', short: '단', dotClassName: 'bg-(--protein)' },
  { key: 'fat', label: '지방', short: '지', dotClassName: 'bg-(--fat)' },
] as const;

export type NutrientKey = (typeof NUTRIENTS)[number]['key'];
