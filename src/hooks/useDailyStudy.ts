import { useEffect, useState } from 'react'
import { buildDailySteps, type DailyInput } from '../lib/daily/engine'
import { getCourseProgress } from '../lib/storage/repositories/courseRepository'
import { getQuestionAttempts, getQuestionErrors } from '../lib/storage/repositories/questionRepository'
import { getSimulations } from '../lib/storage/repositories/simulationRepository'
import { getActiveFlashcards, getFlashcardReviews } from '../lib/storage/repositories/flashcardRepository'
import { buildModuleProgress } from '../lib/course/progress'
import { STORAGE_CHANGED_EVENT, reportStorageError } from '../lib/storage/events'
import { useStudent } from '../features/profile/StudentProvider'
import { getDailySession } from '../lib/daily/repository'
import type { DailySession } from '../lib/daily/engine'
export function useDailyStudy(budgetOverride?: number) {
  const {profile}=useStudent()
  const [data,setData]=useState<DailyInput|null>(null)
  const [sessions,setSessions]=useState<{today:DailySession|null;review:DailySession|null}>({today:null,review:null})
  useEffect(()=>{
    let active=true;let generation=0
    const refresh=async()=>{
      const gen=++generation
      try {
        const [progress,attempts,simulations,errors,cards,reviews,today,review]=await Promise.all([getCourseProgress(),getQuestionAttempts(),getSimulations(),getQuestionErrors(),getActiveFlashcards(),getFlashcardReviews(),getDailySession('today'),getDailySession('review')])
        const requested=budgetOverride??profile?.dailyGoalMinutes??30
        const budget=Math.max(10,Math.min(120,requested))
        if(active&&generation===gen){setData({progress,attempts,simulations,errors,cards,reviews,modules:buildModuleProgress(progress,simulations,attempts),budget});setSessions({today,review})}
      }catch{if(active)reportStorageError()}
    }
    void refresh();window.addEventListener(STORAGE_CHANGED_EVENT,refresh);window.addEventListener('focus',refresh)
    return()=>{active=false;window.removeEventListener(STORAGE_CHANGED_EVENT,refresh);window.removeEventListener('focus',refresh)}
  },[profile?.dailyGoalMinutes,budgetOverride])
  return {data,sessions,loading:!data,today:data?buildDailySteps(data,'today'):[],review:data?buildDailySteps(data,'review'):[]}
}
