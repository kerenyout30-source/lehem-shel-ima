import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/admin/product-form"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories = [] } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>מוצר חדש</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm categories={categories ?? []} />
        </CardContent>
      </Card>
    </main>
  )
}
