"use client"

import { cn } from "@/lib/utils"
import { AnimatedNumber } from "@/components/animated-number"
import { ShareButton } from "@/components/share-button"

interface ResultPanelProps {
  tipPerPerson: number
  totalPerPerson: number
  tipTotal: number
  grandTotal: number
  roundUp: boolean
  onRoundUpChange: (value: boolean) => void
  roundingBonus: number
  summary: string
}

export function ResultPanel({
  tipPerPerson,
  totalPerPerson,
  tipTotal,
  grandTotal,
  roundUp,
  onRoundUpChange,
  roundingBonus,
  summary,
}: ResultPanelProps) {
  return (
    <div className="relative flex flex-col justify-between gap-6 bg-panel p-6 text-panel-foreground sm:p-8 lg:p-10">
      <div
        className="flex flex-col gap-6"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
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
        {roundUp && roundingBonus > 0.004 && (
          <p className="animate-fade-in -mt-2 text-xs text-panel-foreground/50">
            Rounded up — an extra{" "}
            <span className="font-mono font-medium text-primary">
              ${roundingBonus.toFixed(2)}
            </span>{" "}
            goes to the tip
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
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

          <div className="mt-1 flex items-center justify-between border-t border-panel-foreground/10 pt-3">
            <label
              htmlFor="round-up"
              className="text-sm text-panel-foreground/70"
            >
              Round up per person
            </label>
            <button
              id="round-up"
              type="button"
              role="switch"
              aria-checked={roundUp}
              onClick={() => onRoundUpChange(!roundUp)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
                roundUp ? "bg-primary" : "bg-panel-foreground/15",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 size-5 rounded-full bg-panel shadow-sm transition-transform duration-200",
                  roundUp && "translate-x-5",
                )}
              />
            </button>
          </div>
        </div>

        <ShareButton summary={summary} />
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
