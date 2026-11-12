import { formatNumber } from '../../../utils/formatNumber';
import { useState } from 'react';
import type { FoodItem } from '../../../types/types';
import { calories } from '../../../utils/calculate';
import EditFoodCard from './EditFoodCard';
import { useRemoveFood } from '../hooks/useFoodMutations';
import { showAlert } from '../../../utils/sweetAlert';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { showToast } from '../../../store/toastStore';

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
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // 삭제 mutation
  const { mutate: removeFood, isPending } = useRemoveFood(food.userId);

  // 확인 창에서 '삭제'를 눌렀을 때 실행되는 함수
  const handleDeleteFood = () => {
    setIsDeleteConfirmOpen(false);

    removeFood(food.id, {
      onSuccess: () => {
        showToast(`${food.foodName} 기록을 삭제했어요`);
      },
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
    'flex size-8 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150 hover:bg-(--track) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--brand) disabled:cursor-not-allowed disabled:opacity-50';

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
            onClick={() => setIsDeleteConfirmOpen(true)}
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

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        title="이 기록을 삭제할까요?"
        description="삭제한 기록은 되돌릴 수 없어요."
        confirmLabel="삭제"
        cancelLabel="닫기"
        onConfirm={handleDeleteFood}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      >
        <dl className="mt-3.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 rounded-lg bg-(--skel) px-3.5 py-3 text-sm">
          <dt className="text-(--ink-2)">음식</dt>
          <dd className="m-0 text-right break-all">{food.foodName}</dd>
          <dt className="text-(--ink-2)">칼로리</dt>
          <dd className="m-0 text-right tabular-nums">{formatNumber(totalCalories)} kcal</dd>
        </dl>
      </ConfirmDialog>
    </article>
  );
}
