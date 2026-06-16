import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { logoutApi } from '../service/UserService';

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
      <aside className="flex w-70 shrink-0 flex-col bg-(--bg-section) p-5">
        <div className="flex h-20 items-center justify-center text-3xl font-bold text-(--primary-3)">Daily Tracker</div>

        <div className="my-4 border border-(--primary-1)" />

        <nav className="flex flex-col gap-2">
          <div>로그인한 유저: {userFromStore?.email}</div>
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
        <button className="mt-auto cursor-pointer" onClick={handleLogout}>
          로그아웃
        </button>
      </aside>
    </>
  );
}
