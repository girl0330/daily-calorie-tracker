import type { ComponentProps } from 'react';

type ButtonVariant = 'outline' | 'ok' | 'danger' | 'brand';

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
};

// outline: 테두리 버튼 / ok: 저장(초록) / danger: 삭제 확정 / brand: 추가 같은 주 버튼(브랜드 색)
const variantClassName: Record<ButtonVariant, string> = {
  outline: 'border-(--muted) bg-transparent font-medium text-(--ink) hover:border-(--ink-2) disabled:hover:border-(--muted)',
  ok: 'border-(--ok) bg-(--ok) font-bold text-(--bg) hover:bg-[color-mix(in_srgb,var(--ok)_85%,var(--ink))] disabled:hover:bg-(--ok)',
  danger:
    'border-(--err) bg-(--err) font-bold text-(--bg) hover:bg-[color-mix(in_srgb,var(--err)_85%,var(--ink))] disabled:hover:bg-(--err)',
  brand: 'border-(--brand) bg-(--brand) font-bold text-(--bg) hover:bg-(--brand-hover) disabled:hover:bg-(--brand)',
};

/**
 * 시안의 작은 버튼(높이 36px). 폭 같은 자리 잡기는 className으로 덧붙여요.
 * type 기본값이 'button'이라 폼 안에서 실수로 제출되지 않아요. 제출 버튼만 type="submit"을 줘요.
 * onClick, disabled, autoFocus, ref 같은 버튼 속성은 그대로 넘어가요.
 */
export default function Button({ variant = 'outline', type = 'button', className = '', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`h-9 cursor-pointer rounded-lg border px-3.5 text-[13px] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variantClassName[variant]} ${className}`}
      {...props}
    />
  );
}
