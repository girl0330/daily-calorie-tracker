import type { UserId } from '../../types/types';

export const foodQueryKeys = {
  all: ['foods'] as const,

  list: (userId: UserId) => [...foodQueryKeys.all, userId] as const,

  // 기존 list(userId) 무효화로 해당 사용자의 기간 조회도 함께 갱신된다.
  period: (userId: UserId, startDate: string, endDate: string) =>
    [...foodQueryKeys.list(userId), 'period', startDate, endDate] as const,

  // list(userId) 아래에 두어서 음식을 추가·삭제하면 기록한 날 수도 다시 센다.
  recordedDays: (userId: UserId) => [...foodQueryKeys.list(userId), 'recorded-days'] as const,
};
