import { Category } from '@/db/schema'
import { CATEGORY_INFO } from '@/lib/const'

interface CategoryBadgeProps {
  category: string
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const info = CATEGORY_INFO[category as Category]

  // 유효하지 않은 카테고리인 경우 null 반환
  if (!info) return null

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full transition-colors hover:opacity-80 bg-[#f0f4f8] text-[#1a1a1a]`}
      style={{ fontSize: '12px', fontWeight: '500' }}
    >
      {info.name}
    </span>
  )
}
