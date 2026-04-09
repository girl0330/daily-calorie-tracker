const NutritionChart = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full min-h-80 flex-1 flex-col rounded-md border border-(--neutral-4) bg-(--bg-section) p-4">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-(--text-primary)">영양소 그래프</h2>
          <p className="mt-1 text-sm text-(--text-muted)">오늘 영양소 그래프를 확인해 보세요.</p>
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
                  <span className="mb-1 text-xs text-(--text-secondary)">120g</span>
                  <div className="w-10 rounded-t-md bg-(--chart-carb)" style={{ height: '60%' }} />
                  <span className="mt-2 text-xs font-medium text-(--text-primary)">탄수</span>
                </div>

                {/* Protein */}
                <div className="flex flex-col items-center justify-end">
                  <span className="mb-1 text-xs text-(--text-secondary)">80g</span>
                  <div className="w-10 rounded-t-md bg-(--chart-protein)" style={{ height: '85%' }} />
                  <span className="mt-2 text-xs font-medium text-(--text-primary)">단백질</span>
                </div>

                {/* Fat */}
                <div className="flex flex-col items-center justify-end">
                  <span className="mb-1 text-xs text-(--text-secondary)">40g</span>
                  <div className="w-10 rounded-t-md bg-(--chart-fat)" style={{ height: '35%' }} />
                  <span className="mt-2 text-xs font-medium text-(--text-primary)">지방</span>
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
  );
};

export default NutritionChart;
