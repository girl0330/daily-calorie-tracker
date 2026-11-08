import { useId, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { CreateFoodRequest, MealType, UserId } from '../../../types/types';
import { parseFoodForm, validateFoodForm, type FoodFormValues } from '../utils/foodForm';
import { useCreateFood } from '../hooks/useFoodMutations';
import SectionLayout from '../../../components/common/SectionLayout';
import { showAlert } from '../../../utils/sweetAlert';

// 입력창 상태용 타입
type FoodForm = FoodFormValues & {
  mealType: MealType;
};

type FoodInputFormProps = {
  userId: UserId;
  recordDate: string;
  className?: string;
  onSaveSuccess?: () => void; // 음식 추가 성공 시 호출되는 콜백 함수
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

const FoodInputForm = ({ userId, recordDate, className = '', onSaveSuccess }: FoodInputFormProps) => {
  const inputId = useId();

  const foodNameId = `${inputId}-foodName`;
  const carbsId = `${inputId}-carbs`;
  const proteinId = `${inputId}-protein`;
  const fatId = `${inputId}-fat`;

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

  // 폼 전송
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateFoodForm(form);

    if (error) {
      showAlert({
        title: `${error}`,
        icon: 'warning',
      });
      return;
    }

    const parsedForm = parseFoodForm(form);

    const newFood: CreateFoodRequest = {
      userId,
      mealType: form.mealType,
      recordDate,
      ...parsedForm,
    };

    try {
      await createFoodMutation.mutateAsync(newFood);

      // 저장 성공 후 입력값 초기화
      setForm(initialForm);
      onSaveSuccess?.(); // 음식 추가 성공 시 호출되는 콜백 함수
    } catch {
      showAlert({
        title: '음식 추가 실패',
        text: '음식 추가에 실패했습니다.',
        icon: 'error',
      });
    }
  };

  const inputSectionClassName = [
    // 모든 섹션이 공유하는 기본 박스 스타일
    'border-b border-r border-(--border-light) bg-(--white)',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <SectionLayout title="음식 추가" description={`${recordDate} 기록에 추가돼요`} className={inputSectionClassName}>
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        {/* Meal type radio */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-(--text-secondary)">식사 시간</legend>

          <div className="grid grid-cols-3 gap-2">
            {mealOptions.map(meal => (
              <label key={meal.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="mealType"
                  value={meal.value}
                  checked={form.mealType === meal.value}
                  onChange={handleFormChange}
                  autoComplete="off"
                  className="peer sr-only"
                />

                <span className="block rounded-sm border border-(--border-light) px-3 py-2 text-center text-sm text-(--text-secondary) transition-colors duration-150 peer-checked:border-(--primary-2) peer-checked:bg-(--primary-5) peer-checked:font-medium peer-checked:text-(--primary-1) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--primary-2) hover:border-(--border-strong)">
                  {meal.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Food name */}
        <div>
          <label htmlFor={foodNameId} className="mb-2 block text-sm font-medium text-(--text-secondary)">
            음식 이름
          </label>

          <input
            id={foodNameId}
            name="foodName"
            type="text"
            value={form.foodName}
            onChange={handleFormChange}
            placeholder="예: 닭가슴살 샐러드"
            autoComplete="off"
            className="w-full rounded-sm border border-(--border-light) bg-(--bg-input) px-4 py-2.5 text-sm text-(--text-primary) transition-colors duration-150 outline-none placeholder:text-(--text-muted) focus:border-(--primary-2)"
          />
        </div>

        {/* Nutrients + submit button */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_1fr_90px] md:items-end">
          <div>
            <label htmlFor={carbsId} className="mb-2 block text-sm font-medium text-(--text-secondary)">
              탄수화물
            </label>

            <input
              id={carbsId}
              name="carbs"
              type="text"
              inputMode="decimal"
              value={form.carbs}
              onChange={handleFormChange}
              placeholder="0.0 g"
              autoComplete="off"
              className="w-full rounded-sm border border-(--border-light) bg-(--bg-input) px-3 py-2.5 text-sm text-(--text-primary) transition-colors duration-150 outline-none placeholder:text-(--text-muted) focus:border-(--primary-2)"
            />
          </div>

          <div>
            <label htmlFor={proteinId} className="mb-2 block text-sm font-medium text-(--text-secondary)">
              단백질
            </label>

            <input
              id={proteinId}
              name="protein"
              type="text"
              inputMode="decimal"
              value={form.protein}
              onChange={handleFormChange}
              placeholder="0.0 g"
              autoComplete="off"
              className="w-full rounded-sm border border-(--border-light) bg-(--bg-input) px-3 py-2.5 text-sm text-(--text-primary) transition-colors duration-150 outline-none placeholder:text-(--text-muted) focus:border-(--primary-2)"
            />
          </div>

          <div>
            <label htmlFor={fatId} className="mb-2 block text-sm font-medium text-(--text-secondary)">
              지방
            </label>

            <input
              id={fatId}
              name="fat"
              type="text"
              inputMode="decimal"
              value={form.fat}
              onChange={handleFormChange}
              placeholder="0.0 g"
              autoComplete="off"
              className="w-full rounded-sm border border-(--border-light) bg-(--bg-input) px-3 py-2.5 text-sm text-(--text-primary) transition-colors duration-150 outline-none placeholder:text-(--text-muted) focus:border-(--primary-2)"
            />
          </div>

          <button
            type="submit"
            disabled={createFoodMutation.isPending}
            className="cursor-pointer rounded-sm bg-(--primary-1) px-3 py-2.5 text-sm font-medium text-(--text-on-primary) transition-colors duration-150 hover:bg-(--primary-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary-2) disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-(--primary-1)"
          >
            {createFoodMutation.isPending ? '저장 중' : '저장'}
          </button>
        </div>
      </form>
    </SectionLayout>
  );
};

export default FoodInputForm;
