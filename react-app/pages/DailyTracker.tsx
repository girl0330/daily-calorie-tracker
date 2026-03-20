export default function DailyTracker() {
    return (
        <>
            <section className="flex flex-col gap-4">
                {/* 상단 주간 바 */}
                <div className="h-20 border rounded-md bg-white p-4">
                    일 월 화 수 목 금 토
                </div>

                {/* 입력 + 영양 상태 */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md bg-white p-4 min-h-80">
                        음식 추가
                    </div>

                    <div className="border rounded-md bg-white p-4 min-h-80">
                        영양소 그래프
                    </div>
                </div>

                {/* 카드 리스트 */}
                <div className="border rounded-md bg-white p-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="border rounded-md p-4 min-h-96">
                            <h2 className="mb-4 text-xl font-bold">아침</h2>
                            카드 리스트
                        </div>

                        <div className="border rounded-md p-4 min-h-96">
                            <h2 className="mb-4 text-xl font-bold">점심</h2>
                            카드 리스트
                        </div>

                        <div className="border rounded-md p-4 min-h-96">
                            <h2 className="mb-4 text-xl font-bold">저녁</h2>
                            카드 리스트
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

