import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateFoodRequest, FoodItem, UpdateFoodRequest, UserId } from '../../../types/types';
import {
  createFood as createFoodApi,
  removeFood as removeFoodApi,
  updateFood as updateFoodApi,
} from '../services/FoodService';

export const useCreateFood = (userId: UserId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newFood: CreateFoodRequest) => createFoodApi(newFood),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['foods', userId],
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
        queryKey: ['foods', userId],
      });
    },
  });
};

export const useRemoveFood = (userId: UserId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (foodId: FoodItem['id']) => removeFoodApi(foodId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['foods', userId],
      });
    },
  });
};
