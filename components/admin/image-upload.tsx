"use client"

import { useState, useTransition } from "react"
import { Upload, X, Wheat } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

type Props = {
  value: string | null
  onChange: (url: string | null) => void
}

export function ImageUpload({ value, onChange }: Props) {
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState(value)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("יש לבחור קובץ תמונה")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("התמונה גדולה מדי (מקסימום 5MB)")
      return
    }

    startTransition(async () => {
      const supabase = createClient()
      const ext = file.name.split(".").pop() || "jpg"
      const path = `${crypto.randomUUID()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false })
      if (upErr) {
        toast.error("העלאה נכשלה: " + upErr.message)
        return
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(path)
      setPreview(publicUrl)
      onChange(publicUrl)
      toast.success("התמונה הועלתה")
    })
  }

  function handleClear() {
    setPreview(null)
    onChange(null)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="bg-muted relative size-24 shrink-0 overflow-hidden rounded-md">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="תצוגה" className="size-full object-cover" />
        ) : (
          <div className="bg-primary/10 text-primary flex size-full items-center justify-center">
            <Wheat className="size-8" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={isPending}
          />
          <span
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-4 text-sm font-medium"
          >
            <Upload className="size-4" />
            {isPending ? "מעלה..." : preview ? "החלף תמונה" : "העלה תמונה"}
          </span>
        </label>
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-destructive hover:text-destructive"
          >
            <X className="size-4" />
            הסר תמונה
          </Button>
        )}
      </div>
    </div>
  )
}
