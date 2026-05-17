export type UserId = string;

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
  createdAt: string; // 데이터를 실제로 등록한 시간
  recordDate: string; // 사용자가 선택한 음식 기록 날짜
};

export type DayItem = {
  key: string;
  label: string;
  dayNumber: number;
  isToday: boolean;
  hasData: boolean;
};

// 서버에 전송할 음식 데이터 타입
export type CreateFoodRequest = {
  userId: UserId;
  mealType: MealType;
  foodName: string;
  carbs: number;
  protein: number;
  fat: number;
  recordDate: string; // 음식이 기록될 날짜
};

// 서버에 전송할 음식 데이터 타입
export type UpdateFoodRequest = {
  id: number;
  userId: UserId;
  mealType: MealType;
  foodName: string;
  carbs: number;
  protein: number;
  fat: number;
  recordDate: string; // 음식이 기록된 날짜
  createdAt: string; // 데이터를 실제로 등록한 시간
};
