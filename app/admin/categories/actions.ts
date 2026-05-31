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

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\sא-ת]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || `cat-${Date.now()}`
}

export async function createCategory(input: { name: string; sort_order: number }) {
  const supabase = await ensureAdmin()
  const { error } = await supabase.from("categories").insert({
    name: input.name.trim(),
    slug: slugify(input.name) || `cat-${Date.now()}`,
    sort_order: input.sort_order,
  })
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/admin/categories")
  revalidatePath("/menu")
  return { ok: true as const }
}

export async function updateCategory(
  id: string,
  input: { name: string; sort_order: number },
) {
  const supabase = await ensureAdmin()
  const { error } = await supabase
    .from("categories")
    .update({ name: input.name.trim(), sort_order: input.sort_order })
    .eq("id", id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/admin/categories")
  revalidatePath("/menu")
  return { ok: true as const }
}

export async function deleteCategory(id: string) {
  const supabase = await ensureAdmin()
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/admin/categories")
  revalidatePath("/menu")
  return { ok: true as const }
}
