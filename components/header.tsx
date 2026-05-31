import Link from "next/link"
import { Wheat } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { CartBadge } from "@/components/cart-badge"
import { UserMenu } from "@/components/user-menu"
import { getCurrentUser } from "@/lib/auth"

export async function Header() {
  const user = await getCurrentUser()
  const isAdmin = user?.profile?.role === "admin"

  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Wheat className="text-primary size-6" />
          <span className="text-lg font-semibold">לחם של אמא</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            render={<Link href="/menu" />}
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            התפריט
          </Button>
          {isAdmin && (
            <Button
              render={<Link href="/admin/orders" />}
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              ניהול
            </Button>
          )}
          <CartBadge />
          <UserMenu
            userEmail={user?.email ?? null}
            fullName={user?.profile?.full_name ?? ""}
            isAdmin={isAdmin}
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
