import type { CreateFoodRequest } from '../types/types';

const STORAGE_KEY = 'foods';

export const addFood = (newFood: CreateFoodRequest) => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  const foods = storedData ? JSON.parse(storedData) : [];
  const updatedFoods = [...foods, newFood];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFoods));
};
