export function SkeletonCard() {
  return (
    <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-3.5">
      <div className="aspect-[4/3] w-full animate-pulse rounded-[6px] bg-[#EEF0F4]" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-1/3 animate-pulse rounded-[4px] bg-[#EEF0F4]" />
        <div className="h-4 w-5/6 animate-pulse rounded-[4px] bg-[#EEF0F4]" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-24 animate-pulse rounded-[4px] bg-[#EEF0F4]" />
          <div className="h-8 w-20 animate-pulse rounded-[6px] bg-[#EEF0F4]" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
      aria-label="Loading products"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}
