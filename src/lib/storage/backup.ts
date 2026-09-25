import { validQuestion, validSimulation, finite, natural } from './validation'
import { DB_VERSION, deleteLocalDatabase, getDatabase } from './database'
import { notifyStorageChanged } from './events'
import type { LocalBackup, LocalBackupV2 } from './types'

const BACKUP_VERSION = 2 as const
const BACKUP_MAX_BYTES = 25 * 1024 * 1024
const baseArrayKeys = ['lessonProgress','quizAttempts','favorites','flashcards','flashcardReviews','questionBookmarks','errors','simulations','studySessions','activityDays','preferences','studyPlans'] as const
const v2ArrayKeys = [...baseArrayKeys, 'questionAttempts'] as const
const lessonStatuses = new Set(['not_started','in_progress','completed','mastered'])
const reviewRatings = new Set(['again','hard','good','easy'])

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value) }
function isNullableString(value: unknown) { return value === null || typeof value === 'string' }
function validDate(value: unknown) { return typeof value === 'string' && !Number.isNaN(Date.parse(value)) }

export interface BackupSummary {
  profileName: string | null
  lessons: number
  quizzes: number
  questions: number
  simulations: number
  flashcards: number
  errors: number
  studyPlans: number
}

export function getBackupSummary(backup: LocalBackup): BackupSummary {
  return {
    profileName: backup.profile?.displayName ?? null,
    lessons: backup.lessonProgress.length,
    quizzes: backup.quizAttempts.length,
    questions: backup.backupVersion === 2 ? backup.questionAttempts.length : 0,
    simulations: backup.simulations.length,
    flashcards: backup.flashcards.length + backup.flashcardReviews.length,
    errors: backup.errors.length,
    studyPlans: backup.studyPlans.length,
  }
}

export function validateBackup(value: unknown): value is LocalBackup {
  if (!isRecord(value) || (value.backupVersion !== 1 && value.backupVersion !== 2) || !Number.isInteger(value.databaseVersion) || Number(value.databaseVersion) < 1 || !validDate(value.exportedAt)) return false
  if (value.profile !== null) {
    if (!isRecord(value.profile) || value.profile.id !== 'local' || typeof value.profile.displayName !== 'string' || typeof value.profile.currentCertification !== 'string' || (!finite(value.profile.dailyGoalMinutes) || value.profile.dailyGoalMinutes < 5 || value.profile.dailyGoalMinutes > 600) || !validDate(value.profile.createdAt) || !validDate(value.profile.updatedAt)) return false
  }
  if (!baseArrayKeys.every((key) => Array.isArray(value[key]))) return false
  if (value.backupVersion === 2 && !Array.isArray(value.questionAttempts)) return false

  const progress = value.lessonProgress as unknown[]
  if (!progress.every((row) => isRecord(row) && typeof row.pdCode === 'string' && lessonStatuses.has(String(row.status)) && validDate(row.openedAt) && validDate(row.lastStudiedAt) && isNullableString(row.completedAt) && isNullableString(row.masteredAt) && typeof row.hasDoubt === 'boolean' && (row.quizBestScore === null || (finite(row.quizBestScore) && row.quizBestScore >= 0 && row.quizBestScore <= 100)))) return false

  const quizzes = value.quizAttempts as unknown[]
  if (!quizzes.every((row) => isRecord(row) && typeof row.id === 'string' && typeof row.pdCode === 'string' && Array.isArray(row.answers) && row.answers.every(natural) && natural(row.correct) && natural(row.total) && row.total > 0 && row.correct <= row.total && finite(row.score) && row.score >= 0 && row.score <= 100 && validDate(row.completedAt))) return false

  if (value.backupVersion === 2) {
    const attempts = value.questionAttempts as unknown[]
    if (!attempts.every((row) => isRecord(row) && typeof row.id === 'string' && typeof row.questionId === 'string' && typeof row.pdCode === 'string' && typeof row.isCorrect === 'boolean' && natural(row.selectedAnswer) && row.selectedAnswer < 4 && natural(row.correctAnswer) && row.correctAnswer < 4 && row.isCorrect === (row.selectedAnswer === row.correctAnswer) && (row.questionSnapshot === undefined || validQuestion(row.questionSnapshot)) && validDate(row.answeredAt))) return false
  }

  if (!(value.favorites as unknown[]).every((row) => isRecord(row) && typeof row.id === 'string' && typeof row.itemId === 'string' && ['lesson','question','flashcard'].includes(String(row.itemType)) && validDate(row.createdAt))) return false
  if (!(value.flashcards as unknown[]).every((row) => isRecord(row) && typeof row.id === 'string' && (row.pdCode === null || typeof row.pdCode === 'string') && typeof row.front === 'string' && typeof row.back === 'string' && validDate(row.createdAt) && validDate(row.updatedAt))) return false
  if (!(value.flashcardReviews as unknown[]).every((row) => isRecord(row) && typeof row.id === 'string' && typeof row.flashcardId === 'string' && reviewRatings.has(String(row.rating)) && validDate(row.reviewedAt))) return false
  if (!(value.questionBookmarks as unknown[]).every((row) => isRecord(row) && typeof row.id === 'string' && typeof row.questionId === 'string' && validDate(row.createdAt))) return false
  if (!(value.errors as unknown[]).every((row) => isRecord(row) && typeof row.id === 'string' && typeof row.sourceId === 'string' && ['quiz','question','simulation'].includes(String(row.sourceType)) && isNullableString(row.pdCode) && typeof row.prompt === 'string' && isNullableString(row.selectedAnswer) && isNullableString(row.correctAnswer) && validDate(row.createdAt) && isNullableString(row.resolvedAt) && (row.questionSnapshot === undefined || validQuestion(row.questionSnapshot)))) return false
  if (!(value.simulations as unknown[]).every(validSimulation)) return false
  if (!(value.studySessions as unknown[]).every((row) => isRecord(row) && typeof row.id === 'string' && typeof row.activityType === 'string' && isNullableString(row.pdCode) && validDate(row.startedAt) && isNullableString(row.endedAt) && finite(row.activeSeconds) && row.activeSeconds >= 0)) return false
  if (!(value.activityDays as unknown[]).every((row) => isRecord(row) && typeof row.date === 'string' && natural(row.events) && validDate(row.lastActivityAt))) return false
  if (!(value.preferences as unknown[]).every((row) => isRecord(row) && row.id === 'preferences' && validDate(row.updatedAt))) return false
  if (!(value.studyPlans as unknown[]).every((row) => isRecord(row) && typeof row.id === 'string' && validDate(row.updatedAt) && 'payload' in row)) return false
  for (const key of value.backupVersion === 2 ? v2ArrayKeys : baseArrayKeys) {
    const rows = value[key] as Record<string, unknown>[]
    const ids = rows.map((row) => row[key === 'lessonProgress' ? 'pdCode' : key === 'activityDays' ? 'date' : 'id'])
    if (ids.some((id) => typeof id !== 'string' || id.length === 0) || new Set(ids).size !== ids.length) return false
  }
  return true
}

