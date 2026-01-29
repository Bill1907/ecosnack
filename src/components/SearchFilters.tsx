import { useState, useEffect } from 'react'
import type { Region } from '@/db/schema'
import { Search } from 'lucide-react'
import { REGION_INFO } from '@/lib/const'

interface SearchFiltersProps {
  searchQuery: string
  selectedRegion: Region | 'all'
  onSearchChange: (query: string) => void
  onRegionChange: (region: Region | 'all') => void
}

export function SearchFilters({
  searchQuery,
  selectedRegion,
  onSearchChange,
  onRegionChange,
}: SearchFiltersProps) {
  const regions: Array<Region | 'all'> = ['all', 'KR', 'US']
  const [inputValue, setInputValue] = useState(searchQuery)

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  // Debounce: 400ms 후 검색 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        onSearchChange(inputValue)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [inputValue, searchQuery, onSearchChange])

  // Enter 키 누르면 즉시 검색
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange(inputValue)
    }
  }

  return (
    <div className="space-y-2 mb-2">
      <div className="bg-card rounded-2xl shadow-md border border-border/50 overflow-hidden">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="제목, 내용, 키워드로 검색"
            className="w-full pl-11 pr-4 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="기사 검색"
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-md border border-border/50 p-2">
        <div className="flex gap-1.5">
          {regions.map((region) => {
            const isSelected = selectedRegion === region
            const regionInfo = REGION_INFO[region]

            return (
              <button
                key={region}
                onClick={() => onRegionChange(region)}
                className={`flex-1 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
                aria-pressed={isSelected}
                aria-label={`${regionInfo.name} ${isSelected ? '선택됨' : '선택'}`}
              >
                {regionInfo.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
