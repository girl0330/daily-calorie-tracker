import { Outlet } from 'react-router-dom';
import Nav from '../pages/Nav';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Nav />

      <main className="min-w-0 flex-1 p-5">
        <Outlet />
      </main>
    </div>
  );
}
