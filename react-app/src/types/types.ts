// TODO: 이후 Food 입력/렌더링에서 사용할 도메인 타입
export type MealType = 'breakfast' | 'lunch' | 'dinner';

// 내부에서 사용할 음식 데이터
export type FoodItem = {
  id: number;
  userId: UserId;
  mealType: MealType;
  foodName: string;
  carbs: number;
  protein: number;
  fat: number;
  createdAt: string;
};

// 서버에 전송할 음식 데이터 타입
export type CreateFoodRequest = {
  userId: UserId;
  mealType: MealType;
  foodName: string;
  carbs: number;
  protein: number;
  fat: number;
};

// 사용자 ID
export type UserId = string;
