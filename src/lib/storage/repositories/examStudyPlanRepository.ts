import type { ExamStudyPlan, ExamStudyPlanSettings } from '../../study-plan/types'
import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { StudyPlanRecord } from '../types'

const SETTINGS_ID='exam-plan:settings'
const CURRENT_ID='exam-plan:current'

function isRecord(value:unknown):value is Record<string,unknown>{return typeof value==='object'&&value!==null&&!Array.isArray(value)}
function validSettings(value:unknown):value is ExamStudyPlanSettings{
  if(!isRecord(value))return false
  if(value.examDate!==null&&typeof value.examDate!=='string')return false
  if(value.startDate!==null&&typeof value.startDate!=='string')return false
  if(!Array.isArray(value.availableWeekdays)||!value.availableWeekdays.every((day)=>typeof day==='number'&&Number.isInteger(day)&&day>=0&&day<=6))return false
  return typeof value.minutesPerDay==='number'&&typeof value.updatedAt==='string'
}

export async function getExamStudyPlanSettings(){
  const row=await (await getDatabase()).get('studyPlans',SETTINGS_ID)
  return row&&validSettings(row.payload)?row.payload:null
}

export async function saveExamStudyPlanSettings(settings:ExamStudyPlanSettings){
  const record:StudyPlanRecord={id:SETTINGS_ID,payload:settings,updatedAt:settings.updatedAt}
  await (await getDatabase()).put('studyPlans',record)
  notifyStorageChanged()
  return settings
}

export async function saveExamStudyPlanSnapshot(plan:ExamStudyPlan){
  const record:StudyPlanRecord={id:CURRENT_ID,payload:plan,updatedAt:plan.generatedAt}
  await (await getDatabase()).put('studyPlans',record)
  return record
}

export async function getExamStudyPlanSnapshot(){
  const row=await (await getDatabase()).get('studyPlans',CURRENT_ID)
  return row?.payload as ExamStudyPlan|undefined
}
