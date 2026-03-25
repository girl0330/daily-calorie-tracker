export default function DailyTracker() {
  return (
    <>
      <section className="flex flex-col gap-4">
        {/* 상단 주간 바 */}
        <section className="h-20 rounded-md bg-(--bg-section) p-4">
          일 월 화 수 목 금 토
        </section>

        {/* 입력 + 영양 상태 */}
        <section className="grid grid-cols-2 gap-4">
          <div>
            <div className="rounded-md bg-(--bg-section) p-4 min-h-80">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-(--text-primary)">음식 추가</h2>
                <p className="mt-1 text-sm text-(--text-muted)">
                  식사 시간과 영양소를 입력해 오늘 식단을 기록하세요.
                </p>
              </div>

              <div className="mx-auto max-w-2xl w-full">
                <div className="grid grid-cols-[72px_1fr_72px_1fr] items-center gap-x-4 gap-y-3">

                  {/* 식사 시간 */}
                  <label className="text-right">식사 시간</label>
                  <div className="grid grid-cols-3 gap-2 w-full">
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

                  {/* 빈칸 (4열 맞추기용) */}
                  <div></div>
                  <div></div>

                  {/* 음식 이름 */}
                  <label htmlFor="food-name" className="text-right">
                    음식 이름
                  </label>
                  <input
                    id="food-name"
                    className="h-10 w-full border border-(--neutral-3) rounded-md px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                  />

                  {/* 탄수화물 */}
                  <label htmlFor="food-carbs" className="text-right">
                    탄수화물
                  </label>
                  <input
                    id="food-carbs"
                    className="h-10 w-full border border-(--neutral-3) rounded-md px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                  />

                  {/* 단백질 */}
                  <label htmlFor="food-protein" className="text-right">
                    단백질
                  </label>
                  <input
                    id="food-protein"
                    className="h-10 w-full border border-(--neutral-3) rounded-md px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                  />

                  {/* 지방 */}
                  <label htmlFor="food-fat" className="text-right">
                    지방
                  </label>
                  <input
                    id="food-fat"
                    className="h-10 w-full border border-(--neutral-3) rounded-md px-3 outline-none focus:border-(--primary-1) focus:ring-2 focus:ring-(--primary-3)"
                  />

                  {/* 버튼 */}{/* 빈칸 (4열 맞추기용) */}
                  <div></div>
                  <button className="h-10 rounded-md bg-(--primary-1) text-white col-span-3">
                    저장
                  </button>

                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-(--bg-section) min-h-80">
            영양소 그래프
          </div>
        </section>

        {/* 카드 리스트 */}
        <section className="rounded-md bg-(--bg-section)">
          <div className="grid grid-cols-3 gap-1">
            <div className="border-r border-(--primary-1) p-4 min-h-96">
              <h2 className="mb-4 text-xl font-bold">아침</h2>
              카드 리스트
            </div>
            <div className=" p-4 min-h-96">
              <h2 className="mb-4 text-xl font-bold">점심</h2>
              카드 리스트
            </div>
            <div className="border-l border-(--primary-1) p-4 min-h-96">
              <h2 className="mb-4 text-xl font-bold">저녁</h2>
              카드 리스트
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
