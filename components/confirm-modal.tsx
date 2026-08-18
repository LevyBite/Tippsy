"use client"

import React from "react"
import { X } from "lucide-react"

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: {
  visible: boolean
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!visible) return null

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-medium">{title}</h3>}
            {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onCancel}
            className="rounded-full p-1 text-muted-foreground hover:bg-secondary/10"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm transition-colors hover:bg-secondary/10"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:brightness-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
