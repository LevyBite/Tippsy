"use client"

import React from "react"

type HistoryEntry = {
  id: number
  timestamp: string
  bill: number
  tipPercent: number
  people: number
  tipTotal: number
  grandTotal: number
  totalPerPerson: number
  summary: string
}

export function History({
  entries,
  onClear,
  onDelete,
  onRequestClear,
}: {
  entries: HistoryEntry[]
  onClear: () => void
  onDelete: (id: number) => void
  // optional: request a styled modal; when provided history UI will call this
  onRequestClear?: () => void
}) {
  const fmt = (v: number) =>
    `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <section className="max-w-4xl mx-auto mt-6 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium">Calculation history</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onRequestClear) onRequestClear()
              else onClear()
            }}
            disabled={entries.length === 0}
            className="text-xs rounded-full px-3 py-1.5 transition-all disabled:opacity-50"
          >
            Clear history
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No calculations saved yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((e) => (
            <li
              key={e.id}
              className="rounded-xl border border-panel-foreground/8 bg-panel-foreground/[0.03] p-3"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">
                    {`${fmt(e.bill)} — ${e.tipPercent}% tip — ${e.people} ${e.people === 1 ? "person" : "people"}`}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(e.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="font-mono text-sm text-right flex flex-col items-end gap-1">
                  <div className="text-sm">Total: {fmt(e.grandTotal)}</div>
                  <div className="text-xs text-muted-foreground">Per person: {fmt(e.totalPerPerson)}</div>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          const ok = window.confirm("Delete this history entry?")
                          if (!ok) return
                        }
                        onDelete(e.id)
                      }}
                      className="text-xs rounded-full px-2 py-1 transition-all hover:bg-secondary/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <details className="mt-2 text-xs text-muted-foreground">
                <summary className="cursor-pointer">Summary</summary>
                <pre className="whitespace-pre-wrap mt-2 text-xs">{e.summary}</pre>
              </details>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
