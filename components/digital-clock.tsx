"use client"

import { useEffect, useMemo, useState } from "react"

type Zone = { zone: string; label: string }

// Curated default zones recommended for a global audience
const DEFAULT_ZONES: Zone[] = [
  { zone: "UTC", label: "UTC" },
  { zone: "America/New_York", label: "New York" },
  { zone: "America/Los_Angeles", label: "Los Angeles" },
  { zone: "Europe/London", label: "London" },
  { zone: "Europe/Berlin", label: "Berlin" },
  { zone: "Asia/Tokyo", label: "Tokyo" },
  { zone: "Asia/Kolkata", label: "Kolkata" },
  { zone: "Australia/Sydney", label: "Sydney" },
]

const STORAGE_KEY = "tippsy:zones"
const STORAGE_SHOW_SECONDS = "tippsy:clock:showSeconds"
const STORAGE_COMPACT = "tippsy:clock:compact"

function partsForZone(dt: Date, tz: string) {
  const fmt = new Intl.DateTimeFormat(undefined, {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
  const parts = fmt.formatToParts(dt)
  const map: Record<string, string> = {}
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value
  }
  return map
}

// Compute the nominal UTC offset string like "UTC+09:00" for a zone at a given instant.
function computeOffsetString(dt: Date, tz: string) {
  try {
    const parts = partsForZone(dt, tz)
    const y = Number(parts.year)
    const m = Number(parts.month)
    const d = Number(parts.day)
    const hh = Number(parts.hour)
    const mm = Number(parts.minute)
    const ss = Number(parts.second)
    // Construct a timestamp for the zone-local wall time interpreted as UTC.
    const tzUtcMs = Date.UTC(y, m - 1, d, hh, mm, ss)
    const diffMin = Math.round((tzUtcMs - dt.getTime()) / 60000)
    const sign = diffMin >= 0 ? "+" : "-"
    const absMin = Math.abs(diffMin)
    const h = Math.floor(absMin / 60)
    const mmPart = absMin % 60
    return `UTC${sign}${String(h).padStart(2, "0")}:${String(mmPart).padStart(2, "0")}`
  } catch {
    return "UTC"
  }
}

function formatTime(dt: Date, tz: string, showSeconds: boolean) {
  return dt.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: false,
    timeZone: tz,
  })
}

function formatDate(dt: Date, tz: string) {
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: tz,
  })
}

export function DigitalClock({ columns = 2 }: { columns?: number }) {
  const [now, setNow] = useState<Date>(() => new Date())
  const [zones, setZones] = useState<Zone[]>(DEFAULT_ZONES)
  const [input, setInput] = useState("")
  const [showSeconds, setShowSeconds] = useState(true)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    // load persisted zones + settings
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Zone[]
        if (Array.isArray(parsed) && parsed.length > 0) setZones(parsed)
      }
      const s = localStorage.getItem(STORAGE_SHOW_SECONDS)
      if (s !== null) setShowSeconds(s === "true")
      const c = localStorage.getItem(STORAGE_COMPACT)
      if (c !== null) setCompact(c === "true")
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    // choose interval based on whether seconds are shown
    const interval = showSeconds ? 1000 : 5000
    const id = setInterval(() => setNow(new Date()), interval)
    return () => clearInterval(id)
  }, [showSeconds])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(zones))
      localStorage.setItem(STORAGE_SHOW_SECONDS, String(showSeconds))
      localStorage.setItem(STORAGE_COMPACT, String(compact))
    } catch {
      // ignore
    }
  }, [zones, showSeconds, compact])

  const gridCols = useMemo(() => {
    if (columns <= 1) return "grid-cols-1"
    if (columns === 2) return "grid-cols-1 sm:grid-cols-2"
    if (columns === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  }, [columns])

  const addZone = (zoneId: string) => {
    const trimmed = zoneId.trim()
    if (!trimmed) return
    // validate timezone by attempting to format
    try {
      Intl.DateTimeFormat(undefined, { timeZone: trimmed }).format(new Date())
    } catch {
      alert("Invalid timezone identifier. Use an IANA timezone like 'Europe/London'.")
      return
    }
    if (zones.find((z) => z.zone === trimmed)) {
      setInput("")
      return
    }
    setZones((prev) => [...prev, { zone: trimmed, label: trimmed }])
    setInput("")
  }

  const removeZone = (zoneId: string) => {
    setZones((prev) => prev.filter((z) => z.zone !== zoneId))
  }

  return (
    <section
      aria-label="World clocks"
      className="w-full max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">World clocks</h2>
          <p className="text-xs text-muted-foreground">Updated live</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={showSeconds}
              onChange={(e) => setShowSeconds(e.target.checked)}
              className="accent-primary"
            />
            Show seconds
          </label>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={compact}
              onChange={(e) => setCompact(e.target.checked)}
              className="accent-primary"
            />
            Compact view
          </label>
        </div>
      </header>

      <div className="mb-4 flex w-full gap-2">
        <input
          list="zone-suggestions"
          placeholder="Add timezone (e.g. Europe/London)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-lg border border-input bg-secondary/60 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <datalist id="zone-suggestions">
          {DEFAULT_ZONES.map((z) => (
            <option key={z.zone} value={z.zone}>
              {z.label}
            </option>
          ))}
        </datalist>
        <button
          type="button"
          onClick={() => addZone(input)}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          Add
        </button>
      </div>

      <div className={`grid gap-4 ${gridCols}`}>
        {zones.map((z) => (
          <div
            key={z.zone}
            className={`relative flex flex-col gap-1 rounded-xl border border-input bg-secondary/50 p-3 ${
              compact ? "py-2 px-3" : "p-3"
            }`}
          >
            <button
              type="button"
              aria-label={`Remove ${z.zone}`}
              onClick={() => removeZone(z.zone)}
              className="absolute right-3 top-3 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-panel"
            >
              Remove
            </button>

            <div className="flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className={`text-xs font-medium text-muted-foreground ${compact ? "text-xs" : "text-sm"}`}>
                  {z.label}
                </span>
                <span className="text-[11px] text-panel-foreground/60">
                  {z.zone} • {computeOffsetString(now, z.zone)}
                </span>
              </div>

              <div className="text-right">
                <div className={`font-mono ${compact ? "text-base" : "text-lg"} font-semibold tabular-nums`}>
                  {formatTime(now, z.zone, showSeconds)}
                </div>
                {!compact && (
                  <div className="text-xs text-muted-foreground">{formatDate(now, z.zone)}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Tip: add or remove timezones and your selection will be saved locally. Use the compact view for a minimal footprint.
      </p>
    </section>
  )
}
