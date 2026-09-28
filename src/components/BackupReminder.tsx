import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBackupStatus } from '../lib/storage/repositories/backupStatusRepository'
import { STORAGE_CHANGED_EVENT, reportStorageError } from '../lib/storage/events'
export function useBackupStatus() {
  const [data,setData]=useState<Awaited<ReturnType<typeof getBackupStatus>>|null>(null)
  useEffect(()=>{let active=true;const load=()=>void getBackupStatus().then(data=>{if(active)setData(data)}).catch(reportStorageError);load();window.addEventListener(STORAGE_CHANGED_EVENT,load);return()=>{active=false;window.removeEventListener(STORAGE_CHANGED_EVENT,load)}},[])
  return data
}
export function BackupReminder() {
  const data=useBackupStatus()
  if(!data)return null
  const days=data.status?Math.floor((Date.now()-Date.parse(data.status.exportedAt))/86400000):null
  if(data.since<100&&!(data.since>=10&&(days===null||days>=7)))return null
  return <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6"><strong>Hora de guardar uma cópia?</strong> Você respondeu {data.since} questões desde a última exportação{days!==null?`, há ${days} dias`:''}. <Link to="/configuracoes" className="font-bold underline">Fazer backup</Link></div>
}
