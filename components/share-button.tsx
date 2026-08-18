"use client"

import { useState } from "react"
import { Check, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareButtonProps {
  summary: string
  className?: string
}

export function ShareButton({ summary, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Tippsy split", text: summary })
        return
      }
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // user cancelled share sheet or clipboard denied — no-op
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border border-panel-foreground/15 bg-panel-foreground/[0.06] py-3 text-sm font-medium text-panel-foreground transition-all hover:bg-panel-foreground/[0.1] active:scale-[0.98]",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="size-4 text-primary" aria-hidden="true" />
          Copied to clipboard
        </>
      ) : (
        <>
          <Share2 className="size-4" aria-hidden="true" />
          Share the split
        </>
      )}
    </button>
  )
}
