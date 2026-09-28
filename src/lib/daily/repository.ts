import { getDatabase } from '../storage/database'
import { notifyStorageChanged } from '../storage/events'
import { date, isRecord, natural, validQuestion } from '../storage/validation'
import { courseModuleMap } from '../../../content/cpa/course/modules'
import { moduleReadings } from '../../../content/cpa/course/readings'
import type { DailyKind, DailySession, DailyStep } from './engine'
export const dayKey=(now=new Date())=>`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
export const sessionKey=(kind:DailyKind,day=dayKey())=>`session:${day}:${kind}`
export function validDailySession(value:unknown,key?:string):value is DailySession {
  if(!isRecord(value)||value.version!==1||typeof value.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value.date)||!['today','review'].includes(String(value.kind))||!date(value.createdAt)||!date(value.updatedAt))return false
  if(key&&key!==`session:${value.date}:${value.kind}`)return false
  if(!Array.isArray(value.steps)||value.steps.length>100||!natural(value.index)||value.index>value.steps.length)return false
  if(!value.steps.every(s=>isRecord(s)&&typeof s.id==='string'&&typeof s.reason==='string'&&natural(s.minutes)&&s.minutes>0&&(
    s.type==='question'?validQuestion(s.question)&&s.id===`question:${s.question.id}`&&(s.errorId===undefined||typeof s.errorId==='string'):
    s.type==='flashcard'?isRecord(s.card)&&['id','front','back'].every(k=>typeof (s.card as Record<string,unknown>)[k]==='string')&&s.id===`flashcard:${s.card.id}`:
    s.type==='reading'?typeof s.moduleId==='string'&&courseModuleMap.has(s.moduleId)&&moduleReadings[s.moduleId].sections.some(part=>part.id===s.sectionId)&&s.id===`reading:${s.moduleId}:${s.sectionId}`:false)))return false
  const ids=value.steps.map(s=>s.id)
  return new Set(ids).size===ids.length&&['done','skipped'].every(k=>Array.isArray(value[k])&&(value[k] as unknown[]).every(id=>typeof id==='string'&&ids.indexOf(id)<Number(value.index)&&ids.includes(id)))&&new Set([...(value.done as string[]),...(value.skipped as string[])]).size===Number(value.index)&&(value.done as string[]).length+(value.skipped as string[]).length===Number(value.index)
}
export async function getDailySession(kind:DailyKind) {
  const key=sessionKey(kind);const row=await (await getDatabase()).get('studyPlans',key)
  return validDailySession(row?.payload,key)?row.payload:null
}
export async function startDailySession(kind:DailyKind,steps:DailyStep[]) {
  const db=await getDatabase();const tx=db.transaction('studyPlans','readwrite');const id=sessionKey(kind)
  const previous=await tx.store.get(id)
  if(validDailySession(previous?.payload,id)){await tx.done;return previous.payload}
  const now=new Date().toISOString()
  const payload:DailySession={version:1,date:dayKey(),kind,steps:structuredClone(steps),index:0,done:[],skipped:[],createdAt:now,updatedAt:now}
  if(!validDailySession(payload,id))throw new Error('Não foi possível montar uma sessão válida.')
  await tx.store.put({id,payload,updatedAt:now});await tx.done;notifyStorageChanged();return payload
}
export async function advanceDailySession(session:DailySession,skipped=false) {
  const db=await getDatabase();const tx=db.transaction('studyPlans','readwrite');const id=sessionKey(session.kind,session.date)
  const row=await tx.store.get(id)
  if(!validDailySession(row?.payload,id))throw new Error('Sessão não encontrada.')
  const current=row.payload
  if(current.index!==session.index||current.index>=current.steps.length){await tx.done;return current}
  const step=current.steps[current.index]
  const updatedAt=new Date().toISOString()
  const payload={...current,index:current.index+1,done:skipped?current.done:[...current.done,step.id],skipped:skipped?[...current.skipped,step.id]:current.skipped,updatedAt}
  await tx.store.put({id,payload,updatedAt});await tx.done;notifyStorageChanged();return payload
}
export const dailyAttemptId=(session:DailySession)=>`${sessionKey(session.kind,session.date)}:${session.index}`
