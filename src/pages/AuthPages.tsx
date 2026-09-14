import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, CheckCircle2, KeyRound, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from '../features/auth/AuthProvider'

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-white/5 dark:text-white'

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 dark:bg-[#07111c] dark:text-slate-100 sm:grid sm:place-items-center">
    <div className="w-full max-w-md">
      <div className="mb-7 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400 font-black text-slate-950">C</div><div><p className="font-bold tracking-tight">CPA Study</p><p className="text-xs text-slate-500">Estudo com progresso sincronizado</p></div></div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
        <div className="mb-6"><h1 className="text-2xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p></div>
        {children}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4"/>Autenticação protegida pelo Supabase Auth</div>
    </div>
  </div>
}

function ConfigNotice() {
  const { configured } = useAuth()
  if (configured) return null
  return <div className="mb-5 rounded-2xl border border-amber-300/50 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200">Configure <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no ambiente para habilitar login e sincronização.</div>
}

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true); setError(null)
    try { await signIn(email, password); navigate('/') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível entrar.') }
    finally { setLoading(false) }
  }

  return <AuthShell title="Entrar" subtitle="Acesse seu progresso individual, simulados e histórico de estudos."><ConfigNotice/>{params.get('confirmed') && <div className="mb-5 flex gap-2 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4 shrink-0"/>E-mail confirmado. Você já pode entrar.</div>}<form onSubmit={submit} className="space-y-4"><label className="block"><span className="mb-1.5 block text-sm font-medium">E-mail</span><div className="relative"><Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400"/><input className={`${inputClass} pl-10`} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com"/></div></label><label className="block"><span className="mb-1.5 block text-sm font-medium">Senha</span><div className="relative"><LockKeyhole className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400"/><input className={`${inputClass} pl-10`} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha"/></div></label>{error && <p className="rounded-xl bg-rose-400/10 p-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>}<div className="flex justify-end"><Link className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300" to="/recuperar-senha">Esqueci minha senha</Link></div><Button disabled={loading} className="w-full" type="submit">{loading ? 'Entrando...' : 'Entrar'}<ArrowRight className="h-4 w-4"/></Button></form><p className="mt-6 text-center text-sm text-slate-500">Ainda não tem conta? <Link className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300" to="/cadastro">Criar conta</Link></p></AuthShell>
}

export function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (password.length < 8) { setError('Use uma senha com pelo menos 8 caracteres.'); return }
    setLoading(true); setError(null); setNotice(null)
    try {
      const result = await signUp(email, password, displayName)
      if (result.needsEmailConfirmation) setNotice('Conta criada. Confirme o e-mail enviado pelo Supabase antes de entrar.')
      else navigate('/')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível criar a conta.') }
    finally { setLoading(false) }
  }

  return <AuthShell title="Criar conta" subtitle="Felipe e Thó devem criar contas separadas, cada uma com seu próprio e-mail."><ConfigNotice/><form onSubmit={submit} className="space-y-4"><label className="block"><span className="mb-1.5 block text-sm font-medium">Nome</span><div className="relative"><UserRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400"/><input className={`${inputClass} pl-10`} required maxLength={80} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Felipe ou Thó"/></div></label><label className="block"><span className="mb-1.5 block text-sm font-medium">E-mail</span><input className={inputClass} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com"/></label><label className="block"><span className="mb-1.5 block text-sm font-medium">Senha</span><input className={inputClass} type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo de 8 caracteres"/></label>{error && <p className="rounded-xl bg-rose-400/10 p-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>}{notice && <p className="rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">{notice}</p>}<Button disabled={loading || Boolean(notice)} className="w-full" type="submit">{loading ? 'Criando...' : 'Criar conta'}</Button></form><p className="mt-6 text-center text-sm text-slate-500">Já tem conta? <Link className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300" to="/login">Entrar</Link></p></AuthShell>
}

export function RecoveryPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError(null)
    try { await resetPassword(email); setSent(true) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível enviar o e-mail.') }
    finally { setLoading(false) }
  }

  return <AuthShell title="Recuperar senha" subtitle="Enviaremos um link seguro para definir uma nova senha."><ConfigNotice/>{sent ? <div className="space-y-5"><div className="rounded-2xl bg-emerald-400/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">Se o e-mail estiver cadastrado, o link de recuperação será enviado. Verifique também a caixa de spam.</div><Link className="block text-center text-sm font-semibold text-emerald-700 dark:text-emerald-300" to="/login">Voltar ao login</Link></div> : <form onSubmit={submit} className="space-y-4"><label className="block"><span className="mb-1.5 block text-sm font-medium">E-mail</span><input className={inputClass} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com"/></label>{error && <p className="rounded-xl bg-rose-400/10 p-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>}<Button disabled={loading} className="w-full" type="submit">{loading ? 'Enviando...' : 'Enviar link'}<Mail className="h-4 w-4"/></Button></form>}</AuthShell>
}

export function UpdatePasswordPage() {
  const { updatePassword, loading: authLoading, user } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (password.length < 8) { setError('Use uma senha com pelo menos 8 caracteres.'); return }
    if (password !== confirm) { setError('As senhas não coincidem.'); return }
    setLoading(true); setError(null)
    try { await updatePassword(password); navigate('/') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível atualizar a senha.') }
    finally { setLoading(false) }
  }

  return <AuthShell title="Nova senha" subtitle="Defina uma nova senha para sua conta.">{!authLoading && !user && <div className="mb-5 rounded-2xl bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200">Abra esta página pelo link de recuperação recebido por e-mail para validar sua sessão.</div>}<form onSubmit={submit} className="space-y-4"><label className="block"><span className="mb-1.5 block text-sm font-medium">Nova senha</span><div className="relative"><KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400"/><input className={`${inputClass} pl-10`} type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}/></div></label><label className="block"><span className="mb-1.5 block text-sm font-medium">Confirmar nova senha</span><input className={inputClass} type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)}/></label>{error && <p className="rounded-xl bg-rose-400/10 p-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>}<Button disabled={loading || authLoading || !user} className="w-full" type="submit">{loading ? 'Atualizando...' : 'Salvar nova senha'}</Button></form></AuthShell>
}
