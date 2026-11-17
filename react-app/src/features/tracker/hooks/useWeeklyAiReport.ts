import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Goal } from '../../goals/types';
import type { UserId } from '../../../types/types';
import { createWeeklyAiReportApi, getWeeklyAiReportApi } from '../services/WeeklyAiReportService';
import type { WeeklyReport } from '../utils/weeklyReport';

export const weeklyAiReportQueryKeys = {
  all: ['weeklyAiReport'] as const,
  detail: (userId: UserId, startDate: string) => [...weeklyAiReportQueryKeys.all, userId, startDate] as const,
};

/** 이 주(월요일 startDate)에 만들어 둔 AI 리포트. 없으면 null이에요. */
export const useWeeklyAiReport = (userId: UserId, startDate: string) =>
  useQuery({
    queryKey: weeklyAiReportQueryKeys.detail(userId, startDate),
    queryFn: () => getWeeklyAiReportApi(userId, startDate),
  });

/** 리포트 만들기·다시 만들기. 성공하면 그 주의 캐시를 새 리포트로 바꿔요. */
export const useCreateWeeklyAiReport = (userId: UserId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ report, goal, today }: { report: WeeklyReport; goal: Goal | null; today: Date }) =>
      createWeeklyAiReportApi(userId, report, goal, today),
    retry: false,
    onSuccess: (created, { report }) => {
      queryClient.setQueryData(weeklyAiReportQueryKeys.detail(userId, report.startDate), created);
    },
  });
};
