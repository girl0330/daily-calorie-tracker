import type { MealType } from '../../../types/types';
import { calories } from '../../../utils/calculate';

// 음식 추가판과 표의 수정 줄이 함께 쓰는 입력 규칙이에요.
// 입력칸은 글자(string)로 들고 있다가, 저장할 때 숫자로 바꿔요.
export type FoodFormValues = {
  foodName: string;
  carbs: string;
  protein: string;
  fat: string;
};

export type FoodField = keyof FoodFormValues;
export type FoodFormErrors = Partial<Record<FoodField, string>>;

// 화면에 놓인 순서예요. 저장에 실패하면 이 순서로 첫 번째 틀린 칸을 찾아요.
export const FOOD_FIELDS: FoodField[] = ['foodName', 'carbs', 'protein', 'fat'];

export const EMPTY_FOOD_FORM: FoodFormValues = { foodName: '', carbs: '', protein: '', fat: '' };

export const MEAL_OPTIONS: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: '아침' },
  { value: 'lunch', label: '점심' },
  { value: 'dinner', label: '저녁' },
];

export const MEAL_LABEL: Record<MealType, string> = { breakfast: '아침', lunch: '점심', dinner: '저녁' };

// 추가판의 시간대 기본값: 11시 전은 아침, 16시 전은 점심, 그 뒤는 저녁이에요.
export const getMealByTime = (date: Date = new Date()): MealType => {
  const hour = date.getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 16) return 'lunch';
  return 'dinner';
};

const NUMBER_PATTERN = /^\d+(\.\d+)?$/;
const ONE_DECIMAL_PATTERN = /^\d+(\.\d)?$/;

const validateNutrient = (value: string): string | undefined => {
  const text = value.trim();
  if (!text) return '입력해 주세요.';
  if (!NUMBER_PATTERN.test(text)) return '0 이상 숫자만 돼요.';
  if (!ONE_DECIMAL_PATTERN.test(text)) return '소수점 한 자리까지 돼요.';
  return undefined;
};

// 칸마다 오류 문구를 돌려줘요. 빈 객체면 저장해도 돼요.
export const validateFoodForm = (form: FoodFormValues): FoodFormErrors => {
  const errors: FoodFormErrors = {};

  if (!form.foodName.trim()) errors.foodName = '음식 이름을 입력해 주세요.';

  (['carbs', 'protein', 'fat'] as const).forEach(field => {
    const error = validateNutrient(form[field]);
    if (error) errors[field] = error;
  });

  return errors;
};

export const getFirstInvalidField = (errors: FoodFormErrors) => FOOD_FIELDS.find(field => errors[field]);

// 검사를 통과한 글자 값을 저장할 숫자로 바꿔요.
export const parseFoodForm = (form: FoodFormValues) => ({
  foodName: form.foodName.trim(),
  carbs: Number(form.carbs),
  protein: Number(form.protein),
  fat: Number(form.fat),
});

// 저장된 숫자 값을 수정 칸에 넣을 글자로 바꿔요.
export const toFoodFormValues = ({
  foodName,
  carbs,
  protein,
  fat,
}: {
  foodName: string;
  carbs: number;
  protein: number;
  fat: number;
}): FoodFormValues => ({
  foodName,
  carbs: String(carbs),
  protein: String(protein),
  fat: String(fat),
});

// 입력하는 동안 보여 줄 kcal. 아직 비었거나 잘못된 칸은 0으로 셈해요.
export const getPreviewKcal = (form: FoodFormValues) =>
  calories(Number(form.carbs) || 0, Number(form.protein) || 0, Number(form.fat) || 0);
