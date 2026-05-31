"use client"

import { useEffect, useState } from "react"
import { Minus, Plus, Trash2, Wheat } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store/cart-store"
import { formatPrice } from "@/lib/utils/currency"

function useHasMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

export function CartItems() {
  const mounted = useHasMounted()
  const items = useCart((s) => s.items)
  const updateQuantity = useCart((s) => s.updateQuantity)
  const removeItem = useCart((s) => s.removeItem)

  if (!mounted) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        טוען...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground py-16 text-center">
        הסל ריק. <a href="/menu" className="text-primary underline">חזרה לתפריט</a>
      </div>
    )
  }

  return (
    <ul className="divide-border divide-y">
      {items.map((item) => (
        <li key={item.product_id} className="flex items-center gap-4 py-4">
          <div className="bg-muted size-16 shrink-0 overflow-hidden rounded-md">
            {item.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image_url}
                alt={item.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="bg-primary/10 text-primary flex size-full items-center justify-center">
                <Wheat className="size-6" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium">{item.name}</div>
            <div className="text-muted-foreground text-sm">
              {formatPrice(item.price)} ליחידה
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
              aria-label="הפחת כמות"
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
              aria-label="הוסף כמות"
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="w-20 text-end font-semibold">
            {formatPrice(item.price * item.quantity)}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.product_id)}
            aria-label="הסר"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}

export function CartTotal() {
  const mounted = useHasMounted()
  const totalAmount = useCart((s) => s.totalAmount())
  return (
    <div className="flex items-center justify-between border-t pt-4 text-lg font-semibold">
      <span>סה&quot;כ</span>
      <span>{mounted ? formatPrice(totalAmount) : formatPrice(0)}</span>
    </div>
  )
}
