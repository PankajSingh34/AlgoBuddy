"use client"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center container-app text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[hsl(var(--danger-subtle))] flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-[hsl(var(--danger))]" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[hsl(var(--text))]">Something went wrong</h2>
        <p className="text-[hsl(var(--text-muted))] font-body max-w-sm">{error.message}</p>
        <Button onClick={reset} variant="outline">Try again</Button>
      </div>
    </div>
  )
}
