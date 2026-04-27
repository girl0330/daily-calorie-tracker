import { supabase } from '../lib/supabase';
import type { CreateFoodRequest, FoodItem, MealType, UpdateFoodRequest, UserId } from '../types/types';

const STORAGE_KEY = 'foods';

// DB → 프론트로 받은 원본 데이터
type FoodRow = {
  id: number;
  user_id: UserId;
  meal_type: MealType;
  food_name: string;
  carbs: number;
  protein: number;
  fat: number;
  record_date: string;
  created_at: string;
};

// 데이터 mapping 함수수
const toFoodItem = (row: FoodRow): FoodItem => {
  return {
    id: row.id,
    userId: row.user_id,
    mealType: row.meal_type,
    foodName: row.food_name,
    carbs: row.carbs,
    protein: row.protein,
    fat: row.fat,
    recordDate: row.record_date,
    createdAt: row.created_at,
  };
};

// Type FoodItem - React 화면에서 사용할 데이터
export const getFoods = async (userId: UserId): Promise<FoodItem[]> => {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false }); //오래된 순

  if (error) throw error;

  if (!data) {
    return [];
  }

  return (data as FoodRow[]).map(toFoodItem);
};

// 프론트 → DB로 보낼 데이터
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

  if (!data) {
    throw new Error('음식 등록 후 데이터를 가져오지 못했습니다.');
  }
  return toFoodItem(data as FoodRow);
};

export const updateFood = async (editFood: UpdateFoodRequest): Promise<FoodItem> => {
  const { data, error } = await supabase
    .from('foods')
    .update({
      meal_type: editFood.mealType,
      food_name: editFood.foodName,
      carbs: editFood.carbs,
      protein: editFood.protein,
      fat: editFood.fat,
    })
    .eq('id', editFood.id)
    .eq('user_id', editFood.userId)
    .select()
    .single();

  if (error) throw error;

  if (!data) {
    throw new Error('음식 수정 후 데이터를 가져오지 못했습니다.');
  }
  return toFoodItem(data as FoodRow);
};
// const updatedFoodsToStore = foods.map(food => {
//   return food.id === editFoodItem.id ? editFoodItem : food;
// });

// localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFoodsToStore));

export const removeFood = (foodId: number) => {
  console.log('삭제 클릭');
  const storedFoods = localStorage.getItem(STORAGE_KEY);
  const foods: FoodItem[] = storedFoods ? JSON.parse(storedFoods) : [];

  const removedFoods = foods.filter(food => food.id !== foodId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(removedFoods));
};
