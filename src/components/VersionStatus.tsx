import { useState } from 'react'
import { APP_VERSION, CONTENT_REVIEW_DATE, checkVersion } from '../lib/version'
import { useBackupStatus } from './BackupReminder'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
export function VersionStatus() {
  const backup=useBackupStatus()
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[available,setAvailable]=useState(false)
  async function check() {
    if(busy)return
    setBusy(true);setAvailable(false)
    try{const result=await checkVersion();setAvailable(result.available);setMessage(result.available?`v${result.version} disponível. Exporte seu progresso antes de baixar e substituir o HTML.`:`Você está na versão publicada mais recente (v${APP_VERSION}).`)}catch{setMessage('Não foi possível verificar agora. Confira a conexão e tente novamente. A versão atual continua funcionando.')}finally{setBusy(false)}
  }
  return <Card><h2 className="font-bold">Versão e segurança do progresso</h2><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-slate-500">Versão instalada</dt><dd className="font-semibold">v{APP_VERSION}</dd></div><div><dt className="text-slate-500">Última revisão editorial de questões</dt><dd>{new Date(`${CONTENT_REVIEW_DATE}T12:00:00`).toLocaleDateString('pt-BR')} · não representa verificação normativa integral do acervo</dd></div><div><dt className="text-slate-500">Última exportação de backup</dt><dd>{backup?.status?new Date(backup.status.exportedAt).toLocaleString('pt-BR'):'Nunca'}{backup?` · ${backup.since} respostas desde então`:''}</dd></div></dl><p className="mt-3 text-xs leading-6 text-slate-500">Confira se o JSON foi salvo na sua pasta de downloads. A atualização é manual e não substitui seus arquivos automaticamente.</p><Button className="mt-4" variant="secondary" disabled={busy} onClick={()=>void check()}>{busy?'Consultando...':'Verificar nova versão'}</Button>{message&&<p role="status" className="mt-4 text-sm leading-6">{message}</p>}{available&&<a className="mt-3 block text-sm font-bold text-emerald-700 underline dark:text-emerald-300" href="https://github.com/felipeortuzal/CPA/blob/main/CPA_Study.html" target="_blank" rel="noreferrer">Abrir HTML atualizado no GitHub</a>}</Card>
}
