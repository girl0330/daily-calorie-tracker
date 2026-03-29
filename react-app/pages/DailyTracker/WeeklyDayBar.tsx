import React from 'react'

const WeeklyDayBar = () => {
  const days = [
    { label: 'sun', isToday: false, hasData: false },
    { label: 'mon', isToday: false, hasData: false },
    { label: 'tue', isToday: false, hasData: false },
    { label: 'wed', isToday: true, hasData: true },
    { label: 'thu', isToday: false, hasData: false },
    { label: 'fri', isToday: false, hasData: false },
    { label: 'sat', isToday: false, hasData: false },
  ]


  return (
    
        <section className="rounded-md border border-(--neutral-4) bg-(--bg-section) h-20 px-4">
          <div className="grid grid-cols-7 h-full">
            {days.map((day) => {
              return (
                <div
                  key={day.label}
                  className={`flex flex-col items-center justify-center gap-2 ${day.isToday ? 'border-b-2 border-(--primary-1)' : ''}`}
                >
                  <span className="text-sm text-(--text-primary)">
                    {day.label}
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