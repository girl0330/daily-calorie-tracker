import { useState, type Dispatch, type SetStateAction } from 'react';
import type { FoodItem, UpdateFoodRequest } from '../../types/types';
import { calories } from '../../utils/calculate';
import { useUpdateFood } from '../../hooks/useFoodMutations';

type EditFoodCardProps = {
  food: FoodItem;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

type EditFoodForm = {
  foodName: string;
  carbs: string;
  protein: string;
  fat: string;
};

export default function EditFoodCard({ food, setIsEditing }: EditFoodCardProps) {
  const { mutate: updateFood, isPending } = useUpdateFood(food.userId);

  const [editInputForm, setEditInputForm] = useState<EditFoodForm>({
    foodName: food.foodName,
    carbs: String(food.carbs),
    protein: String(food.protein),
    fat: String(food.fat),
  });

  const previewCalories = calories(
    Number(editInputForm.carbs) || 0,
    Number(editInputForm.protein) || 0,
    Number(editInputForm.fat) || 0
  );

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
    setEditInputForm({
      foodName: food.foodName,
      carbs: String(food.carbs),
      protein: String(food.protein),
      fat: String(food.fat),
    });
    setIsEditing(false);
  };

  // 유효성 검사
  const validateFoodForm = ({ foodName, carbs, protein, fat }: EditFoodForm): string | null => {
    if (!foodName || !foodName.trim()) return '음식 이름을 입력해주세요.';

    if (carbs === '' || protein === '' || fat === '') return '탄수화물, 단백질, 지방 값을 모두 입력해주세요.';

    if ([carbs, protein, fat].some(value => Number.isNaN(Number(value)))) {
      return '탄수화물, 단백질, 지방은 숫자여야 합니다.';
    }

    if ([carbs, protein, fat].some(value => Number(value) < 0)) {
      return '탄수화물, 단백질, 지방은 0 이상이어야 합니다.';
    }

    return null;
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateFoodForm(editInputForm);

    // 토스트 알림으로 교체 예정
    if (error) {
      alert(error);
      return;
    }

    const editedFoodItem: UpdateFoodRequest = {
      ...food,
      foodName: editInputForm.foodName.trim(),
      carbs: Number(editInputForm.carbs),
      protein: Number(editInputForm.protein),
      fat: Number(editInputForm.fat),
    };

    updateFood(editedFoodItem, {
      // 수정 성공 후 수정 모드 종료
      onSuccess: () => {
        setIsEditing(false);
      },

      // 수정 실패 시 수정 모드는 유지
      onError: error => {
        console.error('음식 수정 실패:', error);
        alert('음식 수정에 실패했습니다.');
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
              className="col-span-3 h-8 w-full rounded-md border border-(--neutral-3) px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3) disabled:cursor-not-allowed disabled:opacity-60"
            />
            <p className="mt-1 text-center text-sm text-(--text-muted)">{previewCalories} 칼로리</p>
          </div>
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={isPending}
              aria-label="음식 수정 저장"
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              <img src="/check-good-yes.svg" alt="" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              aria-label="음식 수정 취소"
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
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
              className="h-6 w-full rounded-md border border-(--neutral-3) px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3) disabled:cursor-not-allowed disabled:opacity-60"
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
              className="h-6 w-full rounded-md border border-(--neutral-3) px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3) disabled:cursor-not-allowed disabled:opacity-60"
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
              className="h-6 w-full rounded-md border border-(--neutral-3) px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3) disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      </form>
    </article>
  );
}
