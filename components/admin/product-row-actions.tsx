"use client"

import Link from "next/link"
import { useTransition } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  toggleAvailability,
  deleteProduct,
} from "@/app/admin/products/actions"

export function AvailabilityToggle({
  id,
  available,
}: {
  id: string
  available: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function onToggle(v: boolean) {
    startTransition(async () => {
      const result = await toggleAvailability(id, v)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <Checkbox
      checked={available}
      disabled={isPending}
      onCheckedChange={(v) => onToggle(Boolean(v))}
      aria-label="זמינות"
    />
  )
}

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function onDelete() {
    if (!confirm(`למחוק את "${name}"?`)) return
    startTransition(async () => {
      const result = await deleteProduct(id)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("המוצר נמחק")
      router.refresh()
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={onDelete}
      aria-label="מחק"
      className="text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="size-4" />
    </Button>
  )
}

export function EditProductButton({ id }: { id: string }) {
  return (
    <Button
      render={<Link href={`/admin/products/${id}/edit`} />}
      variant="ghost"
      size="icon"
      aria-label="ערוך"
    >
      <Pencil className="size-4" />
    </Button>
  )
}
