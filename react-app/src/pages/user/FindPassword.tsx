import { useRef, useState, type FormEvent } from 'react';
import Button from '../../components/common/Button';
import TextField from '../../components/common/TextField';
import { sendPasswordResetEmailApi } from '../../service/UserService';
import { getEmailError } from '../../utils/authValidation';
import AuthLayout, { AuthLink, AuthNotice } from './AuthLayout';

/**
 * 비밀번호 찾기 화면. 가입한 이메일로 비밀번호를 다시 정하는 링크를 보내요.
 * 그 링크를 누르면 비밀번호 재설정 화면(ResetPassword)이 열려요.
 */
export default function FindPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [formError, setFormError] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setIsSent(false);

    const nextError = getEmailError(email);
    setEmailError(nextError);
    if (nextError) return emailRef.current?.focus();

    try {
      setIsPending(true);
      await sendPasswordResetEmailApi(email.trim());
      // 가입하지 않은 이메일인지는 알려 주지 않아요(남의 가입 여부를 알아낼 수 없게).
      setIsSent(true);
    } catch {
      setFormError('메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthLayout
      title="비밀번호 찾기"
      description="가입한 이메일로 비밀번호를 다시 정하는 링크를 보내요."
      footer={<AuthLink to="/login">로그인으로 돌아가기</AuthLink>}
    >
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <TextField
          ref={emailRef}
          type="email"
          label="이메일"
          value={email}
          placeholder="name@example.com"
          autoComplete="email"
          error={emailError}
          onChange={event => setEmail(event.target.value)}
        />

        {isSent && <AuthNotice tone="ok">메일을 보냈어요. 가입한 이메일이면 곧 링크가 도착해요.</AuthNotice>}
        {formError && <AuthNotice tone="error">{formError}</AuthNotice>}

        <Button type="submit" variant="brand" size="lg" disabled={isPending} className="mt-1 w-full">
          {isPending ? '보내는 중…' : '링크 보내기'}
        </Button>
      </form>
    </AuthLayout>
  );
}
