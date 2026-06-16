import { useState } from 'react';
import { showAlert } from '../../features/foods/utils/sweetAlert';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmailApi } from '../../service/UserService';

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);

  /**
   * 입력한 이메일로 비밀번호 재설정 링크를 전송한다.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim().length === 0) {
      await showAlert({
        title: '비밀번호 재설정 실패',
        text: '이메일을 입력해주세요.',
        icon: 'error',
      });

      return;
    }

    try {
      setIsPending(true);

      await sendPasswordResetEmailApi(email);

      await showAlert({
        title: '이메일 전송 완료',
        text: '입력한 이메일로 비밀번호 재설정 링크를 보냈습니다.',
        icon: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '비밀번호 재설정 이메일 전송 중 오류가 발생했습니다.';

      await showAlert({
        title: '비밀번호 재설정 실패',
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
