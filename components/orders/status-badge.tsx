import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/lib/types/database"
import { STATUS_LABELS_HE, STATUS_VARIANTS } from "@/lib/utils/status"

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS_HE[status]}</Badge>
  )
}
