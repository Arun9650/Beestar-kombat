// utils/formatNumber.js

export function formatNumber(num: number) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(3) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(3) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(3) + 'k';
  }
  return num.toFixed(3);
}
  