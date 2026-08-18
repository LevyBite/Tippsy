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
}: {
  entries: HistoryEntry[]
  onClear: () => void
}) {
  return (
    <section className="max-w-4xl mx-auto mt-6 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium">Calculation history</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={entries.length === 0}
          className="text-xs rounded-full px-3 py-1.5 transition-all disabled:opacity-50"
        >
          Clear history
        </button>
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
                  <div className="text-sm font-medium">{`$${e.bill.toFixed(2)} — ${e.tipPercent}% tip — ${e.people} ${e.people === 1 ? "person" : "people"}`}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(e.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="font-mono text-sm text-right">
                  <div className="text-sm">Total: ${e.grandTotal.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Per person: ${e.totalPerPerson.toFixed(2)}</div>
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
