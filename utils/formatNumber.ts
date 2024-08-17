export  function formatNumber(number: number, locale = "en-US") {
  if (number >= 1000000000) {
    number = number / 1000000000;
    return `${new Intl.NumberFormat(locale).format(number)}B`;
  }
  else if (number >= 1000000) {
    number = number / 1000000;
    return `${new Intl.NumberFormat(locale).format(number)}M`;
  }
  else if (number >= 1000) {
    number = number / 1000;
    return `${new Intl.NumberFormat(locale).format(number)}K`;
  }
  else {
    return new Intl.NumberFormat(locale).format(number);
  }
}

// utils/formatNumber.ts
// utils/formatNumber.ts
export const formatNumberWithCommas = (number: number): string => {
  const roundedNumber = Math.round(number);
  return new Intl.NumberFormat('en-US').format(roundedNumber);
};