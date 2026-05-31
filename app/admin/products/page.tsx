import Link from "next/link"
import { Plus, Wheat } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AvailabilityToggle,
  DeleteProductButton,
  EditProductButton,
} from "@/components/admin/product-row-actions"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils/currency"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products = [] } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("sort_order")
    .order("created_at", { ascending: false })

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">מוצרים</h1>
          <p className="text-muted-foreground text-sm">
            {products?.length ?? 0} מוצרים בתפריט
          </p>
        </div>
        <Button render={<Link href="/admin/products/new" />}>
          <Plus className="size-4" />
          הוסף מוצר
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">תמונה</TableHead>
            <TableHead>שם</TableHead>
            <TableHead>קטגוריה</TableHead>
            <TableHead>מחיר</TableHead>
            <TableHead className="w-16 text-center">מלאי</TableHead>
            <TableHead className="w-20 text-center">זמין</TableHead>
            <TableHead className="w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="bg-muted size-12 overflow-hidden rounded">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="bg-primary/10 text-primary flex size-full items-center justify-center">
                      <Wheat className="size-5" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {(p as { categories?: { name: string } | null }).categories?.name ?? "—"}
              </TableCell>
              <TableCell>{formatPrice(p.price)}</TableCell>
              <TableCell className="text-center text-sm font-medium">
                <span className={(p.stock ?? 0) === 0 ? "text-destructive" : ""}>
                  {p.stock ?? 0}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <AvailabilityToggle id={p.id} available={p.is_available} />
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <EditProductButton id={p.id} />
                  <DeleteProductButton id={p.id} name={p.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {(!products || products.length === 0) && (
            <TableRow>
              <TableCell colSpan={7} className="text-muted-foreground text-center py-12">
                אין מוצרים עדיין
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  )
}
