"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

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

export async function createProduct(input: {
  name: string
  description: string
  price: number
  stock: number
  category_id: string | null
  image_url: string | null
  is_available: boolean
}) {
  const supabase = await ensureAdmin()
  const { error } = await supabase.from("products").insert(input)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/admin/products")
  revalidatePath("/menu")
  return { ok: true as const }
}

export async function updateProduct(
  id: string,
  input: {
    name: string
    description: string
    price: number
    stock: number
    category_id: string | null
    image_url: string | null
    is_available: boolean
  },
) {
  const supabase = await ensureAdmin()
  const { error } = await supabase.from("products").update(input).eq("id", id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/admin/products")
  revalidatePath("/menu")
  return { ok: true as const }
}

export async function deleteProduct(id: string) {
  const supabase = await ensureAdmin()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/admin/products")
  revalidatePath("/menu")
  return { ok: true as const }
}

export async function toggleAvailability(id: string, is_available: boolean) {
  const supabase = await ensureAdmin()
  const { error } = await supabase
    .from("products")
    .update({ is_available })
    .eq("id", id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/admin/products")
  revalidatePath("/menu")
  return { ok: true as const }
}
