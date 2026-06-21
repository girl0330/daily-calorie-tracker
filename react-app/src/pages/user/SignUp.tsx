import { useState } from 'react';
import { signUpApi } from '../../service/UserService';
import { Link, useNavigate } from 'react-router-dom';
import { showAlert } from '../../utils/sweetAlert';
import { getRequiredInputErrorMessage } from '../../utils/validateCommonInput';

const SignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationMessage = getRequiredInputErrorMessage([
      {
        value: email,
        rules: [
          { type: 'required', message: '이메일을 입력해주세요.' },
          { type: 'pattern', regex: loginEmailPattern, message: '올바른 이메일 형식으로 입력해주세요.' },
        ],
      },
      {
        value: password,
        rules: [
          { type: 'required', message: '비밀번호를 입력해주세요.' },
          { type: 'minLength', min: 8, message: '비밀번호는 최소 8자리 이상이어야 합니다.' },
        ],
      },
    ]);

    // 유효성 검사에 걸리면 즉시 경고창을 띄우고 함수 종료됨
    if (validationMessage) {
      showAlert({
        title: '로그인 실패',
        text: validationMessage,
        icon: 'error',
      });

      return;
    }

    try {
      await signUpApi(email, password);

      await showAlert({
        title: '회원가입 성공',
        text: '바로 메인페이지로 이동 됩니다',
        icon: 'success',
      });

      navigate('/', { replace: true });
    } catch (error) {
      console.error('회원가입 실패:', error);

      const apiErrorMessage =
        error instanceof Error && error.message === 'User already registered'
          ? '이미 존재하는 계정입니다.'
          : '회원가입 중 알 수 없는 오류가 발생했습니다.';

      showAlert({
        title: '회원가입 실패',
        text: apiErrorMessage,
        icon: 'error',
      });
    }
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-[430px] bg-white p-3">
        {/* 상단 로고/배너 영역 */}
        <div className="mb-10 flex justify-center">
          <div className="flex h-[110px] items-center justify-center rounded-md text-4xl"> 계정만들기 </div>
        </div>
        {/* 이메일 폼 */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-[15px] font-medium text-[#8c8278]">
              이메일
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일 주소를 입력하세요."
              className="h-12 w-full rounded-2xl border border-[#e4ded8] bg-white px-5 text-[18px] text-[#3a332d] transition outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
            />

            <label htmlFor="password" className="block text-[15px] font-medium text-[#8c8278]">
              비밀번호
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요."
              className="h-12 w-full rounded-2xl border border-[#e4ded8] bg-white px-5 text-[18px] text-[#3a332d] transition outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
            />
          </div>

          <button
            type="submit"
            className="text-l mt-6 h-12 w-full cursor-pointer rounded-2xl bg-[#2f80ed] font-semibold text-white shadow-[0_4px_10px_rgba(47,128,237,0.28)] transition hover:bg-[#2975da] active:scale-[0.99]"
          >
            회원가입
          </button>
        </form>
        {/* 구분선 */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#ddd6cf]" />
          <Link
            to="/login"
            className="shrink-0 cursor-pointer text-[17px] text-[#8a8178] hover:font-bold hover:text-[#5f574f]"
          >
            Login
          </Link>
          <div className="h-px flex-1 bg-[#ddd6cf]" />
        </div>

        {/* 나중에 추가 예정*/}

        {/* <div className="grid grid-cols-2 gap-4">
          <button className="h-14 border">카카오톡</button>
          <button className="h-14 border">구글</button>
        </div> */}
      </div>
    </main>
  );
};

export default SignUp;
