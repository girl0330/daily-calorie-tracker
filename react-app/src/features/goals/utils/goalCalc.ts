import type { Goal, GoalSettings, NutrientRatio } from '../types';

/**
 * 기본 목표: 식약처 '1일 영양성분 기준치'의 탄 324g·단 55g·지 54g.
 * 식품 영양표시의 %가 이 값을 기준으로 해요. 목표 설정을 처음 켜면 이 값으로 시작해요.
 * 칼로리는 이 g을 합한 값(1,296 + 220 + 486)이라 2,000이 아니라 2,002예요.
 */
export const STANDARD_GOAL: Goal = {
  kcal: 2002,
  carbs: 324,
  protein: 55,
  fat: 54,
  mode: 'nut',
  ratio: null,
};

/**
 * 참고용 성인 하루 에너지 필요추정량(kcal, 19~49세).
 * 출처: 2020 한국인 영양소 섭취기준(보건복지부). 19~29세가 max, 30~49세가 min이에요.
 */
export const ADULT_ENERGY_REFERENCES = [
  { sex: '남성', min: 2500, max: 2600 },
  { sex: '여성', min: 1900, max: 2000 },
] as const;

/**
 * 화면에서 실제로 쓸 목표. 목표 설정이 꺼져 있으면 null이에요.
 * null이면 일일·월간·주간 화면은 목표, 남은 칼로리, 달성률을 보여 주지 않아요.
 */
export const getActiveGoal = (settings: GoalSettings | undefined): Goal | null =>
  settings?.isEnabled ? (settings.goal ?? STANDARD_GOAL) : null;

export const isSameGoal = (a: Goal, b: Goal) =>
  a.kcal === b.kcal && a.carbs === b.carbs && a.protein === b.protein && a.fat === b.fat && a.mode === b.mode;

export const GOAL_KCAL_MIN = 800;
export const GOAL_KCAL_MAX = 5000;

// 직접 입력할 때 g 범위 (DB 제약과 같아요)
export const NUTRIENT_LIMITS = {
  carbs: { min: 0, max: 800 },
  protein: { min: 0, max: 400 },
  fat: { min: 0, max: 300 },
} as const;

export const DEFAULT_RATIO: NutrientRatio = { carbs: 50, protein: 20, fat: 30 };

export const RATIO_PRESETS: { label: string; ratio: NutrientRatio }[] = [
  { label: '균형', ratio: { carbs: 50, protein: 20, fat: 30 } },
  { label: '고단백', ratio: { carbs: 40, protein: 30, fat: 30 } },
  { label: '저탄수', ratio: { carbs: 30, protein: 35, fat: 35 } },
];

// 1g당 칼로리: 탄수화물·단백질 4kcal, 지방 9kcal
const KCAL_PER_GRAM = { carbs: 4, protein: 4, fat: 9 } as const;

// 칼로리와 비율 → 탄·단·지 g
export const gramsFromKcal = (kcal: number, ratio: NutrientRatio) => ({
  carbs: Math.round((kcal * ratio.carbs) / 100 / KCAL_PER_GRAM.carbs),
  protein: Math.round((kcal * ratio.protein) / 100 / KCAL_PER_GRAM.protein),
  fat: Math.round((kcal * ratio.fat) / 100 / KCAL_PER_GRAM.fat),
});

// 탄·단·지 g → 칼로리
export const kcalFromGrams = (carbs: number, protein: number, fat: number) =>
  Math.round(carbs * KCAL_PER_GRAM.carbs + protein * KCAL_PER_GRAM.protein + fat * KCAL_PER_GRAM.fat);

export const isSameRatio = (a: NutrientRatio, b: NutrientRatio) =>
  a.carbs === b.carbs && a.protein === b.protein && a.fat === b.fat;

// 입력칸 글자 → 숫자. '1,500'처럼 쉼표가 있어도 읽고, 비어 있거나 숫자가 아니면 null
export const parseNumberInput = (value: string): number | null => {
  const trimmed = value.replaceAll(',', '').trim();
  if (trimmed === '') return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};
