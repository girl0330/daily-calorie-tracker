import { useQuery } from '@tanstack/react-query';
import type { UserId } from '../../../types/types';
import { getWeekRange, parseRecordDate } from '../../../utils/date';
import { foodQueryKeys } from '../../foods/queryKeys';
import { getFoodsByPeriodApi } from '../../foods/services/FoodService';
import { getWeeklyReport } from '../utils/weeklyReport';

// 음식 원본은 기간별 쿼리에 보관하고, 화면에는 기존 함수의 집계 결과를 제공한다.
export const useWeeklyReport = (userId?: UserId, selectedDate: Date = new Date()) => {
  const { startDate, endDate } = getWeekRange(selectedDate);

  return useQuery({
    queryKey: userId ? foodQueryKeys.period(userId, startDate, endDate) : foodQueryKeys.all,
    queryFn: () => {
      if (!userId) throw new Error('사용자 ID가 없습니다.');
      return getFoodsByPeriodApi(userId, startDate, endDate);
    },
    enabled: !!userId,
    select: foods => getWeeklyReport(foods, parseRecordDate(startDate)),
  });
};
