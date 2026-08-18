"use client"

import { Minus, Plus, User, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const QUICK_PICKS = [2, 3, 4, 6]
const MAX_PEOPLE = 50
const AVATAR_LIMIT = 8

interface PeopleCounterProps {
  people: number
  onChange: (value: number) => void
  onStep: (delta: 1 | -1) => void
}

export function PeopleCounter({ people, onChange, onStep }: PeopleCounterProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Users className="size-4" aria-hidden="true" />
          Number of people
        </label>
        <div
          className="flex items-center -space-x-1.5"
          aria-hidden="true"
        >
          {Array.from({ length: Math.min(people, AVATAR_LIMIT) }).map(
            (_, i) => (
              <span
                key={i}
                className="animate-pop-in flex size-5 items-center justify-center rounded-full border-2 border-card bg-accent text-accent-foreground"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <User className="size-2.5" aria-hidden="true" />
              </span>
            ),
          )}
          {people > AVATAR_LIMIT && (
            <span className="flex size-5 items-center justify-center rounded-full border-2 border-card bg-primary text-[9px] font-bold text-primary-foreground">
              +{people - AVATAR_LIMIT}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-input bg-secondary/50 p-2">
        <button
          type="button"
          aria-label="Remove person"
          onClick={() => onStep(-1)}
          disabled={people <= 1}
          className="flex size-11 items-center justify-center rounded-xl bg-card text-foreground shadow-sm transition-all hover:bg-primary hover:text-primary-foreground active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-foreground"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <div className="flex flex-col items-center">
          <span
            key={people}
            className="animate-pop-in font-mono text-2xl font-semibold tabular-nums"
          >
            {people}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {people === 1 ? "person" : "people"}
          </span>
        </div>
        <button
          type="button"
          aria-label="Add person"
          onClick={() => onStep(1)}
          disabled={people >= MAX_PEOPLE}
          className="flex size-11 items-center justify-center rounded-xl bg-card text-foreground shadow-sm transition-all hover:bg-primary hover:text-primary-foreground active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex gap-2">
        {QUICK_PICKS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={people === n}
            className={cn(
              "flex-1 rounded-lg py-1.5 font-mono text-xs font-semibold tabular-nums transition-all active:scale-95",
              people === n
                ? "bg-accent text-accent-foreground"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary",
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
