import type { CreateFoodRequest, FoodItem } from '../types/types';

const STORAGE_KEY = 'foods';

export const getFoods = (): FoodItem[] => {
  const storedFoods = localStorage.getItem(STORAGE_KEY);
  return storedFoods ? (JSON.parse(storedFoods) as FoodItem[]) : [];
};

export const addFood = (newFood: CreateFoodRequest) => {
  const storedFoods = localStorage.getItem(STORAGE_KEY);
  const foods: CreateFoodRequest[] = storedFoods ? JSON.parse(storedFoods) : [];
  const foodsToStore = [...foods, newFood];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(foodsToStore));
};

export const removeFood = (foodId: number) => {
  console.log('삭제 클릭');
  const storedFoods = localStorage.getItem(STORAGE_KEY);
  const foods: FoodItem[] = storedFoods ? JSON.parse(storedFoods) : [];

  const removedFoods = foods.filter(food => food.id !== foodId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(removedFoods));
};
