import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Article } from '../db/schema'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 카테고리를 categoryVariant로 매핑하는 헬퍼 함수
export function getCategoryVariant(
  category: string | null,
): 'global' | 'local' | 'market' | 'tech' | 'policy' {
  const categoryMap: Record<
    string,
    'global' | 'local' | 'market' | 'tech' | 'policy'
  > = {
    '글로벌 경제': 'global',
    '한국 경제': 'local',
    '시장 동향': 'market',
    기술: 'tech',
    정책: 'policy',
  }
  return categoryMap[category || ''] || 'global'
}

// 날짜를 상대적 시간으로 변환하는 헬퍼 함수
export function formatRelativeTime(date: Date | null): string {
  if (!date) return '방금 전'

  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) return '방금 전'
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`
  return date.toLocaleDateString('ko-KR')
}

// 읽기 시간 계산 (대략적으로 텍스트 길이 기반)
export function calculateReadTime(article: Article): string {
  const textLength =
    (article.description || '') + (article.headlineSummary || '')
  const minutes = Math.max(1, Math.ceil(textLength.length / 500)) // 대략 500자당 1분
  return `${minutes}분`
}
