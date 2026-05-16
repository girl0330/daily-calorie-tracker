import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { CreateFoodRequest, MealType, UserId } from '../../../types/types';
import { useCreateFood } from '../../../hooks/useFoodMutations';
import SectionLayout from '../../../components/common/SectionLayout';

// 입력창 상태용 타입
type FoodForm = {
  mealType: MealType;
  foodName: string;
  carbs: string;
  protein: string;
  fat: string;
};

type FoodInputFormProps = {
  userId: UserId;
  className?: string;
};

// 초기 폼
const initialForm: FoodForm = {
  mealType: 'breakfast',
  foodName: '',
  carbs: '',
  protein: '',
  fat: '',
};

const mealOptions: { label: string; value: MealType }[] = [
  { label: '아침', value: 'breakfast' },
  { label: '점심', value: 'lunch' },
  { label: '저녁', value: 'dinner' },
];

const FoodInputForm = ({ userId, className = '' }: FoodInputFormProps) => {
  const [form, setForm] = useState<FoodForm>(initialForm);

  const createFoodMutation = useCreateFood(userId);

  // 입력값 변경 시 form state에 반영
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 유효성 검사
  const validateFoodForm = ({ foodName, carbs, protein, fat }: FoodForm): string | null => {
    if (!foodName.trim()) {
      return '음식 이름을 입력해주세요.';
    }

    if (carbs === '' || protein === '' || fat === '') {
      return '탄수화물, 단백질, 지방 값을 모두 입력해주세요.';
    }

    if ([carbs, protein, fat].some(value => Number.isNaN(Number(value)))) {
      return '탄수화물, 단백질, 지방은 숫자여야 합니다.';
    }

    if ([carbs, protein, fat].some(value => Number(value) < 0)) {
      return '탄수화물, 단백질, 지방은 0 이상이어야 합니다.';
    }

    return null;
  };

  // 폼 전송
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateFoodForm(form);

    if (error) {
      alert(error);
      return;
    }

    const newFood: CreateFoodRequest = {
      userId,
      mealType: form.mealType,
      foodName: form.foodName.trim(),
      carbs: Number(form.carbs),
      protein: Number(form.protein),
      fat: Number(form.fat),
    };

    try {
      await createFoodMutation.mutateAsync(newFood);

      // 저장 성공 후 입력값 초기화
      setForm(initialForm);
    } catch (error) {
      console.error('음식 추가 실패:', error);
      alert('음식 추가에 실패했습니다.');
    }
  };

  return (
    <SectionLayout
      title="음식 추가"
      description="식사 시간과 영양소를 입력해 오늘 식단을 기록하세요."
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Meal type radio */}
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-(--text-secondary)">식사 시간</legend>

          <div className="grid grid-cols-3 gap-2">
            {mealOptions.map(meal => (
              <label key={meal.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="mealType"
                  value={meal.value}
                  checked={form.mealType === meal.value}
                  onChange={handleFormChange}
                  className="peer sr-only"
                />

                <span className="block rounded-md border border-(--neutral-4) px-3 py-2 text-center text-sm font-medium text-(--text-secondary) transition peer-checked:border-(--primary-3) peer-checked:bg-(--primary-1) peer-checked:text-(--primary-5) hover:border-(--primary-3)">
                  {meal.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Food name */}
        <div>
          <label htmlFor="foodName" className="mb-2 block text-sm font-semibold text-(--text-secondary)">
            음식 이름
          </label>

          <input
            id="foodName"
            name="foodName"
            type="text"
            value={form.foodName}
            onChange={handleFormChange}
            placeholder="예: 닭가슴살 샐러드"
            className="w-full rounded-md border border-(--neutral-4) bg-white px-4 py-2.5 text-sm text-(--text-primary) transition outline-none placeholder:text-(--text-muted) focus:border-(--primary-3)"
          />
        </div>

        {/* Nutrients + submit button */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_1fr_90px] md:items-end">
          <div>
            <label htmlFor="carbs" className="mb-2 block text-sm font-semibold text-(--text-secondary)">
              탄수화물
            </label>

            <input
              id="carbs"
              name="carbs"
              type="number"
              min="0"
              value={form.carbs}
              onChange={handleFormChange}
              placeholder="g"
              className="w-full rounded-md border border-(--neutral-4) bg-white px-3 py-2.5 text-sm text-(--text-primary) transition outline-none placeholder:text-(--text-muted) focus:border-(--primary-3)"
            />
          </div>

          <div>
            <label htmlFor="protein" className="mb-2 block text-sm font-semibold text-(--text-secondary)">
              단백질
            </label>

            <input
              id="protein"
              name="protein"
              type="number"
              min="0"
              value={form.protein}
              onChange={handleFormChange}
              placeholder="g"
              className="w-full rounded-md border border-(--neutral-4) bg-white px-3 py-2.5 text-sm text-(--text-primary) transition outline-none placeholder:text-(--text-muted) focus:border-(--primary-3)"
            />
          </div>

          <div>
            <label htmlFor="fat" className="mb-2 block text-sm font-semibold text-(--text-secondary)">
              지방
            </label>

            <input
              id="fat"
              name="fat"
              type="number"
              min="0"
              value={form.fat}
              onChange={handleFormChange}
              placeholder="g"
              className="w-full rounded-md border border-(--neutral-4) bg-white px-3 py-2.5 text-sm text-(--text-primary) transition outline-none placeholder:text-(--text-muted) focus:border-(--primary-3)"
            />
          </div>

          <button
            type="submit"
            disabled={createFoodMutation.isPending}
            className="rounded-md bg-(--primary-3) px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-4) disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createFoodMutation.isPending ? '저장 중' : '저장'}
          </button>
        </div>
      </form>
    </SectionLayout>
  );
};

export default FoodInputForm;
