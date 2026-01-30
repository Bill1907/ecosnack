import { Card } from '@/components/ui/card'

export const DailyReportSkeleton = () => {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg bg-card aspect-[3/4] w-full">
      <div className="h-full flex flex-col animate-pulse">
        {/* Image Skeleton - Top 50% */}
        <div className="h-1/2 bg-gray-200 dark:bg-gray-700" />

        {/* Content Skeleton - Bottom 50% */}
        <div className="h-1/2 p-4 flex flex-col space-y-3">
          {/* Location & Author */}
          <div className="flex items-center gap-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
          </div>

          {/* Summary */}
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>

          {/* Topics */}
          <div className="flex gap-1.5 mt-auto">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
          </div>
        </div>
      </div>
    </Card>
  )
}
