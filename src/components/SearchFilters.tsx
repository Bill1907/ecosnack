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
    <div className="mb-4 space-y-3 sm:flex sm:flex-col sm:items-center">
      {/* Search Input */}
      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="제목, 내용, 키워드로 검색"
          className="w-full px-4 py-2.5 pl-10 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          aria-label="기사 검색"
        />
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground'/>
      </div>

      {/* Region Filter */}
      <div className="flex gap-2 sm:gap-3 sm-">
        {regions.map((region) => {
          const isSelected = selectedRegion === region
          const regionInfo = REGION_INFO[region]

          return (
            <button
              key={region}
              onClick={() => onRegionChange(region)}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                  : 'bg-card border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
              aria-pressed={isSelected}
              aria-label={`${regionInfo.name} ${isSelected ? '선택됨' : '선택'}`}
            >
              <span className="mr-1.5">{regionInfo.emoji}</span>
              {regionInfo.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
