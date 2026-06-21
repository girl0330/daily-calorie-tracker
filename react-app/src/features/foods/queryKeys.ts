import type { UserId } from '../../types/types';

export const foodQueryKeys = {
  all: ['foods'] as const,

  list: (userId: UserId) => [...foodQueryKeys.all, userId] as const,
};
