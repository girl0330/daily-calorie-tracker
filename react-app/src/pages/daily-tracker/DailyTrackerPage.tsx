import type { FoodItem, UserId } from '../../types/types';
import WeeklyDayBar from './components/WeeklyDayBar';
import FoodInputForm from './components/FoodInputForm';
import { useEffect, useState } from 'react';
import { getFoods } from '../../service/FoodService';
import { CardBoard } from '../../components/meal-board/CardBoard';
import { NutritionChart } from '../../components/charts/NutritionChart';
import { useAuthStore } from '../../store/authStore';
import { useFoodItemStore } from '../../store/foodStore';

export default function DailyTrackerPage() {
  const user = useAuthStore(state => state.user);
  const setFoods = useFoodItemStore(state => state.setFoods);
  const foods = useFoodItemStore(state => state.foods);

  useEffect(() => {
    if (!user) return;

    const fetchFoods = async () => {
      try {
        const foodList = await getFoods(user.id);

        console.log('페이지 렌더링되기전 가져온 값 확인 :::', foodList);
        setFoods(foodList);
      } catch (error) {
        console.error('음식 목록 조회 중 에러 발생: ', error);
      }
    };

    fetchFoods();
  }, [user]);

  //user.id를 안전하게 사용하기 위한 방어 코드
  if (!user) {
    return null;
  }

  const userId = user.id as UserId;

  return (
    <>
      <section className="flex flex-col gap-4">
        {/* 상단 주간 바 */}
        <WeeklyDayBar />

        <section className="grid grid-cols-2 gap-4">
          {/* 입력 + 영양 상태 */}
          <FoodInputForm userId={userId} />

          {/* 영양소 그래프 */}
          <NutritionChart foods={foods} />
        </section>

        {/* 카드 리스트 */}
        <CardBoard />
      </section>
    </>
  );
}
