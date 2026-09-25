import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { ActivityDayRecord, StudySessionRecord } from '../types'

export function toLocalDateKey(value: Date | string) {
  const date = typeof value === 'string' ? new Date(value) : value
  const year = date.getFullYear(); const month = String(date.getMonth() + 1).padStart(2, '0'); const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function calculateStreak(dayKeys: string[], today = new Date()) {
  const days = new Set(dayKeys)
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  if (!days.has(toLocalDateKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  if (!days.has(toLocalDateKey(cursor))) return 0
  let streak = 0
  while (days.has(toLocalDateKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1) }
  return streak
}

export async function recordSignificantActivity(at = new Date()) {
  const db = await getDatabase(); const key = toLocalDateKey(at); const tx = db.transaction('activityDays', 'readwrite'); const current = await tx.store.get(key)
  const record: ActivityDayRecord = { date: key, events: (current?.events ?? 0) + 1, lastActivityAt: at.toISOString() }
  await tx.store.put(record); await tx.done; notifyStorageChanged(); return record
}
export async function getActivityDays() { return (await getDatabase()).getAll('activityDays') }

export async function beginStudySession(activityType: StudySessionRecord['activityType'], pdCode: string | null = null) {
  const now = new Date().toISOString()
  const record: StudySessionRecord = { id: crypto.randomUUID(), activityType, pdCode, startedAt: now, endedAt: null, activeSeconds: 0 }
  await (await getDatabase()).put('studySessions', record); return record
}
export async function addActiveStudySeconds(id: string, seconds: number) {
  const db = await getDatabase(); const current = await db.get('studySessions', id); if (!current) return
  await db.put('studySessions', { ...current, activeSeconds: current.activeSeconds + Math.max(0, seconds), endedAt: new Date().toISOString() }); notifyStorageChanged()
}
export async function endStudySession(id: string) {
  const db = await getDatabase(); const current = await db.get('studySessions', id); if (!current) return
  await db.put('studySessions', { ...current, endedAt: new Date().toISOString() }); notifyStorageChanged()
}
export async function getStudySessions() { return (await getDatabase()).getAll('studySessions') }
