import { articles } from '@/db/schema'
import type { Article } from '@/db/schema'

// 목록/카드용 공개 컬럼 집합
// 카드에서 안 쓰는 무거운 분석 필드(impactAnalysis, relatedContext, sentiment 등)는 제외한다
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
