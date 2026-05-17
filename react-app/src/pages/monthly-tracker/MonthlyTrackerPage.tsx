import { NutritionChart } from '../../features/tracker/components/nutrition/NutritionChart';
import SectionLayout from '../../components/common/SectionLayout';
import { CardBoard } from '../../features/tracker/components/meal-board/CardBoard';
import { useFoods } from '../../features/foods/hooks/useFoods';
import { useAuthStore } from '../../store/authStore';

export default function MonthlyTrackerPage() {
  const userFromStore = useAuthStore(state => state.user);
  const { data: foods = [], isLoading, isError, error } = useFoods(userFromStore?.id);
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* 상단 보조 영역: 음식 추가 + 영양소 차트 */}
      <div className="grid shrink-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <CardBoard foods={foods} className="h-full" />

        <NutritionChart foods={foods} variant="full" />
      </div>

      {/* 하단 메인 영역: 식사별 카드 보드 */}
      <div className="min-h-0 flex-1">달력</div>
    </div>
  );
}

// <div className="flex h-full min-h-0 flex-col gap-4">
//   {/* 상단 보조 영역: 음식 추가 + 영양소 차트 */}
//   <div className="grid shrink-0 grid-cols-1 gap-4 xl:grid-cols-2">
//     <CardBoard foods={foods} className="h-full" collapsible={true} />

//     <NutritionChart foods={foods} variant="summary" />
//   </div>

//   {/* 하단 메인 영역: 식사별 카드 보드 */}
//   <div className="flex border border-(--neutral-4) bg-(--bg-section)">달력</div>
// </div>
