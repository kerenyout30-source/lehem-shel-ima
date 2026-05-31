import Link from "next/link"
import { redirect } from "next/navigation"
import { ShoppingBag, Package, Tag } from "lucide-react"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login?next=/admin/orders")
  if (user.profile?.role !== "admin") redirect("/")

  return (
    <div className="bg-background text-foreground min-h-svh">
      <Header />
      <div className="border-border/40 border-b">
        <nav className="mx-auto flex max-w-6xl gap-1 px-6 py-2">
          <Button render={<Link href="/admin/orders" />} variant="ghost" size="sm">
            <ShoppingBag className="size-4" />
            הזמנות
          </Button>
          <Button render={<Link href="/admin/products" />} variant="ghost" size="sm">
            <Package className="size-4" />
            מוצרים
          </Button>
          <Button render={<Link href="/admin/categories" />} variant="ghost" size="sm">
            <Tag className="size-4" />
            קטגוריות
          </Button>
        </nav>
      </div>
      {children}
    </div>
  )
}
