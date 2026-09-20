import type { StudyEngineSnapshot } from '../../study-engine/types'
import { getDatabase } from '../database'
import type { StudyPlanRecord } from '../types'

export interface PersistedStudyPlan {
  generatedAt: string
  overallMastery: number
  coveragePercent: number
  sufficientCoveragePercent: number
  readinessScore: number | null
  readinessDataStatus: StudyEngineSnapshot['readinessDataStatus']
  readinessLabel: string
  readinessMessage: string
  readinessBreakdown: StudyEngineSnapshot['readinessBreakdown']
  readyForExam: boolean
  recentOfficialExamAverage: number | null
  officialExamCount: number
  recentPracticeAccuracy: number | null
  dueReviews: number
  recommendedMinutes: number
  today: StudyEngineSnapshot['today']
  recommendations: StudyEngineSnapshot['recommendations']
  macroSummary: StudyEngineSnapshot['macroSummary']
  weakTopics: StudyEngineSnapshot['weakTopics']
  weakPdCodes: string[]
}

function dateKey(value:string){return value.slice(0,10)}

export async function saveDailyStudyPlan(snapshot:StudyEngineSnapshot){
  const db=await getDatabase()
  const payload:PersistedStudyPlan={
    generatedAt:snapshot.generatedAt,overallMastery:snapshot.overallMastery,coveragePercent:snapshot.coveragePercent,
    sufficientCoveragePercent:snapshot.sufficientCoveragePercent,readinessScore:snapshot.readinessScore,readinessDataStatus:snapshot.readinessDataStatus,
    readinessLabel:snapshot.readinessLabel,readinessMessage:snapshot.readinessMessage,readinessBreakdown:snapshot.readinessBreakdown,
    readyForExam:snapshot.readyForExam,recentOfficialExamAverage:snapshot.recentOfficialExamAverage,officialExamCount:snapshot.officialExamCount,
    recentPracticeAccuracy:snapshot.recentPracticeAccuracy,dueReviews:snapshot.dueReviews,recommendedMinutes:snapshot.recommendedMinutes,
    today:snapshot.today,recommendations:snapshot.recommendations,macroSummary:snapshot.macroSummary,weakTopics:snapshot.weakTopics,weakPdCodes:snapshot.weakPdCodes,
  }
  const record:StudyPlanRecord={id:`daily:${dateKey(snapshot.generatedAt)}`,payload,updatedAt:snapshot.generatedAt}
  await db.put('studyPlans',record)
  const all=await db.getAll('studyPlans')
  const stale=all.filter((item)=>item.id.startsWith('daily:')).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).slice(45)
  await Promise.all(stale.map((item)=>db.delete('studyPlans',item.id)))
  return record
}

export async function getStudyPlans(){
  const rows=await (await getDatabase()).getAll('studyPlans')
  return rows.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))
}
