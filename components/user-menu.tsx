"use client"

import Link from "next/link"
import { LogOut, ShoppingBag, Settings, User as UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
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
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="חשבון המשתמש">
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-semibold">
              {initial}
            </span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{fullName || "משתמש"}</span>
            <span dir="ltr" className="text-muted-foreground text-xs text-start">
              {userEmail}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
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
        <DropdownMenuSeparator />
        <form action="/logout" method="post">
          <DropdownMenuItem
            render={
              <button type="submit" className="w-full" />
            }
            variant="destructive"
          >
            <LogOut className="size-4" />
            יציאה
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
