import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <>
      <aside className="w-56 shrink-0 bg-(--bg-section) p-5">
        <div className="flex h-20 items-center justify-center text-3xl font-bold text-(--primary-3)">
          Daily Tracker
        </div>

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

          {/*<NavLink*/}
          {/*    to="/monthly"*/}
          {/*    className="rounded-md px-4 py-3 text-xl font-medium text-(--text-primary) hover:bg-(--primary-5) transition-colors"*/}
          {/*>*/}
          {/*    Monthly Tracker*/}
          {/*</NavLink>*/}
        </nav>
      </aside>
    </>
  );
}
