import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { FavoriteRecord, LessonProgressRecord, QuizAttemptRecord } from '../types'
import { recordSignificantActivity } from './activityRepository'

export async function getAllLessonProgress() { return (await getDatabase()).getAll('lessonProgress') }
export async function getLessonProgress(pdCode: string) { return (await getDatabase()).get('lessonProgress', pdCode) }

export async function markLessonOpened(pdCode: string) {
  const db = await getDatabase(); const current = await db.get('lessonProgress', pdCode); const now = new Date().toISOString()
  if (current) { const next = { ...current, lastStudiedAt: now }; await db.put('lessonProgress', next); notifyStorageChanged(); return next }
  const created: LessonProgressRecord = { pdCode, status: 'in_progress', openedAt: now, lastStudiedAt: now, completedAt: null, masteredAt: null, hasDoubt: false, quizBestScore: null }
  await db.put('lessonProgress', created); notifyStorageChanged(); return created
}

export async function markLessonStudied(pdCode: string) {
  const db = await getDatabase(); const current = await markLessonOpened(pdCode); const now = new Date().toISOString(); const shouldMaster = (current.quizBestScore ?? 0) >= 75
  const next: LessonProgressRecord = { ...current, status: shouldMaster ? 'mastered' : 'completed', completedAt: current.completedAt ?? now, masteredAt: shouldMaster ? (current.masteredAt ?? now) : current.masteredAt, lastStudiedAt: now }
  await db.put('lessonProgress', next); await recordSignificantActivity(); notifyStorageChanged(); return next
}

export async function toggleLessonDoubt(pdCode: string) {
  const db = await getDatabase(); const current = await markLessonOpened(pdCode); const next = { ...current, hasDoubt: !current.hasDoubt, lastStudiedAt: new Date().toISOString() }
  await db.put('lessonProgress', next); notifyStorageChanged(); return next
}

export async function saveQuizAttempt(pdCode: string, answers: number[], correct: number, total: number): Promise<{ attempt: QuizAttemptRecord; progress: LessonProgressRecord }> {
  const db = await getDatabase(); const now = new Date().toISOString(); const score = total ? Math.round((correct / total) * 100) : 0
  const attempt: QuizAttemptRecord = { id: crypto.randomUUID(), pdCode, answers, correct, total, score, completedAt: now }
  await db.put('quizAttempts', attempt)
  const current = await markLessonOpened(pdCode); const best = Math.max(current.quizBestScore ?? 0, score); const mastered = (current.status === 'completed' || current.status === 'mastered') && best >= 75
  const progress: LessonProgressRecord = { ...current, quizBestScore: best, status: mastered ? 'mastered' : current.status, masteredAt: mastered ? (current.masteredAt ?? now) : current.masteredAt, lastStudiedAt: now }
  await db.put('lessonProgress', progress); await recordSignificantActivity(); notifyStorageChanged(); return { attempt, progress }
}

export async function getQuizAttempts(pdCode?: string) { const db = await getDatabase(); return pdCode ? db.getAllFromIndex('quizAttempts', 'by-pd-code', pdCode) : db.getAll('quizAttempts') }
export async function isLessonFavorite(pdCode: string) { return Boolean(await (await getDatabase()).get('favorites', `lesson:${pdCode}`)) }
export async function toggleLessonFavorite(pdCode: string) {
  const db = await getDatabase(); const id = `lesson:${pdCode}`; const existing = await db.get('favorites', id)
  if (existing) { await db.delete('favorites', id); notifyStorageChanged(); return false }
  const favorite: FavoriteRecord = { id, itemType: 'lesson', itemId: pdCode, createdAt: new Date().toISOString() }
  await db.put('favorites', favorite); notifyStorageChanged(); return true
}
export async function getFavorites() { return (await getDatabase()).getAll('favorites') }
