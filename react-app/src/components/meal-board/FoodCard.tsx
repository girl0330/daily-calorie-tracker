import { useState } from 'react';
import type { FoodItem } from '../../types/types';
import { calories } from '../../utils/calculate';
// import { removeFood } from '../../service/foodService';
import EditFoodCard from './EditFoodCard';
import { removeFood as removeFoodApi } from '../../service/FoodService';
import { useFoodItemStore } from '../../store/foodStore';

export default function FoodCard({ food }: { food: FoodItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const removeFoodFromStore = useFoodItemStore(state => state.removeFood);

  // 삭제 버튼 클릭 시 실행되는 함수
  const handleDeleteFood = async () => {
    try {
      // 1. Supabase DB에서 먼저 삭제
      await removeFoodApi(food.id);

      // 2. DB 삭제가 성공했을 때만 Zustand 상태에서도 삭제
      removeFoodFromStore(food.id);
    } catch (error) {
      // DB 삭제 실패 시 화면에서는 삭제하지 않음
      console.error('음식 삭제 실패:', error);
    }
  };

  return (
    <div className="min-h-0 overflow-y-auto p-4">
      <div className="space-y-4">
        {/* <article className="rounded-md bg-(--white) p-4 shadow-sm">  */}
        {isEditing ? (
          <EditFoodCard food={food} setIsEditing={setIsEditing} />
        ) : (
          <article key={food.id} className="rounded-md border border-(--neutral-4) bg-(--white) p-4 shadow-sm">
            <div className="flex flex-row items-center justify-between gap-3">
              <div className="flex flex-1 flex-col items-center justify-center">
                <h3 className="text-center text-2xl font-bold text-(--text-primary)">{food.foodName}</h3>
                <p className="mt-1 text-center text-sm text-(--text-muted)">
                  {calories(food.carbs, food.protein, food.fat)} 칼로리
                </p>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
                >
                  <img src="/cut-scissors.svg" alt="수정" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDeleteFood}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
                >
                  <img src="/trash-bin.svg" alt="삭제" className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                <p className="text-sm text-(--text-muted)">carbs</p>
                <p className="font-semibold text-(--text-primary)">{food.carbs} g</p>
              </div>
              <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                <p className="text-sm text-(--text-muted)">protein</p>
                <p className="font-semibold text-(--text-primary)">{food.protein} g</p>
              </div>
              <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                <p className="text-sm text-(--text-muted)">fat</p>
                <p className="font-semibold text-(--text-primary)">{food.fat} g</p>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
