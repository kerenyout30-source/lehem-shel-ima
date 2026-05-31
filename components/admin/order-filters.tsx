"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { STATUS_LABELS_HE, STATUS_ORDER } from "@/lib/utils/status"
import { cn } from "@/lib/utils"

export function OrderFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const status = params.get("status") ?? "all"
  const dateFrom = params.get("from") ?? ""
  const [query, setQuery] = useState(params.get("q") ?? "")

  useEffect(() => {
    setQuery(params.get("q") ?? "")
  }, [params])

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    const qs = next.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setParam("q", query.trim() || null)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <StatusButton active={status === "all"} onClick={() => setParam("status", null)}>
          הכל
        </StatusButton>
        {STATUS_ORDER.map((s) => (
          <StatusButton
            key={s}
            active={status === s}
            onClick={() => setParam("status", s)}
          >
            {STATUS_LABELS_HE[s]}
          </StatusButton>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setParam("from", e.target.value || null)}
          className="w-40"
        />
        <form onSubmit={onSearchSubmit} className="relative">
          <Search className="text-muted-foreground absolute top-1/2 start-2.5 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="שם / טלפון / מספר הזמנה"
            dir="auto"
            className="ps-9"
          />
        </form>
      </div>
    </div>
  )
}

function StatusButton({
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
