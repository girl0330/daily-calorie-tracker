import { supabase } from '../../../lib/supabase';
import type {
  CreateFoodRequest,
  DeleteFoodRequest,
  FoodItem,
  MealType,
  UpdateFoodRequest,
  UserId,
} from '../../../types/types';
import { toRecordDate as formatRecordDate } from '../../../utils/date';

// 화면에서 실제로 사용하는 컬럼만 조회한다.
// DB 컬럼이 늘어나도 프론트 도메인 타입이 불필요하게 영향을 받지 않도록 한다.
const FOOD_SELECT_COLUMNS = 'id, user_id, meal_type, food_name, carbs, protein, fat, record_date, created_at';

// DB → 프론트로 받은 원본 데이터
// Supabase 테이블은 snake_case, React 화면은 camelCase를 사용한다.
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
    recordDate: row.record_date ?? formatRecordDate(new Date(row.created_at)),
    createdAt: row.created_at,
  };
};

const toCreateFoodRow = (newFood: CreateFoodRequest) => {
  return {
    user_id: newFood.userId,
    meal_type: newFood.mealType,
    food_name: newFood.foodName,
    carbs: newFood.carbs,
    protein: newFood.protein,
    fat: newFood.fat,
    record_date: newFood.recordDate,
  };
};

const toUpdateFoodRow = (editFood: UpdateFoodRequest) => {
  return {
    meal_type: editFood.mealType,
    food_name: editFood.foodName,
    carbs: editFood.carbs,
    protein: editFood.protein,
    fat: editFood.fat,
    record_date: editFood.recordDate,
  };
};

// 사용자별 음식 목록을 가져온다.
export const getFoodsApi = async (userId: UserId): Promise<FoodItem[]> => {
  const { data, error } = await supabase
    .from('foods')
    .select(FOOD_SELECT_COLUMNS)
    .eq('user_id', userId)
    .order('record_date', { ascending: false })
    .order('created_at', { ascending: false }); // 같은 기록 날짜 안에서는 최신 등록순

  if (error) throw error;

  if (!data) {
    return [];
  }

  return (data as FoodRow[]).map(toFoodItem);
};

// 음식을 등록하고, DB에서 생성된 id/created_at을 포함한 데이터를 다시 받는다.
export const createFoodApi = async (newFood: CreateFoodRequest): Promise<FoodItem> => {
  const { data, error } = await supabase
    .from('foods')
    .insert(toCreateFoodRow(newFood))
    .select(FOOD_SELECT_COLUMNS)
    .single();

  if (error) throw error;

  if (!data) {
    throw new Error('음식 등록 후 데이터를 가져오지 못했습니다.');
  }

  return toFoodItem(data as FoodRow);
};

// id와 user_id를 함께 조건으로 걸어 다른 사용자의 데이터 변경을 한 번 더 방어한다.
export const updateFoodApi = async (editFood: UpdateFoodRequest): Promise<FoodItem> => {
  const { data, error } = await supabase
    .from('foods')
    .update(toUpdateFoodRow(editFood))
    .eq('id', editFood.id)
    .eq('user_id', editFood.userId)
    .select(FOOD_SELECT_COLUMNS)
    .single();

  if (error) throw error;

  if (!data) {
    throw new Error('음식 수정 후 데이터를 가져오지 못했습니다.');
  }

  return toFoodItem(data as FoodRow);
};

// 삭제도 id만 보지 않고 user_id를 같이 확인한다.
export const removeFoodApi = async ({ id, userId }: DeleteFoodRequest): Promise<number> => {
  const { data, error } = await supabase
    .from('foods')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select('id')
    .single();

  if (error) throw error;

  if (!data) {
    throw new Error('삭제할 음식 데이터를 찾지 못했습니다.');
  }

  return data.id as number;
};
