import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import TextField from '../../components/common/TextField';
import { signUpApi } from '../../service/UserService';
import { showToast } from '../../store/toastStore';
import { getEmailError, isValidNewPassword, NEW_PASSWORD_HINT } from '../../utils/authValidation';
import AuthLayout, { AuthLink, AuthNotice } from './AuthLayout';

type SignUpErrors = { email?: string; password?: string };

/** 회원가입 화면. 가입하면 바로 로그인된 채로 일일 기록으로 가요. */
export default function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [formError, setFormError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const nextErrors: SignUpErrors = {
      email: getEmailError(email),
      password: !password ? '비밀번호를 입력하세요.' : isValidNewPassword(password) ? undefined : NEW_PASSWORD_HINT,
    };
    setErrors(nextErrors);
    if (nextErrors.email) return emailRef.current?.focus();
    if (nextErrors.password) return passwordRef.current?.focus();

    try {
      setIsPending(true);
      await signUpApi(email.trim(), password);
      showToast('가입했어요. 오늘 먹은 것부터 기록해 보세요.');
      navigate('/', { replace: true });
    } catch (error) {
      setIsPending(false);
      setFormError(
        error instanceof Error && error.message === 'User already registered'
          ? '이미 가입한 이메일이에요. 로그인해 주세요.'
          : '가입하지 못했어요. 잠시 후 다시 시도해 주세요.'
      );
    }
  };

  return (
    <AuthLayout
      title="회원가입"
      description="이메일과 비밀번호만 있으면 바로 시작해요."
      footer={
        <span>
          이미 계정이 있나요?{' '}
          <AuthLink to="/login" strong>
            로그인
          </AuthLink>
        </span>
      }
    >
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <TextField
          ref={emailRef}
          type="email"
          label="이메일"
          value={email}
          placeholder="name@example.com"
          autoComplete="email"
          error={errors.email}
          onChange={event => setEmail(event.target.value)}
        />
        <TextField
          ref={passwordRef}
          type="password"
          label="비밀번호"
          value={password}
          placeholder="비밀번호를 입력하세요."
          autoComplete="new-password"
          hint={NEW_PASSWORD_HINT}
          error={errors.password}
          onChange={event => setPassword(event.target.value)}
        />

        {formError && <AuthNotice tone="error">{formError}</AuthNotice>}

        <Button type="submit" variant="brand" size="lg" disabled={isPending} className="mt-1 w-full">
          {isPending ? '가입하는 중…' : '가입하기'}
        </Button>
      </form>
    </AuthLayout>
  );
}
