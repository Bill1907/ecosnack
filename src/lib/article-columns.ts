import { articles } from '@/db/schema'
import type { Article } from '@/db/schema'

// 목록/카드용 공개 컬럼 집합
// 회원 전용 분석(impactAnalysis, relatedContext, sentiment)과 카드에서 안 쓰는 필드는 제외한다
export const articleCardColumns = {
  id: articles.id,
  title: articles.title,
  description: articles.description,
  headlineSummary: articles.headlineSummary,
  imageUrl: articles.imageUrl,
  source: articles.source,
  pubDate: articles.pubDate,
  category: articles.category,
}

// 카드 컴포넌트가 받는 좁은 기사 타입
export type ArticleCard = Pick<Article, keyof typeof articleCardColumns>
