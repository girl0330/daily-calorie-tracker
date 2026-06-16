import { useState } from 'react';
import { signUpApi } from '../../service/UserService';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '../../features/foods/utils/sweetAlert';

const SignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const message =
        error instanceof Error && error.message === 'User already registered'
          ? '이미 존재하는 계정입니다.'
          : '회원가입 중 알 수 없는 오류가 발생했습니다.';

      showAlert({
        title: '회원가입 실패',
        text: message,
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
          <p className="shrink-0 text-[17px] text-[#8a8178]">Sign up</p>
          <div className="h-px flex-1 bg-[#ddd6cf]" />
        </div>

        {/* 소셜 로그인 */}
        <div className="grid grid-cols-2 gap-4">
          <button className="h-14 border">카카오톡</button>
          <button className="h-14 border">구글</button>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
