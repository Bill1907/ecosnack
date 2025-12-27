import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  jsonb,
  integer,
} from 'drizzle-orm/pg-core'

// JSONB 타입 정의
export type SoWhat = {
  summary: string
  implications: string[]
}

export type ImpactAnalysis = {
  environmental: string
  economic: string
  social: string
}

export type RelatedContext = {
  background: string
  relatedTopics: string[]
}

export type Sentiment = {
  score: number
  label: 'positive' | 'negative' | 'neutral'
}

// Articles 테이블 스키마
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),

  // 기본 정보
  title: text('title').notNull(),
  link: text('link').unique().notNull(),
  description: text('description'),
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
