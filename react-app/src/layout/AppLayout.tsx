import { Outlet } from 'react-router-dom';
import Nav from '../components/common/Nav';

export default function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <Nav />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
