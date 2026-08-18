"use client"

import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

const TIP_PRESETS = [
  { value: 10, label: "Fair" },
  { value: 15, label: "Good" },
  { value: 18, label: "Great" },
  { value: 20, label: "Excellent" },
  { value: 25, label: "Generous" },
]

const MAX_TIP = 40

interface TipSelectorProps {
  tipPercent: number
  onChange: (value: number) => void
  customTip: string
  onCustomChange: (value: string) => void
  isCustom: boolean
  onCustomFocus: () => void
}

export function TipSelector({
  tipPercent,
  onChange,
  customTip,
  onCustomChange,
  isCustom,
  onCustomFocus,
}: TipSelectorProps) {
  const activeLabel = isCustom
    ? "Custom"
    : TIP_PRESETS.find((p) => p.value === tipPercent)?.label ?? "Custom"

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-muted-foreground">
          Select tip %
        </label>
        <span
          key={activeLabel}
          className="animate-fade-in text-xs font-semibold text-primary"
        >
          {activeLabel}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
        {TIP_PRESETS.map((preset) => {
          const active = !isCustom && tipPercent === preset.value
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange(preset.value)}
              aria-pressed={active}
              className={cn(
                "group flex flex-col items-center gap-0.5 rounded-xl py-2.5 transition-all duration-200 active:scale-95",
                active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              )}
            >
              <span className="font-mono text-base font-semibold tabular-nums">
                {preset.value}%
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  active
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground/70",
                )}
              >
                {preset.label}
              </span>
            </button>
          )
        })}
        <input
          aria-label="Custom tip percentage"
          inputMode="decimal"
          placeholder="Custom"
          value={customTip}
          onFocus={onCustomFocus}
          onChange={(e) => {
            const v = e.target.value
            if (/^\d*\.?\d{0,1}$/.test(v) && Number(v) <= 100) {
              onCustomChange(v)
            }
          }}
          className={cn(
            "col-span-3 rounded-xl border py-2.5 text-center font-mono text-base font-semibold tabular-nums outline-none transition-all placeholder:font-sans placeholder:text-xs placeholder:font-medium sm:col-span-5",
            isCustom
              ? "border-primary bg-card ring-4 ring-primary/15"
              : "border-transparent bg-secondary text-secondary-foreground placeholder:text-muted-foreground",
          )}
        />
      </div>

      {/* Fine-tune slider */}
      <div className="flex items-center gap-3 pt-1">
        <input
          type="range"
          min={0}
          max={MAX_TIP}
          step={1}
          value={Math.min(tipPercent, MAX_TIP)}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Fine-tune tip percentage"
          className="tip-slider flex-1"
          style={
            {
              "--slider-progress": `${(Math.min(tipPercent, MAX_TIP) / MAX_TIP) * 100}%`,
            } as CSSProperties
          }
        />
        <span className="w-11 shrink-0 text-right font-mono text-xs font-semibold tabular-nums text-muted-foreground">
          {Math.min(tipPercent, MAX_TIP)}%
        </span>
      </div>
    </div>
  )
}
