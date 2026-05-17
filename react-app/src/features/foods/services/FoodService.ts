import { supabase } from '../../../lib/supabase';
import type { CreateFoodRequest, FoodItem, MealType, UpdateFoodRequest, UserId } from '../../../types/types';
import { toRecordDate } from '../../../utils/date';

// DB → 프론트로 받은 원본 데이터
type FoodRow = {
  id: number;
  user_id: UserId;
  meal_type: MealType;
  food_name: string;
  carbs: number;
  protein: number;
  fat: number;
  record_date: string | null;
  created_at: string;
};

// DB의 snake_case 데이터를 화면에서 쓰는 camelCase 도메인 타입으로 변환한다.
const toFoodItem = (row: FoodRow): FoodItem => {
  return {
    id: row.id,
    userId: row.user_id,
    mealType: row.meal_type,
    foodName: row.food_name,
    carbs: row.carbs,
    protein: row.protein,
    fat: row.fat,
    // 기존 데이터에 record_date가 비어 있으면 등록 시간을 기준으로 한 번만 보정한다.
    recordDate: row.record_date ?? toRecordDate(new Date(row.created_at)),
    createdAt: row.created_at,
  };
};

// Type FoodItem - React 화면에서 사용할 데이터
export const getFoods = async (userId: UserId): Promise<FoodItem[]> => {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('user_id', userId)
    .order('record_date', { ascending: false })
    .order('created_at', { ascending: false }); // 같은 기록 날짜 안에서는 최신 등록순

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
      record_date: newFood.recordDate,
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
      record_date: editFood.recordDate,
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

export const removeFood = async (foodId: number): Promise<void> => {
  const { error } = await supabase.from('foods').delete().eq('id', foodId);

  if (error) {
    console.error('음식 삭제 실패:', error.message);
    throw error;
  }
};
