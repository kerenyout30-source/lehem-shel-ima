import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle } from "lucide-react"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/orders/status-badge"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { formatPrice } from "@/lib/utils/currency"

export const dynamic = "force-dynamic"

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  const supabase = await createClient()

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (!order) notFound()

  // Check authorization: order must belong to logged-in user or be a guest order
  if (order.customer_id && order.customer_id !== user?.id) {
    notFound()
  }

  const { data: items = [] } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)

  return (
    <div className="bg-background text-foreground min-h-svh">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
            <CheckCircle className="size-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ההזמנה אושרה!</h1>
            <p className="text-muted-foreground mt-2">תודה שהזמנת ממאפיית לחם של אמא</p>
          </div>
        </div>

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
                    {new Date(order.created_at).toLocaleString("he-IL")}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">שם</div>
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
                  <div dir="ltr" className="text-start font-medium text-sm">
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
                <span>סה"כ</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מה הלאה?</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="text-sm text-muted-foreground">
                <p>
                  קיבלנו את ההזמנה שלך! נשלח לך דוא"ל בכתובת {order.customer_email} עם
                  פרטי ההזמנה.
                </p>
                <p className="mt-2">
                  נעדכן אותך כשההזמנה תהיה מוכנה לאיסוף.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {!user && (
                  <>
                    <div className="text-sm font-medium">רוצה לעקוב אחרי ההזמנות שלך?</div>
                    <Button render={<Link href="/login" />} size="sm">
                      התחברות לחשבון
                    </Button>
                    <p className="text-muted-foreground text-xs">
                      או{" "}
                      <Link href="/signup" className="text-primary underline">
                        צור חשבון חדש
                      </Link>
                    </p>
                  </>
                )}
                <Button render={<Link href="/menu" />} variant="outline">
                  חזור לתפריט
                </Button>
                {user && (
                  <Button render={<Link href="/orders" />} variant="outline">
                    ההזמנות שלי
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
