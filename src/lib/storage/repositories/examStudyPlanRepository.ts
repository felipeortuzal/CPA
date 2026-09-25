import { validStudyPlanSettings } from '../../study-plan/validation'
import type { ExamStudyPlan, ExamStudyPlanSettings } from '../../study-plan/types'
import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { StudyPlanRecord } from '../types'

const SETTINGS_ID='exam-plan:settings'
const CURRENT_ID='exam-plan:current'

export async function getExamStudyPlanSettings(){
  const row=await (await getDatabase()).get('studyPlans',SETTINGS_ID)
  return row&&validStudyPlanSettings(row.payload)?row.payload:null
}

export async function saveExamStudyPlanSettings(settings:ExamStudyPlanSettings){
  if(!validStudyPlanSettings(settings)) throw new Error('Configuração do plano inválida. Confira as datas, os dias e os minutos.')
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
