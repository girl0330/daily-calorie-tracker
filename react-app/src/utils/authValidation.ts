// 로그인·회원가입·비밀번호 화면이 함께 쓰는 입력 검사예요.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 새 비밀번호 규칙 안내. 회원가입·비밀번호 재설정·마이페이지 비밀번호 변경이 같은 규칙을 써요. */
export const NEW_PASSWORD_HINT = '8자 이상, 영문과 숫자를 섞어 주세요.';

/** 8자 이상이고 영문과 숫자가 모두 들어 있는지 */
export const isValidNewPassword = (password: string) =>
  password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);

/** 이메일 칸의 오류 문구. 문제가 없으면 undefined예요. */
export const getEmailError = (email: string) => {
  const value = email.trim();
  if (!value) return '이메일을 입력하세요.';
  if (!EMAIL_PATTERN.test(value)) return '이메일 형식이 맞지 않아요. 예) name@example.com';
  return undefined;
};
