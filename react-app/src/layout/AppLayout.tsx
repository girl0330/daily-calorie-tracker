import { Outlet } from 'react-router-dom';
import Nav from '../components/common/Nav';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Nav />

      <main className="min-w-0 flex-1 p-5">
        <Outlet />
      </main>
    </div>
  );
}
