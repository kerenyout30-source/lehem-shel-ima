import type { OrderStatus } from "@/lib/types/database"

export const STATUS_LABELS_HE: Record<OrderStatus, string> = {
  new: "חדש",
  received: "התקבלה",
  ready: "מוכן לאיסוף",
  completed: "הושלמה",
}

export const STATUS_ORDER: OrderStatus[] = [
  "new",
  "received",
  "ready",
  "completed",
]

export function statusLabel(status: OrderStatus): string {
  return STATUS_LABELS_HE[status] ?? status
}

export const STATUS_VARIANTS: Record<
  OrderStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  new: "destructive",
  received: "default",
  ready: "secondary",
  completed: "outline",
}
