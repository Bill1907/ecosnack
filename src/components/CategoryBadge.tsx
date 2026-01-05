import type { Category } from '@/db/schema'
import { CATEGORY_INFO } from '@/lib/const'

interface CategoryBadgeProps {
  category?: string
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const info = CATEGORY_INFO[category as Category] || ''

  return (
    <span className="inline-block px-3 py-1 rounded-full transition-colors hover:opacity-80 bg-secondary text-secondary-foreground text-xs font-medium">
      {info.name || ''}
    </span>
  )
}
