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