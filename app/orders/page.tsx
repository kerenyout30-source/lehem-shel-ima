import Link from "next/link"
import { redirect } from "next/navigation"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/orders/status-badge"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { formatPrice } from "@/lib/utils/currency"

export const dynamic = "force-dynamic"

export default async function MyOrdersPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login?next=/orders")

  const supabase = await createClient()
  const { data: orders = [] } = await supabase
    .from("orders")
    .select("id, order_number, status, total_amount, pickup_date, created_at, is_paid")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="bg-background text-foreground min-h-svh">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">ההזמנות שלי</h1>
        {!orders || orders.length === 0 ? (
          <div className="text-muted-foreground py-16 text-center">
            עדיין לא הזמנת. <Link href="/menu" className="text-primary underline">לתפריט</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((o) => (
              <Card key={o.id}>
                <CardContent className="flex items-center justify-between gap-4 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span dir="ltr" className="font-mono text-sm font-semibold">
                        {o.order_number}
                      </span>
                      <StatusBadge status={o.status} />
                      {o.is_paid && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">
                          שולם
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      איסוף: {new Date(o.pickup_date).toLocaleDateString("he-IL")} · {formatPrice(o.total_amount)}
                    </div>
                  </div>
                  <Button
                    render={<Link href={`/orders/${o.id}`} />}
                    variant="outline"
                    size="sm"
                  >
                    פרטים
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
