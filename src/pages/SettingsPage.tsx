import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, LogOut, Save, UserRound } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { certifications } from '../data/certifications'
import { useAuth } from '../features/auth/AuthProvider'
import { useProfile } from '../features/auth/ProfileProvider'

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-white/5 dark:text-white'

export function SettingsPage() {
  const { user, signOut } = useAuth()
  const { profile, loading, updateProfile } = useProfile()
  const [displayName, setDisplayName] = useState('')
  const [certification, setCertification] = useState('CPA')
  const [dailyGoal, setDailyGoal] = useState(30)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    setDisplayName(profile.display_name)
    setCertification(profile.current_certification)
    setDailyGoal(profile.daily_goal_minutes)
  }, [profile])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true); setMessage(null); setError(null)
    try {
      await updateProfile({
        display_name: displayName.trim(),
        current_certification: certification,
        daily_goal_minutes: dailyGoal,
      })
      setMessage('Configurações salvas e sincronizadas.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar as configurações.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="mx-auto max-w-3xl space-y-4"><div className="h-9 w-48 animate-pulse rounded-xl bg-slate-200 dark:bg-white/10"/><div className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10"/></div>

  return <div className="mx-auto max-w-3xl space-y-6"><div><h1 className="text-3xl font-bold tracking-tight">Configurações</h1><p className="mt-2 text-slate-500">Preferências da sua conta e rotina de estudos.</p></div><Card><div className="mb-6 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-700 dark:text-emerald-300"><UserRound className="h-5 w-5"/></div><div><h2 className="font-semibold">Perfil</h2><p className="text-sm text-slate-500">{user?.email}</p></div></div><form onSubmit={submit} className="space-y-5"><label className="block"><span className="mb-1.5 block text-sm font-medium">Nome</span><input className={inputClass} required maxLength={80} value={displayName} onChange={(e) => setDisplayName(e.target.value)}/></label><label className="block"><span className="mb-1.5 block text-sm font-medium">Certificação atual</span><select className={inputClass} value={certification} onChange={(e) => setCertification(e.target.value)}>{certifications.map((item) => <option key={item.id} value={item.id} disabled={!item.available}>{item.name}{!item.available ? ' — em breve' : ''}</option>)}</select></label><label className="block"><span className="mb-1.5 block text-sm font-medium">Meta diária</span><div className="flex items-center gap-3"><input className={inputClass} type="number" min={5} max={600} step={5} value={dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))}/><span className="shrink-0 text-sm text-slate-500">minutos</span></div></label>{message && <div className="flex items-center gap-2 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4"/>{message}</div>}{error && <p className="rounded-xl bg-rose-400/10 p-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>}<div className="flex flex-col gap-3 sm:flex-row"><Button disabled={saving} type="submit"><Save className="h-4 w-4"/>{saving ? 'Salvando...' : 'Salvar alterações'}</Button><Button type="button" variant="secondary" onClick={() => void signOut()}><LogOut className="h-4 w-4"/>Sair da conta</Button></div></form></Card><Card><h2 className="font-semibold">Privacidade dos estudos</h2><p className="mt-2 text-sm leading-6 text-slate-500">Seu progresso, tentativas, simulados, flashcards privados e sessões de estudo ficam associados ao seu usuário. As políticas RLS do banco impedem que outra conta consulte ou altere esses registros.</p></Card></div>
}
