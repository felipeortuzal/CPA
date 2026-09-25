import type { ExamStudyPlanSettings } from './types'
import { date, finite, isRecord } from '../storage/validation'

export function calendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T12:00:00Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10) === value
}

export function validStudyPlanSettings(value: unknown): value is ExamStudyPlanSettings {
  if (!isRecord(value)) return false
  if (!(value.examDate === null || calendarDate(value.examDate)) || !(value.startDate === null || calendarDate(value.startDate))) return false
  if (value.examDate && value.startDate && value.startDate >= value.examDate) return false
  return Array.isArray(value.availableWeekdays) && value.availableWeekdays.length > 0
    && value.availableWeekdays.every(day => Number.isInteger(day) && day >= 0 && day <= 6)
    && new Set(value.availableWeekdays).size === value.availableWeekdays.length
    && finite(value.minutesPerDay) && value.minutesPerDay >= 5 && value.minutesPerDay <= 600 && date(value.updatedAt)
}
