"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types/database"

export function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const current = params.get("category") ?? "all"

  function setCategory(slug: string) {
    const next = new URLSearchParams(params)
    if (slug === "all") next.delete("category")
    else next.set("category", slug)
    const qs = next.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <CategoryButton
        active={current === "all"}
        onClick={() => setCategory("all")}
      >
        הכל
      </CategoryButton>
      {categories.map((c) => (
        <CategoryButton
          key={c.id}
          active={current === c.slug}
          onClick={() => setCategory(c.slug)}
        >
          {c.name}
        </CategoryButton>
      ))}
    </div>
  )
}

function CategoryButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={cn("rounded-full", active && "shadow-sm")}
    >
      {children}
    </Button>
  )
}
