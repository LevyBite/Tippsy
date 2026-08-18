"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
}

// easeOutExpo — quick to move, gentle to settle
function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function AnimatedNumber({
  value,
  duration = 600,
  className,
  prefix = "",
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const displayRef = useRef(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      fromRef.current = to
      displayRef.current = to
      setDisplay(to)
      return
    }

    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)
      const current = from + (to - from) * eased
      displayRef.current = current
      setDisplay(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
        displayRef.current = to
        setDisplay(to)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      // Always resume from the most recent live value, never a stale
      // closure — prevents jumpy restarts on rapid consecutive updates.
      fromRef.current = displayRef.current
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <span className={className}>
      {prefix}
      {formatted}
    </span>
  )
}
