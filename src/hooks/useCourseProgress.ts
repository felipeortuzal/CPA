import { getQuestionAttempts } from '../lib/storage/repositories/questionRepository'
import { buildModuleProgress } from '../lib/course/progress'
import { useEffect, useState } from 'react'
import { getCourseProgress, type CourseProgress } from '../lib/storage/repositories/courseRepository'
import { getSimulations } from '../lib/storage/repositories/simulationRepository'
import { STORAGE_CHANGED_EVENT, reportStorageError } from '../lib/storage/events'
import type { QuestionAttemptRecord, SimulationRecord } from '../lib/storage/types'
export function useCourseProgress() {
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({})
  const [simulations, setSimulations] = useState<SimulationRecord[]>([])
  const [attempts, setAttempts] = useState<QuestionAttemptRecord[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true; let generation = 0
    const refresh = async () => {
      const current = ++generation
      try {
        const [p, s, a] = await Promise.all([getCourseProgress(), getSimulations(), getQuestionAttempts()])
        if (active && current === generation) { setProgress(p); setSimulations(s); setAttempts(a); setLoading(false) }
      } catch { if (active) reportStorageError() }
    }
    void refresh(); window.addEventListener(STORAGE_CHANGED_EVENT, refresh)
    return () => { active = false; window.removeEventListener(STORAGE_CHANGED_EVENT, refresh) }
  }, [])
  return { progress, simulations, attempts, modules: buildModuleProgress(progress,simulations,attempts), loading }
}
