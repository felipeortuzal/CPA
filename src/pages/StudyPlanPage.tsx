import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, RefreshCw, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Progress } from '../components/ui/Progress'
import { useStudent } from '../features/profile/StudentProvider'
import { useStudyEngine } from '../features/study/useStudyEngine'
import { generateExamStudyPlan, PHASE_META } from '../lib/study-plan/engine'
import type { ExamStudyPlanSettings } from '../lib/study-plan/types'
import { getExamStudyPlanSettings, saveExamStudyPlanSettings, saveExamStudyPlanSnapshot } from '../lib/storage/repositories/examStudyPlanRepository'

const weekdays=[['Dom',0],['Seg',1],['Ter',2],['Qua',3],['Qui',4],['Sex',5],['Sáb',6]] as const
const inputClass='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-white/5'

function formatDate(value:string){return new Intl.DateTimeFormat('pt-BR',{weekday:'short',day:'2-digit',month:'short'}).format(new Date(`${value}T12:00:00`))}
function phaseProgress(days:number,total:number){return total?Math.round(days/total*100):0}

export function StudyPlanPage(){
  const {profile}=useStudent()
  const {snapshot:study,loading:studyLoading}=useStudyEngine()
  const [saved,setSaved]=useState<ExamStudyPlanSettings|null>(null)
  const [loaded,setLoaded]=useState(false)
  const [examDate,setExamDate]=useState('')
  const [startDate,setStartDate]=useState('')
  const [minutes,setMinutes]=useState(profile?.dailyGoalMinutes??30)
  const [days,setDays]=useState<number[]>([1,2,3,4,5])
  const [showAll,setShowAll]=useState(false)
  const [message,setMessage]=useState('')
  const [error,setError]=useState('')

  useEffect(()=>{if(profile&&!saved)setMinutes(profile.dailyGoalMinutes)},[profile,saved])
  useEffect(()=>{void (async()=>{const settings=await getExamStudyPlanSettings();if(settings){setSaved(settings);setExamDate(settings.examDate??'');setStartDate(settings.startDate??'');setMinutes(settings.minutesPerDay);setDays(settings.availableWeekdays)}setLoaded(true)})()},[])

  const effective=useMemo<ExamStudyPlanSettings>(()=>saved??{examDate:null,startDate:null,availableWeekdays:[1,2,3,4,5],minutesPerDay:profile?.dailyGoalMinutes??30,updatedAt:new Date().toISOString()},[saved,profile])
  const plan=useMemo(()=>study?generateExamStudyPlan(effective,study):null,[effective,study])
  useEffect(()=>{if(plan)void saveExamStudyPlanSnapshot(plan)},[plan])

  function toggleDay(day:number){setDays((current)=>current.includes(day)?current.filter((item)=>item!==day):[...current,day].sort((a,b)=>a-b))}
  async function persist(nextExamDate:string|null){
    setMessage('');setError('')
    if(days.length===0){setError('Selecione pelo menos um dia disponível para estudar.');return}
    if(minutes<5||minutes>600){setError('Defina entre 5 e 600 minutos por dia.');return}
    if(nextExamDate&&startDate&&startDate>=nextExamDate){setError('O início do plano deve ser anterior à data da prova.');return}
    if(nextExamDate&&nextExamDate<new Date().toISOString().slice(0,10)){setError('A data da prova não pode estar no passado.');return}
    const next:ExamStudyPlanSettings={examDate:nextExamDate,startDate:startDate||null,availableWeekdays:days,minutesPerDay:minutes,updatedAt:new Date().toISOString()}
    await saveExamStudyPlanSettings(next);setSaved(next);setExamDate(nextExamDate??'');setMessage(nextExamDate?'Plano salvo e recalculado.':'Data da prova removida. O plano passou para modo contínuo.')
  }
  async function submit(event:FormEvent){event.preventDefault();await persist(examDate||null)}

  if(!loaded||studyLoading||!study||!plan)return <div className="mx-auto max-w-7xl"><Card><p className="py-12 text-center text-sm text-slate-500">Montando seu plano de estudos...</p></Card></div>
  const visibleDays=showAll?plan.agenda:plan.agenda.slice(0,14)
  const paceLabel=plan.paceStatus==='ahead'?'Adiantado':plan.paceStatus==='behind'?'Atenção ao ritmo':plan.paceStatus==='continuous'?'Plano contínuo':'No ritmo'

  return <div className="mx-auto max-w-7xl space-y-6">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><div className="mb-2 flex items-center gap-2"><Badge>V10 · Plano de Estudos</Badge><span className="text-sm text-slate-500">adaptativo e 100% local</span></div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Plano até a prova</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Defina quando pretende fazer a CPA e quanto tempo realmente tem. O plano usa seu domínio, erros, flashcards, simulados e progresso para redistribuir a agenda.</p></div><Link to="/revisao"><Button variant="secondary">Abrir revisão <ArrowRight className="h-4 w-4"/></Button></Link></div>

    <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <Card>
        <div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-emerald-500"/><h2 className="font-bold">Configuração</h2></div>
        <form onSubmit={(event)=>void submit(event)} className="mt-5 space-y-5">
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">Data prevista da prova</span><input className={inputClass} type="date" value={examDate} onChange={(event)=>setExamDate(event.target.value)}/><span className="mt-1 block text-xs text-slate-500">Pode ficar em branco. Sem data, o plano funciona em janela móvel.</span></label>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">Início do plano <span className="font-normal text-slate-400">(opcional)</span></span><input className={inputClass} type="date" value={startDate} onChange={(event)=>setStartDate(event.target.value)}/></label>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">Minutos por dia</span><div className="flex items-center gap-3"><input className={inputClass} type="number" min={5} max={600} step={5} value={minutes} onChange={(event)=>setMinutes(Number(event.target.value))}/><Clock3 className="h-5 w-5 shrink-0 text-slate-400"/></div></label>
          <div><p className="mb-2 text-sm font-semibold">Dias disponíveis</p><div className="grid grid-cols-4 gap-2 sm:grid-cols-7 xl:grid-cols-4">{weekdays.map(([label,day])=><button type="button" key={day} onClick={()=>toggleDay(day)} className={`rounded-xl border px-2 py-2 text-xs font-bold transition ${days.includes(day)?'border-emerald-400 bg-emerald-400/12 text-emerald-700 dark:text-emerald-300':'border-slate-200 text-slate-500 dark:border-white/10'}`}>{label}</button>)}</div></div>
          <div className="flex flex-wrap gap-2"><Button type="submit"><RefreshCw className="h-4 w-4"/>Salvar e recalcular</Button>{saved?.examDate?<Button type="button" variant="secondary" onClick={()=>void persist(null)}>Remover data da prova</Button>:null}</div>
        </form>
        {message?<div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4"/>{message}</div>:null}
        {error?<p className="mt-4 rounded-xl bg-rose-400/10 p-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>:null}
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="bg-slate-950 p-6 text-white"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-300">Plano recalculado com seus dados</p><h2 className="mt-2 text-2xl font-black">{saved?.examDate?`${plan.daysUntilExam} dia(s) até a prova`:'Sem data definida'}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{plan.paceMessage}</p></div><Badge>{paceLabel}</Badge></div></div>
        <div className="grid gap-3 p-5 sm:grid-cols-3"><div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Sessões disponíveis</p><p className="mt-1 text-2xl font-black">{plan.availableStudyDays}</p></div><div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Minutos planejados</p><p className="mt-1 text-2xl font-black">{plan.plannedMinutes}</p></div><div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Dias com simulado</p><p className="mt-1 text-2xl font-black">{plan.simulationDays}</p></div></div>
        <div className="border-t border-slate-200 p-5 dark:border-white/10"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Base usada no recálculo</p><div className="mt-3 flex flex-wrap gap-2">{plan.recommendationBasis.map((item)=><span key={item} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold dark:bg-white/5">{item}</span>)}</div></div>
      </Card>
    </div>

    <Card><div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold">Fases do plano</h2><p className="mt-1 text-sm text-slate-500">A distribuição muda quando você atrasa, avança ou melhora/piora o desempenho.</p></div><Target className="h-5 w-5 text-violet-500"/></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{plan.phases.map((phase)=><div key={phase.phase} className={`rounded-2xl border p-4 ${phase.phase===plan.currentPhase?'border-emerald-400 bg-emerald-400/[0.06]':'border-slate-200 dark:border-white/10'}`}><div className="flex items-center justify-between gap-3"><h3 className="font-bold">{PHASE_META[phase.phase].label}</h3><span className="text-xs font-black">{phase.days} dia(s)</span></div><p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{phase.purpose}</p><Progress value={phaseProgress(phase.days,plan.availableStudyDays)}/>{phase.startDate?<p className="mt-2 text-[11px] text-slate-400">{formatDate(phase.startDate)} → {formatDate(phase.endDate!)}</p>:null}</div>)}</div></Card>

    <Card className="overflow-hidden p-0"><div className="flex flex-col gap-2 border-b border-slate-200 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold">Agenda diária</h2><p className="mt-1 text-xs text-slate-500">Cada atividade abre diretamente a área correta da plataforma.</p></div><span className="text-xs font-semibold text-slate-400">{plan.agenda.length} sessão(ões)</span></div>{plan.agenda.length===0?<div className="p-10 text-center"><CalendarDays className="mx-auto h-8 w-8 text-amber-500"/><p className="mt-3 font-bold">Nenhum dia disponível antes da prova.</p><p className="mt-1 text-sm text-slate-500">Ajuste a data, o início ou os dias da semana.</p></div>:<div className="divide-y divide-slate-100 dark:divide-white/[0.06]">{visibleDays.map((day)=><div key={day.date} className="grid gap-3 p-4 lg:grid-cols-[150px_1fr]"><div><p className="text-sm font-black capitalize">{formatDate(day.date)}</p><p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">{day.phaseLabel}</p><p className="mt-1 text-[11px] text-slate-400">{day.minutes} min</p></div><div className="grid gap-2 md:grid-cols-2">{day.tasks.map((task)=><Link key={task.id} to={task.route} className="group rounded-xl border border-slate-200 p-3 transition hover:border-emerald-400 dark:border-white/10"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{task.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{task.description}</p></div><span className="shrink-0 text-[11px] font-bold text-slate-400">{task.minutes}m</span></div><span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 opacity-0 transition group-hover:opacity-100">Abrir <ArrowRight className="h-3 w-3"/></span></Link>)}</div></div>)}</div>}{plan.agenda.length>14?<div className="border-t border-slate-200 p-4 text-center dark:border-white/10"><Button variant="secondary" onClick={()=>setShowAll((value)=>!value)}>{showAll?'Mostrar só próximas 14':'Ver agenda completa'}</Button></div>:null}</Card>

    <p className="text-xs leading-5 text-slate-500">O plano é recalculado com base no histórico local real. Ele organiza estudo; não prevê aprovação e não substitui as regras oficiais do exame.</p>
  </div>
}
