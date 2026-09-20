import { useCallback, useEffect, useMemo, useState } from 'react'
import { cpaQuestions } from '../../../content/cpa/questions'
import { cpaLessonMap } from '../../../content/cpa/lessons'
import { buildStudyEngineSnapshot } from '../../lib/study-engine/engine'
import type { StudyEngineSnapshot } from '../../lib/study-engine/types'
import { STORAGE_CHANGED_EVENT } from '../../lib/storage/events'
import { getActiveFlashcards, getFlashcardReviews } from '../../lib/storage/repositories/flashcardRepository'
import { getAllLessonProgress, getQuizAttempts } from '../../lib/storage/repositories/learningRepository'
import { getQuestionAttempts, getQuestionErrors } from '../../lib/storage/repositories/questionRepository'
import { getSimulations } from '../../lib/storage/repositories/simulationRepository'
import { saveDailyStudyPlan } from '../../lib/storage/repositories/studyPlanRepository'
import { useStudent } from '../profile/StudentProvider'

const questionPdCodes=new Set(cpaQuestions.map((question)=>question.pdCode))
const questionDifficultyById=new Map(cpaQuestions.map((question)=>[question.id,question.difficulty]))
const lessonPdCodes=new Set(cpaLessonMap.keys())

export function useStudyEngine(){
  const {profile}=useStudent()
  const [snapshot,setSnapshot]=useState<StudyEngineSnapshot|null>(null)
  const [loading,setLoading]=useState(true)
  const load=useCallback(async()=>{
    if(!profile){setSnapshot(null);setLoading(false);return}
    setLoading(true)
    const [lessonProgress,quizAttempts,questionAttempts,simulations,errors,flashcards,flashcardReviews]=await Promise.all([
      getAllLessonProgress(),getQuizAttempts(),getQuestionAttempts(),getSimulations(),getQuestionErrors(true),getActiveFlashcards(),getFlashcardReviews(),
    ])
    const flashcardPdById=new Map(flashcards.map((card)=>[card.id,card.pdCode]))
    const next=buildStudyEngineSnapshot({
      lessonProgress,quizAttempts,questionAttempts,simulations,errors,flashcardReviews,flashcardPdById,questionDifficultyById,
      lessonPdCodes,questionPdCodes,dailyGoalMinutes:profile.dailyGoalMinutes,
    })
    setSnapshot(next)
    await saveDailyStudyPlan(next)
    setLoading(false)
  },[profile])
  useEffect(()=>{void load();const listener=()=>void load();window.addEventListener(STORAGE_CHANGED_EVENT,listener);return()=>window.removeEventListener(STORAGE_CHANGED_EVENT,listener)},[load])
  return useMemo(()=>({snapshot,loading,refresh:load}),[snapshot,loading,load])
}
