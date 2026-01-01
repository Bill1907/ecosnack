import type { Category } from '@/db/schema'
import { CATEGORY_INFO } from '@/lib/const'

interface CategoryFilterProps {
  categories: Array<string>
  selectedCategory: Category | 'all'
  onCategoryChange: (category: Category | 'all') => void
}

export function CategoryFilter({
  categories: apiCategories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  // API에서 받은 카테고리 목록에 'all' 추가
  const categories: Array<Category | 'all'> = [
    'all',
    ...apiCategories,
  ] as Array<Category | 'all'>

  return (
    <div className="mb-2 sm:mb-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex sm:justify-center overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] scroll-smooth">
      <div className="flex gap-2 sm:gap-3 min-w-max sm:min-w-0 sm:flex-wrap cursor-pointer">
        {categories.map((category) => {
          const isSelected = selectedCategory === category
          const categoryInfo = CATEGORY_INFO[category]

          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap text-sm font-medium ${
                isSelected
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-[#f5f5f5] text-[#666666] hover:bg-[#e5e5e5]'
              }`}
              aria-pressed={isSelected}
              aria-label={`${categoryInfo.name} 카테고리 ${isSelected ? '선택됨' : '선택'}`}
            >
              {categoryInfo.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
