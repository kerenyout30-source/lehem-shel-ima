"use client"

import Link from "next/link"
import { LogOut, ShoppingBag, Settings, User as UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  userEmail: string | null
  fullName: string
  isAdmin: boolean
}

export function UserMenu({ userEmail, fullName, isAdmin }: Props) {
  if (!userEmail) {
    return (
      <Button render={<Link href="/login" />} variant="ghost" size="sm">
        התחברות
      </Button>
    )
  }

  const initial = (fullName || userEmail).charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/80 outline-none" aria-label="חשבון המשתמש">
        {initial}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{fullName || "משתמש"}</span>
              <span dir="ltr" className="text-muted-foreground text-xs text-start">
                {userEmail}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/orders" />}>
            <ShoppingBag className="size-4" />
            ההזמנות שלי
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem render={<Link href="/admin/orders" />}>
              <Settings className="size-4" />
              ניהול
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="w-full"
            >
              <DropdownMenuItem variant="destructive">
                <LogOut className="size-4" />
                יציאה
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
