import { Skeleton } from "@/components/ui/skeleton"

export default function BlogsLoading() {
  return (
    <div className="section container-app">
      <div className="text-center mb-20">
        <Skeleton className="h-12 w-80 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <Skeleton className="h-6 w-48 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-xl border border-[hsl(var(--border))] overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 rounded-xl border border-[hsl(var(--border))] p-4">
              <Skeleton className="w-32 h-24 rounded-md flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
