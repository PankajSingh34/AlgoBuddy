import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--primary-subtle))] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[hsl(var(--primary))] animate-spin" />
        </div>
        <p className="text-[hsl(var(--text-muted))] text-sm font-body">Loading&hellip;</p>
      </div>
    </div>
  )
}
