import { useQuery } from '@tanstack/react-query';
import { getFoods } from '../services/FoodService';
import type { UserId } from '../../../types/types';
import { foodQueryKeys } from '../queryKeys';

export const useFoods = (userId?: UserId) => {
  return useQuery({
    queryKey: userId ? foodQueryKeys.list(userId) : foodQueryKeys.all,

    queryFn: () => {
      if (!userId) {
        throw new Error('사용자 ID가 없습니다.');
      }

      return getFoods(userId);
    },

    // 로그인 사용자가 준비되기 전에는 요청을 보내지 않는다.
    enabled: !!userId,
  });
};
