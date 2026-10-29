// 음식 기록 날짜는 DB의 date 컬럼과 맞추기 위해 YYYY-MM-DD 문자열로 관리한다.
// Date 타입 -> string 변환
export const toRecordDate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const parseRecordDate = (recordDate: string) => {
  const [year, month, day] = recordDate.split('-').map(Number);

  return new Date(year, month - 1, day);
};

// Date 객체와 음식 기록 날짜 문자열이 같은 날짜인지 비교한다.
export const isSameRecordDate = (recordDate: string, date: Date): boolean => {
  return recordDate === toRecordDate(date);
};

// 선택한 날짜가 속한 주를 로컬 날짜 기준 월요일~일요일로 반환한다.
// 원본 Date는 변경하지 않으며, DST 전환도 날짜 연산으로 처리한다.
export const getWeekRange = (date: Date = new Date()) => {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('유효한 날짜가 필요합니다.');
  }

  const monday = new Date(date);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

  const dates = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return toRecordDate(day);
  });

  return { startDate: dates[0], endDate: dates[6], dates };
};

