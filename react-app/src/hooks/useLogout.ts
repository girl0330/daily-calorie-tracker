import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logoutApi } from '../service/UserService';
import { useAuthStore } from '../store/authStore';
import { showToast } from '../store/toastStore';

/**
 * 로그아웃하고 로그인 화면으로 보내요. (마이페이지 로그아웃, 비밀번호 변경·재설정 뒤, 회원 탈퇴 뒤)
 * - Supabase 로그인을 끊고, 화면이 기억하던 사용자 정보를 지워요.
 * - React Query가 들고 있던 데이터(음식 기록·목표·리포트)도 모두 지워요.
 *   공용 컴퓨터에서 다음 사람이 이전 사람의 기록을 메모리에서 볼 수 없게 하려는 거예요.
 * - message를 주면 로그인 화면에서 토스트로 보여 줘요.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore(state => state.clearUser);
  const navigate = useNavigate();

  return async (message?: string) => {
    await logoutApi();
    clearUser();
    queryClient.clear();
    if (message) showToast(message);
    navigate('/login', { replace: true });
  };
};
