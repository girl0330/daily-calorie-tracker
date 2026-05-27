import { useState } from 'react';
import type { FoodItem } from '../../../types/types';
import { calories } from '../../../utils/calculate';
import EditFoodCard from './EditFoodCard';
import { useRemoveFood } from '../hooks/useFoodMutations';

type FoodCardProps = {
  food: FoodItem;
  compact?: boolean;
};

export default function FoodCard({ food, compact = false }: FoodCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // 삭제 mutation
  const { mutate: removeFood, isPending } = useRemoveFood(food.userId);

  // 삭제 버튼 클릭 시 실행되는 함수
  const handleDeleteFood = () => {
    removeFood(food.id, {
      onError: error => {
        console.error('음식 삭제 실패:', error);
        alert('음식 삭제에 실패했습니다.');
      },
    });
  };

  if (isEditing) {
    return <EditFoodCard food={food} setIsEditing={setIsEditing} />;
  }

  return (
    <article className={`rounded-md border border-(--neutral-4) bg-(--white) shadow-sm ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex flex-row items-center justify-between gap-3">
        <div className="flex flex-1 flex-col items-center justify-center">
          <h3 className={`text-center font-bold text-(--text-primary) ${compact ? 'text-base' : 'text-2xl'}`}>
            {food.foodName}
          </h3>
          <p className={`mt-1 text-center text-(--text-muted) ${compact ? 'text-xs' : 'text-sm'}`}>
            {calories(food.carbs, food.protein, food.fat)} 칼로리
          </p>
        </div>

        <div className="flex flex-col justify-end">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="음식 수정"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
          >
            <img src="/cut-scissors.svg" alt="" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDeleteFood}
            disabled={isPending}
            aria-label="음식 삭제"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <img src="/trash-bin.svg" alt="" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-3 gap-2 text-center ${compact ? 'mt-3' : 'mt-4'}`}>
        <div className="rounded-md bg-(--neutral-5) px-2 py-2">
          <p className={`text-(--text-muted) ${compact ? 'text-xs' : 'text-sm'}`}>탄</p>
          <p className={`font-semibold text-(--text-primary) ${compact ? 'text-sm' : ''}`}>{food.carbs}g</p>
        </div>
        <div className="rounded-md bg-(--neutral-5) px-2 py-2">
          <p className={`text-(--text-muted) ${compact ? 'text-xs' : 'text-sm'}`}>단</p>
          <p className={`font-semibold text-(--text-primary) ${compact ? 'text-sm' : ''}`}>{food.protein}g</p>
        </div>
        <div className="rounded-md bg-(--neutral-5) px-2 py-2">
          <p className={`text-(--text-muted) ${compact ? 'text-xs' : 'text-sm'}`}>지</p>
          <p className={`font-semibold text-(--text-primary) ${compact ? 'text-sm' : ''}`}>{food.fat}g</p>
        </div>
      </div>
    </article>
  );
}
