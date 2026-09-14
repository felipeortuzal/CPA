import { useCallback, useEffect, useMemo, useState } from 'react'
import { cpaCurriculum } from '../../../content/cpa/curriculum'
import { macro1Lessons } from '../../../content/cpa/lessons/macro-1'
import { STORAGE_CHANGED_EVENT } from '../../lib/storage/events'
import { calculateStreak, getActivityDays, getStudySessions } from '../../lib/storage/repositories/activityRepository'
import { getAllLessonProgress, getQuizAttempts } from '../../lib/storage/repositories/learningRepository'
import { useStudent } from '../profile/StudentProvider'

export interface LocalDashboardData { name:string; cpaProgress:number; lessonsStudied:number; macro1Progress:number; quizzesCompleted:number; accuracy:number|null; studyHours:number; streak:number; lastActivity:string|null; continueLesson:{pdCode:string;title:string}|null }
const parents=new Set(cpaCurriculum.flatMap((item)=>item.parentCode?[item.parentCode]:[]));const terminals=new Set(cpaCurriculum.filter((item)=>!parents.has(item.pdCode)).map((item)=>item.pdCode))

export function useDashboardData(){
 const {profile}=useStudent();const [data,setData]=useState<LocalDashboardData|null>(null);const [loading,setLoading]=useState(true)
 const load=useCallback(async()=>{if(!profile){setData(null);setLoading(false);return}setLoading(true);const [progressRows,quizzes,sessions,activityDays]=await Promise.all([getAllLessonProgress(),getQuizAttempts(),getStudySessions(),getActivityDays()]);const studiedRows=progressRows.filter((x)=>x.status==='completed'||x.status==='mastered');const studiedCodes=new Set(studiedRows.map((x)=>x.pdCode));const macro1Studied=macro1Lessons.filter((x)=>studiedCodes.has(x.pdCode)).length;const cpaStudied=[...studiedCodes].filter((x)=>terminals.has(x)).length;const total=quizzes.reduce((s,x)=>s+x.total,0);const correct=quizzes.reduce((s,x)=>s+x.correct,0);const times=[...progressRows.map((x)=>x.lastStudiedAt),...quizzes.map((x)=>x.completedAt),...sessions.flatMap((x)=>x.endedAt?[x.endedAt]:[])].sort();const inProgress=[...progressRows].filter((x)=>x.status==='in_progress').sort((a,b)=>b.lastStudiedAt.localeCompare(a.lastStudiedAt))[0];const next=(inProgress&&macro1Lessons.find((x)=>x.pdCode===inProgress.pdCode))??macro1Lessons.find((x)=>!studiedCodes.has(x.pdCode))??null;setData({name:profile.displayName,cpaProgress:terminals.size?Math.round(cpaStudied/terminals.size*100):0,lessonsStudied:macro1Studied,macro1Progress:Math.round(macro1Studied/macro1Lessons.length*100),quizzesCompleted:quizzes.length,accuracy:total?Math.round(correct/total*100):null,studyHours:Math.round(sessions.reduce((s,x)=>s+x.activeSeconds,0)/360)*.1,streak:calculateStreak(activityDays.map((x)=>x.date)),lastActivity:times.at(-1)??null,continueLesson:next?{pdCode:next.pdCode,title:next.title}:null});setLoading(false)},[profile])
 useEffect(()=>{void load();const listener=()=>{void load()};window.addEventListener(STORAGE_CHANGED_EVENT,listener);return()=>window.removeEventListener(STORAGE_CHANGED_EVENT,listener)},[load])
 return useMemo(()=>({data,loading,refresh:load}),[data,loading,load])
}
