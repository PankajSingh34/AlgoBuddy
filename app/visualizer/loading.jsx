import { Skeleton } from "@/components/ui/skeleton"

export default function VisualizerLoading() {
  return (
    <div className="section container-app">
      <div className="text-center mb-14">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-64 mx-auto" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-[hsl(var(--border))] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface-muted))]">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-20 ml-2" />
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-9 w-36 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
