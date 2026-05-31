import { createClient } from "@/lib/supabase/server"
import type { Profile } from "@/lib/types/database"

export type AuthUser = {
  id: string
  email: string
  profile: Profile | null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  return {
    id: user.id,
    email: user.email ?? "",
    profile,
  }
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.profile?.role === "admin"
}
