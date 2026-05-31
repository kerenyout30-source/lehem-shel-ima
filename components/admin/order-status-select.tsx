"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { NativeSelect } from "@/components/ui/native-select"
import { updateOrderStatus } from "@/app/admin/orders/actions"
import { STATUS_LABELS_HE, STATUS_ORDER } from "@/lib/utils/status"
import type { OrderStatus } from "@/lib/types/database"

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string
  status: OrderStatus
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as OrderStatus
    if (newStatus === status) return
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(
        newStatus === "ready"
          ? "הסטטוס עודכן. נשלח מייל ללקוח."
          : "הסטטוס עודכן",
      )
      router.refresh()
    })
  }

  return (
    <NativeSelect>
      <select
        value={status}
        onChange={onChange}
        disabled={isPending}
        className="size-full appearance-none bg-transparent ps-2.5 pe-8 outline-none"
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS_HE[s]}
          </option>
        ))}
      </select>
    </NativeSelect>
  )
}
