import { useLocation, useNavigate } from 'react-router-dom';
import { useLoginPromptStore } from '../../store/loginPromptStore';
import ConfirmDialog from './ConfirmDialog';

/**
 * 로그인하지 않은 사람이 기능(음식 검색·추가, 리포트 만들기, 목표 설정)을 누르면 뜨는 안내창.
 * '로그인'을 누르면 로그인 화면으로 가고, 로그인이 끝나면 보던 화면으로 돌아와요.
 */
export default function LoginPromptDialog() {
  const isOpen = useLoginPromptStore(state => state.isOpen);
  const close = useLoginPromptStore(state => state.close);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ConfirmDialog
      open={isOpen}
      title="로그인이 필요해요"
      description="기록을 저장하고 AI 기능을 쓰려면 로그인해 주세요."
      confirmLabel="로그인"
      cancelLabel="닫기"
      tone="brand"
      onCancel={close}
      onConfirm={() => {
        close();
        // 로그인 화면이 끝나고 돌아올 주소(?date= 같은 뒷부분까지)를 함께 넘겨요.
        navigate('/login', { state: { from: location.pathname + location.search } });
      }}
    />
  );
}
