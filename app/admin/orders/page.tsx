import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/orders/status-badge"
import { OrderFilters } from "@/components/admin/order-filters"
import { PaidCheckbox } from "@/components/admin/paid-checkbox"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils/currency"
import type { OrderStatus } from "@/lib/types/database"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; from?: string; q?: string }>
}) {
  const { status, from, q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  const validStatuses: OrderStatus[] = ["new", "received", "ready", "completed"]
  if (status && validStatuses.includes(status as OrderStatus)) {
    query = query.eq("status", status as OrderStatus)
  }
  if (from) {
    query = query.gte("pickup_date", from)
  }
  if (q) {
    const term = q.trim()
    query = query.or(
      `customer_name.ilike.%${term}%,customer_phone.ilike.%${term}%,order_number.ilike.%${term}%`,
    )
  }

  const { data: orders = [] } = await query

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">הזמנות</h1>
        <p className="text-muted-foreground text-sm">
          {orders?.length ?? 0} הזמנות {status && status !== "all" ? "בסטטוס זה" : ""}
        </p>
      </div>

      <div className="mb-6">
        <OrderFilters />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>מס׳</TableHead>
            <TableHead>לקוח</TableHead>
            <TableHead>טלפון</TableHead>
            <TableHead>איסוף</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>סה״כ</TableHead>
            <TableHead className="text-center">שולם</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((o) => (
            <TableRow key={o.id}>
              <TableCell dir="ltr" className="text-start font-mono text-sm">
                {o.order_number}
              </TableCell>
              <TableCell>{o.customer_name}</TableCell>
              <TableCell dir="ltr" className="text-start text-sm">
                {o.customer_phone}
              </TableCell>
              <TableCell className="text-sm">
                {new Date(o.pickup_date).toLocaleDateString("he-IL")}
              </TableCell>
              <TableCell>
                <StatusBadge status={o.status} />
              </TableCell>
              <TableCell className="font-medium">
                {formatPrice(o.total_amount)}
              </TableCell>
              <TableCell className="text-center">
                <PaidCheckbox orderId={o.id} isPaid={o.is_paid} />
              </TableCell>
              <TableCell>
                <Button
                  render={<Link href={`/admin/orders/${o.id}`} />}
                  variant="outline"
                  size="sm"
                >
                  פרטים
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {(!orders || orders.length === 0) && (
            <TableRow>
              <TableCell colSpan={8} className="text-muted-foreground py-12 text-center">
                אין הזמנות תואמות
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  )
}
