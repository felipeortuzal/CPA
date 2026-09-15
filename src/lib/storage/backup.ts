import { DB_VERSION, deleteLocalDatabase, getDatabase } from './database'
import { notifyStorageChanged } from './events'
import type { LocalBackup, LocalBackupV2 } from './types'

const BACKUP_VERSION = 2 as const
const baseArrayKeys = ['lessonProgress','quizAttempts','favorites','flashcards','flashcardReviews','questionBookmarks','errors','simulations','studySessions','activityDays','preferences','studyPlans'] as const
const v2ArrayKeys = [...baseArrayKeys, 'questionAttempts'] as const
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value) }

export function validateBackup(value: unknown): value is LocalBackup {
  if (!isRecord(value) || (value.backupVersion !== 1 && value.backupVersion !== 2) || typeof value.databaseVersion !== 'number' || typeof value.exportedAt !== 'string') return false
  if (Number.isNaN(Date.parse(value.exportedAt))) return false
  if (value.profile !== null) {
    if (!isRecord(value.profile) || value.profile.id !== 'local' || typeof value.profile.displayName !== 'string' || typeof value.profile.currentCertification !== 'string' || typeof value.profile.dailyGoalMinutes !== 'number') return false
  }
  if (!baseArrayKeys.every((key) => Array.isArray(value[key]))) return false
  if (value.backupVersion === 2 && !Array.isArray(value.questionAttempts)) return false
  const progress = value.lessonProgress as unknown[]
  if (!progress.every((row) => isRecord(row) && typeof row.pdCode === 'string' && ['not_started','in_progress','completed','mastered'].includes(String(row.status)))) return false
  const quizzes = value.quizAttempts as unknown[]
  if (!quizzes.every((row) => isRecord(row) && typeof row.id === 'string' && typeof row.pdCode === 'string' && typeof row.score === 'number')) return false
  if (value.backupVersion === 2) {
    const attempts = value.questionAttempts as unknown[]
    if (!attempts.every((row) => isRecord(row) && typeof row.id === 'string' && typeof row.questionId === 'string' && typeof row.isCorrect === 'boolean' && typeof row.selectedAnswer === 'number')) return false
  }
  return true
}

export async function createBackup(): Promise<LocalBackupV2> {
  const db = await getDatabase()
  const [profile, lessonProgress, quizAttempts, questionAttempts, favorites, flashcards, flashcardReviews, questionBookmarks, errors, simulations, studySessions, activityDays, preferences, studyPlans] = await Promise.all([
    db.get('profile','local'), db.getAll('lessonProgress'), db.getAll('quizAttempts'), db.getAll('questionAttempts'), db.getAll('favorites'), db.getAll('flashcards'), db.getAll('flashcardReviews'), db.getAll('questionBookmarks'), db.getAll('errors'), db.getAll('simulations'), db.getAll('studySessions'), db.getAll('activityDays'), db.getAll('preferences'), db.getAll('studyPlans'),
  ])
  return { backupVersion: BACKUP_VERSION, databaseVersion: DB_VERSION, exportedAt: new Date().toISOString(), profile: profile ?? null, lessonProgress, quizAttempts, questionAttempts, favorites, flashcards, flashcardReviews, questionBookmarks, errors, simulations, studySessions, activityDays, preferences, studyPlans }
}

export function downloadBackup(backup: LocalBackup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a')
  anchor.href = url; anchor.download = `cpa-backup-${new Date().toISOString().slice(0,10)}.json`; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url)
}

export async function parseBackupFile(file: File): Promise<LocalBackup> {
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
  await tx.done; notifyStorageChanged()
}

export async function resetAllProgress() { await deleteLocalDatabase(); notifyStorageChanged() }
