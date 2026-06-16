import { useState } from 'react';
import { login as loginApi } from '../../service/UserService';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { showAlert } from '../../features/foods/utils/sweetAlert';
import { getRequiredInputErrorMessage } from '../../features/foods/utils/validateCommonInput';

const Login = () => {
  const navigate = useNavigate();

  const setUser = useAuthStore(state => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationMessage = getRequiredInputErrorMessage([
      {
        value: email,
        message: '이메일을 입력해주세요.',
      },
      {
        value: password,
        message: '비밀번호를 입력해주세요.',
      },
    ]);

    if (validationMessage) {
      showAlert({
        title: '로그인 실패',
        text: validationMessage,
        icon: 'error',
      });

      return;
    }

    try {
      setIsPending(true);
      const data = await loginApi(email, password);
      setUser(data.user);

      navigate('/', { replace: true });
    } catch (error) {
      const message =
        error instanceof Error && error.message === 'Invalid login credentials'
          ? '이메일 또는 비밀번호를 확인하시고 다시 입력해주세요.'
          : '로그인 중 알 수 없는 오류가 발생했습니다.';

      showAlert({
        title: '로그인 실패',
        text: message,
        icon: 'error',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-[430px] bg-white p-3">
        {/* 상단 로고/배너 영역 */}
        <div className="mb-10 flex justify-center">
          <div className="flex h-[110px] items-center justify-center rounded-md text-4xl"> 로그인 </div>
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
            disabled={isPending}
            className="text-l mt-6 h-12 w-full rounded-2xl bg-(--accent-2) font-semibold text-white transition hover:bg-(--accent-1) active:scale-[0.99]"
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <button
          onClick={() => navigate('/find-password')}
          className="mt-6 h-12 w-full rounded-2xl border border-[#8a8178] bg-white font-semibold transition hover:bg-(--border-strong) active:scale-[0.99]"
        >
          비밀번호 찾기
        </button>
        {/* 구분선 */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#ddd6cf]" />
          <Link
            to="/sign-up"
            className="shrink-0 cursor-pointer text-[17px] text-[#8a8178] hover:font-bold hover:text-[#5f574f]"
          >
            Sign up
          </Link>
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

export default Login;
