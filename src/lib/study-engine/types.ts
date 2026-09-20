import type { ErrorRecord, FlashcardReviewRecord, LessonProgressRecord, QuestionAttemptRecord, QuizAttemptRecord, SimulationRecord } from '../storage/types'

export type MasteryLevel = 'weak' | 'learning' | 'good' | 'mastered'
export type DataStatus = 'insufficient' | 'partial' | 'sufficient'
export type StudyRecommendationKind = 'learn' | 'review' | 'practice' | 'recover_error'
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

export interface StudyEngineInput {
  lessonProgress: LessonProgressRecord[]
  quizAttempts: QuizAttemptRecord[]
  questionAttempts: QuestionAttemptRecord[]
  simulations: SimulationRecord[]
  errors: ErrorRecord[]
  flashcardReviews: FlashcardReviewRecord[]
  flashcardPdById: Map<string, string | null>
  questionDifficultyById: Map<string, QuestionDifficulty>
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
  dataStatus: DataStatus
  level: MasteryLevel
  evidenceCount: number
  practiceAttempts: number
  practiceAccuracy: number | null
  weightedQuestionAccuracy: number | null
  simulationAccuracy: number | null
  flashcardRecall: number | null
  officialExamSamples: number
  unresolvedErrors: number
  hasDoubt: boolean
  falseConfidence: boolean
  falseConfidenceMessage: string | null
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
  sufficientPercent: number
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

export interface WeakTopic {
  pdCode: string
  title: string
  macroCode: string
  score: number
  dataStatus: DataStatus
  practiceAccuracy: number | null
  unresolvedErrors: number
  falseConfidence: boolean
  reason: string
  route: string
}

export interface ReadinessBreakdown {
  coverage: number
  mastery: number
  fullExams: number
  recentPerformance: number
  consistency: number
  themeBalance: number
}

export interface StudyEngineSnapshot {
  generatedAt: string
  overallMastery: number
  coveragePercent: number
  sufficientCoveragePercent: number
  readinessScore: number | null
  readinessDataStatus: DataStatus
  readinessLabel: string
  readinessMessage: string
  readinessBreakdown: ReadinessBreakdown
  readyForExam: boolean
  recentOfficialExamAverage: number | null
  officialExamCount: number
  recentPracticeAccuracy: number | null
  dueReviews: number
  recommendedMinutes: number
  today: StudyRecommendation[]
  recommendations: StudyRecommendation[]
  macroSummary: MacroMastery[]
  mastery: PDMastery[]
  weakTopics: WeakTopic[]
  falseConfidencePdCodes: string[]
  weakPdCodes: string[]
  masteredPdCodes: string[]
}
