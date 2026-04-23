import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../service/UserService';
import type { User } from '@supabase/supabase-js';

type NavProps = {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  user: User | null;
};

export default function Nav({ setUser, user }: NavProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login', { replace: true });
  };
  return (
    <>
      <aside className="flex w-70 shrink-0 flex-col bg-(--bg-section) p-5">
        <div className="flex h-20 items-center justify-center text-3xl font-bold text-(--primary-3)">Daily Tracker</div>

        <div className="my-4 border border-(--primary-1)" />

        <nav className="flex flex-col gap-2">
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
