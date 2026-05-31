"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Checkbox } from "@/components/ui/checkbox"
import { togglePaid } from "@/app/admin/orders/actions"

export function PaidCheckbox({
  orderId,
  isPaid,
}: {
  orderId: string
  isPaid: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function onChange(v: boolean) {
    startTransition(async () => {
      const result = await togglePaid(orderId, v)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <Checkbox
      checked={isPaid}
      disabled={isPending}
      onCheckedChange={(v) => onChange(Boolean(v))}
      aria-label="שולם"
    />
  )
}
