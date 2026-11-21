import { Outlet } from 'react-router-dom';
import LoginPromptDialog from '../components/common/LoginPromptDialog';
import Nav from '../components/common/Nav';

export default function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <Nav />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Outlet />
      </main>

      {/* 로그인 안 한 사람이 기능을 누르면 뜨는 안내창(한 개를 같이 써요) */}
      <LoginPromptDialog />
    </div>
  );
}
