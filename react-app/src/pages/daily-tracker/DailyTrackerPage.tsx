import type { UserId } from '../../types/types';
import WeeklyDayBar from './components/WeeklyDayBar';
import FoodCard from '../../components/meal-board/FoodCard';
import FoodInputForm from './components/FoodInputForm';
import NutritionChart from '../../components/charts/NutritionChart';

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
            <NutritionChart />
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
