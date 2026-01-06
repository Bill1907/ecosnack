import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  jsonb,
  integer,
  unique,
} from 'drizzle-orm/pg-core'
import { z } from 'zod'

// ============================================
// 뉴스 분석 결과 Zod 스키마
// ============================================

// So What 분석
export const SoWhatSchema = z.object({
  main_point: z.string().describe('이 뉴스가 중요한 이유 (3-4문장)'),
  market_signal: z
    .string()
    .describe('시장에 주는 시그널 (긍정/부정/중립 + 근거)'),
  time_horizon: z
    .enum(['short', 'medium', 'long'])
    .describe('단기(1주)/중기(1-3개월)/장기(1년+) 영향 구분'),
})

// 투자자 영향 분석
export const InvestorImpactSchema = z.object({
  summary: z.string().describe('투자자에게 미치는 영향 요약'),
  action_items: z.array(z.string()).describe('구체적 대응 방안'),
  sectors_affected: z.array(z.string()).describe('영향받는 섹터/종목'),
})

// 직장인/노동자 영향 분석
export const WorkerImpactSchema = z.object({
  summary: z.string().describe('직장인/노동자에게 미치는 영향'),
  industries_affected: z.array(z.string()).describe('영향받는 산업군'),
  job_outlook: z.string().describe('고용 전망 변화'),
})

// 소비자 영향 분석
export const ConsumerImpactSchema = z.object({
  summary: z.string().describe('소비자에게 미치는 영향'),
  price_impact: z.string().describe('물가/생활비 영향'),
  spending_advice: z.string().describe('소비 관련 조언'),
})

// 전체 영향 분석
export const ImpactAnalysisSchema = z.object({
  investors: InvestorImpactSchema,
  workers: WorkerImpactSchema,
  consumers: ConsumerImpactSchema,
})

// 관련 컨텍스트
export const RelatedContextSchema = z.object({
  background: z.string().describe('이 뉴스의 배경/맥락 설명'),
  related_events: z.array(z.string()).describe('연관된 최근 이슈들'),
  what_to_watch: z.string().describe('앞으로 주목할 후속 이벤트'),
})

// 감성 분석
export const SentimentSchema = z.object({
  overall: z
    .enum(['positive', 'negative', 'neutral', 'mixed'])
    .describe('전반적 감성'),
  confidence: z.number().min(0).max(1).describe('신뢰도 (0.0-1.0)'),
})

// 카테고리
export const CategorySchema = z
  .enum(['economy', 'finance', 'business', 'markets', 'policy', 'trade'])
  .describe('뉴스 카테고리')

// ============================================
// 전체 분석 결과 스키마
// ============================================

export const NewsAnalysisResultSchema = z.object({
  headline_summary: z.string().describe('1문장으로 핵심 요약'),
  so_what: SoWhatSchema,
  impact_analysis: ImpactAnalysisSchema,
  related_context: RelatedContextSchema,
  keywords: z.array(z.string()).min(3).max(7).describe('핵심 키워드 3-7개'),
  category: CategorySchema,
  sentiment: SentimentSchema,
  importance_score: z
    .number()
    .int()
    .min(1)
    .max(10)
    .describe('중요도 점수 (1-10)'),
})

// 타입 추출
export type SoWhat = z.infer<typeof SoWhatSchema>
export type InvestorImpact = z.infer<typeof InvestorImpactSchema>
export type WorkerImpact = z.infer<typeof WorkerImpactSchema>
export type ConsumerImpact = z.infer<typeof ConsumerImpactSchema>
export type ImpactAnalysis = z.infer<typeof ImpactAnalysisSchema>
export type RelatedContext = z.infer<typeof RelatedContextSchema>
export type Sentiment = z.infer<typeof SentimentSchema>
export type Category = z.infer<typeof CategorySchema>
export type NewsAnalysisResult = z.infer<typeof NewsAnalysisResultSchema>

// Articles 테이블 스키마
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),

  // 기본 정보
  title: text('title').notNull(),
  link: text('link').unique().notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  pubDate: timestamp('pub_date', { withTimezone: true }),
  source: varchar('source', { length: 100 }),
  region: varchar('region', { length: 10 }),

  // AI 분석 결과
  headlineSummary: text('headline_summary'),
  soWhat: jsonb('so_what').$type<SoWhat>(),
  impactAnalysis: jsonb('impact_analysis').$type<ImpactAnalysis>(),
  relatedContext: jsonb('related_context').$type<RelatedContext>(),

  // 메타데이터
  keywords: text('keywords').array(),
  category: varchar('category', { length: 50 }),
  sentiment: jsonb('sentiment').$type<Sentiment>(),
  importanceScore: integer('importance_score'),

  // 시스템
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// 타입 추론
export type Article = typeof articles.$inferSelect
export type NewArticle = typeof articles.$inferInsert

// 카테고리 통계 Materialized View
export const categoryStats = pgTable('category_stats', {
  category: varchar('category', { length: 50 }).primaryKey(),
  articleCount: integer('article_count').notNull(),
  latestArticle: timestamp('latest_article', { withTimezone: true }),
})

export type CategoryStat = typeof categoryStats.$inferSelect

// ============================================
// Users 테이블 (Clerk 사용자 동기화)
// ============================================

export const users = pgTable('users', {
  clerkId: varchar('clerk_id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }),
  name: varchar('name', { length: 255 }),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

// ============================================
// Bookmarks 테이블 (사용자-기사 북마크)
// ============================================

export const bookmarks = pgTable(
  'bookmarks',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.clerkId, { onDelete: 'cascade' }),
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [unique().on(table.userId, table.articleId)]
)

export type Bookmark = typeof bookmarks.$inferSelect
export type NewBookmark = typeof bookmarks.$inferInsert
