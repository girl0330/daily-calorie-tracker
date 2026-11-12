import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserId } from '../../../types/types';
import { getGoalSettingsApi, saveGoalSettingsApi } from '../services/GoalService';
import type { Goal } from '../types';

export const goalQueryKeys = {
  all: ['goal'] as const,
  detail: (userId: UserId) => [...goalQueryKeys.all, userId] as const,
};

/**
 * 로그인한 사용자의 목표 설정(켜짐 여부 + 직접 정한 목표).
 * 화면에서 쓸 목표는 getActiveGoal(data)로 구해요. 꺼져 있으면 null이에요(목표 기능 없음).
 * 일일·월간·주간 화면도 이 훅 하나로 같은 설정을 읽어요(React Query가 한 번만 요청).
 */
export const useGoalSettings = (userId?: UserId) => {
  return useQuery({
    queryKey: userId ? goalQueryKeys.detail(userId) : goalQueryKeys.all,
    queryFn: () => {
      if (!userId) throw new Error('사용자 ID가 없습니다.');
      return getGoalSettingsApi(userId);
    },
    enabled: !!userId,
  });
};

export const useSaveGoalSettings = (userId: UserId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: { isEnabled: boolean; goal: Goal }) => saveGoalSettingsApi(userId, settings),
    retry: false,

    // 서버가 돌려준 값으로 캐시를 바로 바꿔서, 다시 요청하지 않고 모든 화면에 반영해요.
    onSuccess: savedSettings => {
      queryClient.setQueryData(goalQueryKeys.detail(userId), savedSettings);
    },
  });
};
