import type { UserId } from '../../types/types';
import WeeklyDayBar from './components/WeeklyDayBar';
import FoodInputForm from './components/FoodInputForm';
import { useEffect } from 'react';
import { getFoods as getFoodsApi } from '../../service/FoodService';
import { CardBoard } from '../../components/meal-board/CardBoard';
import { NutritionChart } from '../../components/charts/NutritionChart';
import { useAuthStore } from '../../store/authStore';
import { useFoodItemStore } from '../../store/foodStore';

export default function DailyTrackerPage() {
  const userFromStore = useAuthStore(state => state.user);
  const setFoods = useFoodItemStore(state => state.setFoods);
  const foodsFromStore = useFoodItemStore(state => state.foods);

  useEffect(() => {
    if (!userFromStore) return;

    const fetchFoods = async () => {
      try {
        const foodList = await getFoodsApi(userFromStore.id);

        // console.log('페이지 렌더링되기전 가져온 값 확인 :::', foodList);
        setFoods(foodList); // 전역으로 저장됨됨
      } catch (error) {
        console.error('음식 목록 조회 중 에러 발생: ', error);
      }
    };

    fetchFoods();
  }, [userFromStore]);

  //user.id를 안전하게 사용하기 위한 방어 코드
  if (!userFromStore) {
    return null;
  }

  const userId = userFromStore.id as UserId;

  return (
    <>
      <section className="flex flex-col gap-4">
        {/* 상단 주간 바 */}
        <WeeklyDayBar foods={foodsFromStore} />

        <section className="grid grid-cols-2 gap-4">
          {/* 입력 + 영양 상태 */}
          <FoodInputForm userId={userId} />

          {/* 영양소 그래프 */}
          <NutritionChart foods={foodsFromStore} />
        </section>

        {/* 카드 리스트 */}
        <CardBoard />
      </section>
    </>
  );
}
