import { formatNumber } from '../../../utils/formatNumber';
import { useState, type Dispatch, type SetStateAction } from 'react';
import type { FoodItem, UpdateFoodRequest } from '../../../types/types';
import { calories } from '../../../utils/calculate';
import { useUpdateFood } from '../hooks/useFoodMutations';
import {
  getPreviewNutrients,
  parseFoodForm,
  toFoodFormValues,
  validateFoodForm,
  type FoodFormValues,
} from '../utils/foodForm';
import { showAlert } from '../../../utils/sweetAlert';

type EditFoodCardProps = {
  food: FoodItem;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

type EditFoodForm = FoodFormValues;

export default function EditFoodCard({ food, setIsEditing }: EditFoodCardProps) {
  const { mutate: updateFood, isPending } = useUpdateFood(food.userId);

  const [editInputForm, setEditInputForm] = useState<EditFoodForm>(() => toFoodFormValues(food));

  const previewNutrients = getPreviewNutrients(editInputForm);
  const previewCalories = calories(previewNutrients.carbs, previewNutrients.protein, previewNutrients.fat);

  // 입력 감지
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditInputForm(prev => ({
      ...prev,
      [name as keyof EditFoodForm]: value,
    }));
  };

  // 수정 카드 닫기
  const handleClose = () => {
    setEditInputForm(toFoodFormValues(food));
    setIsEditing(false);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateFoodForm(editInputForm);

    if (error) {
      showAlert({
        title: `${error}`,
        icon: 'warning',
      });
      return;
    }

    const parsedForm = parseFoodForm(editInputForm);

    const editedFoodItem: UpdateFoodRequest = {
      id: food.id,
      userId: food.userId,
      mealType: food.mealType,
      recordDate: food.recordDate,
      ...parsedForm,
    };

    updateFood(editedFoodItem, {
      // 수정 성공 후 수정 모드 종료
      onSuccess: () => {
        setIsEditing(false);
      },

      // 수정 실패 시 수정 모드는 유지
      onError: error => {
        console.error('음식 수정 실패:', error);
        showAlert({
          title: '음식 수정 실패',
          text: '음식을 수정하지 못했습니다. 다시 시도해 주세요.',
          icon: 'error',
        });
      },
    });
  };

  const inputClassName =
    'w-full rounded-sm border border-(--border-light) bg-(--bg-input) px-2 text-(--text-primary) transition-colors duration-150 outline-none focus:border-(--brand) disabled:opacity-50';
  const actionButtonClassName =
    'flex size-8 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150 hover:bg-(--skel) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--brand) disabled:cursor-not-allowed disabled:opacity-50';
  const nutrientFields = [
    { name: 'carbs', label: '탄수화물' },
    { name: 'protein', label: '단백질' },
    { name: 'fat', label: '지방' },
  ] as const;

  return (
    <article className="rounded-xl bg-(--surface) py-3 pr-2 pl-4 ring-1 ring-(--brand) ring-inset">
      <form onSubmit={handleEditSubmit}>
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor={`food-name-${food.id}`} className="sr-only">
              음식 이름
            </label>
            <input
              id={`food-name-${food.id}`}
              name="foodName"
              value={editInputForm.foodName}
              onChange={handleInputChange}
              placeholder={food.foodName}
              disabled={isPending}
              className={`h-8 text-base ${inputClassName}`}
            />
            <p className="mt-1 text-sm text-(--text-secondary) tabular-nums">
              {formatNumber(previewCalories)}
              <span className="ml-1 text-xs text-(--text-muted)">kcal</span>
            </p>
          </div>
          <div className="flex shrink-0">
            <button type="submit" disabled={isPending} aria-label="음식 수정 저장" className={actionButtonClassName}>
              <img src="/check-good-yes.svg" alt="" className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              aria-label="음식 수정 취소"
              className={actionButtonClassName}
            >
              <img src="/close.svg" alt="" className="size-4" />
            </button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 pr-2">
          {nutrientFields.map(field => (
            <div key={field.name}>
              <label htmlFor={`food-${field.name}-${food.id}`} className="text-xs text-(--text-muted)">
                {field.label}
              </label>
              <input
                id={`food-${field.name}-${food.id}`}
                name={field.name}
                inputMode="decimal"
                value={editInputForm[field.name]}
                onChange={handleInputChange}
                placeholder="0.0"
                disabled={isPending}
                className={`mt-1 h-8 text-sm tabular-nums ${inputClassName}`}
              />
            </div>
          ))}
        </div>
      </form>
    </article>
  );
}
