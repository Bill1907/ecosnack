import { Category } from '@/db/schema'
import { CATEGORY_INFO } from '@/lib/const'

interface CategoryBadgeProps {
  category: string
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full transition-colors hover:opacity-80 bg-[#f0f4f8] text-[#1a1a1a]`}
      style={{ fontSize: '12px', fontWeight: '500' }}
    >
      {CATEGORY_INFO[category as Category].name}
    </span>
  )
}
