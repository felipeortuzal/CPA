export type LessonStatus = 'not_started' | 'in_progress' | 'completed' | 'mastered'

export interface LocalProfile {
  id: 'local'
  displayName: string
  currentCertification: string
  dailyGoalMinutes: number
  createdAt: string
  updatedAt: string
}

export interface LessonProgressRecord {
  pdCode: string
  status: LessonStatus
  openedAt: string
  lastStudiedAt: string
  completedAt: string | null
  masteredAt: string | null
  hasDoubt: boolean
  quizBestScore: number | null
}

export interface QuizAttemptRecord { id: string; pdCode: string; answers: number[]; correct: number; total: number; score: number; completedAt: string }
export interface QuestionAttemptRecord { id: string; questionId: string; pdCode: string; selectedAnswer: number; correctAnswer: number; isCorrect: boolean; answeredAt: string }
export interface FavoriteRecord { id: string; itemType: 'lesson' | 'question' | 'flashcard'; itemId: string; createdAt: string }
export interface StoredFlashcard { id: string; pdCode: string | null; front: string; back: string; createdAt: string; updatedAt: string }
export interface FlashcardReviewRecord { id: string; flashcardId: string; rating: 'again' | 'hard' | 'good' | 'easy'; reviewedAt: string; lastReviewed?: string; nextReview?: string | null; interval?: number; ease?: number; reviewCount?: number; correctStreak?: number; nextReviewAt?: string | null }
export interface QuestionBookmarkRecord { id: string; questionId: string; createdAt: string }
export interface ErrorRecord { id: string; sourceType: 'quiz' | 'question' | 'simulation'; sourceId: string; pdCode: string | null; prompt: string; selectedAnswer: string | null; correctAnswer: string | null; createdAt: string; resolvedAt: string | null; wrongCount?: number; lastWrongAt?: string }

export interface SimulationPerformance { correct: number; total: number; percent: number }
export interface SimulationQuestionResult {
  questionId: string
  pdCode: string
  macroTopic: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  selectedAnswer: number | null
  correctAnswer: number
  isCorrect: boolean
}
export interface SimulationResultSnapshot {
  correct: number
  total: number
  scorePercent: number
  passed: boolean | null
  cutoff: number | null
  timeUsedSeconds: number
  markedCount: number
  unansweredCount: number
  themePerformance: Record<string, SimulationPerformance>
  difficultyPerformance: Record<'easy' | 'medium' | 'hard', SimulationPerformance>
  pdPerformance: Record<string, SimulationPerformance>
  questionResults: SimulationQuestionResult[]
}
export interface SimulationPayload {
  mode: 'official_exam' | 'quick10' | 'quick20' | 'theme' | 'weak' | 'unseen'
  label: string
  theme: string | null
  questionIds: string[]
  answers: Record<string, number | null>
  markedForReview: string[]
  notes: string
  startedAt: string
  durationSeconds: number
  cutoff: number | null
  result: SimulationResultSnapshot | null
}
export interface SimulationRecord { id: string; certification: string; score: number | null; questionCount: number; completedAt: string | null; payload: SimulationPayload }

export interface StudySessionRecord { id: string; activityType: 'lesson' | 'quiz' | 'flashcard' | 'questions' | 'simulation' | 'review'; pdCode: string | null; startedAt: string; endedAt: string | null; activeSeconds: number }
export interface ActivityDayRecord { date: string; events: number; lastActivityAt: string }
export interface PreferencesRecord { id: 'preferences'; theme?: 'light' | 'dark'; reduceMotion?: boolean; lessonSidebarOpen?: boolean; updatedAt: string }
export interface StudyPlanRecord { id: string; payload: unknown; updatedAt: string }

interface LocalBackupBase {
  databaseVersion: number
  exportedAt: string
  profile: LocalProfile | null
  lessonProgress: LessonProgressRecord[]
  quizAttempts: QuizAttemptRecord[]
  favorites: FavoriteRecord[]
  flashcards: StoredFlashcard[]
  flashcardReviews: FlashcardReviewRecord[]
  questionBookmarks: QuestionBookmarkRecord[]
  errors: ErrorRecord[]
  simulations: SimulationRecord[]
  studySessions: StudySessionRecord[]
  activityDays: ActivityDayRecord[]
  preferences: PreferencesRecord[]
  studyPlans: StudyPlanRecord[]
}

export interface LocalBackupV1 extends LocalBackupBase { backupVersion: 1 }
export interface LocalBackupV2 extends LocalBackupBase { backupVersion: 2; questionAttempts: QuestionAttemptRecord[] }
export type LocalBackup = LocalBackupV1 | LocalBackupV2
