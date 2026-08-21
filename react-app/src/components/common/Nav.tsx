import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logoutApi } from '../../service/UserService';
import { useState } from 'react';

export default function Nav() {
  const navigate = useNavigate();

  const clearUser = useAuthStore(state => state.clearUser);
  const userFromStore = useAuthStore(state => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutApi();

    clearUser();
    navigate('/login', { replace: true });
  };
  return (
    <>
      <div className="relative w-full lg:hidden">
        {/* Mobile */}
        <header className="relative z-20 flex h-16 w-full items-center bg-(--bg-section) px-5">
          <img src="/logo.svg" alt="Daily Tracker" className="absolute left-1/2 h-10 -translate-x-1/2" />

          <button
            type="button"
            className="ml-auto cursor-pointer"
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-expanded={isMenuOpen}
            aria-label="메뉴 열기"
          >
            <img src="/menu.svg" alt="" className="h-6 w-6" />
          </button>
        </header>

        {isMenuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-10 bg-black/20 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-label="메뉴 닫기"
            />

            <div className="absolute top-full left-0 z-20 w-full bg-(--bg-section) px-5 pb-5">
              <nav className="flex flex-col gap-2">
                <NavLink
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-md px-4 py-3 font-medium ${
                      isActive
                        ? 'bg-(--paintedpony-normal-active) text-(--text-primary)'
                        : 'text-(--text-primary) hover:bg-(--paintedpony-normal-hover)'
                    }`
                  }
                >
                  Daily Tracker
                </NavLink>

                <NavLink
                  to="/monthly"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-md px-4 py-3 font-medium ${
                      isActive
                        ? 'bg-(--paintedpony-light-active) text-(--text-primary)'
                        : 'text-(--text-primary) hover:bg-(--paintedpony-light-hover)'
                    }`
                  }
                >
                  Monthly Tracker
                </NavLink>
              </nav>

              <div className="mt-4 flex flex-col gap-2 border-t border-(--primary-4) pt-4">
                <div className="px-4 text-sm text-(--text-primary) opacity-80">{userFromStore?.email}</div>

                <NavLink
                  to="/reset-password"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-md px-4 py-2 text-(--text-primary)"
                >
                  비밀번호 재설정
                </NavLink>

                <button
                  type="button"
                  className="cursor-pointer px-4 py-2 text-left text-sm text-red-500"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Desktop */}
      <div className="hidden w-70 shrink-0 flex-col border-r border-(--neutral-4) bg-(--bg-section) p-5 lg:flex">
        <img src="/logo.svg" alt="Daily Tracker" className="h-10 lg:h-20" />

        <nav className="mt-8 flex flex-1 flex-col gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-md px-4 py-3 text-xl font-medium transition-colors ${
                isActive
                  ? 'bg-(--paintedpony-normal-active) text-(--text-primary)'
                  : 'text-(--text-primary) hover:bg-(--paintedpony-normal-hover)'
              }`
            }
          >
            Daily Tracker
          </NavLink>

          <NavLink
            to="/monthly"
            className={({ isActive }) =>
              `rounded-md px-4 py-3 text-xl font-medium transition-colors ${
                isActive
                  ? 'bg-(--paintedpony-light-active) text-(--text-primary)'
                  : 'text-(--text-primary) hover:bg-(--paintedpony-light-hover)'
              }`
            }
          >
            Monthly Tracker
          </NavLink>
        </nav>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <div className="px-4 text-sm text-(--text-primary) opacity-80">{userFromStore?.email}</div>

          <NavLink
            to="/reset-password"
            className={({ isActive }) =>
              `rounded-md px-4 py-2 text-base font-medium transition-colors ${
                isActive
                  ? 'bg-(--paintedpony-light-active) text-(--text-primary)'
                  : 'text-(--text-primary) hover:bg-(--paintedpony-light-hover)'
              }`
            }
          >
            비밀번호 재설정
          </NavLink>

          <button
            className="cursor-pointer px-4 py-2 text-left text-sm text-red-500 hover:underline"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
}
