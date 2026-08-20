import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logoutApi } from '../../service/UserService';

export default function Nav() {
  const navigate = useNavigate();

  const clearUser = useAuthStore(state => state.clearUser);
  const userFromStore = useAuthStore(state => state.user);

  const handleLogout = async () => {
    await logoutApi();

    clearUser();
    navigate('/login', { replace: true });
  };
  return (
    <>
      // Mobile
      <header className="flex h-16 w-full items-center justify-between bg-(--bg-section) px-5 lg:hidden">
        <img src="/logo.svg" alt="Daily Tracker" className="h-10" />

        <button type="button" className="cursor-pointer">
          메뉴
        </button>
      </header>
      // Desktop
      <div className="hidden w-70 shrink-0 flex-col bg-(--bg-section) p-5 lg:flex">
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
