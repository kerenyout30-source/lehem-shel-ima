"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/admin/image-upload"
import { createProduct, updateProduct } from "@/app/admin/products/actions"
import type { Product, Category } from "@/lib/types/database"

type Props = {
  product?: Product
  categories: Category[]
}

export function ProductForm({ product, categories }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState(product?.name ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState<string>(
    product ? String(product.price) : "",
  )
  const [stock, setStock] = useState<string>(
    product?.stock ? String(product.stock) : "0",
  )
  const [categoryId, setCategoryId] = useState<string>(
    product?.category_id ?? "",
  )
  const [imageUrl, setImageUrl] = useState<string | null>(
    product?.image_url ?? null,
  )
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      category_id: categoryId || null,
      image_url: imageUrl,
      is_available: isAvailable,
    }
    if (!payload.name || Number.isNaN(payload.price)) {
      toast.error("יש למלא שם ומחיר")
      return
    }
    if (Number.isNaN(payload.stock) || payload.stock < 0) {
      toast.error("כמות המלאי חייבת להיות מספר חיובי")
      return
    }
    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, payload)
        : await createProduct(payload)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(product ? "המוצר עודכן" : "המוצר נוסף")
      router.push("/admin/products")
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label>תמונה</Label>
        <ImageUpload value={imageUrl} onChange={setImageUrl} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">שם המוצר</Label>
        <Input
          id="name"
          required
          dir="auto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">תיאור</Label>
        <Textarea
          id="description"
          dir="auto"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">מחיר (₪)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            required
            dir="ltr"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="text-start"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stock">מלאי</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            step="1"
            required
            dir="ltr"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="text-start"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">קטגוריה</Label>
          <NativeSelect className="w-full">
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="size-full appearance-none bg-transparent ps-2.5 pe-8 outline-none"
            >
              <option value="">ללא קטגוריה</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </NativeSelect>
        </div>
      </div>
      <label className="flex items-center gap-2">
        <Checkbox
          checked={isAvailable}
          onCheckedChange={(v) => setIsAvailable(Boolean(v))}
        />
        <span className="text-sm">זמין למכירה</span>
      </label>
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "שומר..." : product ? "עדכן מוצר" : "הוסף מוצר"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          ביטול
        </Button>
      </div>
    </form>
  )
}
