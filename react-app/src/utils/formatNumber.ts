const numberFormatter = new Intl.NumberFormat('ko-KR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const formatNumber = (value: number) => numberFormatter.format(value);
