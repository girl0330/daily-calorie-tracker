import { formatNumber } from '../../../utils/formatNumber';
import { useState } from 'react';
import type { FoodItem } from '../../../types/types';
import { calories } from '../../../utils/calculate';
import EditFoodCard from './EditFoodCard';
import { useRemoveFood } from '../hooks/useFoodMutations';
import { showAlert, showConfirm } from '../../../utils/sweetAlert';

type FoodCardProps = {
  food: FoodItem;
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

export default function FoodCard({ food }: FoodCardProps) {
  const totalCalories = calories(food.carbs, food.protein, food.fat);

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
      onError: () => {
        showAlert({
          title: '음식 삭제 실패',
          text: '음식을 삭제하지 못했습니다. 다시 시도해 주세요.',
          icon: 'error',
        });
      },
    });
  };

  if (isEditing) {
    return <EditFoodCard food={food} setIsEditing={setIsEditing} />;
  }

  const actionButtonClassName =
    'flex size-8 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150 hover:bg-(--surface-4) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--primary-2) disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <article className="rounded-xl bg-(--bg-section) py-3 pr-2 pl-4 ring-1 ring-(--border-light) ring-inset">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1 pt-1">
          <h4 className="truncate text-base font-medium text-(--text-primary)">{food.foodName}</h4>
          <p className="text-sm text-(--text-secondary) tabular-nums">
            {formatNumber(totalCalories)}
            <span className="ml-1 text-xs text-(--text-muted)">kcal</span>
          </p>
        </div>

        {/* 수정 / 삭제 */}
        <div className="flex shrink-0">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label={`${food.foodName} 수정`}
            className={actionButtonClassName}
          >
            <img src="/edit.svg" alt="" className="size-4" />
          </button>

          <button
            type="button"
            onClick={handleDeleteFood}
            disabled={isPending}
            aria-label={`${food.foodName} 삭제`}
            className={actionButtonClassName}
          >
            <img src="/trash-bin.svg" alt="" className="size-4" />
          </button>
        </div>
      </div>

      {/* 영양소 */}
      <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 pr-2 text-xs">
        {nutrientItems.map(({ key, label, colorClassName }) => (
          <li key={key} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${colorClassName}`} />

            <span className="text-(--text-muted)">{label}</span>

            <span className="text-(--text-primary) tabular-nums">{formatNumber(food[key])}g</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
