import { importBackup, parseBackupFile } from '../lib/storage/backup'
import { useState, useRef, type FormEvent } from 'react'
import { ArrowRight, GraduationCap } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useStudent } from '../features/profile/StudentProvider'

export function WelcomePage() {
  const { createStudent, refresh } = useStudent(); const [name,setName] = useState(''); const [saving,setSaving] = useState(false); const [error,setError] = useState<string|null>(null)
  const backupInput = useRef<HTMLInputElement>(null)
  async function restore(file?: File) {
    if (!file) return
    setSaving(true); setError(null)
    try { await importBackup(await parseBackupFile(file)); await refresh() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível restaurar o backup.') }
    finally { setSaving(false) }
  }
  async function submit(event: FormEvent) { event.preventDefault(); const clean=name.trim(); if (!clean) { setError('Digite seu nome para continuar.'); return }; setSaving(true); setError(null); try { await createStudent(clean) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar seu nome.') } finally { setSaving(false) } }
  return <div className="grid min-h-screen place-items-center bg-slate-50 p-4 text-slate-950 dark:bg-[#07111c] dark:text-slate-100"><Card className="w-full max-w-md p-7 sm:p-9"><div className="mb-7 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400 text-slate-950"><GraduationCap className="h-7 w-7"/></div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Nova CPA 2026</p><h1 className="mt-2 text-3xl font-black tracking-tight">Bem-vindo ao CPA</h1><p className="mt-3 text-sm leading-6 text-slate-500">Seu progresso fica salvo somente neste navegador. Não há login, servidor ou assinatura.</p><form onSubmit={submit} className="mt-7 space-y-4"><label className="block"><span className="mb-2 block text-sm font-semibold">Como podemos te chamar?</span><input autoFocus maxLength={80} value={name} onChange={(event)=>setName(event.target.value)} placeholder="Felipe, Thó..." className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-white/5"/></label>{error ? <p className="rounded-xl bg-rose-400/10 p-3 text-sm text-rose-700 dark:text-rose-300">{error}</p> : null}<Button className="w-full py-3" disabled={saving}>{saving ? 'Salvando...' : 'Começar a estudar'} <ArrowRight className="h-4 w-4"/></Button></form><input ref={backupInput} type="file" accept=".json,application/json" className="hidden" onChange={(event)=>{void restore(event.target.files?.[0]);event.target.value=''}}/><Button className="mt-3 w-full" variant="secondary" disabled={saving} onClick={()=>backupInput.current?.click()}>Já tenho um backup</Button></Card></div>
}
