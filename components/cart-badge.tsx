"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store/cart-store"

export function CartBadge() {
  const items = useCart((s) => s.items)
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const count = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0

  return (
    <Button
      render={<Link href="/cart" className="relative" />}
      variant="ghost"
      size="icon"
      aria-label="הסל שלי"
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span
          dir="ltr"
          className="bg-primary text-primary-foreground absolute -top-1 -end-1 flex size-5 items-center justify-center rounded-full text-xs font-semibold"
        >
          {count}
        </span>
      )}
    </Button>
  )
}
