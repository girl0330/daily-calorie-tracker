import { useQuery } from '@tanstack/react-query';
import { getFoods } from '../services/FoodService';
import type { UserId } from '../../../types/types';

export const useFoods = (userId?: UserId) => {
  return useQuery({
    queryKey: ['foods', userId],

    queryFn: () => {
      if (!userId) {
        throw new Error('사용자 ID가 없습니다.');
      }

      return getFoods(userId);
    },

    enabled: !!userId,
  });
};