export async function createBackup(): Promise<LocalBackupV2> {
  const db = await getDatabase()
  const tx = db.transaction(['profile', ...v2ArrayKeys], 'readonly')
  const [profile, lessonProgress, quizAttempts, questionAttempts, favorites, flashcards, flashcardReviews, questionBookmarks, errors, simulations, studySessions, activityDays, preferences, studyPlans] = await Promise.all([
    tx.objectStore('profile').get('local'), tx.objectStore('lessonProgress').getAll(), tx.objectStore('quizAttempts').getAll(), tx.objectStore('questionAttempts').getAll(), tx.objectStore('favorites').getAll(), tx.objectStore('flashcards').getAll(), tx.objectStore('flashcardReviews').getAll(), tx.objectStore('questionBookmarks').getAll(), tx.objectStore('errors').getAll(), tx.objectStore('simulations').getAll(), tx.objectStore('studySessions').getAll(), tx.objectStore('activityDays').getAll(), tx.objectStore('preferences').getAll(), tx.objectStore('studyPlans').getAll(),
  ])
  await tx.done
  return { backupVersion: BACKUP_VERSION, databaseVersion: DB_VERSION, exportedAt: new Date().toISOString(), profile: profile ?? null, lessonProgress, quizAttempts, questionAttempts, favorites, flashcards, flashcardReviews, questionBookmarks, errors, simulations, studySessions, activityDays, preferences, studyPlans }
}

export function downloadBackup(backup: LocalBackup, suffix = '') {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `cpa-backup-${new Date().toISOString().slice(0,10)}${suffix}.json`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function parseBackupFile(file: File): Promise<LocalBackup> {
  if (file.size > BACKUP_MAX_BYTES) throw new Error('O backup excede o limite de segurança de 25 MB.')
  let parsed: unknown
  try { parsed = JSON.parse(await file.text()) } catch { throw new Error('O arquivo não contém JSON válido.') }
  if (!validateBackup(parsed)) throw new Error('Backup inválido ou de versão incompatível.')
  return parsed
}

export async function importBackup(backup: LocalBackup) {
  if (!validateBackup(backup)) throw new Error('Backup inválido ou de versão incompatível.')
  if (backup.databaseVersion > DB_VERSION) throw new Error('Este backup foi criado por uma versão mais nova do CPA. Atualize a plataforma antes de importar.')
  const db = await getDatabase()
  const stores = ['profile', ...v2ArrayKeys] as const
  const tx = db.transaction(stores, 'readwrite')
  const completed = tx.done
  void completed.catch(() => {})
  try {
    await Promise.all(v2ArrayKeys.map((name) => tx.objectStore(name).clear()).concat([tx.objectStore('profile').clear()]))
    if (backup.profile) await tx.objectStore('profile').put(backup.profile)
    for (const item of backup.lessonProgress) await tx.objectStore('lessonProgress').put(item)
    for (const item of backup.quizAttempts) await tx.objectStore('quizAttempts').put(item)
    if (backup.backupVersion === 2) for (const item of backup.questionAttempts) await tx.objectStore('questionAttempts').put(item)
    for (const item of backup.favorites) await tx.objectStore('favorites').put(item)
    for (const item of backup.flashcards) await tx.objectStore('flashcards').put(item)
    for (const item of backup.flashcardReviews) await tx.objectStore('flashcardReviews').put(item)
    for (const item of backup.questionBookmarks) await tx.objectStore('questionBookmarks').put(item)
    for (const item of backup.errors) await tx.objectStore('errors').put(item)
    for (const item of backup.simulations) await tx.objectStore('simulations').put(item)
    for (const item of backup.studySessions) await tx.objectStore('studySessions').put(item)
    for (const item of backup.activityDays) await tx.objectStore('activityDays').put(item)
    for (const item of backup.preferences) await tx.objectStore('preferences').put(item)
    for (const item of backup.studyPlans) await tx.objectStore('studyPlans').put(item)
    await completed
  } catch (cause) {
    try { tx.abort() } catch { /* Already aborted. */ }
    await completed.catch(() => {})
    throw cause
  }
  notifyStorageChanged()
}

export async function resetAllProgress() { await deleteLocalDatabase(); notifyStorageChanged() }
