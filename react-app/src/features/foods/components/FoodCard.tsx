import { useState } from 'react';
import type { FoodItem } from '../../../types/types';
import { calories } from '../../../utils/calculate';
import EditFoodCard from './EditFoodCard';
import { useRemoveFood } from '../hooks/useFoodMutations';
import { showAlert, showConfirm } from '../../../utils/sweetAlert';

type FoodCardProps = {
  food: FoodItem;
  compact?: boolean;
};

const nutrientItems = [
  {
    key: 'carbs',
    label: '탄수화물',
    colorClassName: 'bg-(--chart-carbs)',
  },
  {
    key: 'protein',
    label: '단백질',
    colorClassName: 'bg-(--chart-protein)',
  },
  {
    key: 'fat',
    label: '지방',
    colorClassName: 'bg-(--chart-fat)',
  },
] as const;

export default function FoodCard({ food, compact = false }: FoodCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // 삭제 mutation
  const { mutate: removeFood, isPending } = useRemoveFood(food.userId);

  // 삭제 버튼 클릭 시 실행되는 함수
  const handleDeleteFood = async () => {
    const isConfirmed = await showConfirm({
      title: '음식을 삭제할까요?',
      text: '삭제한 음식 기록은 되돌릴 수 없습니다.',
      icon: 'warning',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    });

    if (!isConfirmed) return;

    removeFood(food.id, {
      onError: error => {
        showAlert({
          title: `${error}`,
          icon: 'error',
        });
      },
    });
  };

  if (isEditing) {
    return <EditFoodCard food={food} setIsEditing={setIsEditing} />;
  }

  return (
    <article className={`h-[130px] rounded-md border border-(--neutral-4) bg-(--white) ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex flex-row items-center justify-between gap-3">
        <div className="flex flex-1 flex-col items-center justify-center">
          <h3 className={`text-center font-bold text-(--text-primary) ${compact ? 'text-base' : 'text-2xl'}`}>
            {food.foodName}
          </h3>
          <p className={`mt-1 text-center text-(--text-muted) ${compact ? 'text-xs' : 'text-sm'}`}>
            {calories(food.carbs, food.protein, food.fat)} 칼로리
          </p>
        </div>

        {/* <div className="flex flex-col justify-end">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="음식 수정"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
          >
            <img src="/edit.svg" alt="" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDeleteFood}
            disabled={isPending}
            aria-label="음식 삭제"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
          >
            <img src="/trash-bin.svg" alt="" className="h-4 w-4" />
          </button>
        </div> */}
        <div className="absolute top-3 right-3 flex flex-col">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="음식 수정"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
          >
            <img src="/edit.svg" alt="" className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleDeleteFood}
            disabled={isPending}
            aria-label="음식 삭제"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
          >
            <img src="/trash-bin.svg" alt="" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* <div
        className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-1 ${
          compact ? 'mt-3 text-xs' : 'mt-4 text-sm'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-(--chart-carbs)" />
          <span className="text-(--text-muted)">탄수화물</span>
          <span className="font-semibold text-(--text-primary)">{food.carbs}g</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-(--chart-protein)" />
          <span className="text-(--text-muted)">단백질</span>
          <span className="font-semibold text-(--text-primary)">{food.protein}g</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-(--chart-fat)" />
          <span className="text-(--text-muted)">지방</span>
          <span className="font-semibold text-(--text-primary)">{food.fat}g</span>
        </div>
      </div> */}

      <div
        className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1 ${
          compact ? 'mt-3 text-xs' : 'mt-4 text-sm'
        }`}
      >
        {nutrientItems.map(({ key, label, colorClassName }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 shrink-0 rounded-full ${colorClassName}`} />

            <span className="text-(--text-muted)">{label}</span>

            <span className="font-semibold text-(--text-primary)">{food[key]}g</span>
          </div>
        ))}
      </div>
    </article>
  );
}
