import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildAnalyticsSnapshot, type AnalyticsSnapshot } from '../../lib/analytics/engine'
import { STORAGE_CHANGED_EVENT } from '../../lib/storage/events'
import { getStudySessions } from '../../lib/storage/repositories/activityRepository'
import { getAllLessonProgress, getQuizAttempts } from '../../lib/storage/repositories/learningRepository'
import { getQuestionAttempts, getQuestionErrors } from '../../lib/storage/repositories/questionRepository'
import { getSimulations } from '../../lib/storage/repositories/simulationRepository'

export function useAnalyticsData(){
  const [snapshot,setSnapshot]=useState<AnalyticsSnapshot|null>(null)
  const [loading,setLoading]=useState(true)

  const load=useCallback(async()=>{
    setLoading(true)
    const [attempts,errors,simulations,sessions,lessons,quizzes]=await Promise.all([
      getQuestionAttempts(),
      getQuestionErrors(true),
      getSimulations(),
      getStudySessions(),
      getAllLessonProgress(),
      getQuizAttempts(),
    ])
    setSnapshot(buildAnalyticsSnapshot({attempts,errors,simulations,sessions,lessons,quizzes}))
    setLoading(false)
  },[])

  useEffect(()=>{
    void load()
    const listener=()=>void load()
    window.addEventListener(STORAGE_CHANGED_EVENT,listener)
    return()=>window.removeEventListener(STORAGE_CHANGED_EVENT,listener)
  },[load])

  return useMemo(()=>({snapshot,loading,refresh:load}),[snapshot,loading,load])
}
