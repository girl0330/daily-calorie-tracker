import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import { getRequiredInputErrorMessage } from '../../utils/validateCommonInput';
import { showAlert, showConfirm } from '../../utils/sweetAlert';
import { logoutApi, reauthenticateApi, resetPasswordApi } from '../../service/UserService';

const ChangePassword = () => {
  const navigate = useNavigate();
  const clearUser = useAuthStore(state => state.clearUser);

  const user = useAuthStore(state => state.user);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  const isConfirmEmpty = confirmNewPassword === '';
  const isMatched = newPassword === confirmNewPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationMessage = getRequiredInputErrorMessage([
      {
        value: currentPassword,
        rules: [{ type: 'required', message: '현재 비밀번호를 입력해주세요.' }],
      },
      {
        value: newPassword,
        rules: [
          { type: 'required', message: '새 비밀번호를 입력해주세요.' },
          {
            type: 'minLength',
            min: 8,
            message: '비밀번호는 최소 8자리 이상이어야 합니다.',
          },
        ],
      },
      {
        value: confirmNewPassword,
        rules: [
          {
            type: 'required',
            message: '비밀번호 확인을 입력해주세요.',
          },
          {
            type: 'minLength',
            min: 8,
            message: '비밀번호는 최소 8자리 이상이어야 합니다.',
          },
          {
            type: 'match',
            compareValue: newPassword,
            message: '비밀번호가 일치하지 않습니다.',
          },
        ],
      },
    ]);

    if (validationMessage) {
      showAlert({
        title: '비밀번호 변경 실패',
        text: validationMessage,
        icon: 'error',
      });
      return;
    }

    if (!user?.email) {
      showAlert({
        title: '비밀번호 변경 실패',
        text: '사용자 이메일 정보를 확인할 수 없습니다.',
        icon: 'error',
      });
      return;
    }

    try {
      setIsPending(true);

      await reauthenticateApi(user.email, currentPassword);

      await resetPasswordApi(newPassword);

      await showAlert({
        title: '비밀번호 변경 완료',
        html: `비밀번호가 변경되었습니다.<br/>새 비밀번호로 다시 로그인해 주세요.`,
        icon: 'success',
      });

      await logoutApi();
      clearUser();
      navigate('/login', { replace: true });
    } catch (error) {
      const apiErrorMessage =
        error instanceof Error && error.message === 'Invalid login credentials'
          ? '현재 비밀번호가 일치하지 않습니다.'
          : '비밀번호 변경 중 오류가 발생했습니다.';

      showAlert({
        title: '비밀번호 변경 실패',
        text: apiErrorMessage,
        icon: 'error',
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleSkipPasswordChange = async () => {
    const result = await showConfirm({
      title: '비밀번호 변경을 나중에 하시겠어요?',
      text: '현재 비밀번호를 유지하고 홈으로 이동합니다.',
      icon: 'question',
      confirmButtonText: '홈으로 이동',
      cancelButtonText: '계속 변경하기',
    });

    if (result) {
      navigate('/');
    }
  };
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-[430px] bg-white p-3">
        <div className="mb-10 flex justify-center">
          <div className="flex h-[110px] items-center justify-center rounded-md text-4xl font-bold">비밀번호 변경</div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="block text-[15px] font-medium text-[#8c8278]">
              현재 비밀번호
            </label>

            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호를 입력하세요."
              className="h-12 w-full rounded-2xl border border-[#e4ded8] bg-white px-5 text-[18px] text-[#3a332d] transition outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
            />

            <label htmlFor="password" className="block pt-2 text-[15px] font-medium text-[#8c8278]">
              새 비밀번호
            </label>

            <input
              id="password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="새 비밀번호를 입력하세요."
              className="h-12 w-full rounded-2xl border border-[#e4ded8] bg-white px-5 text-[18px] text-[#3a332d] transition outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
            />

            <label htmlFor="confirmPassword" className="block pt-2 text-[15px] font-medium text-[#8c8278]">
              비밀번호 확인
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              placeholder="비밀번호를 다시 한번 입력하세요."
              className="h-12 w-full rounded-2xl border border-[#e4ded8] bg-white px-5 text-[18px] text-[#3a332d] transition outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
            />

            {!isConfirmEmpty && (
              <p className={`mt-1 pl-2 text-sm ${isMatched ? 'text-green-600' : 'text-red-500'}`}>
                {isMatched ? '✓ 비밀번호가 일치합니다.' : '✗ 비밀번호가 일치하지 않습니다.'}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || !currentPassword || !newPassword || !confirmNewPassword || !isMatched}
            className="mt-6 h-12 w-full rounded-2xl border border-[#8a8178] bg-white font-semibold transition hover:bg-(--border-strong) active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? '변경 중...' : '비밀번호 변경'}
          </button>

          <button
            type="button"
            onClick={handleSkipPasswordChange}
            disabled={isPending}
            className="mt-6 h-12 w-full rounded-2xl border border-[#8a8178] bg-white font-semibold transition hover:bg-(--border-strong) active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            다음에 변경하기
          </button>
        </form>
      </div>
    </main>
  );
};
export default ChangePassword;
