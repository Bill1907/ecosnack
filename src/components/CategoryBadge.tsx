interface CategoryBadgeProps {
  category: string
  variant?: 'global' | 'local' | 'market' | 'tech' | 'policy'
}

const variantStyles = {
  global: 'bg-[#f0f4f8] text-[#1a1a1a]',
  local: 'bg-[#fef3f2] text-[#1a1a1a]',
  market: 'bg-[#f3f0ff] text-[#1a1a1a]',
  tech: 'bg-[#f0fdf4] text-[#1a1a1a]',
  policy: 'bg-[#fef9c3] text-[#1a1a1a]',
}

export function CategoryBadge({
  category,
  variant = 'global',
}: CategoryBadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full transition-colors hover:opacity-80 ${variantStyles[variant]}`}
      style={{ fontSize: '12px', fontWeight: '500' }}
    >
      {category}
    </span>
  )
}
