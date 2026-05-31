"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { OrderStatus } from "@/lib/types/database"

async function ensureAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
  if (profile?.role !== "admin") throw new Error("Forbidden")
  return supabase
}

async function notifyCustomer(orderId: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notify-order-status`
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
      },
      body: JSON.stringify({ order_id: orderId }),
    })
  } catch (err) {
    console.error("notifyCustomer failed:", err)
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
) {
  const supabase = await ensureAdmin()
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
  if (error) return { ok: false as const, error: error.message }

  if (newStatus === "ready") {
    await notifyCustomer(orderId)
  }

  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath("/orders")
  return { ok: true as const }
}

export async function togglePaid(orderId: string, isPaid: boolean) {
  const supabase = await ensureAdmin()
  const { error } = await supabase
    .from("orders")
    .update({ is_paid: isPaid })
    .eq("id", orderId)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${orderId}`)
  return { ok: true as const }
}
