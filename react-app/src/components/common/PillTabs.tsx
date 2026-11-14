import { useRef, type KeyboardEvent } from 'react';

type PillTab<T extends string> = {
  value: T;
  label: string;
  /** 글자 앞 작은 색 점 (예: 영양소 색) */
  dotClassName?: string;
  disabled?: boolean;
};

type PillTabsProps<T extends string> = {
  tabs: PillTab<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
};

// 시안의 .pseg: 제목 줄 안의 작은 알약형 탭. 고른 탭만 흰 바탕으로 떠 보여요. 좌우 화살표 키로도 바꿔요.
export default function PillTabs<T extends string>({ tabs, value, onChange, ariaLabel }: PillTabsProps<T>) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;

    event.preventDefault();

    // 꺼진 탭은 건너뛰어요.
    let index = tabs.findIndex(tab => tab.value === value);
    for (let i = 0; i < tabs.length; i += 1) {
      index = (index + step + tabs.length) % tabs.length;
      if (!tabs[index].disabled) break;
    }

    onChange(tabs[index].value);
    tabRefs.current[index]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className="inline-flex shrink-0 gap-0.5 rounded-full bg-(--skel) p-[3px]"
    >
      {tabs.map((tab, index) => {
        const isSelected = tab.value === value;

        return (
          <button
            key={tab.value}
            ref={element => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            // 고른 탭 하나만 Tab으로 들어오고, 나머지는 화살표 키로 이동해요.
            tabIndex={isSelected ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => onChange(tab.value)}
            className={`inline-flex h-7 cursor-pointer items-center gap-[5px] rounded-full px-3 text-[12.5px] whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
              isSelected
                ? 'bg-(--surface) font-bold text-(--ink) shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                : 'bg-transparent text-(--ink-2) enabled:hover:text-(--ink)'
            }`}
          >
            {tab.dotClassName && <i aria-hidden="true" className={`inline-block size-1.5 rounded-full ${tab.dotClassName}`} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
