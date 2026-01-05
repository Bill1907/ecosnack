import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Article } from '../db/schema'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function getOptimizedImageUrl(
  url: string,
  width?: number,
  quality: number = 80,
): string {
  if (!url) return ''
  // 로컬 이미지나 이미 최적화된 URL은 건너뛰기
  if (url.startsWith('/') || url.includes('wsrv.nl')) return url

  // wsrv.nl 이미지 프록시 사용 (무료, 오픈소스)
  // WebP 포맷 변환, 리사이징, 압축 적용
  const params = new URLSearchParams()
  params.append('url', url)
  params.append('output', 'webp')
  params.append('q', quality.toString())
  if (width) params.append('w', width.toString())

  return `https://wsrv.nl/?${params.toString()}`
}
