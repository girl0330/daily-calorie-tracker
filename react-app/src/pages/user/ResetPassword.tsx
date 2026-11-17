import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import TextField from '../../components/common/TextField';
import { useLogout } from '../../hooks/useLogout';
import { resetPasswordApi } from '../../service/UserService';
import { showToast } from '../../store/toastStore';
import { isValidNewPassword, NEW_PASSWORD_HINT } from '../../utils/authValidation';
import AuthLayout, { AuthNotice } from './AuthLayout';

type ResetErrors = { password?: string; confirm?: string };

/**
 * 비밀번호 재설정 화면. 비밀번호 찾기 메일의 링크를 눌렀을 때만 열려요.
 * 바꾸면 로그아웃하고 로그인 화면으로 보내요.
 */
export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<ResetErrors>({});
  const [formError, setFormError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const nextErrors: ResetErrors = {
      password: !password ? '새 비밀번호를 입력하세요.' : isValidNewPassword(password) ? undefined : NEW_PASSWORD_HINT,
      confirm: !confirm
        ? '새 비밀번호를 한 번 더 입력하세요.'
        : confirm === password
          ? undefined
          : '새 비밀번호가 서로 달라요.',
    };
    setErrors(nextErrors);
    if (nextErrors.password) return passwordRef.current?.focus();
    if (nextErrors.confirm) return confirmRef.current?.focus();

    try {
      setIsPending(true);
      await resetPasswordApi(password);
      await logout('비밀번호를 바꿨어요. 새 비밀번호로 로그인해 주세요.');
    } catch (error) {
      setIsPending(false);
      // Supabase는 예전과 같은 비밀번호면 바꾸지 않아요.
      setFormError(
        error instanceof Error && error.message.includes('different from the old password')
          ? '예전 비밀번호와 다르게 정해 주세요.'
          : '비밀번호를 바꾸지 못했어요. 잠시 후 다시 시도해 주세요.'
      );
    }
  };

  // 메일 링크가 만료됐으면 주소 '#' 뒤에 error_code=otp_expired가 붙어 와요. 그러면 다시 요청하게 보내요.
  useEffect(() => {
    const errorCode = new URLSearchParams(location.hash.substring(1)).get('error_code');
    if (errorCode !== 'otp_expired') return;

    showToast('링크가 만료됐어요. 다시 요청해 주세요.');
    navigate('/find-password', { replace: true });
  }, [location.hash, navigate]);

  return (
    <AuthLayout title="새 비밀번호 정하기" description="새로 쓸 비밀번호를 두 번 입력해 주세요.">
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <TextField
          ref={passwordRef}
          type="password"
          label="새 비밀번호"
          value={password}
          placeholder="새 비밀번호를 입력하세요."
          autoComplete="new-password"
          hint={NEW_PASSWORD_HINT}
          error={errors.password}
          onChange={event => setPassword(event.target.value)}
        />
        <TextField
          ref={confirmRef}
          type="password"
          label="새 비밀번호 확인"
          value={confirm}
          placeholder="한 번 더 입력하세요."
          autoComplete="new-password"
          error={errors.confirm}
          onChange={event => setConfirm(event.target.value)}
        />

        {formError && <AuthNotice tone="error">{formError}</AuthNotice>}

        <Button type="submit" variant="brand" size="lg" disabled={isPending} className="mt-1 w-full">
          {isPending ? '바꾸는 중…' : '비밀번호 바꾸기'}
        </Button>
      </form>
    </AuthLayout>
  );
}
