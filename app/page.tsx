import { TipCalculator } from "@/components/tip-calculator"
import { DigitalClock } from "@/components/digital-clock"

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-4 py-10">
      <TipCalculator />
      <DigitalClock />
      <p className="text-center text-xs text-muted-foreground">
        Enter a bill, pick a tip, and split it evenly — round up and share in
        one tap.
      </p>
    </main>
  )
}
