// 음식 입력/수정 폼에서 공통으로 사용하는 문자열 기반 폼 값 타입이다.
// input value는 화면에서 문자열로 관리되므로, 저장 직전에 숫자로 변환한다.
export type FoodFormValues = {
  foodName: string;
  carbs: string;
  protein: string;
  fat: string;
};

export type ParsedFoodFormValues = {
  foodName: string;
  carbs: number;
  protein: number;
  fat: number;
};

const nutrientFields: Array<keyof Pick<FoodFormValues, 'carbs' | 'protein' | 'fat'>> = ['carbs', 'protein', 'fat'];

// 음식 이름과 영양소 입력값이 저장 가능한 값인지 검사한다.
export const validateFoodForm = ({ foodName, carbs, protein, fat }: FoodFormValues): string | null => {
  if (!foodName.trim()) {
    return '음식 이름을 입력해주세요.';
  }

  if (carbs === '' || protein === '' || fat === '') {
    return '탄수화물, 단백질, 지방 값을 모두 입력해주세요.';
  }

  const nutrientValues = [carbs, protein, fat];

  if (nutrientValues.some(value => Number.isNaN(Number(value)))) {
    return '탄수화물, 단백질, 지방은 숫자여야 합니다.';
  }

  if (nutrientValues.some(value => Number(value) < 0)) {
    return '탄수화물, 단백질, 지방은 0 이상이어야 합니다.';
  }

  return null;
};

// 검증을 통과한 문자열 폼 값을 API에 전달하기 좋은 형태로 변환한다.
export const parseFoodForm = (form: FoodFormValues): ParsedFoodFormValues => {
  return {
    foodName: form.foodName.trim(),
    carbs: Number(form.carbs),
    protein: Number(form.protein),
    fat: Number(form.fat),
  };
};

// 숫자 기반 음식 데이터를 수정 폼에서 사용할 문자열 값으로 변환한다.
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
}): FoodFormValues => {
  return {
    foodName,
    carbs: String(carbs),
    protein: String(protein),
    fat: String(fat),
  };
};

// 입력 중 비어 있는 값은 미리보기 계산에서 0으로 취급한다.
export const getPreviewNutrients = (form: FoodFormValues) => {
  return nutrientFields.reduce(
    (acc, field) => {
      acc[field] = Number(form[field]) || 0;
      return acc;
    },
    { carbs: 0, protein: 0, fat: 0 }
  );
};
