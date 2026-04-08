import { useState } from "react";
import type { FoodItem, MealType, UserId } from "../../types/types";
import WeeklyDayBar from "./components/WeeklyDayBar";
import FoodCard from "../../components/meal-board/FoodCard";

// 입력창 상태용 타입입
type FoodForm = {
  mealType: MealType;
  foodName: string;
  carbs: string;
  protein: string;
  fat: string;
};

// 서버에 전송할 음식 데이터 타입
type CreateFoodRequest = {
  userId: UserId
  mealType: MealType
  foodName: string
  carbs: number
  protein: number
  fat: number
}

const initialForm: FoodForm = {
  mealType: 'breakfast',
  foodName: '',
  carbs: '',
  protein: '',
  fat: '',
}

export default function DailyTrackerPage( { userId }: { userId: UserId } ) {
  const [form, setForm] = useState<FoodForm>(initialForm)
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type} = e.target

    if (type === 'radio') {
      setForm((prev) => ({
        ...prev,
        [name as keyof FoodForm]: value as MealType,
      }))
      return 
    }

    setForm((prev) => ({
      ...prev,
      [name as keyof FoodForm]: value,
    }))
  }

  const validateFoodForm = ({ foodName, carbs, protein, fat }: FoodForm): string | null => {
    if (!foodName || !foodName.trim()) return '음식 이름을 입력해주세요.'

    if (carbs === '' || protein === '' || fat === '') return '탄수화물, 단백질, 지방 값을 모두 입력해주세요.'

    if ([carbs, protein, fat].some(value => Number.isNaN(Number(value)))) {
        return '탄수화물, 단백질, 지방은 숫자여야 합니다.'
    }

    if ([carbs, protein, fat].some(value => Number(value) < 0)) {
        return '탄수화물, 단백질, 지방은 0 이상이어야 합니다.'
    }

    return null
  }
  
  const toLocalFoodItem = (payload: CreateFoodRequest): FoodItem => ({
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...payload,
  })
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const error = validateFoodForm(form)
    
    if (error) {
        alert(error)
        return
      }

    const request: CreateFoodRequest = {
      userId: userId,
      mealType: form.mealType,
      foodName: form.foodName.trim(),
      carbs: Number(form.carbs),
      protein: Number(form.protein),
      fat: Number(form.fat),
    }

    const newFoodItem = toLocalFoodItem(request)

    console.log(newFoodItem)

    setForm(initialForm)
  }
  
  return (
    <>
      <section className="flex flex-col gap-4">
        {/* 상단 주간 바 */}
        <WeeklyDayBar />

        <section className="grid grid-cols-2 gap-4">
          {/* 입력 + 영양 상태 */}
          <div className="flex flex-col h-full">
            <div className="flex flex-col flex-1 rounded-md border border-(--neutral-4) bg-(--bg-section) p-4 min-h-80 h-full">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-(--text-primary)">음식 추가</h2>
                <p className="mt-1 text-sm text-(--text-muted)">
                  식사 시간과 영양소를 입력해 오늘 식단을 기록하세요.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="rounded-md flex-1 flex flex-col">
                  <form className="flex-1 flex flex-col justify-between" onSubmit={handleSubmit}>
                    <div className="mx-auto max-w-2xl w-full flex-1 flex flex-col justify-center">
                      <div className="grid grid-cols-8 gap-x-3 gap-y-10 items-center">
                        {/* 식사 시간 */}
                        <label className="col-span-1 text-right">식사 시간</label>
                        <div className="col-span-7 flex gap-4">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name="mealType" value="breakfast" checked={form.mealType === 'breakfast'} onChange={handleFormChange} className="accent-(--primary-1)" />
                            <span>아침</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name="mealType" value="lunch" checked={form.mealType === 'lunch'} onChange={handleFormChange} className="accent-(--primary-1)" />
                            <span>점심</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name="mealType" value="dinner" checked={form.mealType === 'dinner'} onChange={handleFormChange} className="accent-(--primary-1)" />
                            <span>저녁</span>
                          </label>
                        </div>

                        {/* 음식 이름 */}
                        <label htmlFor="food-name" className="col-span-1 text-right">
                          음식 이름
                        </label>
                        <input
                          id="food-name"
                          name='foodName'
                          value={form.foodName}
                          onChange={handleFormChange}
                          placeholder='음식을 입력해주세요'
                          className="col-span-3 h-10 w-full border border-(--neutral-3) rounded-md px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                        />
                          <label htmlFor="food-carbs" className="col-span-1 text-right">
                            탄수화물
                          </label>
                          <div className='col-span-3 relative'>
                            <input
                              id="food-carbs"
                              name='carbs'
                              value={form.carbs}
                              onChange={handleFormChange}
                              placeholder='0'
                              className="h-10 w-full border border-(--neutral-3) rounded-md px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">
                              g
                            </span>
                          </div>
                        {/* 단백질 */}
                        <label htmlFor="food-protein" className="col-span-1 text-right">
                          단백질
                        </label>
                        <div className='col-span-3 relative'>
                          <input
                            id="food-protein"
                            name='protein'
                            value={form.protein}
                            onChange={handleFormChange}
                            placeholder='0'
                            className="h-10 w-full border border-(--neutral-3) rounded-md px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">
                              g
                            </span>
                        </div>
                        <label htmlFor="food-fat" className="col-span-1 text-right">
                          지방
                        </label>
                        <div className='col-span-3 relative'>
                          <input
                            id="food-fat"
                            name='fat'
                            value={form.fat}
                            onChange={handleFormChange}
                            placeholder='0'
                            className="h-10 w-full border border-(--neutral-3) rounded-md px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">
                              g
                            </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center mt-6">
                      <button
                        type="submit"
                        className="h-10 w-full max-w-xs rounded-md bg-(--primary-3) text-white hover:bg-(--primary-2) transition"
                      >
                        저장
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* 영양소 그래프 */}
          <div className="flex flex-col h-full">
            <div className="flex flex-col flex-1 rounded-md border border-(--neutral-4) bg-(--bg-section) p-4 min-h-80 h-full">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-(--text-primary)">
                  영양소 그래프
                </h2>
                <p className="mt-1 text-sm text-(--text-muted)">
                  오늘 영양소 그래프를 확인해 보세요.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="rounded-md bg-white px-4 pt-5 pb-4 flex-1 flex flex-col">
                  {/* 그래프 */}
                  <div className="relative h-52 border-l-2 border-b-2 border-(--chart-grid) px-4 pb-2">
                    {/* 가이드라인 */}
                    <div className="absolute inset-x-4 top-1/4 border-t border-dashed border-(--chart-grid)" />
                    <div className="absolute inset-x-4 top-2/4 border-t border-dashed border-(--chart-grid)" />
                    <div className="absolute inset-x-4 top-3/4 border-t border-dashed border-(--chart-grid)" />

                    {/* 막대 */}
                    <div className="flex h-full items-end justify-around gap-4">
                      {/* Carbs */}
                      <div className="flex flex-col items-center justify-end">
                        <span className="mb-1 text-xs text-(--text-secondary)">120g</span>
                        <div
                          className="w-10 rounded-t-md bg-(--chart-carb)"
                          style={{ height: '60%' }}
                        />
                        <span className="mt-2 text-xs font-medium text-(--text-primary)">
                          탄수
                        </span>
                      </div>

                      {/* Protein */}
                      <div className="flex flex-col items-center justify-end">
                        <span className="mb-1 text-xs text-(--text-secondary)">80g</span>
                        <div
                          className="w-10 rounded-t-md bg-(--chart-protein)"
                          style={{ height: '85%' }}
                        />
                        <span className="mt-2 text-xs font-medium text-(--text-primary)">
                          단백질
                        </span>
                      </div>

                      {/* Fat */}
                      <div className="flex flex-col items-center justify-end">
                        <span className="mb-1 text-xs text-(--text-secondary)">40g</span>
                        <div
                          className="w-10 rounded-t-md bg-(--chart-fat)"
                          style={{ height: '35%' }}
                        />
                        <span className="mt-2 text-xs font-medium text-(--text-primary)">
                          지방
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* 칼로리 summary */}
                  <div className="mt-4 border-t border-(--neutral-4) pt-3 flex justify-center items-center">
                    {/* 총 칼로리 + 영양소 요약을 가운데에 나란히 배치 */}
                    <div className="flex items-center gap-6">
                      <p className="text-2xl font-bold text-(--chart-calorie)">
                        840 <span className="text-base font-medium">kcal</span>
                      </p>
                      <div className="text-sm text-(--text-secondary)">
                        <span>탄수화물 120g</span>
                        <span className="mx-2 text-(--text-muted)">/</span>
                        <span>단백질 80g</span>
                        <span className="mx-2 text-(--text-muted)">/</span>
                        <span>지방 40g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 카드 리스트 */}
        <section className="rounded-md border border-(--neutral-4) bg-(--bg-section)">
          <div className="grid h-[520px] grid-cols-3 divide-x divide-(--neutral-4)">
            {/* 아침 */}
            <FoodCard />

            {/* 점심 */}
            <div className="flex min-h-0 flex-col">
              <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3 text-center">
                <h2 className="text-2xl font-bold text-(--text-primary)">점심</h2>
              </div>

              <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3">
                <div className="flex items-center justify-center gap-2 text-sm text-(--text-secondary)">
                <span className="text-(--text-muted)">
                  carbs <span className="text-(--text-primary)">100</span> g
                </span>

                <span className="text-(--text-muted)">
                  protein <span className="text-(--text-primary)">30</span> g
                </span>

                <span className="text-(--text-muted)">
                  fat <span className="text-(--text-primary)">250</span> g
                </span>

                  <span className="order-4 text-(--neutral-3)">|</span>
                <span className="order-5 font-semibold text-(--primary-1)">총 650 kcal</span>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <article className="rounded-md border border-(--neutral-4) bg-(--white) p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-bold text-(--text-primary)">싸이버거</h3>
                        <p className="mt-1 text-sm text-(--text-muted)">450 칼로리</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full border border-(--primary-2)"
                        />
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full border border-(--primary-2)"
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                        <p className="text-sm text-(--text-muted)">carbs</p>
                        <p className="font-semibold text-(--text-primary)">100 g</p>
                      </div>
                      <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                        <p className="text-sm text-(--text-muted)">protein</p>
                        <p className="font-semibold text-(--text-primary)">30 g</p>
                      </div>
                      <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                        <p className="text-sm text-(--text-muted)">fat</p>
                        <p className="font-semibold text-(--text-primary)">250 g</p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>

            {/* 저녁 */}
            <div className="flex min-h-0 flex-col">
              <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3 text-center">
                <h2 className="text-2xl font-bold text-(--text-primary)">저녁</h2>
              </div>

              <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3">
                <div className="flex items-center justify-center gap-2 text-sm text-(--text-secondary)">
                <span className="text-(--text-muted)">
                  carbs <span className="text-(--text-primary)">100</span> g
                </span>

                <span className="text-(--text-muted)">
                  protein <span className="text-(--text-primary)">30</span> g
                </span>

                <span className="text-(--text-muted)">
                  fat <span className="text-(--text-primary)">250</span> g
                </span>

                  <span className="order-4 text-(--neutral-3)">|</span>
                <span className="order-5 font-semibold text-(--primary-1)">총 650 kcal</span>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <article className="rounded-md border border-(--neutral-4) bg-(--white) p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-(--text-primary)">싸이버거</h3>
                        <p className="mt-1 text-sm text-(--text-muted)">450 칼로리</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full border border-(--primary-2)"
                        />
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full border border-(--primary-2)"
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                        <p className="text-sm text-(--text-muted)">carbs</p>
                        <p className="font-semibold text-(--text-primary)">100 g</p>
                      </div>
                      <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                        <p className="text-sm text-(--text-muted)">protein</p>
                        <p className="font-semibold text-(--text-primary)">30 g</p>
                      </div>
                      <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                        <p className="text-sm text-(--text-muted)">fat</p>
                        <p className="font-semibold text-(--text-primary)">250 g</p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

      </section>
    </>
  );
}
