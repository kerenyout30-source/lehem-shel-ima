"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export function SignupForm({ next }: { next?: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
        },
      })
      if (error) {
        toast.error("הרשמה נכשלה: " + error.message)
        return
      }
      toast.success("נרשמת בהצלחה!")
      router.push(next || "/")
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fullName">שם מלא</Label>
        <Input
          id="fullName"
          type="text"
          required
          dir="auto"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">טלפון</Label>
        <Input
          id="phone"
          type="tel"
          required
          dir="ltr"
          autoComplete="tel"
          placeholder="050-1234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="text-start"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">אימייל</Label>
        <Input
          id="email"
          type="email"
          required
          dir="ltr"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-start"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">סיסמה (לפחות 6 תווים)</Label>
        <Input
          id="password"
          type="password"
          required
          dir="ltr"
          autoComplete="new-password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? "פותח חשבון..." : "פתיחת חשבון"}
      </Button>
    </form>
  )
}
