import { useState } from 'react';
import type { CreateFoodRequest, MealType, UserId } from '../../../types/types';
import { createFood } from '../../../service/FoodService';
import { useFoodItemStore } from '../../../store/foodStore';

// 입력창 상태용 타입
type FoodForm = {
  mealType: MealType;
  foodName: string;
  carbs: string;
  protein: string;
  fat: string;
};

// 초기 폼
const initialForm: FoodForm = {
  mealType: 'breakfast',
  foodName: '',
  carbs: '',
  protein: '',
  fat: '',
};

const FoodInputForm = ({ userId }: { userId: UserId }) => {
  const [form, setForm] = useState<FoodForm>(initialForm);

  const addFood = useFoodItemStore(state => state.addFood);

  // 입력 감지
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'radio') {
      setForm(prev => ({
        ...prev,
        [name as keyof FoodForm]: value as MealType,
      }));
      return;
    }

    setForm(prev => ({
      ...prev,
      [name as keyof FoodForm]: value,
    }));
  };

  // 유효성 검사
  const validateFoodForm = ({ foodName, carbs, protein, fat }: FoodForm): string | null => {
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

  // 폼 전송
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateFoodForm(form);

    if (error) {
      alert(error);
      return;
    }

    const requestFood: CreateFoodRequest = {
      userId: userId,
      mealType: form.mealType,
      foodName: form.foodName.trim(),
      carbs: Number(form.carbs),
      protein: Number(form.protein),
      fat: Number(form.fat),
    };

    // 데이터 추가
    const addedFood = await createFood(requestFood);

    // FoodStore에 추가
    addFood(addedFood);

    setForm(initialForm);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full flex-col">
        <div className="flex h-full min-h-80 flex-1 flex-col rounded-md border border-(--neutral-4) bg-(--bg-section) p-4">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-(--text-primary)">음식 추가</h2>
            <p className="mt-1 text-sm text-(--text-muted)">식사 시간과 영양소를 입력해 오늘 식단을 기록하세요.</p>
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex flex-1 flex-col rounded-md">
              <form className="flex flex-1 flex-col justify-between" onSubmit={handleSubmit}>
                <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">
                  <div className="grid grid-cols-8 items-center gap-x-3 gap-y-10">
                    {/* 식사 시간 */}
                    <label className="col-span-1 text-right">식사 시간</label>
                    <div className="col-span-7 flex gap-4">
                      <label className="flex cursor-pointer items-center gap-1">
                        <input
                          type="radio"
                          name="mealType"
                          value="breakfast"
                          checked={form.mealType === 'breakfast'}
                          onChange={handleFormChange}
                          className="accent-(--primary-1)"
                        />
                        <span>아침</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-1">
                        <input
                          type="radio"
                          name="mealType"
                          value="lunch"
                          checked={form.mealType === 'lunch'}
                          onChange={handleFormChange}
                          className="accent-(--primary-1)"
                        />
                        <span>점심</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-1">
                        <input
                          type="radio"
                          name="mealType"
                          value="dinner"
                          checked={form.mealType === 'dinner'}
                          onChange={handleFormChange}
                          className="accent-(--primary-1)"
                        />
                        <span>저녁</span>
                      </label>
                    </div>

                    {/* 음식 이름 */}
                    <label htmlFor="food-name" className="col-span-1 text-right">
                      음식 이름
                    </label>
                    <input
                      id="food-name"
                      name="foodName"
                      value={form.foodName}
                      onChange={handleFormChange}
                      placeholder="음식을 입력해주세요"
                      className="col-span-3 h-10 w-full rounded-md border border-(--neutral-3) px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                    />
                    <label htmlFor="food-carbs" className="col-span-1 text-right">
                      탄수화물
                    </label>
                    <div className="relative col-span-3">
                      <input
                        id="food-carbs"
                        name="carbs"
                        value={form.carbs}
                        onChange={handleFormChange}
                        placeholder="0"
                        className="h-10 w-full rounded-md border border-(--neutral-3) px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                      />
                      <span className="absolute top-1/2 right-3 -translate-y-1/2">g</span>
                    </div>
                    {/* 단백질 */}
                    <label htmlFor="food-protein" className="col-span-1 text-right">
                      단백질
                    </label>
                    <div className="relative col-span-3">
                      <input
                        id="food-protein"
                        name="protein"
                        value={form.protein}
                        onChange={handleFormChange}
                        placeholder="0"
                        className="h-10 w-full rounded-md border border-(--neutral-3) px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                      />
                      <span className="absolute top-1/2 right-3 -translate-y-1/2">g</span>
                    </div>
                    <label htmlFor="food-fat" className="col-span-1 text-right">
                      지방
                    </label>
                    <div className="relative col-span-3">
                      <input
                        id="food-fat"
                        name="fat"
                        value={form.fat}
                        onChange={handleFormChange}
                        placeholder="0"
                        className="h-10 w-full rounded-md border border-(--neutral-3) px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                      />
                      <span className="absolute top-1/2 right-3 -translate-y-1/2">g</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    type="submit"
                    className="h-10 w-full max-w-xs rounded-md bg-(--primary-3) text-white transition hover:bg-(--primary-2)"
                  >
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodInputForm;
