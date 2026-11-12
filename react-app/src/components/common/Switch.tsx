type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
};

// 시안의 .sw: 켜고 끄는 스위치. 화면 낭독기는 "스위치, 켜짐/꺼짐"으로 읽어요.
export default function Switch({ checked, onChange, label, disabled = false }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-5.5 w-10 shrink-0 cursor-pointer rounded-full transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
        // 꺼짐도 배경과 3:1 이상 차이 나야 보여서 --line 대신 --muted를 써요.
        checked ? 'bg-(--brand)' : 'bg-(--muted)'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 left-0.5 size-4.5 rounded-full bg-(--surface) shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-150 ${
          checked ? 'translate-x-4.5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
