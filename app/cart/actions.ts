"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import type { CartItem } from "@/lib/store/cart-store"

export type SubmitOrderInput = {
  items: CartItem[]
  customer_name: string
  customer_phone: string
  customer_email: string
  pickup_date: string
  notes: string
}

export type SubmitOrderResult =
  | { ok: true; order_id: string; order_number: string }
  | { ok: false; error: string }

export async function submitOrder(
  input: SubmitOrderInput,
): Promise<SubmitOrderResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!input.items.length) return { ok: false, error: "הסל ריק" }

  // Verify stock availability for all items
  const { data: products, error: productsErr } = await supabase
    .from("products")
    .select("id, name, stock")
    .in("id", input.items.map((i) => i.product_id))

  if (productsErr) {
    return { ok: false, error: "שגיאה בבדיקת המלאי" }
  }

  for (const item of input.items) {
    const product = products?.find((p) => p.id === item.product_id)
    if (!product) {
      return { ok: false, error: `המוצר "${item.name}" לא נמצא` }
    }
    if ((product.stock ?? 0) < item.quantity) {
      return {
        ok: false,
        error: `אין מספיק מלאי של "${product.name}" (זמין: ${product.stock ?? 0}, בקשת: ${item.quantity})`,
      }
    }
  }

  const total = input.items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0,
  )

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      customer_id: user?.id ?? null,
      customer_name: input.customer_name.trim(),
      customer_phone: input.customer_phone.trim(),
      customer_email: input.customer_email.trim(),
      pickup_date: input.pickup_date,
      notes: input.notes.trim(),
      total_amount: total,
    })
    .select("id, order_number")
    .single()

  if (orderErr || !order) {
    return { ok: false, error: orderErr?.message ?? "שגיאה ביצירת הזמנה" }
  }

  const items = input.items.map((i) => ({
    order_id: order.id,
    product_id: i.product_id,
    product_name: i.name,
    product_price: i.price,
    quantity: i.quantity,
    subtotal: Number(i.price) * i.quantity,
  }))

  const { error: itemsErr } = await supabase.from("order_items").insert(items)
  if (itemsErr) {
    await supabase.from("orders").delete().eq("id", order.id)
    return { ok: false, error: itemsErr.message }
  }

  // Decrease stock for each product
  for (const item of input.items) {
    const product = products?.find((p) => p.id === item.product_id)
    if (product) {
      const newStock = Math.max(0, (product.stock ?? 0) - item.quantity)
      await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", item.product_id)
    }
  }

  revalidatePath("/orders")
  revalidatePath("/admin/orders")
  revalidatePath("/menu")
  return { ok: true, order_id: order.id, order_number: order.order_number }
}
