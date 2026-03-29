import React from 'react'
const weekKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

type DayItem = { 
  key: string; 
  label: string; 
  dayNumber: number;
  isToday: boolean;
  hasData: boolean;
}

const WeeklyDayBar = () => {
  const today = new Date();
  const todayDay = today.getDay(); //0(일) ~ 6(토)

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - todayDay) //일요일이 며칠인지 계산

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const days = Array.from({length:7}, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)

    return {
      key: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
      label: weekDays[i],
      date: date.getDate(),
      isToday: 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth(),
      hasData: false, // todo: 데이터 연결하기
    }
  })

  return (
    
        <section className="rounded-md border border-(--neutral-4) bg-(--bg-section) h-20 px-4">
          <div className="grid grid-cols-7 h-full">
            {days.map((day, i) => {
              return (
                <div
                  key={day.key[i]}
                  className={`flex flex-col items-center justify-center gap-2 ${day.isToday ? 'border-b-2 border-(--primary-1)' : ''}`}
                >
                  <span className="text-sm text-(--text-primary)">
                    {day.label} 
                    <span className="ml-1 text-sm font-semibold text-[var(--text-primary)]">
                      ( {day.date} )    
                    </span>
                  </span>

                  <span
                    className={`h-2.5 w-2.5 rounded-full border border-(--text-primary) ${day.hasData ? 'bg-(--primary-1)' : ''}`}
                  />
                </div>
              );
            })}
          </div>
        </section>
    
  )
}

export default WeeklyDayBar