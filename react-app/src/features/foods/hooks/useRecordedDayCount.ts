import { useQuery } from '@tanstack/react-query';
import type { UserId } from '../../../types/types';
import { foodQueryKeys } from '../queryKeys';
import { getRecordedDayCountApi } from '../services/FoodService';

// 마이페이지 계정 정보의 '기록한 날'
export const useRecordedDayCount = (userId?: UserId) => {
  return useQuery({
    queryKey: userId ? foodQueryKeys.recordedDays(userId) : foodQueryKeys.all,
    queryFn: () => {
      if (!userId) throw new Error('사용자 ID가 없습니다.');
      return getRecordedDayCountApi(userId);
    },
    enabled: !!userId,
  });
};
