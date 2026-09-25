import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { FavoriteRecord, LessonProgressRecord, QuizAttemptRecord } from '../types'
import { recordActivityInStore } from './activityRepository'

export async function getAllLessonProgress() { return (await getDatabase()).getAll('lessonProgress') }
export async function getLessonProgress(pdCode: string) { return (await getDatabase()).get('lessonProgress', pdCode) }

function initialProgress(pdCode: string, now: string): LessonProgressRecord {
  return { pdCode, status: 'in_progress', openedAt: now, lastStudiedAt: now, completedAt: null, masteredAt: null, hasDoubt: false, quizBestScore: null }
}

async function updateLesson(pdCode: string, update: (current: LessonProgressRecord, now: string) => LessonProgressRecord, significant = false) {
  const db = await getDatabase()
  const tx = db.transaction(['lessonProgress', 'activityDays'], 'readwrite')
  const store = tx.objectStore('lessonProgress')
  const now = new Date().toISOString()
  const current = await store.get(pdCode) ?? initialProgress(pdCode, now)
  const next = update({ ...current, lastStudiedAt: now }, now)
  await store.put(next)
  if (significant) await recordActivityInStore(tx.objectStore('activityDays'), new Date(now))
  await tx.done
  notifyStorageChanged()
  return next
}

export function markLessonOpened(pdCode: string) {
  return updateLesson(pdCode, current => current)
}

export function markLessonStudied(pdCode: string) {
  return updateLesson(pdCode, (current, now) => {
    const mastered = (current.quizBestScore ?? 0) >= 75
    return { ...current, status: mastered ? 'mastered' : 'completed', completedAt: current.completedAt ?? now, masteredAt: mastered ? current.masteredAt ?? now : current.masteredAt }
  }, true)
}

export function toggleLessonDoubt(pdCode: string) {
  return updateLesson(pdCode, current => ({ ...current, hasDoubt: !current.hasDoubt }))
}

export async function saveQuizAttempt(pdCode: string, answers: number[], correct: number, total: number): Promise<{ attempt: QuizAttemptRecord; progress: LessonProgressRecord }> {
  if (!Number.isInteger(total) || total < 1 || answers.length !== total || !answers.every(answer => Number.isInteger(answer) && answer >= 0) || !Number.isInteger(correct) || correct < 0 || correct > total) throw new Error('Respostas do quiz inválidas.')
  const db = await getDatabase()
  const tx = db.transaction(['quizAttempts', 'lessonProgress', 'activityDays'], 'readwrite')
  const now = new Date().toISOString()
  const score = Math.round(correct / total * 100)
  const attempt: QuizAttemptRecord = { id: crypto.randomUUID(), pdCode, answers: [...answers], correct, total, score, completedAt: now }
  await tx.objectStore('quizAttempts').put(attempt)
  const store = tx.objectStore('lessonProgress')
  const current = await store.get(pdCode) ?? initialProgress(pdCode, now)
  const best = Math.max(current.quizBestScore ?? 0, score)
  const mastered = (current.status === 'completed' || current.status === 'mastered') && best >= 75
  const progress: LessonProgressRecord = { ...current, quizBestScore: best, status: mastered ? 'mastered' : current.status, masteredAt: mastered ? current.masteredAt ?? now : current.masteredAt, lastStudiedAt: now }
  await store.put(progress)
  await recordActivityInStore(tx.objectStore('activityDays'), new Date(now))
  await tx.done
  notifyStorageChanged()
  return { attempt, progress }
}

export async function getQuizAttempts(pdCode?: string) { const db = await getDatabase(); return pdCode ? db.getAllFromIndex('quizAttempts', 'by-pd-code', pdCode) : db.getAll('quizAttempts') }
export async function isLessonFavorite(pdCode: string) { return Boolean(await (await getDatabase()).get('favorites', `lesson:${pdCode}`)) }
export async function toggleLessonFavorite(pdCode: string) {
  const db = await getDatabase(); const id = `lesson:${pdCode}`; const tx = db.transaction('favorites', 'readwrite'); const existing = await tx.store.get(id)
  if (existing) { await tx.store.delete(id); await tx.done; notifyStorageChanged(); return false }
  const favorite: FavoriteRecord = { id, itemType: 'lesson', itemId: pdCode, createdAt: new Date().toISOString() }
  await tx.store.put(favorite); await tx.done; notifyStorageChanged(); return true
}
export async function getFavorites() { return (await getDatabase()).getAll('favorites') }
