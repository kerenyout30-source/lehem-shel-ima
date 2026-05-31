import { Header } from "@/components/header"
import { ProductCard } from "@/components/menu/product-card"
import { CategoryFilter } from "@/components/menu/category-filter"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  const { data: categories = [] } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")

  let productsQuery = supabase
    .from("products")
    .select("*, categories(slug)")
    .eq("is_available", true)
    .order("sort_order")

  if (category) {
    const cat = (categories ?? []).find((c) => c.slug === category)
    if (cat) productsQuery = productsQuery.eq("category_id", cat.id)
  }

  const { data: products = [] } = await productsQuery

  return (
    <div className="bg-background text-foreground min-h-svh">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            התפריט שלנו
          </h1>
          <p className="text-muted-foreground mt-3">
            כל מה שאופים השבוע. מוסיפים לסל, ורונית תכין הכל ליום האיסוף שלכם.
          </p>
        </div>
        <div className="mb-10">
          <CategoryFilter categories={categories ?? []} />
        </div>
        {!products || products.length === 0 ? (
          <div className="text-muted-foreground py-16 text-center">
            אין מוצרים בקטגוריה הזו כרגע
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
