// 음식 입력/수정 폼에서 공통으로 사용하는 문자열 기반 폼 값 타입이다.

import { getRequiredInputErrorMessage } from '../../../utils/validateCommonInput';

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

const nutrientSavePattern = /^\d+(\.\d{1,2})?$/;
const numberRegex = /^\d+(\.\d+)?$/;

const nutrientFields: Array<keyof Pick<FoodFormValues, 'carbs' | 'protein' | 'fat'>> = ['carbs', 'protein', 'fat'];

// 유효성 검사
export const validateFoodForm = (form: FoodFormValues): string | null => {
  const errorMessage = getRequiredInputErrorMessage([
    {
      value: form.foodName,
      rules: [{ type: 'required', message: '음식 이름을 입력해주세요.' }],
    },
    {
      value: form.carbs,
      rules: [
        { type: 'required', message: '탄수화물(carbs) 값을 입력해주세요.' },
        { type: 'minNumber', min: 0, message: `${form.carbs}은 0 이상이어야 합니다.` },
        { type: 'pattern', regex: numberRegex, message: '숫자만 입력할 수 있습니다.' },
        { type: 'pattern', regex: nutrientSavePattern, message: '탄수화물은 소수점 2자리까지 입력할 수 있습니다.' },
      ],
    },
    {
      value: form.protein,
      rules: [
        { type: 'required', message: '단백질(protein) 값을 입력해주세요.' },
        { type: 'minNumber', min: 0, message: `${form.protein}은 0 이상이어야 합니다.` },
        { type: 'pattern', regex: numberRegex, message: '숫자만 입력할 수 있습니다.' },
        { type: 'pattern', regex: nutrientSavePattern, message: '탄수화물은 소수점 2자리까지 입력할 수 있습니다.' },
      ],
    },
    {
      value: form.fat,
      rules: [
        { type: 'required', message: '지방(fat) 값을 입력해주세요.' },
        { type: 'minNumber', min: 0, message: `${form.fat}은 0 이상이어야 합니다.` },
        { type: 'pattern', regex: numberRegex, message: '숫자만 입력할 수 있습니다.' },
        { type: 'pattern', regex: nutrientSavePattern, message: '탄수화물은 소수점 2자리까지 입력할 수 있습니다.' },
      ],
    },
  ]);

  return errorMessage;
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

// 입력 중 허용할 영양소 값 패턴이다.
// 예: '', '1', '1.', '1.2', '1.23' 허용
// 예: '1.234', 'abc', '-1' 불가
// const nutrientInputPattern = /^\d*(\.\d{0,2})?$/;

// 저장 시점에 허용할 최종 영양소 값 패턴이다.
// 예: '1', '1.2', '1.23' 허용
// 예: '', '.', '1.' 불가

// input에서 값이 바뀔 때 사용할 검사 함수이다.
// 입력 중에는 빈 문자열이나 '1.' 같은 중간 상태도 허용한다.
// export const isValidNutrientInput = (value: string): boolean => {
//   return nutrientInputPattern.test(value);
// };
