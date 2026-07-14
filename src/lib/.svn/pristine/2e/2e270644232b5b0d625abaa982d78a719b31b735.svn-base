export default function toStringAccessorFn<T extends Record<string, unknown>>(
  row: T,
  key: keyof T,
): string {
  return row[key] ? String(row[key]) : "";
}
