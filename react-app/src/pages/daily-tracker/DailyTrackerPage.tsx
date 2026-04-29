import type { UserId } from '../../types/types';
import WeeklyDayBar from './components/WeeklyDayBar';
import FoodInputForm from './components/FoodInputForm';
import { CardBoard } from '../../components/meal-board/CardBoard';
import { NutritionChart } from '../../components/charts/NutritionChart';
import { useAuthStore } from '../../store/authStore';
import { useFoods } from '../../hooks/userFoods';

export default function DailyTrackerPage() {
  const userFromStore = useAuthStore(state => state.user);

  const { data: foods = [], isLoading, isError, error } = useFoods(userFromStore?.id);

  //user.id를 안전하게 사용하기 위한 방어 코드
  if (!userFromStore) {
    return null;
  }

  // 최초 음식 데이터를 가져오는 중인 상태
  if (isLoading) {
    return <div>음식 데이터를 불러오는 중입니다.</div>;
  }

  // 음식 데이터 조회 실패 상태
  if (isError) {
    return <div>음식 데이터를 불러오지 못했습니다: {error.message}</div>;
  }

  const userId = userFromStore.id as UserId;

  return (
    <>
      <section className="flex flex-col gap-4">
        {/* 상단 주간 바 */}
        <WeeklyDayBar foods={foods} />

        <section className="grid grid-cols-2 gap-4">
          {/* 입력 + 영양 상태 */}
          <FoodInputForm userId={userId} />

          {/* 영양소 그래프 */}
          <NutritionChart foods={foods} />
        </section>

        {/* 카드 리스트 */}
        <CardBoard foods={foods} />
      </section>
    </>
  );
}
