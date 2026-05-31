import Link from "next/link"
import { redirect } from "next/navigation"

import { Header } from "@/components/header"
import { SignupForm } from "./signup-form"
import { getCurrentUser } from "@/lib/auth"

export default async function SignupPage({
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
          <h1 className="text-3xl font-bold tracking-tight">פתיחת חשבון</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            כמה פרטים ואתם בפנים
          </p>
        </div>
        <SignupForm next={next} />
        <p className="text-muted-foreground text-center text-sm">
          כבר יש חשבון?{" "}
          <Link
            href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="text-primary font-medium hover:underline"
          >
            התחברות
          </Link>
        </p>
      </main>
    </div>
  )
}
