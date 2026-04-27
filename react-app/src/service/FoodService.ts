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

export const createFood = async (newFood: CreateFoodRequest): Promise<FoodItem> => {
  const { data, error } = await supabase
    .from('foods')
    .insert({
      user_id: newFood.userId,
      meal_type: newFood.mealType,
      food_name: newFood.foodName,
      carbs: newFood.carbs,
      protein: newFood.protein,
      fat: newFood.fat,
    })
    .select()
    .single();

  if (error) throw error;

  if (data ? data : []) {
    console.log('데이터 있음 insert 확인::: ', data);
  }
  return {
    id: data.id,
    userId: data.user_id,
    mealType: data.meal_type,
    foodName: data.food_name,
    carbs: data.carbs,
    protein: data.protein,
    fat: data.fat,
    recordDate: data.record_date,
    createdAt: data.created_at,
  };
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
