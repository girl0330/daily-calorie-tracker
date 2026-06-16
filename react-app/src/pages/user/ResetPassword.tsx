import { useEffect, useState } from 'react';
import { logoutApi, resetPasswordApi } from '../../service/UserService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { showAlert } from '../../features/foods/utils/sweetAlert';
import { getRequiredInputErrorMessage } from '../../features/foods/utils/validateCommonInput';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const clearUser = useAuthStore(state => state.clearUser);

  // 1. 상태 분리: 새 비밀번호와 비밀번호 확인을 따로 관리합니다.
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  // 2. 파생 상태: 실시간 검증을 위한 변수들
  const isConfirmEmpty = confirmPassword === '';
  const isMatched = password === confirmPassword;

  const handleSubmitPW = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 필수 입력값 검증 (기존 유틸 함수 활용)
    const validationMessage = getRequiredInputErrorMessage([
      {
        value: password,
        rules: [
          { type: 'required', message: '비밀번호를 입력해주세요.' },
          { type: 'minLength', min: 8, message: '비밀번호는 최소 8자리 이상이어야 합니다.' },
        ],
      },
      {
        value: confirmPassword,
        rules: [
          { type: 'required', message: '비밀번호 확인을 입력해주세요.' },
          { type: 'match', compareValue: password, message: '비밀번호가 일치하지 않습니다.' },
        ],
      },
    ]);

    if (validationMessage) {
      showAlert({
        title: '변경 실패', // 타이틀 수정
        text: validationMessage,
        icon: 'error',
      });
      return;
    }

    // // 3. 최종 제출 전 두 비밀번호 일치 여부 확인
    // if (!isMatched) {
    //   showAlert({
    //     title: '변경 실패',
    //     text: '비밀번호가 일치하지 않습니다. 다시 확인해주세요.',
    //     icon: 'error',
    //   });
    //   return;
    // }

    try {
      setIsPending(true);
      await resetPasswordApi(password);

      await showAlert({
        title: '비밀번호 재설정 완료',
        html: `비밀번호가 변경되었습니다. <br/> 새 비밀번호로 다시 로그인해 주세요.`,
        icon: 'success',
      });

      await logoutApi();
      clearUser();
      navigate('/login', { replace: true });
    } catch (error) {
      showAlert({
        title: '변경 실패', // 타이틀 수정
        text: `${error}`,
        icon: 'error',
      });
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    // 주소창의 '#' 뒤에 있는 파라미터 분석
    const handleExpiredResetLink = async () => {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const errorCode = hashParams.get('error_code');

      if (errorCode !== 'otp_expired') {
        return;
      }

      await showAlert({
        title: '비밀번호 재설정 링크 만료',
        html: `비밀번호 재설정 링크가 만료되었습니다.<br />
                다시 요청해주세요.`,
        icon: 'error',
      });

      navigate('/find-password', { replace: true });
    };

    handleExpiredResetLink();
  }, [location.hash, navigate]);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-[430px] bg-white p-3">
        {/* 상단 로고/배너 영역 */}
        <div className="mb-10 flex justify-center">
          <div className="flex h-[110px] items-center justify-center rounded-md text-4xl font-bold">
            {' '}
            {/* font-bold 추가 */}
            비밀번호 재설정
          </div>
        </div>

        {/* 비밀번호 입력 폼 */}
        <form className="space-y-4" onSubmit={handleSubmitPW}>
          <div className="space-y-2">
            {/* 첫 번째: 비밀번호 입력 */}
            <label htmlFor="password" className="block text-[15px] font-medium text-[#8c8278]">
              새 비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)} // onChange 연결
              placeholder="새 비밀번호를 입력하세요."
              className="h-12 w-full rounded-2xl border border-[#e4ded8] bg-white px-5 text-[18px] text-[#3a332d] transition outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
            />

            {/* 두 번째: 비밀번호 확인 입력 */}
            <label htmlFor="confirmPassword" className="block pt-2 text-[15px] font-medium text-[#8c8278]">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword" // id 고유값으로 수정
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} // confirmPassword 상태와 연결
              placeholder="비밀번호를 다시 한번 입력하세요."
              className="h-12 w-full rounded-2xl border border-[#e4ded8] bg-white px-5 text-[18px] text-[#3a332d] transition outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
            />

            {/* 4. 실시간 일치 여부 안내 메시지 추가 */}
            {!isConfirmEmpty && (
              <p className={`mt-1 pl-2 text-sm ${isMatched ? 'text-green-600' : 'text-red-500'}`}>
                {isMatched ? '✓ 비밀번호가 일치합니다.' : '✗ 비밀번호가 일치하지 않습니다.'}
              </p>
            )}
          </div>

          {/* 5. 조건에 맞지 않을 때 버튼 disabled 처리 추가 */}
          <button
            type="submit"
            // disabled={isPending || !password || !confirmPassword || !isMatched}
            className="mt-6 h-12 w-full rounded-2xl border border-[#8a8178] bg-white font-semibold transition hover:bg-(--border-strong) active:scale-[0.99]"
          >
            {isPending ? '변경 중...' : '확인'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;
