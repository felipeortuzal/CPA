import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, BookOpen, Brain, ClipboardCheck, FileText, GraduationCap, LayoutDashboard, LogOut, Menu, Moon, RotateCcw, Settings, Sun, Target, X } from 'lucide-react'
import { CertificationSelector } from '../components/CertificationSelector'
import { useAuth } from '../features/auth/AuthProvider'
import { useProfile } from '../features/auth/ProfileProvider'
import { useTheme } from '../hooks/useTheme'

const nav = [
  ['Dashboard', '/', LayoutDashboard], ['Trilha de Estudos', '/trilha', GraduationCap], ['Conteúdos', '/conteudos', BookOpen], ['Questões', '/questoes', ClipboardCheck], ['Simulados', '/simulados', FileText], ['Revisão', '/revisao', RotateCcw], ['Flashcards', '/flashcards', Brain], ['Caderno de Erros', '/erros', Target], ['Estatísticas', '/estatisticas', BarChart3], ['Fontes', '/fontes', FileText]
] as const

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { signOut, user } = useAuth()
  const { profile } = useProfile()
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Aluno'
  const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

  const sidebar = <><div className="flex h-20 items-center gap-3 px-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400 font-black text-slate-950">C</div><div><p className="font-bold tracking-tight">CPA Study</p><p className="text-xs text-slate-500">Certificações ANBIMA</p></div><button aria-label="Fechar menu" className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button></div><nav className="space-y-1 px-3">{nav.map(([label, to, Icon]) => <NavLink end={to === '/'} key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-emerald-400/12 text-emerald-700 dark:text-emerald-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'}`}><Icon className="h-4 w-4" />{label}</NavLink>)}</nav><div className="mt-auto space-y-1 p-3"><NavLink to="/configuracoes" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"><Settings className="h-4 w-4" />Configurações</NavLink><button onClick={() => void signOut()} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-white/5 dark:hover:text-rose-300"><LogOut className="h-4 w-4"/>Sair</button></div></>

  return <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#07111c] dark:text-slate-100"><aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#091621]/95 lg:flex">{sidebar}</aside>{mobileOpen && <div className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"><aside className="flex h-full w-72 flex-col bg-white dark:bg-[#091621]">{sidebar}</aside></div>}<div className="lg:pl-64"><header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b border-slate-200/80 bg-slate-50/80 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#07111c]/80 sm:px-6 lg:px-8"><button aria-label="Abrir menu" className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></button><CertificationSelector /><div className="ml-auto flex items-center gap-2"><div className="hidden text-right sm:block"><p className="max-w-40 truncate text-sm font-semibold">{displayName}</p><p className="max-w-40 truncate text-xs text-slate-500">{user?.email}</p></div><button aria-label="Alternar tema" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">{theme === 'dark' ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}</button><NavLink aria-label="Abrir configurações" to="/configuracoes" className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-emerald-400 dark:text-slate-950">{initials || 'A'}</NavLink></div></header><main className="p-4 sm:p-6 lg:p-8"><Outlet /></main></div></div>
}
