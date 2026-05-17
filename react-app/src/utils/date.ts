// 음식 기록 날짜는 DB의 date 컬럼과 맞추기 위해 YYYY-MM-DD 문자열로 관리한다.
// toISOString()은 UTC 기준이라 한국 시간 자정 근처에서 날짜가 밀릴 수 있어 로컬 날짜 기준으로 직접 포맷한다.
export const toRecordDate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// Date 객체와 음식 기록 날짜 문자열이 같은 날짜인지 비교한다.
export const isSameRecordDate = (recordDate: string, date: Date): boolean => {
  return recordDate === toRecordDate(date);
};
