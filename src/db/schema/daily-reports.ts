import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  integer,
  date,
  doublePrecision,
} from 'drizzle-orm/pg-core'
import { z } from 'zod'

// ============================================
// Daily Reports Zod 스키마
// ============================================

// Related Article 스키마
export const RelatedArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  importance: z.number().min(1).max(10),
})

// Evidence Item 스키마
export const EvidenceItemSchema = z.object({
  text: z.string(),
  articleId: z.number().optional(),
  articleUrl: z.string().optional(),
  source: z.string().optional(),
})

// Executive Summary 스키마
export const ExecutiveSummarySchema = z.object({
  headline: z.string(),
  overview: z.string(),
  highlights: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      relatedArticle: RelatedArticleSchema,
    })
  ),
  sentiment: z.object({
    overall: z.enum(['positive', 'negative', 'neutral', 'mixed']),
    description: z.string(),
  }),
})

// Market Overview 스키마
export const MarketOverviewSchema = z.object({
  summary: z.string(),
  sections: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      keyData: z.array(z.string()),
      relatedArticles: z.array(RelatedArticleSchema),
    })
  ),
  outlook: z.string(),
  watchList: z.array(z.string()),
})

// Key Insight 스키마
export const KeyInsightSchema = z.object({
  title: z.string(),
  summary: z.string(),
  analysis: z.string(),
  implications: z.object({
    investors: z.string(),
    workers: z.string(),
    consumers: z.string(),
  }),
  evidence: z.array(EvidenceItemSchema),
  relatedArticles: z.array(RelatedArticleSchema),
  actionItems: z.array(z.string()),
  impact: z.enum(['high', 'medium', 'low']),
  timeHorizon: z.enum(['short', 'medium', 'long']),
})

// Sentiment Analysis 스키마
export const DailySentimentAnalysisSchema = z.object({
  overall: z.string(),
  positiveCount: z.number(),
  negativeCount: z.number(),
  neutralCount: z.number(),
})

// Quality Evaluation 스키마
export const QualityEvaluationSchema = z.object({
  score: z.number(),
  feedback: z.string().optional(),
})

// Evidence Validation 스키마
export const EvidenceValidationSchema = z.object({
  isValid: z.boolean(),
  details: z.string().optional(),
})

// 타입 추출
export type RelatedArticle = z.infer<typeof RelatedArticleSchema>
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>
export type ExecutiveSummary = z.infer<typeof ExecutiveSummarySchema>
export type MarketOverview = z.infer<typeof MarketOverviewSchema>
export type KeyInsight = z.infer<typeof KeyInsightSchema>
export type DailySentimentAnalysis = z.infer<typeof DailySentimentAnalysisSchema>
export type QualityEvaluation = z.infer<typeof QualityEvaluationSchema>
export type EvidenceValidation = z.infer<typeof EvidenceValidationSchema>

// ============================================
// Daily Reports 테이블 정의
// ============================================

export const dailyReports = pgTable('daily_reports', {
  id: serial('id').primaryKey(),
  reportDate: date('report_date').notNull().unique(),
  title: text('title').notNull(),

  executiveSummary: jsonb('executive_summary').$type<ExecutiveSummary>().notNull(),
  marketOverview: jsonb('market_overview').$type<MarketOverview>().notNull(),
  keyInsights: jsonb('key_insights').$type<KeyInsight[]>().notNull(),

  topKeywords: text('top_keywords').array().notNull(),
  sentimentAnalysis: jsonb('sentiment_analysis')
    .$type<DailySentimentAnalysis>()
    .notNull(),

  articleCount: integer('article_count').notNull().default(0),
  articleIds: integer('article_ids').array().notNull().default([]),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),

  qualityEvaluation: jsonb('quality_evaluation').$type<QualityEvaluation>(),
  evidenceValidation: jsonb('evidence_validation').$type<EvidenceValidation>(),
  qualityScore: doublePrecision('quality_score'),
})

export type DailyReport = typeof dailyReports.$inferSelect
export type NewDailyReport = typeof dailyReports.$inferInsert
