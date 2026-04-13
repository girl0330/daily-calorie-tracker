import type { FoodItem, UserId } from '../../types/types';
import WeeklyDayBar from './components/WeeklyDayBar';
import FoodInputForm from './components/FoodInputForm';
import { useEffect, useState } from 'react';
import { getFoods } from '../../service/foodService';
import { CardBoard } from '../../components/meal-board/CardBoard';
import { NutritionChart } from '../../components/charts/NutritionChart';

/* foods 데이터
[{
  id: 1775832844345
  userId: "test-user"
  foodName: "커피"
  mealType: "dinner"
  carbs: 0
  protein: 5
  fat: 0
  createdAt: "2026-04-10T14:54:04.345Z"
},
...{}] */

export default function DailyTrackerPage({ userId }: { userId: UserId }) {
  const [foods, setFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    const storedFoods = getFoods();

    console.log('데일리 페이지의 저장된 음식 리스트 확인 :::', storedFoods);
    setFoods(storedFoods);
  }, []);

  return (
    <>
      <section className="flex flex-col gap-4">
        {/* 상단 주간 바 */}
        <WeeklyDayBar foods={foods} />

        <section className="grid grid-cols-2 gap-4">
          {/* 입력 + 영양 상태 */}
          <FoodInputForm userId={userId} setFoods={setFoods} />

          {/* 영양소 그래프 */}
          <NutritionChart foods={foods} />
        </section>

        {/* 카드 리스트 */}
        <CardBoard userId={userId} foods={foods} setFoods={setFoods} />
      </section>
    </>
  );
}
