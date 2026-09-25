import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { CheckCircle2, DatabaseBackup, Download, Save, Trash2, Upload, UserRound } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { certifications } from '../data/certifications'
import { useStudent } from '../features/profile/StudentProvider'
import { createBackup, downloadBackup, getBackupSummary, importBackup, parseBackupFile, resetAllProgress } from '../lib/storage/backup'

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-white/5 dark:text-white'

export function SettingsPage() {
  const { profile, loading, updateStudent, refresh } = useStudent()
  const inputRef = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState('')
  const [certification, setCertification] = useState('CPA')
  const [dailyGoal, setDailyGoal] = useState(30)
  const [saving, setSaving] = useState(false)
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    setDisplayName(profile.displayName)
    setCertification(profile.currentCertification)
    setDailyGoal(profile.dailyGoalMinutes)
  }, [profile])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true); setMessage(null); setError(null)
    try {
      await updateStudent({ displayName: displayName.trim(), currentCertification: certification, dailyGoalMinutes: dailyGoal })
      setMessage('Configurações salvas neste navegador.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar as configurações.')
    } finally { setSaving(false) }
  }

  async function exportProgress() {
    setBusyAction('export'); setMessage(null); setError(null)
    try { downloadBackup(await createBackup()); setMessage('Backup exportado com sucesso.') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível exportar o backup.') }
    finally { setBusyAction(null) }
  }

  async function chooseImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setBusyAction('import'); setMessage(null); setError(null)
    try {
      const backup = await parseBackupFile(file)
      const summary = getBackupSummary(backup)
      const name = summary.profileName ?? 'sem perfil'
      const ok = window.confirm(`Importar o backup de ${name}?\n\nAulas: ${summary.lessons}\nMini quizzes: ${summary.quizzes}\nQuestões respondidas: ${summary.questions}\nSimulados: ${summary.simulations}\nErros: ${summary.errors}\n\nUma cópia dos dados atuais será baixada antes da substituição.`)
      if (!ok) return
      downloadBackup(await createBackup(), '-antes-da-importacao')
      await importBackup(backup)
      await refresh()
      setMessage('Backup importado. Seu progresso local foi restaurado.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível importar o backup.')
    } finally { setBusyAction(null) }
  }

  async function resetProgress() {
    const first = window.confirm('Isso apagará TODO o progresso salvo neste navegador. Antes de continuar, recomendamos exportar um backup. Deseja prosseguir?')
    if (!first) return
    const typed = window.prompt('Confirmação final: digite APAGAR para remover todos os dados locais.')
    if (typed !== 'APAGAR') { setError('Exclusão cancelada: a confirmação não correspondeu a APAGAR.'); return }
    setBusyAction('reset'); setMessage(null); setError(null)
    try { await resetAllProgress(); await refresh() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível apagar os dados locais.') }
    finally { setBusyAction(null) }
  }

  if (loading || !profile) return <div className="mx-auto max-w-3xl space-y-4"><div className="h-9 w-48 animate-pulse rounded-xl bg-slate-200 dark:bg-white/10"/><div className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10"/></div>

  return <div className="mx-auto max-w-3xl space-y-6">
    <div><h1 className="text-3xl font-bold tracking-tight">Configurações</h1><p className="mt-2 text-slate-500">Perfil local, rotina de estudos e segurança dos seus dados.</p></div>
    <Card>
      <div className="mb-6 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-700 dark:text-emerald-300"><UserRound className="h-5 w-5"/></div><div><h2 className="font-semibold">Perfil local</h2><p className="text-sm text-slate-500">Sem conta e sem login. Este perfil existe apenas neste navegador.</p></div></div>
      <form onSubmit={submit} className="space-y-5">
        <label className="block"><span className="mb-1.5 block text-sm font-medium">Alterar nome</span><input className={inputClass} required maxLength={80} value={displayName} onChange={(e) => setDisplayName(e.target.value)}/></label>
        <label className="block"><span className="mb-1.5 block text-sm font-medium">Certificação atual</span><select className={inputClass} value={certification} onChange={(e) => setCertification(e.target.value)}>{certifications.map((item) => <option key={item.id} value={item.id} disabled={!item.available}>{item.name}{!item.available ? ' — em breve' : ''}</option>)}</select></label>
        <label className="block"><span className="mb-1.5 block text-sm font-medium">Meta diária</span><div className="flex items-center gap-3"><input className={inputClass} type="number" min={5} max={600} step={5} value={dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))}/><span className="shrink-0 text-sm text-slate-500">minutos</span></div></label>
        <Button disabled={saving} type="submit"><Save className="h-4 w-4"/>{saving ? 'Salvando...' : 'Salvar alterações'}</Button>
      </form>
    </Card>

    <Card>
      <div className="mb-5 flex items-start gap-3"><DatabaseBackup className="mt-0.5 h-5 w-5 text-emerald-500"/><div><h2 className="font-semibold">Dados e Backup</h2><p className="mt-2 text-sm font-semibold">Faça um backup ao terminar seus estudos. Guarde o JSON junto do HTML.</p><p className="mt-1 text-sm leading-6 text-slate-500">O conteúdo está incluído nesta versão. Seu nome, progresso, quizzes, favoritos, estatísticas e demais dados pessoais ficam no IndexedDB deste navegador.</p></div></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="secondary" disabled={busyAction !== null} onClick={() => void exportProgress()}><Download className="h-4 w-4"/>Exportar progresso</Button>
        <Button variant="secondary" disabled={busyAction !== null} onClick={() => inputRef.current?.click()}><Upload className="h-4 w-4"/>Importar progresso</Button>
      </div>
      <input ref={inputRef} className="hidden" type="file" accept="application/json,.json" onChange={(event) => void chooseImport(event)}/>
      <div className="mt-5 border-t border-slate-200 pt-5 dark:border-white/10"><Button variant="secondary" disabled={busyAction !== null} className="text-rose-700 dark:text-rose-300" onClick={() => void resetProgress()}><Trash2 className="h-4 w-4"/>Apagar todo o progresso</Button><p className="mt-2 text-xs leading-5 text-slate-500">A exclusão exige duas confirmações e não acontece silenciosamente.</p></div>
    </Card>

    {message ? <div className="flex items-center gap-2 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4"/>{message}</div> : null}
    {error ? <p className="rounded-xl bg-rose-400/10 p-3 text-sm text-rose-700 dark:text-rose-300">{error}</p> : null}
    <Card><h2 className="font-semibold">Privacidade</h2><p className="mt-2 text-sm leading-6 text-slate-500">Nenhum dado de estudo é enviado para servidor obrigatório. Felipe e Thó possuem bancos locais independentes nos próprios navegadores/computadores. O HTML e o site têm progressos separados. Exporte antes de atualizar, mover ou renomear o HTML, limpar o navegador ou trocar de computador. Importe o backup para continuar no novo local.</p></Card>
  </div>
}
