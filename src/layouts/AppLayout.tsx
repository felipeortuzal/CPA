import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, BookOpen, Brain, CalendarDays, ClipboardCheck, FileText, GraduationCap, Layers3, LayoutDashboard, Menu, Moon, RotateCcw, Settings, Sun, Target, X } from 'lucide-react'
import { CertificationSelector } from '../components/CertificationSelector'
import { OfflineBanner } from '../components/system/OfflineBanner'
import { useStudent } from '../features/profile/StudentProvider'
import { useTheme } from '../hooks/useTheme'

const nav = [['Dashboard','/',LayoutDashboard],['Trilha de Estudos','/trilha',GraduationCap],['Conteúdos','/conteudos',BookOpen],['Questões','/questoes',ClipboardCheck],['Simulados','/simulados',FileText],['Plano de Estudos','/plano',CalendarDays],['Estudo Ativo','/estudo-ativo',Layers3],['Revisão','/revisao',RotateCcw],['Flashcards','/flashcards',Brain],['Caderno de Erros','/erros',Target],['Estatísticas','/estatisticas',BarChart3],['Fontes e Atualizações','/fontes',FileText]] as const

export function AppLayout() {
  const [mobileOpen,setMobileOpen] = useState(false)
  const { theme,toggleTheme } = useTheme()
  const { profile } = useStudent()
  const displayName=profile?.displayName||'Aluno'
  const initials=displayName.split(/\s+/).slice(0,2).map((p)=>p[0]).join('').toUpperCase()

  useEffect(() => {
    if (!mobileOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [mobileOpen])

  const sidebar=<><div className="flex h-20 items-center gap-3 px-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400 font-black text-slate-950" aria-hidden="true">C</div><div><p className="font-bold tracking-tight">CPA Study</p><p className="text-xs text-slate-500">100% local</p></div><button aria-label="Fechar menu" className="ml-auto rounded-lg p-2 focus-visible:outline-none lg:hidden" onClick={()=>setMobileOpen(false)}><X className="h-5 w-5"/></button></div><nav aria-label="Navegação principal" className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3">{nav.map(([label,to,Icon])=><NavLink end={to==='/'} key={to} to={to} onClick={()=>setMobileOpen(false)} className={({isActive})=>`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive?'bg-emerald-400/12 text-emerald-700 dark:text-emerald-300':'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'}`}><Icon className="h-4 w-4" aria-hidden="true"/>{label}</NavLink>)}</nav><div className="mt-auto p-3"><NavLink to="/configuracoes" onClick={()=>setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"><Settings className="h-4 w-4" aria-hidden="true"/>Configurações</NavLink></div></>

  return <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#07111c] dark:text-slate-100">
    <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>
    <aside aria-label="Menu lateral" className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#091621]/95 lg:flex">{sidebar}</aside>
    {mobileOpen?<div className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" onMouseDown={()=>setMobileOpen(false)}><aside role="dialog" aria-modal="true" aria-label="Menu de navegação" className="flex h-full w-72 flex-col bg-white dark:bg-[#091621]" onMouseDown={(event)=>event.stopPropagation()}>{sidebar}</aside></div>:null}
    <div className="lg:pl-64">
      <header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b border-slate-200/80 bg-slate-50/80 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#07111c]/80 sm:px-6 lg:px-8">
        <button aria-label="Abrir menu" aria-expanded={mobileOpen} className="rounded-lg p-2 lg:hidden" onClick={()=>setMobileOpen(true)}><Menu className="h-5 w-5"/></button>
        <CertificationSelector/>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden text-right sm:block"><p className="max-w-40 truncate text-sm font-semibold">Olá, {displayName}</p><p className="text-xs text-slate-500">progresso salvo neste navegador</p></div>
          <button aria-label="Alternar tema" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">{theme==='dark'?<Sun className="h-4 w-4" aria-hidden="true"/>:<Moon className="h-4 w-4" aria-hidden="true"/>}</button>
          <NavLink aria-label="Abrir configurações" to="/configuracoes" className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-emerald-400 dark:text-slate-950">{initials||'A'}</NavLink>
        </div>
      </header>
      <OfflineBanner/>
      <main id="main-content" tabIndex={-1} className="p-4 sm:p-6 lg:p-8"><Outlet/></main>
    </div>
  </div>
}
