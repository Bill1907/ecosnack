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
