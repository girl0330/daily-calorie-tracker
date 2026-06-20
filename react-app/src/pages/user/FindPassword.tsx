import { useState } from 'react';
import { showAlert } from '../../features/foods/utils/sweetAlert';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmailApi } from '../../service/UserService';
import { getRequiredInputErrorMessage } from '../../features/foods/utils/validateCommonInput';

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);

  // 이메일 패턴 정규식
  const loginEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * 입력한 이메일로 비밀번호 재설정 링크를 전송한다.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationMessage = getRequiredInputErrorMessage([
      {
        value: email,
        rules: [
          { type: 'required', message: '이메일을 입력해주세요.' },
          { type: 'pattern', regex: loginEmailPattern, message: '올바른 이메일 형식으로 입력해주세요.' },
        ],
      },
    ]);

    if (validationMessage) {
      showAlert({
        title: '비밀번호 재설정 실패',
        text: validationMessage,
        icon: 'error',
      });

      return;
    }

    try {
      setIsPending(true);

      await sendPasswordResetEmailApi(email);

      await showAlert({
        title: '이메일 전송 완료',
        text: '계정이 존재하는 경우 비밀번호 재설정 링크를 보내드립니다.',
        icon: 'success',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-[430px] bg-white p-3">
        <h1 className="mb-6 text-center text-3xl font-bold">비밀번호 재설정</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="가입한 이메일을 입력해주세요."
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-black py-3 text-white disabled:opacity-60"
          >
            {isPending ? '전송 중...' : '재설정 링크 보내기'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-gray-600 hover:text-black">
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
};

export default FindPassword;
