"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Check, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/admin/categories/actions"
import type { Category } from "@/lib/types/database"

export function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editSort, setEditSort] = useState(0)
  const [newName, setNewName] = useState("")

  function startEdit(c: Category) {
    setEditingId(c.id)
    setEditName(c.name)
    setEditSort(c.sort_order)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName("")
    setEditSort(0)
  }

  function saveEdit(id: string) {
    if (!editName.trim()) {
      toast.error("שם חובה")
      return
    }
    startTransition(async () => {
      const result = await updateCategory(id, { name: editName, sort_order: editSort })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("הקטגוריה עודכנה")
      cancelEdit()
      router.refresh()
    })
  }

  function addNew() {
    if (!newName.trim()) {
      toast.error("שם חובה")
      return
    }
    const maxSort = Math.max(0, ...initialCategories.map((c) => c.sort_order))
    startTransition(async () => {
      const result = await createCategory({
        name: newName,
        sort_order: maxSort + 1,
      })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("הקטגוריה נוספה")
      setNewName("")
      router.refresh()
    })
  }

  function remove(id: string, name: string) {
    if (!confirm(`למחוק את "${name}"? המוצרים בקטגוריה ישארו אבל ללא קטגוריה.`)) {
      return
    }
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("הקטגוריה נמחקה")
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {initialCategories.map((c) => (
          <li
            key={c.id}
            className="border-border bg-card flex items-center gap-2 rounded-md border p-2"
          >
            {editingId === c.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  dir="auto"
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={editSort}
                  onChange={(e) => setEditSort(parseInt(e.target.value) || 0)}
                  className="w-20 text-start"
                  dir="ltr"
                />
                <Button
                  size="icon"
                  onClick={() => saveEdit(c.id)}
                  disabled={isPending}
                  aria-label="שמור"
                >
                  <Check className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={cancelEdit}
                  aria-label="ביטול"
                >
                  <X className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => startEdit(c)}
                  className="hover:bg-accent flex-1 rounded px-2 py-1 text-start text-sm font-medium"
                >
                  {c.name}
                  <span className="text-muted-foreground ms-2 text-xs">
                    סדר: {c.sort_order}
                  </span>
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(c.id, c.name)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="מחק"
                >
                  <Trash2 className="size-4" />
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 border-t pt-3">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="קטגוריה חדשה"
          dir="auto"
          className="flex-1"
        />
        <Button onClick={addNew} disabled={isPending}>
          <Plus className="size-4" />
          הוסף
        </Button>
      </div>
    </div>
  )
}
