import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateFoodRequest, FoodItem, UpdateFoodRequest, UserId } from '../../../types/types';
import { createFoodApi, removeFoodApi, updateFoodApi } from '../services/FoodService';
import { foodQueryKeys } from '../queryKeys';

export const useCreateFood = (userId: UserId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newFood: CreateFoodRequest) => createFoodApi(newFood),

    networkMode: 'always',
    retry: false,

    // 다시 불러오기가 끝난 뒤에 화면의 onSuccess가 불려요. 그래서 새 줄을 바로 찾을 수 있어요.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: foodQueryKeys.list(userId) }),
  });
};

export const useUpdateFood = (userId: UserId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (editFood: UpdateFoodRequest) => updateFoodApi(editFood),

    onSuccess: () => queryClient.invalidateQueries({ queryKey: foodQueryKeys.list(userId) }),
  });
};

export const useRemoveFood = (userId: UserId) => {
  const queryClient = useQueryClient();
  const listKey = foodQueryKeys.list(userId);

  return useMutation({
    // 삭제 API는 id와 userId를 함께 쓰지만, 화면에서는 food.id만 넘기면 돼요.
    mutationFn: (foodId: FoodItem['id']) => removeFoodApi({ id: foodId, userId }),

    // 서버 응답을 기다리지 않고 표에서 먼저 빼요. 그래야 삭제 뒤 포커스를 바로 옮길 수 있어요.
    onMutate: async foodId => {
      await queryClient.cancelQueries({ queryKey: listKey, exact: true });
      const previousFoods = queryClient.getQueryData<FoodItem[]>(listKey);
      queryClient.setQueryData<FoodItem[]>(listKey, foods => foods?.filter(food => food.id !== foodId));
      return { previousFoods };
    },

    // 실패하면 빼기 전 목록으로 되돌려요.
    onError: (_error, _foodId, context) => {
      if (context?.previousFoods) queryClient.setQueryData(listKey, context.previousFoods);
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: listKey }),
  });
};
