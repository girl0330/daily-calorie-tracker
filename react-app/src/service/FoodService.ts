import { supabase } from '../lib/supabase';
import type { CreateFoodRequest, FoodItem } from '../types/types';

const STORAGE_KEY = 'foods';

export const getFoods = (): FoodItem[] => {
  const storedFoods = localStorage.getItem(STORAGE_KEY);
  return storedFoods ? (JSON.parse(storedFoods) as FoodItem[]) : [];
};

// export const addFood = (newFood: CreateFoodRequest) => {
//   const storedFoods = localStorage.getItem(STORAGE_KEY);
//   const foods: FoodItem[] = storedFoods ? JSON.parse(storedFoods) : [];
//   const foodsToStore = [...foods, newFood];

//   localStorage.setItem(STORAGE_KEY, JSON.stringify(foodsToStore));
// };

// export const getFoods = async () => {
//   const { data } = await supabase.from('foods').select('*');
//   return data ? data : [];
// };

export const addFood = async (newFood: CreateFoodRequest) => {
  const { data, error } = await supabase.from('foods').insert([newFood]).select();
  if (error) throw error;

  if (data ? data : []) {
    console.log('데이터 있음');
  }
  return data;
};

export const updateFood = (editFoodItem: FoodItem) => {
  const storedFoods = localStorage.getItem(STORAGE_KEY);
  const foods: FoodItem[] = storedFoods ? JSON.parse(storedFoods) : [];

  const updatedFoodsToStore = foods.map(food => {
    return food.id === editFoodItem.id ? editFoodItem : food;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFoodsToStore));
};

export const removeFood = (foodId: number) => {
  console.log('삭제 클릭');
  const storedFoods = localStorage.getItem(STORAGE_KEY);
  const foods: FoodItem[] = storedFoods ? JSON.parse(storedFoods) : [];

  const removedFoods = foods.filter(food => food.id !== foodId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(removedFoods));
};
