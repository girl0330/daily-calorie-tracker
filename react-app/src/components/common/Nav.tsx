import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

type MenuItem = {
  to: string;
  label: string;
  icon: ReactNode;
};

// 아이콘은 currentColor를 쓰는 인라인 SVG라서 글자색과 테마를 그대로 따라가요.
const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const MENU_ITEMS: MenuItem[] = [
  {
    to: '/',
    label: '일일 기록',
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 10h16M9 3v4M15 3v4M12 14v3" />
      </svg>
    ),
  },
  {
    to: '/monthly',
    label: '월간 기록',
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 10h16M9 3v4M15 3v4M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
      </svg>
    ),
  },
  {
    to: '/weekly-report',
    label: '주간 리포트',
    icon: (
      <svg {...iconProps}>
        <path d="M5 20V12M10 20V6M15 20v-9M20 20V9" />
      </svg>
    ),
  },
  {
    to: '/mypage',
    label: '마이페이지',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
      </svg>
    ),
  },
];

const menuLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `group flex h-12 items-center gap-3 rounded-[10px] px-3 text-[15px] transition-colors duration-150 ${
    isActive
      ? 'bg-(--brand-soft) font-bold text-(--brand)'
      : 'font-medium text-(--ink-2) hover:bg-(--skel) hover:text-(--ink)'
  }`;

export default function Nav() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // 다른 페이지로 이동하면 모바일 메뉴를 닫아요 (렌더 중에 이전 경로와 비교).
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  // 모바일 메뉴가 열려 있을 때 Esc로 닫아요.
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      {/* 1024px 미만: 상단 바 */}
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-(--line) bg-(--side) pr-2 pl-4 lg:hidden">
        <b className="text-lg font-bold tracking-[-0.03em] text-(--ink)">Daily Tracker</b>

        <button
          type="button"
          onClick={() => setIsMenuOpen(prev => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="app-menu"
          aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-[10px] text-(--ink) hover:bg-(--skel)"
        >
          <svg {...iconProps} width={22} height={22}>
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      {isMenuOpen && (
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-x-0 top-14 bottom-0 z-20 cursor-default bg-(--scrim) lg:hidden"
        />
      )}

      {/* 1024px 이상: 왼쪽 고정 사이드바 / 미만: 상단 바 아래로 펼쳐지는 메뉴 */}
      <aside
        id="app-menu"
        className={`${isMenuOpen ? 'flex' : 'hidden'} fixed inset-x-0 top-14 z-20 max-h-[calc(100dvh-56px)] flex-col gap-3 overflow-y-auto border-b border-(--line) bg-(--side) px-4 pt-3 pb-4 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:max-h-none lg:w-62 lg:shrink-0 lg:gap-7 lg:border-r lg:border-b-0 lg:px-4 lg:pt-7 lg:pb-5`}
      >
        <div className="hidden flex-col gap-0.5 px-3 lg:flex">
          <b className="text-[22px] leading-[1.1] font-bold tracking-[-0.03em] text-(--ink)">Daily Tracker</b>
          <span className="text-xs text-(--muted)">하루 칼로리 기록</span>
        </div>

        <nav aria-label="페이지" className="flex flex-col gap-1">
          {MENU_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={menuLinkClassName}>
              {({ isActive }) => (
                <>
                  <span
                    className={`shrink-0 ${isActive ? 'text-(--brand)' : 'text-(--muted) group-hover:text-(--ink)'}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
