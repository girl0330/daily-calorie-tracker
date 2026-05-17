import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateFoodRequest, FoodItem, UpdateFoodRequest, UserId } from '../../../types/types';
import {
  createFood as createFoodApi,
  removeFood as removeFoodApi,
  updateFood as updateFoodApi,
} from '../services/FoodService';
import { foodQueryKeys } from '../queryKeys';

const getFoodListQueryKey = (userId: UserId) => foodQueryKeys.list(userId);

export const useCreateFood = (userId: UserId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newFood: CreateFoodRequest) => createFoodApi(newFood),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getFoodListQueryKey(userId),
      });
    },
  });
};

export const useUpdateFood = (userId: UserId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (editFood: UpdateFoodRequest) => updateFoodApi(editFood),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getFoodListQueryKey(userId),
      });
    },
  });
};

export const useRemoveFood = (userId: UserId) => {
  const queryClient = useQueryClient();

  return useMutation({
    // 삭제 API는 id와 userId를 함께 사용하지만, 컴포넌트에서는 food.id만 넘기면 된다.
    mutationFn: (foodId: FoodItem['id']) => removeFoodApi({ id: foodId, userId }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getFoodListQueryKey(userId),
      });
    },
  });
};
