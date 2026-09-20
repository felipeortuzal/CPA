import { useCallback, useEffect, useMemo, useState } from 'react'
import { cpaCurriculum } from '../../../content/cpa/curriculum'
import { cpaLessons } from '../../../content/cpa/lessons'
import { STORAGE_CHANGED_EVENT } from '../../lib/storage/events'
import { calculateStreak, getActivityDays, getStudySessions } from '../../lib/storage/repositories/activityRepository'
import { getAllLessonProgress, getQuizAttempts } from '../../lib/storage/repositories/learningRepository'
import { useStudent } from '../profile/StudentProvider'

export interface ThemeLessonProgress {
  macroCode:'1'|'2'|'3'|'4'
  title:string
  weight:number
  total:number
  studied:number
  progress:number
}

export interface LocalDashboardData {
  name:string
  cpaProgress:number
  lessonsStudied:number
  availableLessons:number
  themeProgress:ThemeLessonProgress[]
  quizzesCompleted:number
  accuracy:number|null
  studyHours:number
  streak:number
  lastActivity:string|null
  continueLesson:{pdCode:string;title:string}|null
}

const parents=new Set(cpaCurriculum.flatMap((item)=>item.parentCode?[item.parentCode]:[]))
const terminals=new Set(cpaCurriculum.filter((item)=>!parents.has(item.pdCode)).map((item)=>item.pdCode))
const themeMeta={
  '1':{title:'Estrutura e dinâmica do SFN',weight:20},
  '2':{title:'Produtos do mercado financeiro',weight:40},
  '3':{title:'Relacionamento com o cliente',weight:30},
  '4':{title:'Inovação e desenvolvimento de mercado',weight:10},
} as const

export function useDashboardData(){
  const {profile}=useStudent()
  const [data,setData]=useState<LocalDashboardData|null>(null)
  const [loading,setLoading]=useState(true)

  const load=useCallback(async()=>{
    if(!profile){setData(null);setLoading(false);return}
    setLoading(true)
    const [progressRows,quizzes,sessions,activityDays]=await Promise.all([getAllLessonProgress(),getQuizAttempts(),getStudySessions(),getActivityDays()])
    const studiedRows=progressRows.filter((row)=>row.status==='completed'||row.status==='mastered')
    const studiedCodes=new Set(studiedRows.map((row)=>row.pdCode))
    const lessonsStudied=cpaLessons.filter((lesson)=>studiedCodes.has(lesson.pdCode)).length
    const cpaStudied=[...studiedCodes].filter((code)=>terminals.has(code)).length
    const total=quizzes.reduce((sum,row)=>sum+row.total,0)
    const correct=quizzes.reduce((sum,row)=>sum+row.correct,0)
    const times=[...progressRows.map((row)=>row.lastStudiedAt),...quizzes.map((row)=>row.completedAt),...sessions.flatMap((row)=>row.endedAt?[row.endedAt]:[])].sort()
    const inProgress=[...progressRows].filter((row)=>row.status==='in_progress').sort((a,b)=>b.lastStudiedAt.localeCompare(a.lastStudiedAt))[0]
    const next=(inProgress&&cpaLessons.find((lesson)=>lesson.pdCode===inProgress.pdCode))??cpaLessons.find((lesson)=>!studiedCodes.has(lesson.pdCode))??null

    const themeProgress=(Object.keys(themeMeta) as Array<keyof typeof themeMeta>).map((macroCode)=>{
      const lessons=cpaLessons.filter((lesson)=>lesson.pdCode.startsWith(macroCode+'.'))
      const studied=lessons.filter((lesson)=>studiedCodes.has(lesson.pdCode)).length
      return{
        macroCode,
        title:themeMeta[macroCode].title,
        weight:themeMeta[macroCode].weight,
        total:lessons.length,
        studied,
        progress:lessons.length?Math.round(studied/lessons.length*100):0,
      }
    })

    setData({
      name:profile.displayName,
      cpaProgress:terminals.size?Math.round(cpaStudied/terminals.size*100):0,
      lessonsStudied,
      availableLessons:cpaLessons.length,
      themeProgress,
      quizzesCompleted:quizzes.length,
      accuracy:total?Math.round(correct/total*100):null,
      studyHours:Math.round(sessions.reduce((sum,row)=>sum+row.activeSeconds,0)/360)*.1,
      streak:calculateStreak(activityDays.map((row)=>row.date)),
      lastActivity:times.at(-1)??null,
      continueLesson:next?{pdCode:next.pdCode,title:next.title}:null,
    })
    setLoading(false)
  },[profile])

  useEffect(()=>{
    void load()
    const listener=()=>void load()
    window.addEventListener(STORAGE_CHANGED_EVENT,listener)
    return()=>window.removeEventListener(STORAGE_CHANGED_EVENT,listener)
  },[load])

  return useMemo(()=>({data,loading,refresh:load}),[data,loading,load])
}
