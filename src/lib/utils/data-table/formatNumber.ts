export default function formatNumber(value: unknown) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(2) : "0.00";
}
