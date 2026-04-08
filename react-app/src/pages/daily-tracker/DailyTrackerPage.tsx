import type { UserId } from '../../types/types';
import WeeklyDayBar from './components/WeeklyDayBar';
import FoodCard from '../../components/meal-board/FoodCard';
import FoodInputForm from './components/FoodInputForm';

export default function DailyTrackerPage({ userId }: { userId: UserId }) {
  return (
    <>
      <section className="flex flex-col gap-4">
        {/* 상단 주간 바 */}
        <WeeklyDayBar />

        <section className="grid grid-cols-2 gap-4">
          {/* 입력 + 영양 상태 */}
          <div className="flex h-full flex-col">
            <FoodInputForm userId={userId} />
          </div>
          {/* 영양소 그래프 */}
          <div className="flex h-full flex-col">
            <div className="flex h-full min-h-80 flex-1 flex-col rounded-md border border-(--neutral-4) bg-(--bg-section) p-4">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-(--text-primary)">
                  영양소 그래프
                </h2>
                <p className="mt-1 text-sm text-(--text-muted)">
                  오늘 영양소 그래프를 확인해 보세요.
                </p>
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex flex-1 flex-col rounded-md bg-white px-4 pt-5 pb-4">
                  {/* 그래프 */}
                  <div className="relative h-52 border-b-2 border-l-2 border-(--chart-grid) px-4 pb-2">
                    {/* 가이드라인 */}
                    <div className="absolute inset-x-4 top-1/4 border-t border-dashed border-(--chart-grid)" />
                    <div className="absolute inset-x-4 top-2/4 border-t border-dashed border-(--chart-grid)" />
                    <div className="absolute inset-x-4 top-3/4 border-t border-dashed border-(--chart-grid)" />

                    {/* 막대 */}
                    <div className="flex h-full items-end justify-around gap-4">
                      {/* Carbs */}
                      <div className="flex flex-col items-center justify-end">
                        <span className="mb-1 text-xs text-(--text-secondary)">
                          120g
                        </span>
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
                        <span className="mb-1 text-xs text-(--text-secondary)">
                          80g
                        </span>
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
                        <span className="mb-1 text-xs text-(--text-secondary)">
                          40g
                        </span>
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
                  <div className="mt-4 flex items-center justify-center border-t border-(--neutral-4) pt-3">
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
                <h2 className="text-2xl font-bold text-(--text-primary)">
                  점심
                </h2>
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
                  <span className="order-5 font-semibold text-(--primary-1)">
                    총 650 kcal
                  </span>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <article className="rounded-md border border-(--neutral-4) bg-(--white) p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-bold text-(--text-primary)">
                          싸이버거
                        </h3>
                        <p className="mt-1 text-sm text-(--text-muted)">
                          450 칼로리
                        </p>
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
                        <p className="font-semibold text-(--text-primary)">
                          100 g
                        </p>
                      </div>
                      <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                        <p className="text-sm text-(--text-muted)">protein</p>
                        <p className="font-semibold text-(--text-primary)">
                          30 g
                        </p>
                      </div>
                      <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                        <p className="text-sm text-(--text-muted)">fat</p>
                        <p className="font-semibold text-(--text-primary)">
                          250 g
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>

            {/* 저녁 */}
            <div className="flex min-h-0 flex-col">
              <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3 text-center">
                <h2 className="text-2xl font-bold text-(--text-primary)">
                  저녁
                </h2>
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
                  <span className="order-5 font-semibold text-(--primary-1)">
                    총 650 kcal
                  </span>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <article className="rounded-md border border-(--neutral-4) bg-(--white) p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-(--text-primary)">
                          싸이버거
                        </h3>
                        <p className="mt-1 text-sm text-(--text-muted)">
                          450 칼로리
                        </p>
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
                        <p className="font-semibold text-(--text-primary)">
                          100 g
                        </p>
                      </div>
                      <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                        <p className="text-sm text-(--text-muted)">protein</p>
                        <p className="font-semibold text-(--text-primary)">
                          30 g
                        </p>
                      </div>
                      <div className="rounded-md bg-(--neutral-5) px-2 py-2">
                        <p className="text-sm text-(--text-muted)">fat</p>
                        <p className="font-semibold text-(--text-primary)">
                          250 g
                        </p>
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
