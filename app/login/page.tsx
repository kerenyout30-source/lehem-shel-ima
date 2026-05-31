import Link from "next/link"
import { redirect } from "next/navigation"

import { Header } from "@/components/header"
import { LoginForm } from "./login-form"
import { getCurrentUser } from "@/lib/auth"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const user = await getCurrentUser()
  if (user) redirect(next || "/")

  return (
    <div className="bg-background text-foreground min-h-svh">
      <Header />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">ברוכים השבים</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            התחברו כדי להזמין ולעקוב אחרי ההזמנות שלכם
          </p>
        </div>
        <LoginForm next={next} />
        <p className="text-muted-foreground text-center text-sm">
          אין עדיין חשבון?{" "}
          <Link
            href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="text-primary font-medium hover:underline"
          >
            הרשמה
          </Link>
        </p>
      </main>
    </div>
  )
}
