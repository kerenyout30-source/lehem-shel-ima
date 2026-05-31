"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/lib/store/cart-store"
import { submitOrder } from "@/app/cart/actions"

type Props = {
  defaultName: string
  defaultPhone: string
  defaultEmail: string
}

export function CheckoutForm({ defaultName, defaultPhone, defaultEmail }: Props) {
  const router = useRouter()
  const items = useCart((s) => s.items)
  const clearCart = useCart((s) => s.clear)
  const [isPending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [fullName, setFullName] = useState(defaultName)
  const [phone, setPhone] = useState(defaultPhone)
  const [email, setEmail] = useState(defaultEmail)
  const [pickupDate, setPickupDate] = useState("")
  const [notes, setNotes] = useState("")

  const minDate = new Date().toISOString().split("T")[0]

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) {
      toast.error("הסל ריק")
      return
    }
    startTransition(async () => {
      const result = await submitOrder({
        items,
        customer_name: fullName,
        customer_phone: phone,
        customer_email: email,
        pickup_date: pickupDate,
        notes,
      })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      clearCart()
      toast.success(`ההזמנה נשלחה! מספר הזמנה: ${result.order_number}`)
      router.push(`/orders/${result.order_id}`)
      router.refresh()
    })
  }

  const canSubmit = mounted && items.length > 0

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">שם מלא</Label>
          <Input
            id="fullName"
            type="text"
            required
            dir="auto"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">טלפון</Label>
          <Input
            id="phone"
            type="tel"
            required
            dir="ltr"
            placeholder="050-1234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="text-start"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">אימייל</Label>
          <Input
            id="email"
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-start"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pickupDate">תאריך איסוף רצוי</Label>
          <Input
            id="pickupDate"
            type="date"
            required
            min={minDate}
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">הערות (אופציונלי)</Label>
        <Textarea
          id="notes"
          dir="auto"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="העדפות מיוחדות, אלרגיות, וכו'"
        />
      </div>
      <Button type="submit" disabled={!canSubmit || isPending} size="lg">
        {isPending ? "שולח..." : "שלח הזמנה"}
      </Button>
    </form>
  )
}
