"use client"

import { Plus, Wheat } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/store/cart-store"
import { formatPrice } from "@/lib/utils/currency"
import type { Product } from "@/lib/types/database"

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)
  const isOutOfStock = (product.stock ?? 0) <= 0

  function handleAdd() {
    if (isOutOfStock) {
      toast.error("המוצר אזל מהמלאי")
      return
    }
    addItem({
      product_id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
    })
    toast.success(`${product.name} נוסף לסל`)
  }

  return (
    <Card className="flex flex-col overflow-hidden pt-0">
      <div className="bg-muted relative aspect-[4/3] w-full">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="bg-primary/10 text-primary flex size-full items-center justify-center">
            <Wheat className="size-12" />
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <div className="text-sm font-medium">אזל מהמלאי</div>
            </div>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription className="leading-relaxed">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
          <Button
            onClick={handleAdd}
            size="sm"
            className="gap-1.5"
            disabled={isOutOfStock}
            variant={isOutOfStock ? "ghost" : "default"}
          >
            <Plus className="size-4" />
            {isOutOfStock ? "אזל מהמלאי" : "הוסף לסל"}
          </Button>
        </div>
        {(product.stock ?? 0) > 0 && (
          <div className="text-muted-foreground text-xs">
            {product.stock} בעלות
          </div>
        )}
      </CardContent>
    </Card>
  )
}
