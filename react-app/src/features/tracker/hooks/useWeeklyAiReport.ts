import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Goal } from '../../goals/types';
import type { UserId } from '../../../types/types';
import { createWeeklyAiReportApi, getWeeklyAiReportApi } from '../services/WeeklyAiReportService';
import { getReportSignature, type WeeklyReport } from '../utils/weeklyReport';

export const weeklyAiReportQueryKeys = {
  all: ['weeklyAiReport'] as const,
  detail: (userId: UserId, startDate: string) => [...weeklyAiReportQueryKeys.all, userId, startDate] as const,
};

/** 이 주(월요일 startDate)에 만들어 둔 AI 리포트. 없으면 null이에요. */
export const useWeeklyAiReport = (userId: UserId, startDate: string) =>
  useQuery({
    queryKey: weeklyAiReportQueryKeys.detail(userId, startDate),
    queryFn: () => getWeeklyAiReportApi(userId, startDate),
    // 로그인 안 한 사람(userId가 빈 값)은 서버에 묻지 않아요.
    enabled: !!userId,
  });

/**
 * 리포트 만들기·다시 만들기. 성공하면 그 주의 캐시를 새 리포트로 바꿔요.
 * 서명값은 지금 화면의 기록·목표로 만들어 함께 저장해요. 나중에 '바뀜 안내'를 보여 줄 때 비교해요.
 */
export const useCreateWeeklyAiReport = (userId: UserId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ report, goal }: { report: WeeklyReport; goal: Goal | null }) =>
      createWeeklyAiReportApi(report.startDate, getReportSignature(report, goal)),
    retry: false,
    onSuccess: (created, { report }) => {
      queryClient.setQueryData(weeklyAiReportQueryKeys.detail(userId, report.startDate), created);
    },
  });
};
