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

  return (
    <article className="rounded-md border border-(--neutral-4) bg-(--white) p-4 shadow-sm">
      <form onSubmit={handleEditSubmit}>
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex flex-1 flex-col items-center justify-center">
            <input
              id={`food-name-${food.id}`}
              name="foodName"
              value={editInputForm.foodName}
              onChange={handleInputChange}
              placeholder={food.foodName}
              disabled={isPending}
              className="col-span-3 h-8 w-full rounded-md border border-(--neutral-3) px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
            />
            <p className="mt-1 text-center text-sm text-(--text-muted)">{previewCalories} 칼로리</p>
          </div>
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={isPending}
              aria-label="음식 수정 저장"
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
            >
              <img src="/check-good-yes.svg" alt="" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              aria-label="음식 수정 취소"
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
            >
              <img src="/close.svg" alt="" className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md bg-(--neutral-5) px-2 py-2">
            <p className="text-sm text-(--text-muted)">carbs</p>
            <input
              id={`food-carbs-${food.id}`}
              name="carbs"
              value={editInputForm.carbs}
              onChange={handleInputChange}
              placeholder="0"
              disabled={isPending}
              className="h-6 w-full rounded-md border border-(--neutral-3) px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
            />
          </div>
          <div className="rounded-md bg-(--neutral-5) px-2 py-2">
            <p className="text-sm text-(--text-muted)">protein</p>
            <input
              id={`food-protein-${food.id}`}
              name="protein"
              value={editInputForm.protein}
              onChange={handleInputChange}
              placeholder="0"
              disabled={isPending}
              className="h-6 w-full rounded-md border border-(--neutral-3) px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
            />
          </div>
          <div className="rounded-md bg-(--neutral-5) px-2 py-2">
            <p className="text-sm text-(--text-muted)">fat</p>
            <input
              id={`food-fat-${food.id}`}
              name="fat"
              value={editInputForm.fat}
              onChange={handleInputChange}
              placeholder="0"
              disabled={isPending}
              className="h-6 w-full rounded-md border border-(--neutral-3) px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
            />
          </div>
        </div>
      </form>
    </article>
  );
}
