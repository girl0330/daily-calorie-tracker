type ValidationRule =
  | { type: 'required'; message: string }
  | { type: 'minLength'; min: number; message: string }
  | { type: 'match'; compareValue: string; message: string };

// 2. 각 필드가 가질 데이터 구조 정의
interface ValidationField {
  value: string;
  rules: ValidationRule[];
}

/**
 * 선언된 규칙들을 순차적으로 검사하여 첫 번째 에러 메시지를 반환하는 통합 함수
 */
export const getRequiredInputErrorMessage = (fields: ValidationField[]): string | null => {
  for (const field of fields) {
    const { value, rules } = field;

    for (const rule of rules) {
      switch (rule.type) {
        // 필수 값 검사 (공백 제거 후 확인)
        case 'required':
          if (value.trim().length === 0) {
            return rule.message;
          }
          break;

        // 최소 글자수 검사
        // TODO: 비밀번호 입력 input에 모두 적용하기기
        case 'minLength':
          if (value.length < rule.min) {
            return rule.message;
          }
          break;

        // 두 값이 일치하는지 검사
        case 'match':
          if (value !== rule.compareValue) {
            return rule.message;
          }
          break;

        default:
          break;
      }
    }
  }

  // 모든 검증을 통과하면 null 반환
  return null;
};
