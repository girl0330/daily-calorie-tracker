import { create } from 'zustand';
import type { FoodItem } from '../types/types';

type FoodState = {
  foods: FoodItem[];
  isFoodLoading: boolean;

  setFoodLoading: (isLoading: boolean) => void;
  setFoods: (foods: FoodItem[]) => void;
  addFood: (food: FoodItem) => void;
  updateFood: (food: FoodItem) => void;
  removeFood: (foodId: number) => void;
};

export const useFoodItemStore = create<FoodState>()(set => ({
  foods: [],
  isFoodLoading: true,

  setFoodLoading: (isFoodLoading: boolean) => set({ isFoodLoading: isFoodLoading }),
  setFoods: (foods: FoodItem[]) => set({ foods }),
  addFood: (food: FoodItem) =>
    set(state => ({
      foods: [...state.foods, food],
    })),
  updateFood: updatedFood =>
    set(state => ({
      foods: state.foods.map(food => (food.id === updatedFood.id ? updatedFood : food)),
    })),
  removeFood: foodId =>
    set(state => ({
      foods: state.foods.filter(food => food.id !== foodId),
    })),
}));
