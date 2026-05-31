import Link from "next/link"
import { notFound } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/orders/status-badge"
import { OrderStatusSelect } from "@/components/admin/order-status-select"
import { PaidCheckbox } from "@/components/admin/paid-checkbox"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils/currency"

export const dynamic = "force-dynamic"

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Button
        render={<Link href="/admin/orders" />}
        variant="ghost"
        size="sm"
        className="mb-6 -ms-2"
      >
        → חזרה להזמנות
      </Button>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
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
                <div className="text-muted-foreground">שם לקוח</div>
                <div className="font-medium">{order.customer_name}</div>
              </div>
              <div>
                <div className="text-muted-foreground">טלפון</div>
                <div dir="ltr" className="text-start font-medium">
                  {order.customer_phone}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">אימייל</div>
                <div dir="ltr" className="text-start font-medium">
                  {order.customer_email}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">תאריך איסוף</div>
                <div className="font-medium">
                  {new Date(order.pickup_date).toLocaleDateString("he-IL")}
                </div>
              </div>
            </div>
            {order.notes && (
              <div className="text-sm">
                <div className="text-muted-foreground">הערות מהלקוח</div>
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

        <Card>
          <CardHeader>
            <CardTitle>ניהול</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">סטטוס הזמנה</div>
                <p className="text-muted-foreground text-xs">
                  שינוי ל&quot;מוכן לאיסוף&quot; ישלח מייל אוטומטי ללקוח
                </p>
              </div>
              <OrderStatusSelect orderId={order.id} status={order.status} />
            </div>
            <Separator />
            <label className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">סטטוס תשלום</div>
                <p className="text-muted-foreground text-xs">סמן כשהלקוח שילם</p>
              </div>
              <PaidCheckbox orderId={order.id} isPaid={order.is_paid} />
            </label>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
