// 항상 소수 첫째 자리까지 보여요. 예: 12 → '12.0'
const numberFormatter = new Intl.NumberFormat('ko-KR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const formatNumber = (value: number) => numberFormatter.format(value);

// 소수점 없이 쉼표만 넣어요. kcal과 목표 숫자에 써요. 예: 1500.4 → '1,500'
const integerFormatter = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 });

export const formatInteger = (value: number) => integerFormatter.format(value);

// 소수 첫째 자리가 있을 때만 보여요. 영양소 g에 써요. 예: 12 → '12', 12.34 → '12.3'
const gramFormatter = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 1 });

export const formatGram = (value: number) => gramFormatter.format(value);
