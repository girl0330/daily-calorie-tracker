import { useId, useRef, useState, type FormEvent, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { logoutApi, reauthenticateApi, resetPasswordApi } from '../../service/UserService';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../store/toastStore';

type PasswordField = 'current' | 'next' | 'confirm';
type PasswordErrors = Partial<Record<PasswordField, string>>;

const NEW_PASSWORD_HINT = '8자 이상, 영문과 숫자를 섞어 주세요.';

const validate = (current: string, next: string, confirm: string): PasswordErrors => {
  const errors: PasswordErrors = {};

  if (!current) errors.current = '현재 비밀번호를 입력하세요.';

  if (!next) errors.next = '새 비밀번호를 입력하세요.';
  else if (next.length < 8 || !/[a-zA-Z]/.test(next) || !/\d/.test(next)) errors.next = NEW_PASSWORD_HINT;
  else if (next === current) errors.next = '현재 비밀번호와 다르게 정해 주세요.';

  if (!confirm) errors.confirm = '새 비밀번호를 한 번 더 입력하세요.';
  else if (confirm !== next) errors.confirm = '새 비밀번호가 서로 달라요.';

  return errors;
};

type PasswordInputProps = {
  label: string;
  value: string;
  placeholder: string;
  autoComplete: string;
  error?: string;
  hint?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
};

function PasswordInput({ label, value, placeholder, autoComplete, error, hint, inputRef, onChange }: PasswordInputProps) {
  const messageId = useId();
  const message = error ?? hint;

  return (
    <label className="flex flex-col gap-1.5 text-[13px] text-(--ink-2)">
      {label}
      <input
        ref={inputRef}
        type="password"
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={message ? messageId : undefined}
        onChange={event => onChange(event.target.value)}
        className={`h-11 w-full rounded-lg border bg-(--surface) px-3 text-[15px] text-(--ink) ${
          error ? 'border-(--err)' : 'border-(--muted)'
        }`}
      />
      {message && (
        <span id={messageId} className={`text-xs ${error ? 'text-(--err)' : 'text-(--muted)'}`}>
          {message}
        </span>
      )}
    </label>
  );
}

// 마이페이지 '비밀번호 변경' 칸. 바꾸면 로그아웃하고 로그인 화면으로 보내요.
export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const email = useAuthStore(state => state.user?.email);
  const clearUser = useAuthStore(state => state.clearUser);

  const [values, setValues] = useState<Record<PasswordField, string>>({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [isPending, setIsPending] = useState(false);

  const currentInputRef = useRef<HTMLInputElement>(null);
  const nextInputRef = useRef<HTMLInputElement>(null);
  const confirmInputRef = useRef<HTMLInputElement>(null);

  const focusField = (field: PasswordField) => {
    const ref = { current: currentInputRef, next: nextInputRef, confirm: confirmInputRef }[field];
    ref.current?.focus();
  };

  const setValue = (field: PasswordField) => (value: string) => setValues(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values.current, values.next, values.confirm);
    setErrors(nextErrors);

    // 첫 번째로 틀린 칸으로 포커스를 옮겨요.
    const firstInvalid = (['current', 'next', 'confirm'] as const).find(field => nextErrors[field]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    if (!email) {
      showToast('계정 정보를 확인할 수 없어요. 다시 로그인해 주세요.');
      return;
    }

    try {
      setIsPending(true);
      await reauthenticateApi(email, values.current);
    } catch {
      setIsPending(false);
      setErrors({ current: '현재 비밀번호가 맞지 않아요.' });
      focusField('current');
      return;
    }

    try {
      await resetPasswordApi(values.next);
      await logoutApi();
      clearUser();
      showToast('비밀번호를 바꿨어요. 새 비밀번호로 다시 로그인해 주세요.');
      navigate('/login', { replace: true });
    } catch {
      setIsPending(false);
      showToast('비밀번호를 바꾸지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex max-w-100 flex-col gap-3.5">
      <PasswordInput
        label="현재 비밀번호"
        value={values.current}
        placeholder="현재 비밀번호를 입력하세요."
        autoComplete="current-password"
        error={errors.current}
        inputRef={currentInputRef}
        onChange={setValue('current')}
      />
      <PasswordInput
        label="새 비밀번호"
        value={values.next}
        placeholder="새 비밀번호를 입력하세요."
        autoComplete="new-password"
        error={errors.next}
        hint={NEW_PASSWORD_HINT}
        inputRef={nextInputRef}
        onChange={setValue('next')}
      />
      <PasswordInput
        label="새 비밀번호 확인"
        value={values.confirm}
        placeholder="새 비밀번호를 한 번 더 입력하세요."
        autoComplete="new-password"
        error={errors.confirm}
        inputRef={confirmInputRef}
        onChange={setValue('confirm')}
      />
      <Button type="submit" disabled={isPending} className="w-max">
        {isPending ? '바꾸는 중' : '비밀번호 변경'}
      </Button>
    </form>
  );
}
