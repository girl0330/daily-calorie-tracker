import { useId, type ComponentProps, type ReactNode } from 'react';

type TextFieldProps = ComponentProps<'input'> & {
  label: ReactNode;
  /** 있으면 칸 테두리가 빨개지고, 칸 아래에 빨간 글자로 보여요. */
  error?: string;
  /** 오류가 없을 때 칸 아래에 흐린 글자로 보여요. */
  hint?: string;
  /** 숫자 칸은 오른쪽 정렬해요. */
  align?: 'left' | 'right';
};

/**
 * 시안의 .fld: 위에 라벨, 44px 입력칸, 아래 안내·오류 문구.
 * value, onChange, inputMode, autoFocus, ref 같은 input 속성은 그대로 넘어가요.
 * className은 바깥 묶음(라벨·칸·문구를 감싸는 div)에 붙어서 폭이나 flex 크기를 정할 때 써요.
 */
export default function TextField({ id, label, error, hint, align = 'left', className = '', ...inputProps }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  // 문구를 라벨 밖에 둬요. 라벨 안에 있으면 칸 이름에 오류 문구까지 섞여서 화면 읽기 프로그램이 두 번 읽어요.
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-[13px] text-(--ink-2)">
        {label}
      </label>
      <input
        type="text"
        {...inputProps}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={message ? messageId : undefined}
        className={`h-11 w-full rounded-lg border bg-(--surface) px-3 text-[15px] text-(--ink) placeholder:text-(--muted) ${
          align === 'right' ? 'text-right tabular-nums' : ''
        } ${error ? 'border-(--err)' : 'border-(--muted)'}`}
      />
      {message && (
        // break-keep: 좁은 칸에서도 '주세 / 요.'처럼 낱말 중간에서 줄이 바뀌지 않게 해요.
        <span id={messageId} className={`text-xs break-keep ${error ? 'text-(--err)' : 'text-(--muted)'}`}>
          {message}
        </span>
      )}
    </div>
  );
}
