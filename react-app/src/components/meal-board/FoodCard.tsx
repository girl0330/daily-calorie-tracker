import { useEffect, useState } from 'react';
import type { FoodItem, MealType } from '../../types/types';
import { getFoods } from '../../service/FoodService';

type FoodCardProps = {
  mealType: MealType;
};

export default function FoodCard({ mealType }: FoodCardProps) {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log(mealType);
    const data = getFoods();
    console.log('data:::   ' + JSON.stringify(data));
    const breakfastData = data.filter(item => {
      return item.mealType === mealType;
    });
    console.log('breakfastData:::   ' + JSON.stringify(breakfastData));

    setFoods(breakfastData);
  }, [mealType]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {/* <article className="rounded-md bg-(--white) p-4 shadow-sm">  */}
        {foods.map(item => (
          <article key={item.id} className="rounded-md border border-(--neutral-4) bg-(--white) p-4 shadow-sm">
            <div className="flex flex-row items-center justify-between gap-3">
              {/* 텍스트 영역 (가운데 정렬 )*/}
              <div className="flex flex-1 flex-col items-center justify-center">
                <h3 className="text-center text-2xl font-bold text-(--text-primary)">{item.foodName}</h3>
                <p className="mt-1 text-center text-sm text-(--text-muted)">450 칼로리</p>
              </div>
              {/* 버튼 영역 (오른쪽 정렬) */}
              <div className="flex flex-col justify-end">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
                    >
                      <img src="/check-good-yes.svg" alt="확인" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
                    >
                      <img src="/cross.svg" alt="딛힘" className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
                    >
                      <img src="/cut-scissors.svg" alt="수정" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-(--neutral-5) focus:outline-none"
                    >
                      <img src="/trash-alt-delete-bin.svg" alt="삭제" className="h-4 w-4" />
                    </button>
                  </>
                )}
                {/* 체크 */}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                <p className="text-sm text-(--text-muted)">carbs</p>
                <p className="font-semibold text-(--text-primary)">{item.carbs} g</p>
              </div>
              <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                <p className="text-sm text-(--text-muted)">protein</p>
                <p className="font-semibold text-(--text-primary)">{item.protein} g</p>
              </div>
              <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                <p className="text-sm text-(--text-muted)">fat</p>
                <p className="font-semibold text-(--text-primary)">{item.fat} g</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
