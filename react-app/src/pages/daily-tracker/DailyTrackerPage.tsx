import type { FoodItem, UserId } from '../../types/types';
import WeeklyDayBar from './components/WeeklyDayBar';
import FoodInputForm from './components/FoodInputForm';
import NutritionChart from '../../components/charts/NutritionChart';
import { useEffect, useState } from 'react';
import { getFoods } from '../../service/foodService';
import { CardBoard } from '../../components/meal-board/CardBoard';

export default function DailyTrackerPage({ userId }: { userId: UserId }) {
  const [foods, setFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    const storedFoods = getFoods();

    console.log('데일리 페이지의 저장된 음식 리스트 확인 :::', storedFoods);
    setFoods(storedFoods);
  }, []);

  console.log('foods :::', foods);
  return (
    <>
      <section className="flex flex-col gap-4">
        {/* 상단 주간 바 */}
        <WeeklyDayBar />

        <section className="grid grid-cols-2 gap-4">
          {/* 입력 + 영양 상태 */}
          <FoodInputForm userId={userId} setFoods={setFoods} />

          {/* 영양소 그래프 */}
          <NutritionChart />
        </section>

        {/* 카드 리스트 */}
        <CardBoard foods={foods} setFoods={setFoods} />
      </section>
    </>
  );
}
