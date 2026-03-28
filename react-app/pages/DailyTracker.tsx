import React from "react";

export default function DailyTracker() {
  return (
    <>
      <section className="flex flex-col gap-4">
        {/* 상단 주간 바 */}
        <section className="rounded-md border border-(--neutral-4) bg-(--bg-section) h-20 px-4">
          <div className="grid grid-cols-7 h-full">
            
            {/* 일 (오늘 + 데이터 있음) */}
            <div className="flex flex-col items-center justify-center gap-2 border-b-2 border-(--primary-1)">
              <span className="text-sm text-(--text-primary)">일</span>
              <span className="h-2.5 w-2.5 rounded-full border border-(--text-primary) bg-(--primary-1)" />
            </div>

            {/* 월 */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-sm text-(--text-primary)">월</span>
              <span className="h-2.5 w-2.5 rounded-full border border-(--text-primary)" />
            </div>

            {/* 화 */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-sm text-(--text-primary)">화</span>
              <span className="h-2.5 w-2.5 rounded-full border border-(--text-primary)" />
            </div>

            {/* 수 */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-sm text-(--text-primary)">수</span>
              <span className="h-2.5 w-2.5 rounded-full border border-(--text-primary)" />
            </div>

            {/* 목 */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-sm text-(--text-primary)">목</span>
              <span className="h-2.5 w-2.5 rounded-full border border-(--text-primary)" />
            </div>

            {/* 금 */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-sm text-(--text-primary)">금</span>
              <span className="h-2.5 w-2.5 rounded-full border border-(--text-primary)" />
            </div>

            {/* 토 */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-sm text-(--text-primary)">토</span>
              <span className="h-2.5 w-2.5 rounded-full border border-(--text-primary)" />
            </div>

          </div>
        </section>

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
                  <form className="flex-1 flex flex-col justify-between">
                    <div className="mx-auto max-w-2xl w-full flex-1 flex flex-col justify-center">
                      <div className="grid grid-cols-8 gap-x-3 gap-y-10 items-center">
                        {/* 식사 시간 */}
                        <label className="col-span-1 text-right">식사 시간</label>
                        <div className="col-span-7 flex gap-4">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name="mealType" value="breakfast" className="accent-(--primary-1)" />
                            <span>아침</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name="mealType" value="lunch" className="accent-(--primary-1)" />
                            <span>점심</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name="mealType" value="dinner" className="accent-(--primary-1)" />
                            <span>저녁</span>
                          </label>
                        </div>

                        {/* 음식 이름 */}
                        <label htmlFor="food-name" className="col-span-1 text-right">
                          음식 이름
                        </label>
                        <input
                          id="food-name"
                          className="col-span-3 h-10 w-full border border-(--neutral-3) rounded-md px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                        />
                        <label htmlFor="food-carbs" className="col-span-1 text-right">
                          탄수화물
                        </label>
                        <input
                          id="food-carbs"
                          className="col-span-3 h-10 w-full border border-(--neutral-3) rounded-md px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                        />

                        {/* 단백질 */}
                        <label htmlFor="food-protein" className="col-span-1 text-right">
                          단백질
                        </label>
                        <input
                          id="food-protein"
                          className="col-span-3 h-10 w-full border border-(--neutral-3) rounded-md px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                        />
                        <label htmlFor="food-fat" className="col-span-1 text-right">
                          지방
                        </label>
                        <input
                          id="food-fat"
                          className="col-span-3 h-10 w-full border border-(--neutral-3) rounded-md px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                        />
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
            <div className="flex min-h-0 flex-col">
              <div className="shrink-0 border-b border-(--neutral-4) px-4 py-3 text-center">
                <h2 className="text-2xl font-bold text-(--text-primary)">아침</h2>
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
                    <div className="flex flex-row items-center justify-between gap-3">
                      {/* 텍스트 영역 (가운데 정렬 )*/}
                      <div className="flex flex-col items-center justify-center flex-1">
                        <h3 className="text-2xl font-bold text-(--text-primary) text-center">콩나물 불고기</h3>
                        <p className="mt-1 text-sm text-(--text-muted) text-center">450 칼로리</p>
                      </div>
                      {/* 버튼 영역 (오른쪽 정렬) */}
                      <div className="flex flex-col justify-end">
                        {/* 체크 */}
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-colors hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-(--primary-3)"
                        >
                          <img src="/check.svg" alt="확인" className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          <img src="/cross.svg" alt="삭제" className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-colors hover:bg-(--neutral-5) focus:outline-none focus:ring-2 focus:ring-(--primary-3)"
                        >
                          <img src="/pencil.svg" alt="수정" className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          <img src="/trash.svg" alt="삭제" className="h-3.5 w-3.5" />
                        </button>
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
