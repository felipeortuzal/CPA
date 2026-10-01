import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { BarChart3, BookOpen, Brain, CalendarDays, ClipboardCheck, FileText, GraduationCap, LayoutDashboard, Menu, Moon, RotateCcw, Settings, Sun, Target, X, type LucideIcon } from 'lucide-react'
import { CertificationSelector } from '../components/CertificationSelector'
import { OfflineBanner } from '../components/system/OfflineBanner'
import { useStudent } from '../features/profile/StudentProvider'
import { useTheme } from '../hooks/useTheme'
type NavItem=readonly [string,string,LucideIcon]
const groups: {title:string;items:NavItem[]}[]=[
  {title:'Início',items:[['Hoje','/',LayoutDashboard]]},
  {title:'Estudar',items:[['Módulos','/conteudos',GraduationCap],['Mapa do edital','/edital',BookOpen],['Inteligência da prova','/inteligencia',Brain]]},
  {title:'Praticar',items:[['Questões','/questoes',ClipboardCheck],['Simulados','/simulados',FileText]]},
  {title:'Revisar',items:[['Revisão de hoje','/revisao',RotateCcw],['Erros','/erros',Target],['Flashcards','/flashcards',Brain]]},
  {title:'Progresso',items:[['Plano','/plano',CalendarDays],['Estatísticas','/estatisticas',BarChart3]]},
]
export function AppLayout() {
  const [mobileOpen,setMobileOpen]=useState(false)
  const {theme,toggleTheme}=useTheme()
  const {profile}=useStudent()
  const location=useLocation()
  const trigger=useRef<HTMLButtonElement>(null),dialog=useRef<HTMLElement>(null),background=useRef<HTMLDivElement>(null)
  const displayName=profile?.displayName||'Aluno'
  const initials=displayName.split(/\s+/).slice(0,2).map(p=>p[0]).join('').toUpperCase()
  useEffect(()=>{
    if(!mobileOpen)return
    const originalOverflow=document.body.style.overflow
    document.body.style.overflow='hidden'
    if(background.current)background.current.inert=true
    const root=dialog.current
    const focusable=()=>Array.from(root?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]')??[]).filter(el=>el.getClientRects().length)
    focusable()[0]?.focus()
    const keys=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();setMobileOpen(false)}
      if(event.key==='Tab'){
        const elements=focusable(),first=elements[0],last=elements.at(-1)
        if(event.shiftKey&&(document.activeElement===first||!root?.contains(document.activeElement))){event.preventDefault();last?.focus()}
        else if(!event.shiftKey&&(document.activeElement===last||!root?.contains(document.activeElement))){event.preventDefault();first?.focus()}
      }
    }
    const resize=()=>{if(window.innerWidth>=1024)setMobileOpen(false)}
    document.addEventListener('keydown',keys);window.addEventListener('resize',resize)
    return()=>{document.body.style.overflow=originalOverflow;if(background.current)background.current.inert=false;document.removeEventListener('keydown',keys);window.removeEventListener('resize',resize);trigger.current?.focus()}
  },[mobileOpen])
  function item([label,to,Icon]:NavItem) {
    const extra=to==='/conteudos'&&(location.pathname==='/trilha'||location.pathname.startsWith('/modulos/'))
    return <NavLink end={to==='/'} key={to} to={to} onClick={()=>setMobileOpen(false)} className={({isActive})=>`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ${isActive||extra?'bg-emerald-400/12 text-emerald-700 dark:text-emerald-300':'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'}`}><Icon className="h-4 w-4" aria-hidden="true"/>{label}</NavLink>
  }
  const sidebar=<><div className="flex h-20 shrink-0 items-center gap-3 px-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400 font-black text-slate-950" aria-hidden="true">C</div><div><p className="font-bold">CPA Study</p><p className="text-xs text-slate-500">20 módulos · progresso local</p></div><button aria-label="Fechar menu" className="ml-auto rounded-lg p-2 lg:hidden" onClick={()=>setMobileOpen(false)}><X className="h-5 w-5"/></button></div><nav aria-label="Navegação principal" className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 pb-3">{groups.map(group=><div key={group.title}><p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">{group.title}</p>{group.items.map(item)}</div>)}</nav><nav aria-label="Ajuda e configurações" className="border-t border-slate-200 p-3 dark:border-white/10">{item(['Fontes e atualizações','/fontes',FileText])}{item(['Configurações','/configuracoes',Settings])}</nav></>
  return <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#07111c] dark:text-slate-100"><a href="#main-content" onClick={event=>{event.preventDefault();document.getElementById('main-content')?.focus()}} className="skip-link">Pular para o conteúdo principal</a><aside aria-label="Menu lateral" className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white/95 dark:border-white/10 dark:bg-[#091621] lg:flex">{sidebar}</aside>{mobileOpen&&<div className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" onMouseDown={()=>setMobileOpen(false)}><aside ref={dialog} role="dialog" aria-modal="true" aria-label="Menu de navegação" className="flex h-full w-72 max-w-[90vw] flex-col bg-white dark:bg-[#091621]" onMouseDown={event=>event.stopPropagation()}>{sidebar}</aside></div>}<div ref={background} className="lg:pl-64"><header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b border-slate-200/80 bg-slate-50/90 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#07111c]/90 sm:px-6 lg:px-8"><button ref={trigger} aria-label="Abrir menu" aria-expanded={mobileOpen} className="rounded-lg p-2 lg:hidden" onClick={()=>setMobileOpen(true)}><Menu className="h-5 w-5"/></button><CertificationSelector/><div className="ml-auto flex items-center gap-2"><div className="hidden text-right sm:block"><p className="max-w-40 truncate text-sm font-semibold">Olá, {displayName}</p><p className="text-xs text-slate-500">progresso salvo neste navegador</p></div><button aria-label="Alternar tema" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">{theme==='dark'?<Sun aria-hidden="true" className="h-4 w-4"/>:<Moon aria-hidden="true" className="h-4 w-4"/>}</button><NavLink aria-label="Abrir configurações" to="/configuracoes" className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-emerald-400 dark:text-slate-950">{initials||'A'}</NavLink></div></header><OfflineBanner/>{window.location.protocol==='file:'&&<div className="bg-amber-50 px-4 py-2 text-xs text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">Arquivo local · Exporte seu progresso antes de atualizar ou mover este HTML. <NavLink to="/configuracoes" className="font-bold underline">Abrir backup</NavLink></div>}<main id="main-content" tabIndex={-1} className="p-4 sm:p-6 lg:p-8"><Outlet/></main></div></div>
}
