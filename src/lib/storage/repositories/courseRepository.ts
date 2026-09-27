import { courseModuleMap } from '../../../../content/cpa/course/modules'
import { moduleReadings } from '../../../../content/cpa/course/readings'
import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'

export interface CourseProgress { version: 1; moduleId: string; readSections: string[] }
export function validCourseProgress(value: unknown, recordId?: string): value is CourseProgress {
  if (!value || typeof value !== 'object') return false
  const p = value as CourseProgress
  if (!courseModuleMap.has(p.moduleId)) return false
  const reading = moduleReadings[p.moduleId]
  return p.version === 1 && Boolean(reading) && (!recordId || recordId === `course:${p.moduleId}`) && Array.isArray(p.readSections) && new Set(p.readSections).size === p.readSections.length && p.readSections.every(id => reading.sections.some(section => section.id === id))
}
export async function getCourseProgress() {
  const rows = await (await getDatabase()).getAll('studyPlans')
  return Object.fromEntries(rows.filter(row => row.id.startsWith('course:') && validCourseProgress(row.payload, row.id)).map(row => [(row.payload as CourseProgress).moduleId, row.payload as CourseProgress])) as Record<string, CourseProgress>
}
export async function setSectionRead(moduleId: string, sectionId: string, read: boolean) {
  if (!moduleReadings[moduleId]?.sections.some(section => section.id === sectionId)) throw new Error('Seção de leitura inválida.')
  const db = await getDatabase()
  const tx = db.transaction(['studyPlans', 'activityDays'], 'readwrite')
  const store = tx.objectStore('studyPlans')
  const id = `course:${moduleId}`
  const previous = await store.get(id)
  const sections = new Set(validCourseProgress(previous?.payload, id) ? previous.payload.readSections : [])
  if (read) sections.add(sectionId); else sections.delete(sectionId)
  const payload: CourseProgress = { version: 1, moduleId, readSections: [...sections] }
  const now = new Date(); const updatedAt = now.toISOString()
  await store.put({ id, payload, updatedAt })
  const date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
  const activity = await tx.objectStore('activityDays').get(date)
  await tx.objectStore('activityDays').put({date, events:(activity?.events ?? 0)+1, lastActivityAt:updatedAt})
  await tx.done
  notifyStorageChanged()
  return payload
}
