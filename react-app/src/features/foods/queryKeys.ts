import type { UserId } from '../../types/types';

export const foodQueryKeys = {
  all: ['foods'] as const,

  // 사용자별 음식 목록 캐시 키를 한곳에서 관리한다.
  list: (userId: UserId) => [...foodQueryKeys.all, userId] as const,
};
