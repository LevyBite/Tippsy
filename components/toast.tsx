"use client"

import React, { useEffect, useRef } from "react"

export function Toast({ visible, message, actionLabel, onAction }: {
  visible: boolean
  message: string
  actionLabel?: string
  onAction?: () => void
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!visible) return
    const el = ref.current
    if (el) {
      el.animate(
        [
          { transform: "translateY(12px)", opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" }
      )
    }
  }, [visible])

  if (!visible) return null
  return (
    <div ref={ref} className="fixed left-1/2 bottom-8 z-50 -translate-x-1/2 rounded-full bg-panel-foreground/[0.06] px-4 py-2 text-sm shadow-sm">
      <div className="flex items-center gap-4">
        <div>{message}</div>
        {actionLabel && onAction && (
          <button onClick={onAction} className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
