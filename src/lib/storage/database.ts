import { deleteDB, openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { ActivityDayRecord, ErrorRecord, FavoriteRecord, FlashcardReviewRecord, LessonProgressRecord, LocalProfile, PreferencesRecord, QuestionAttemptRecord, QuestionBookmarkRecord, QuizAttemptRecord, SimulationRecord, StoredFlashcard, StudyPlanRecord, StudySessionRecord } from './types'

export const DB_NAME = 'cpa-study-local'
export const DB_VERSION = 2

export interface CPAStudyDB extends DBSchema {
  profile: { key: 'local'; value: LocalProfile }
  lessonProgress: { key: string; value: LessonProgressRecord }
  quizAttempts: { key: string; value: QuizAttemptRecord; indexes: { 'by-pd-code': string; 'by-completed-at': string } }
  questionAttempts: { key: string; value: QuestionAttemptRecord; indexes: { 'by-question-id': string; 'by-pd-code': string; 'by-answered-at': string } }
  favorites: { key: string; value: FavoriteRecord; indexes: { 'by-item-id': string } }
  flashcards: { key: string; value: StoredFlashcard; indexes: { 'by-pd-code': string } }
  flashcardReviews: { key: string; value: FlashcardReviewRecord; indexes: { 'by-flashcard-id': string; 'by-reviewed-at': string } }
  questionBookmarks: { key: string; value: QuestionBookmarkRecord }
  errors: { key: string; value: ErrorRecord; indexes: { 'by-pd-code': string; 'by-created-at': string } }
  simulations: { key: string; value: SimulationRecord }
  studySessions: { key: string; value: StudySessionRecord; indexes: { 'by-started-at': string; 'by-pd-code': string } }
  activityDays: { key: string; value: ActivityDayRecord }
  preferences: { key: 'preferences'; value: PreferencesRecord }
  studyPlans: { key: string; value: StudyPlanRecord }
}

let databasePromise: Promise<IDBPDatabase<CPAStudyDB>> | null = null

function migrateV1(db: IDBPDatabase<CPAStudyDB>) {
  db.createObjectStore('profile', { keyPath: 'id' })
  db.createObjectStore('lessonProgress', { keyPath: 'pdCode' })
  const quizAttempts = db.createObjectStore('quizAttempts', { keyPath: 'id' }); quizAttempts.createIndex('by-pd-code', 'pdCode'); quizAttempts.createIndex('by-completed-at', 'completedAt')
  const favorites = db.createObjectStore('favorites', { keyPath: 'id' }); favorites.createIndex('by-item-id', 'itemId')
  const flashcards = db.createObjectStore('flashcards', { keyPath: 'id' }); flashcards.createIndex('by-pd-code', 'pdCode')
  const flashcardReviews = db.createObjectStore('flashcardReviews', { keyPath: 'id' }); flashcardReviews.createIndex('by-flashcard-id', 'flashcardId'); flashcardReviews.createIndex('by-reviewed-at', 'reviewedAt')
  db.createObjectStore('questionBookmarks', { keyPath: 'id' })
  const errors = db.createObjectStore('errors', { keyPath: 'id' }); errors.createIndex('by-pd-code', 'pdCode'); errors.createIndex('by-created-at', 'createdAt')
  db.createObjectStore('simulations', { keyPath: 'id' })
  const studySessions = db.createObjectStore('studySessions', { keyPath: 'id' }); studySessions.createIndex('by-started-at', 'startedAt'); studySessions.createIndex('by-pd-code', 'pdCode')
  db.createObjectStore('activityDays', { keyPath: 'date' })
  db.createObjectStore('preferences', { keyPath: 'id' })
  db.createObjectStore('studyPlans', { keyPath: 'id' })
}

function migrateV2(db: IDBPDatabase<CPAStudyDB>) {
  const attempts = db.createObjectStore('questionAttempts', { keyPath: 'id' })
  attempts.createIndex('by-question-id', 'questionId')
  attempts.createIndex('by-pd-code', 'pdCode')
  attempts.createIndex('by-answered-at', 'answeredAt')
}

export function getDatabase() {
  if (!databasePromise) {
    databasePromise = openDB<CPAStudyDB>(DB_NAME, DB_VERSION, {
      blocking() { void closeDatabase() },
      terminated() { databasePromise = null },
      upgrade(db, oldVersion) {
        if (oldVersion < 1) migrateV1(db)
        if (oldVersion < 2) migrateV2(db)
      },
    }).catch((cause) => { databasePromise = null; throw cause })
  }
  return databasePromise
}

export async function closeDatabase() { if (!databasePromise) return; const db = await databasePromise; db.close(); databasePromise = null }
export async function deleteLocalDatabase() { await closeDatabase(); await deleteDB(DB_NAME); databasePromise = null }
