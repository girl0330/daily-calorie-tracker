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
                    <div className="rounded-md bg-(--bg-section) p-4 min-h-80">
                        음식추가
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
    )
}

