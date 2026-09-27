import { useEffect, useState } from 'react'
import { getCourseProgress, type CourseProgress } from '../lib/storage/repositories/courseRepository'
import { getSimulations } from '../lib/storage/repositories/simulationRepository'
import { STORAGE_CHANGED_EVENT, reportStorageError } from '../lib/storage/events'
import type { SimulationRecord } from '../lib/storage/types'
export function useCourseProgress() {
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({})
  const [simulations, setSimulations] = useState<SimulationRecord[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true; let generation = 0
    const refresh = async () => {
      const current = ++generation
      try {
        const [p, s] = await Promise.all([getCourseProgress(), getSimulations()])
        if (active && current === generation) { setProgress(p); setSimulations(s.filter(row => row.payload.mode === 'module')); setLoading(false) }
      } catch { if (active) reportStorageError() }
    }
    void refresh(); window.addEventListener(STORAGE_CHANGED_EVENT, refresh)
    return () => { active = false; window.removeEventListener(STORAGE_CHANGED_EVENT, refresh) }
  }, [])
  return { progress, simulations, loading }
}
