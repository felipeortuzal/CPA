import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { LocalBackup, LocalBackupV2 } from '../types'
export interface BackupStatus { exportedAt:string; answeredCount:number }
export function validBackupStatus(value:unknown):value is BackupStatus {
  if(!value||typeof value!=='object')return false
  const p=value as BackupStatus
  return typeof p.exportedAt==='string'&&Number.isFinite(Date.parse(p.exportedAt))&&Number.isSafeInteger(p.answeredCount)&&p.answeredCount>=0
}
export function backupAnswerCount(backup:LocalBackup) {
  return (backup.backupVersion===2?backup.questionAttempts.length:0)+backup.simulations.reduce((sum,s)=>sum+Object.values(s.payload.answers).filter(a=>a!==null).length,0)
}
export function prepareBackupExport(backup:LocalBackupV2) {
  const payload:BackupStatus={exportedAt:backup.exportedAt,answeredCount:backupAnswerCount(backup)}
  return {...backup,studyPlans:[...backup.studyPlans.filter(row=>row.id!=='backup:status'),{id:'backup:status',payload,updatedAt:backup.exportedAt}]}
}
export async function recordBackupExport(backup:LocalBackupV2) {
  const row=backup.studyPlans.find(row=>row.id==='backup:status')
  if(row&&validBackupStatus(row.payload)){await (await getDatabase()).put('studyPlans',row);notifyStorageChanged()}
}
export async function getBackupStatus() {
  const db=await getDatabase()
  const [row,attempts,sims]=await Promise.all([db.get('studyPlans','backup:status'),db.getAll('questionAttempts'),db.getAll('simulations')])
  const status=validBackupStatus(row?.payload)?row.payload:null
  const total=attempts.length+sims.reduce((sum,s)=>sum+Object.values(s.payload.answers).filter(a=>a!==null).length,0)
  return {status,since:Math.max(0,total-(status?.answeredCount??0))}
}
