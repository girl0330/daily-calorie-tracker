import type { ComponentProps } from 'react';

type ButtonVariant = 'outline' | 'ok' | 'danger' | 'brand' | 'go';
type ButtonSize = 'sm' | 'lg' | 'custom';

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

// outline: 테두리 버튼 / ok: 저장(초록) / danger: 삭제 확정 / brand: 추가 같은 주 버튼(브랜드 색)
// go: 시안의 .go·.ai-go 갈색 버튼(AI 검색, 리포트 만들기, 일일 기록으로 가기). 라이트·다크 모두 같은 고정 색이에요.
const variantClassName: Record<ButtonVariant, string> = {
  outline: 'border-(--muted) bg-transparent font-medium text-(--ink) hover:border-(--ink-2) disabled:hover:border-(--muted)',
  ok: 'border-(--ok) bg-(--ok) font-bold text-(--bg) hover:bg-[color-mix(in_srgb,var(--ok)_85%,var(--ink))] disabled:hover:bg-(--ok)',
  danger:
    'border-(--err) bg-(--err) font-bold text-(--bg) hover:bg-[color-mix(in_srgb,var(--err)_85%,var(--ink))] disabled:hover:bg-(--err)',
  brand: 'border-(--brand) bg-(--brand) font-bold text-(--bg) hover:bg-(--brand-hover) disabled:hover:bg-(--brand)',
  go: 'border-[#dbc0a7] bg-[#dbc0a7] font-bold text-[#2b2623] hover:border-[#cfae90] hover:bg-[#cfae90] disabled:hover:bg-[#dbc0a7]',
};

// sm: 확인 창·마이페이지의 작은 버튼(36px) / lg: 칸 옆에 서는 버튼(44px, 칸과 높이가 같아요)
// custom: 높이·둥글기·글자 크기를 className으로 직접 정해요. go 버튼처럼 자리마다 크기가 다를 때 써요.
const sizeClassName: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-lg px-3.5 text-[13px]',
  lg: 'h-11 rounded-[10px] px-4 text-sm',
  custom: '',
};

/**
 * 시안의 버튼. 폭 같은 자리 잡기는 className으로 덧붙여요.
 * type 기본값이 'button'이라 폼 안에서 실수로 제출되지 않아요. 제출 버튼만 type="submit"을 줘요.
 * onClick, disabled, autoFocus, ref 같은 버튼 속성은 그대로 넘어가요.
 */
export default function Button({
  variant = 'outline',
  size = 'sm',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`cursor-pointer border transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClassName[size]} ${variantClassName[variant]} ${className}`}
      {...props}
    />
  );
}
