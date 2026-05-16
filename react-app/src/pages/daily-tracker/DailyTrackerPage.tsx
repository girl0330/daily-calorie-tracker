import type { UserId } from '../../types/types';
import WeeklyDayBar from './components/WeeklyDayBar';
import FoodInputForm from './components/FoodInputForm';
import { CardBoard } from '../../components/meal-board/CardBoard';
import { NutritionChart } from '../../components/charts/NutritionChart';
import { useAuthStore } from '../../store/authStore';
import { useFoods } from '../../hooks/userFoods';
import useTodayFoods from '../../hooks/useTodayFoods';

export default function DailyTrackerPage() {
  const userFromStore = useAuthStore(state => state.user);

  const { data: foods = [], isLoading, isError, error } = useFoods(userFromStore?.id);

  // 날짜 기준 데이터는 페이지에서 한 번만 계산해서 하위 컴포넌트로 내려준다.
  const todayFoods = useTodayFoods(foods);

  // 로그인 유저가 없으면 페이지를 렌더링하지 않음
  if (!userFromStore) {
    return null;
  }

  // 음식 데이터 조회 중 상태
  if (isLoading) {
    return <div>음식 데이터를 불러오는 중입니다.</div>;
  }

  // 음식 데이터 조회 실패 상태
  if (isError) {
    return <div>음식 데이터를 불러오지 못했습니다: {error.message}</div>;
  }

  const userId = userFromStore.id as UserId;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* 주간 날짜 영역 */}
      <WeeklyDayBar foods={foods} />

      {/* 상단 보조 영역: 음식 추가 + 영양소 차트 */}
      <div className="grid shrink-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <FoodInputForm userId={userId} />

        <NutritionChart foods={todayFoods} variant="full" />
      </div>

      {/* 하단 메인 영역: 식사별 카드 보드 */}
      <div className="min-h-0 flex-1">
        <CardBoard foods={todayFoods} variant="daily" className="h-full" />
      </div>
    </div>
  );
}
