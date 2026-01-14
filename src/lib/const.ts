import { Category } from '@/db/schema'

// 카테고리 정보 매핑
export const CATEGORY_INFO: Record<
  Category | 'all',
  { name: string; variant: string }
> = {
  all: { name: '전체', variant: 'all' },
  economy: { name: '경제', variant: 'economy' },
  finance: { name: '금융', variant: 'finance' },
  business: { name: '비즈니스', variant: 'business' },
  markets: { name: '시장', variant: 'markets' },
  policy: { name: '정책', variant: 'policy' },
  trade: { name: '무역', variant: 'trade' },
}

export const TIME_HORIZON_CONFIG = {
  short: { label: '단기 (1주)', className: 'bg-blue-100 text-blue-700' },
  medium: {
    label: '중기 (1-3개월)',
    className: 'bg-purple-100 text-purple-700',
  },
  long: { label: '장기 (1년+)', className: 'bg-green-100 text-green-700' },
} as const
