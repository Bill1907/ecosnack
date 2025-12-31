export function NewsCardSkeleton() {
  return (
    <div className="bg-white border border-[#e5e5e5] p-4 sm:p-6 rounded-sm">
      {/* Image Placeholder */}
      <div className="w-full h-50 bg-gray-200 rounded-sm mb-3 animate-pulse" />

      {/* Title Placeholder */}
      <div className="space-y-2 mb-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>

      {/* Summary Placeholder */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
      </div>

      {/* Meta Placeholder */}
      <div className="flex gap-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
      </div>
    </div>
  )
}
