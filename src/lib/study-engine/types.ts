import type { ErrorRecord, LessonProgressRecord, QuestionAttemptRecord, QuizAttemptRecord, SimulationRecord } from '../storage/types'

export type MasteryLevel = 'new' | 'weak' | 'developing' | 'strong' | 'mastered'
export type StudyRecommendationKind = 'learn' | 'review' | 'practice' | 'recover_error'

export interface StudyEngineInput {
  lessonProgress: LessonProgressRecord[]
  quizAttempts: QuizAttemptRecord[]
  questionAttempts: QuestionAttemptRecord[]
  simulations: SimulationRecord[]
  errors: ErrorRecord[]
  lessonPdCodes: Set<string>
  questionPdCodes: Set<string>
  dailyGoalMinutes: number
  now?: Date
}

export interface PDMastery {
  pdCode: string
  title: string
  macroCode: string
  macroTitle: string
  score: number
  confidence: number
  level: MasteryLevel
  evidenceCount: number
  practiceAttempts: number
  practiceAccuracy: number | null
  unresolvedErrors: number
  hasDoubt: boolean
  lastEvidenceAt: string | null
  nextReviewAt: string | null
  reviewIntervalDays: number
  overdue: boolean
  lessonAvailable: boolean
  questionAvailable: boolean
}

export interface MacroMastery {
  macroCode: string
  title: string
  officialWeight: number
  score: number
  coveragePercent: number
  dueReviews: number
  weakItems: number
  totalItems: number
}

export interface StudyRecommendation {
  pdCode: string
  title: string
  macroCode: string
  kind: StudyRecommendationKind
  score: number
  priority: number
  reason: string
  targetMinutes: number
  route: string
}

export interface StudyEngineSnapshot {
  generatedAt: string
  overallMastery: number
  coveragePercent: number
  readinessScore: number
  readinessLabel: string
  readyForExam: boolean
  recentOfficialExamAverage: number | null
  dueReviews: number
  recommendedMinutes: number
  today: StudyRecommendation[]
  macroSummary: MacroMastery[]
  mastery: PDMastery[]
  weakPdCodes: string[]
  masteredPdCodes: string[]
}
