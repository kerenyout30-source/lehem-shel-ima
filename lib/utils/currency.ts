export function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (Number.isNaN(num)) return "₪0"
  return `₪${num.toLocaleString("he-IL", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}
