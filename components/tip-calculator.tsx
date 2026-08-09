"use client"

import { useMemo, useState } from "react"
import { Minus, Plus, Receipt, Users, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedNumber } from "@/components/animated-number"

const TIP_PRESETS = [10, 15, 18, 20, 25]

export function TipCalculator() {
  const [bill, setBill] = useState("")
  const [tipPercent, setTipPercent] = useState(18)
  const [customTip, setCustomTip] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [people, setPeople] = useState(1)

  const billNum = Number.parseFloat(bill) || 0
  const activeTip = isCustom ? Number.parseFloat(customTip) || 0 : tipPercent

  const { tipTotal, grandTotal, tipPerPerson, totalPerPerson } = useMemo(() => {
    const safePeople = Math.max(people, 1)
    const tip = billNum * (activeTip / 100)
    const total = billNum + tip
    return {
      tipTotal: tip,
      grandTotal: total,
      tipPerPerson: tip / safePeople,
      totalPerPerson: total / safePeople,
    }
  }, [billNum, activeTip, people])

  const handlePreset = (value: number) => {
    setIsCustom(false)
    setCustomTip("")
    setTipPercent(value)
  }

  const reset = () => {
    setBill("")
    setTipPercent(18)
    setCustomTip("")
    setIsCustom(false)
    setPeople(1)
  }

  const isDirty = bill !== "" || people !== 1 || tipPercent !== 18 || isCustom

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-4xl border border-border bg-card shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]">
      <div className="grid md:grid-cols-[1fr_0.9fr]">
        {/* Inputs */}
        <div className="flex flex-col gap-8 p-6 sm:p-8 lg:p-10">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Receipt className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-lg font-semibold leading-none tracking-tight">
                  Split
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
                  if (/^\d*\.?\d{0,2}$/.test(v)) setBill(v)
                }}
                className="w-full rounded-2xl border border-input bg-secondary/50 py-4 pl-9 pr-4 text-right font-mono text-2xl font-semibold tabular-nums outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/15"
              />
            </div>
          </div>

          {/* Tip percentage */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-muted-foreground">
              Select tip %
            </label>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              {TIP_PRESETS.map((preset) => {
                const active = !isCustom && tipPercent === preset
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePreset(preset)}
                    className={cn(
                      "rounded-xl py-3 font-mono text-base font-semibold tabular-nums transition-all duration-200 active:scale-95",
                      active
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-secondary text-secondary-foreground hover:bg-accent",
                    )}
                  >
                    {preset}%
                  </button>
                )
              })}
              <input
                aria-label="Custom tip percentage"
                inputMode="decimal"
                placeholder="Custom"
                value={customTip}
                onFocus={() => setIsCustom(true)}
                onChange={(e) => {
                  const v = e.target.value
                  if (/^\d*\.?\d{0,1}$/.test(v) && Number(v) <= 100) {
                    setIsCustom(true)
                    setCustomTip(v)
                  }
                }}
                className={cn(
                  "col-span-3 rounded-xl border py-3 text-center font-mono text-base font-semibold tabular-nums outline-none transition-all placeholder:font-sans placeholder:text-sm placeholder:font-normal sm:col-span-6",
                  isCustom
                    ? "border-primary bg-card ring-4 ring-primary/15"
                    : "border-transparent bg-secondary text-secondary-foreground placeholder:text-muted-foreground",
                )}
              />
            </div>
          </div>

          {/* Number of people */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Users className="size-4" aria-hidden="true" />
              Number of people
            </label>
            <div className="flex items-center justify-between rounded-2xl border border-input bg-secondary/50 p-2">
              <button
                type="button"
                aria-label="Remove person"
                onClick={() => setPeople((p) => Math.max(1, p - 1))}
                disabled={people <= 1}
                className="flex size-11 items-center justify-center rounded-xl bg-card text-foreground shadow-sm transition-all hover:bg-primary hover:text-primary-foreground active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-foreground"
              >
                <Minus className="size-4" aria-hidden="true" />
              </button>
              <div className="flex flex-col items-center">
                <span className="font-mono text-2xl font-semibold tabular-nums">
                  {people}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {people === 1 ? "person" : "people"}
                </span>
              </div>
              <button
                type="button"
                aria-label="Add person"
                onClick={() => setPeople((p) => Math.min(50, p + 1))}
                disabled={people >= 50}
                className="flex size-11 items-center justify-center rounded-xl bg-card text-foreground shadow-sm transition-all hover:bg-primary hover:text-primary-foreground active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Results panel */}
        <div className="relative flex flex-col justify-between gap-8 bg-panel p-6 text-panel-foreground sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6">
            <ResultRow
              label="Tip amount"
              sublabel="per person"
              value={tipPerPerson}
            />
            <div className="h-px bg-panel-foreground/10" />
            <ResultRow
              label="Total"
              sublabel="per person"
              value={totalPerPerson}
              emphasize
            />
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-panel-foreground/[0.06] p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-panel-foreground/60">Total tip</span>
              <span className="font-mono font-medium tabular-nums">
                <AnimatedNumber value={tipTotal} prefix="$" />
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-panel-foreground/60">Total bill</span>
              <span className="font-mono font-medium tabular-nums">
                <AnimatedNumber value={grandTotal} prefix="$" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultRow({
  label,
  sublabel,
  value,
  emphasize = false,
}: {
  label: string
  sublabel: string
  value: number
  emphasize?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <span
          className={cn(
            "font-medium",
            emphasize ? "text-base" : "text-sm text-panel-foreground/80",
          )}
        >
          {label}
        </span>
        <span className="text-xs text-panel-foreground/50">{sublabel}</span>
      </div>
      <AnimatedNumber
        value={value}
        prefix="$"
        className={cn(
          "font-mono font-bold tabular-nums text-primary tracking-tight",
          emphasize ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
        )}
      />
    </div>
  )
}
