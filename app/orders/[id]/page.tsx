import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/orders/status-badge"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { formatPrice } from "@/lib/utils/currency"

export const dynamic = "force-dynamic"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect(`/login?next=/orders/${id}`)

  const supabase = await createClient()
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle()
  if (!order) notFound()

  const { data: items = [] } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)

  return (
    <div className="bg-background text-foreground min-h-svh">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Button
          render={<Link href="/orders" />}
          variant="ghost"
          size="sm"
          className="mb-6 -ms-2"
        >
          → חזרה להזמנות שלי
        </Button>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle className="text-2xl">
                  הזמנה{" "}
                  <span dir="ltr" className="font-mono">
                    {order.order_number}
                  </span>
                </CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">
                  נוצרה: {new Date(order.created_at).toLocaleString("he-IL")}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">תאריך איסוף</div>
                <div className="font-medium">
                  {new Date(order.pickup_date).toLocaleDateString("he-IL")}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">תשלום</div>
                <div className="font-medium">
                  {order.is_paid ? "שולם" : "טרם שולם"}
                </div>
              </div>
            </div>
            {order.notes && (
              <div className="text-sm">
                <div className="text-muted-foreground">הערות</div>
                <div className="font-medium">{order.notes}</div>
              </div>
            )}
            <Separator />
            <div className="flex flex-col gap-2">
              {items?.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    {it.product_name}{" "}
                    <span className="text-muted-foreground">× {it.quantity}</span>
                  </div>
                  <div className="font-medium">{formatPrice(it.subtotal)}</div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>סה&quot;כ</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
