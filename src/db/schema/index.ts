// Articles + 뉴스 분석 스키마
export {
  // Zod 스키마
  SoWhatSchema,
  InvestorImpactSchema,
  WorkerImpactSchema,
  ConsumerImpactSchema,
  ImpactAnalysisSchema,
  RelatedContextSchema,
  SentimentSchema,
  CategorySchema,
  RegionSchema,
  NewsAnalysisResultSchema,
  // 타입
  type SoWhat,
  type InvestorImpact,
  type WorkerImpact,
  type ConsumerImpact,
  type ImpactAnalysis,
  type RelatedContext,
  type Sentiment,
  type Category,
  type Region,
  type NewsAnalysisResult,
  // 테이블
  articles,
  type Article,
  type NewArticle,
} from './articles'

// Users 테이블
export { users, type User, type NewUser } from './users'

// Bookmarks 테이블
export { bookmarks, type Bookmark, type NewBookmark } from './bookmarks'

// Category Stats
export { categoryStats, type CategoryStat } from './category-stats'

// Daily Reports + 관련 스키마
export {
  // Zod 스키마
  RelatedArticleSchema,
  EvidenceItemSchema,
  ExecutiveSummarySchema,
  MarketOverviewSchema,
  KeyInsightSchema,
  DailySentimentAnalysisSchema,
  QualityEvaluationSchema,
  EvidenceValidationSchema,
  // 타입
  type RelatedArticle,
  type EvidenceItem,
  type ExecutiveSummary,
  type MarketOverview,
  type KeyInsight,
  type DailySentimentAnalysis,
  type QualityEvaluation,
  type EvidenceValidation,
  // 테이블
  dailyReports,
  type DailyReport,
  type NewDailyReport,
} from './daily-reports'
