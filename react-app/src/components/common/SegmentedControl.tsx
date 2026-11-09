import { useRef, type KeyboardEvent } from 'react';

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: 'md' | 'sm';
  className?: string;
};

const sizeClassName = {
  md: { group: 'h-11 rounded-[10px]', button: 'px-[18px] text-sm' },
  sm: { group: 'h-[34px] rounded-lg', button: 'px-3 text-[13px]' },
};

// 시안의 .seg: 여러 개 중 하나를 고르는 버튼 묶음. 화살표 키로도 고를 수 있는 radiogroup이에요.
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'md',
  className = '',
}: SegmentedControlProps<T>) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;

    event.preventDefault();

    const currentIndex = options.findIndex(option => option.value === value);
    const nextIndex = (currentIndex + step + options.length) % options.length;

    onChange(options[nextIndex].value);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={`flex w-max max-w-full overflow-hidden border border-(--ink) ${sizeClassName[size].group} ${className}`}
    >
      {options.map((option, index) => {
        const isChecked = option.value === value;

        return (
          <button
            key={option.value}
            ref={element => {
              buttonRefs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={isChecked}
            // 선택된 버튼 하나만 Tab으로 들어오고, 나머지는 화살표 키로 이동해요.
            tabIndex={isChecked ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={`h-full cursor-pointer transition-colors duration-150 not-first:border-l not-first:border-(--ink) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--brand) ${
              sizeClassName[size].button
            } ${
              isChecked
                ? 'bg-(--brand-soft) font-bold text-(--brand)'
                : 'bg-(--surface) text-(--ink) hover:bg-(--skel)'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
