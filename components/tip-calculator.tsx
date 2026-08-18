"use client"

import React, { useMemo, useState, useEffect, useRef } from "react"
import { Receipt, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { TipSelector } from "@/components/tip-selector"
import { PeopleCounter } from "@/components/people-counter"
import { ResultPanel } from "@/components/result-panel"
import { History as HistoryPanel } from "@/components/history"

const DEFAULT_TIP = 18
const MAX_BILL = 999999
const MAX_PEOPLE = 50
const HISTORY_KEY = "tippsy_history_v1"

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

export function TipCalculator() {
  const [bill, setBill] = useState("")
  const [tipPercent, setTipPercent] = useState(DEFAULT_TIP)
  const [customTip, setCustomTip] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [people, setPeople] = useState(1)
  const [roundUp, setRoundUp] = useState(false)

  const [history, setHistory] = useState<HistoryEntry[]>([])
  const historyRef = useRef(history)
  useEffect(() => {
    historyRef.current = history
  }, [history])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (raw) setHistory(JSON.parse(raw))
    } catch {
      // ignore malformed
    }
  }, [])

  const persistHistory = (next: HistoryEntry[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
    } catch {
      // ignore write errors
    }
  }

  const addHistory = (entry: HistoryEntry) => {
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 50)
      persistHistory(next)
      return next
    })
  }

  const deleteHistoryEntry = (id: number) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id)
      persistHistory(next)
      return next
    })
  }

  const clearHistory = () => {
    // ask for confirmation to avoid accidental data loss
    if (typeof window !== "undefined") {
      const ok = window.confirm("Clear all calculation history? This cannot be undone.")
      if (!ok) return
    }

    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch {}
    setHistory([])
  }

  const billNum = Number.parseFloat(bill) || 0
  const activeTip = isCustom ? Number.parseFloat(customTip) || 0 : tipPercent

  const {
    tipTotal,
    grandTotal,
    tipPerPerson,
    totalPerPerson,
    roundingBonus,
  } = useMemo(() => {
    const safePeople = Math.max(people, 1)
    const billPerPerson = billNum / safePeople
    const rawTipPerPerson = (billNum * (activeTip / 100)) / safePeople
    const rawTotalPerPerson = billPerPerson + rawTipPerPerson

    const finalTotalPerPerson =
      roundUp && rawTotalPerPerson > 0
        ? Math.ceil(rawTotalPerPerson)
        : rawTotalPerPerson
    const finalTipPerPerson = Math.max(
      finalTotalPerPerson - billPerPerson,
      0,
    )

    return {
      tipTotal: finalTipPerPerson * safePeople,
      grandTotal: finalTotalPerPerson * safePeople,
      tipPerPerson: finalTipPerPerson,
      totalPerPerson: finalTotalPerPerson,
      roundingBonus: finalTotalPerPerson - rawTotalPerPerson,
    }
  }, [billNum, activeTip, people, roundUp])

  // Auto-save to history when the calculated summary changes and there's a non-zero total.
  useEffect(() => {
    if (grandTotal <= 0) return
    const timeout = setTimeout(() => {
      const currentFirst = historyRef.current[0]
      const summary = `Tippsy split\nBill: $${billNum.toFixed(2)}\nTip (${activeTip}%): $${tipTotal.toFixed(2)}\nTotal: $${grandTotal.toFixed(2)}\nSplit ${people} way${people === 1 ? "" : "s"}: $${totalPerPerson.toFixed(2)} each`
      if (currentFirst?.summary !== summary) {
        const entry: HistoryEntry = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          bill: billNum,
          tipPercent: activeTip,
          people,
          tipTotal,
          grandTotal,
          totalPerPerson,
          summary,
        }
        addHistory(entry)
      }
    }, 1200)
    return () => clearTimeout(timeout)
    // We intentionally don't reference `history` here to avoid creating
    // a new timer when history changes. We compare against historyRef.current
  }, [billNum, activeTip, people, tipTotal, grandTotal, totalPerPerson])

  const stepPeople = (delta: 1 | -1) => {
    // Functional update so rapid consecutive clicks (fast taps or
    // programmatic bursts) each apply against the latest state instead of
    // a stale closure value, which would silently drop increments.
    setPeople((prev) => Math.min(MAX_PEOPLE, Math.max(1, prev + delta)))
  }

  const handlePreset = (value: number) => {
    setIsCustom(false)
    setCustomTip("")
    setTipPercent(value)
  }

  const reset = () => {
    setBill("")
    setTipPercent(DEFAULT_TIP)
    setCustomTip("")
    setIsCustom(false)
    setPeople(1)
    setRoundUp(false)
  }

  const isDirty =
    bill !== "" ||
    people !== 1 ||
    tipPercent !== DEFAULT_TIP ||
    isCustom ||
    roundUp

  const summary = `Tippsy split\nBill: $${billNum.toFixed(2)}\nTip (${activeTip}%): $${tipTotal.toFixed(2)}\nTotal: $${grandTotal.toFixed(2)}\nSplit ${people} way${people === 1 ? "" : "s"}: $${totalPerPerson.toFixed(2)} each`

  return (
    <>
      <div className="animate-rise w-full max-w-4xl overflow-hidden rounded-4xl border border-border bg-card shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]">
        <div className="grid md:grid-cols-[1fr_0.9fr]">
          {/* Inputs */}
          <div className="flex flex-col gap-7 p-6 sm:p-8 lg:p-10">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Receipt className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h1 className="text-lg font-semibold leading-none tracking-tight">
                    Tippsy
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tip &amp; bill splitter
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={reset}
                disabled={!isDirty}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  isDirty
                    ? "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    : "pointer-events-none opacity-0",
                )}
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Reset
              </button>
            </header>

            {/* Bill amount */}
            <div className="flex flex-col gap-3">
              <label
                htmlFor="bill"
                className="text-sm font-medium text-muted-foreground"
              >
                Bill amount
              </label>
              <div className="group relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl text-muted-foreground">
                  $
                </span>
                <input
                  id="bill"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={bill}
                  onChange={(e) => {
                    const v = e.target.value
                    if (
                      /^\d*\.?\d{0,2}$/.test(v) &&
                      (v === "" || Number.parseFloat(v) <= MAX_BILL)
                    ) {
                      setBill(v)
                    }
                  }}
                  className="w-full rounded-2xl border border-input bg-secondary/50 py-4 pl-9 pr-4 text-right font-mono text-2xl font-semibold tabular-nums outline-none transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <TipSelector
              tipPercent={tipPercent}
              onChange={handlePreset}
              customTip={customTip}
              onCustomChange={(v) => {
                setIsCustom(true)
                setCustomTip(v)
              }}
              isCustom={isCustom}
              onCustomFocus={() => setIsCustom(true)}
            />

            <PeopleCounter
              people={people}
              onChange={setPeople}
              onStep={stepPeople}
            />
          </div>

          <ResultPanel
            tipPerPerson={tipPerPerson}
            totalPerPerson={totalPerPerson}
            tipTotal={tipTotal}
            grandTotal={grandTotal}
            roundUp={roundUp}
            onRoundUpChange={setRoundUp}
            roundingBonus={roundingBonus}
            summary={summary}
          />
        </div>
      </div>

      <HistoryPanel entries={history} onClear={clearHistory} onDelete={deleteHistoryEntry} />
    </>
  )
}
