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
  const categories: Array<Category | 'all'> = [
    'all',
    ...apiCategories,
  ] as Array<Category | 'all'>

  return (
    <div className="mb-4">
      <div className="bg-card rounded-2xl shadow-md border border-border/50 p-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-1.5 min-w-max sm:min-w-0 sm:flex-wrap">
          {categories.map((category) => {
            const isSelected = selectedCategory === category
            const categoryInfo = CATEGORY_INFO[category]

            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-background text-muted-foreground hover:bg-muted'
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
    </div>
  )
}
