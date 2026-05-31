import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryManager } from "@/components/admin/category-manager"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories = [] } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">קטגוריות</h1>
        <p className="text-muted-foreground text-sm">ארגון התפריט לפי סוגים</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>כל הקטגוריות</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryManager initialCategories={categories ?? []} />
        </CardContent>
      </Card>
    </main>
  )
}
