import { useRef, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import TextField from '../../components/common/TextField';
import { loginApi } from '../../service/UserService';
import { useAuthStore } from '../../store/authStore';
import { getEmailError } from '../../utils/authValidation';
import AuthLayout, { AuthLink, AuthNotice } from './AuthLayout';

type LoginErrors = { email?: string; password?: string };

/** 로그인 화면. 로그인 안내창·메뉴의 로그인 버튼으로 오거나, 로그아웃·탈퇴하면 이 화면으로 와요. */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  // 로그인 안내창이나 마이페이지에서 왔다면 로그인 뒤 그 주소로 돌려보내요. 앱 안 주소('/'로 시작)만 받아요.
  const from: unknown = location.state?.from;
  const returnTo = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/';
  const setUser = useAuthStore(state => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  // 서버에서 실패했을 때(비밀번호가 틀림 등) 폼 안에 보여 줄 문구
  const [formError, setFormError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    // 이미 가입한 사람의 예전 비밀번호도 들어와야 해서, 비밀번호는 비어 있는지만 봐요.
    const nextErrors: LoginErrors = {
      email: getEmailError(email),
      password: password ? undefined : '비밀번호를 입력하세요.',
    };
    setErrors(nextErrors);
    if (nextErrors.email) return emailRef.current?.focus();
    if (nextErrors.password) return passwordRef.current?.focus();

    try {
      setIsPending(true);
      const data = await loginApi(email.trim(), password);
      setUser(data.user);
      navigate(returnTo, { replace: true });
    } catch (error) {
      setIsPending(false);
      setFormError(
        error instanceof Error && error.message === 'Invalid login credentials'
          ? '이메일이나 비밀번호가 맞지 않아요.'
          : '로그인하지 못했어요. 잠시 후 다시 시도해 주세요.'
      );
    }
  };

  return (
    <AuthLayout
      title="로그인"
      description="기록을 이어가려면 로그인해 주세요."
      footer={
        <>
          <AuthLink to="/find-password">비밀번호를 잊었어요</AuthLink>
          <span>
            계정이 없나요?{' '}
            <AuthLink to="/sign-up" strong>
              회원가입
            </AuthLink>
          </span>
        </>
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
          autoComplete="current-password"
          error={errors.password}
          onChange={event => setPassword(event.target.value)}
        />

        {formError && <AuthNotice tone="error">{formError}</AuthNotice>}

        <Button type="submit" variant="brand" size="lg" disabled={isPending} className="mt-1 w-full">
          {isPending ? '로그인하는 중…' : '로그인'}
        </Button>
      </form>
    </AuthLayout>
  );
}
