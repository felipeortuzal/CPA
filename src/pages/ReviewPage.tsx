import { AlertTriangle, ArrowRight, Brain, CalendarClock, Clock3, MoonStar, RefreshCw, Target, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Progress } from '../components/ui/Progress'
import { useReviewCenter } from '../features/review/useReviewCenter'

const typeLabel={flashcard:'Flashcard',error:'Erro',content:'Conteúdo'} as const

export function ReviewPage(){
  const {center,study,loading,refresh}=useReviewCenter()
  if(loading||!center||!study)return <div className="mx-auto max-w-7xl"><Card><p className="py-12 text-center text-sm text-slate-500">Montando sua fila de revisão...</p></Card></div>

  const modes=[
    {mode:'5',title:'5 minutos',description:'Uma revisão curtíssima para não quebrar a sequência.',icon:Zap},
    {mode:'10',title:'10 minutos',description:'Mistura erros, flashcards e pontos fracos de maior prioridade.',icon:Clock3},
    {mode:'20',title:'20 minutos',description:'Bloco mais completo para consolidar conteúdo sem entrar em simulado.',icon:Target},
    {mode:'eve',title:'Revisão de Véspera',description:'Só conteúdo já visto: erros, vencidos e pontos fracos. Nada de matéria nova.',icon:MoonStar},
  ]

  return <div className="mx-auto max-w-7xl space-y-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><div className="mb-2 flex items-center gap-2"><Badge>V8 · Central de Revisão</Badge><span className="text-sm text-slate-500">fila automática + repetição espaçada</span></div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">O que revisar agora</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">A fila combina flashcards vencidos, erros recorrentes, baixo domínio, dúvidas e conteúdo antigo usando os dados reais do Study Engine.</p></div><Button variant="secondary" onClick={()=>void refresh()}><RefreshCw className="h-4 w-4"/>Atualizar fila</Button></div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Card><Brain className="h-5 w-5 text-emerald-500"/><p className="mt-3 text-2xl font-black">{center.dueFlashcards}</p><p className="text-sm font-semibold">Flashcards vencidos</p></Card>
      <Card><AlertTriangle className="h-5 w-5 text-rose-500"/><p className="mt-3 text-2xl font-black">{center.unresolvedErrors}</p><p className="text-sm font-semibold">Erros pendentes</p></Card>
      <Card><AlertTriangle className="h-5 w-5 text-orange-500"/><p className="mt-3 text-2xl font-black">{center.recurrentErrors}</p><p className="text-sm font-semibold">Erros recorrentes</p></Card>
      <Card><Target className="h-5 w-5 text-violet-500"/><p className="mt-3 text-2xl font-black">{center.weakPdCount}</p><p className="text-sm font-semibold">PDs abaixo de 60</p></Card>
      <Card><CalendarClock className="h-5 w-5 text-amber-500"/><p className="mt-3 text-2xl font-black">{center.overdueContent}</p><p className="text-sm font-semibold">Conteúdos vencidos</p></Card>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{modes.map(({mode,title,description,icon:Icon})=><Card key={mode} className="flex flex-col"><div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/12 text-emerald-700 dark:text-emerald-300"><Icon className="h-5 w-5"/></div><h2 className="mt-4 font-bold">{title}</h2><p className="mt-1 flex-1 text-sm leading-6 text-slate-500">{description}</p><Link className="mt-5" to={`/revisao/sessao?mode=${mode}`}><Button className="w-full" disabled={center.queue.length===0}>Começar <ArrowRight className="h-4 w-4"/></Button></Link></Card>)}</div>

    <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-white/10"><div><h2 className="font-bold">Fila priorizada</h2><p className="mt-1 text-xs text-slate-500">Ordenada automaticamente; erros recorrentes vêm antes.</p></div><span className="text-sm font-black">{center.queue.length} itens</span></div>
        {center.queue.length===0?<div className="p-10 text-center"><p className="font-bold">Fila zerada.</p><p className="mt-1 text-sm text-slate-500">Estude, responda questões ou abra aulas para gerar novas revisões.</p></div>:<div className="divide-y divide-slate-100 dark:divide-white/[0.06]">{center.queue.slice(0,12).map((item,index)=><div key={item.id} className="flex items-start gap-3 p-4"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-black dark:bg-white/5">{index+1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Badge>{typeLabel[item.type]}</Badge>{item.pdCode?<span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-300">PD {item.pdCode}</span>:null}<span className="text-[11px] text-slate-400">~{item.estimatedMinutes} min</span></div><p className="mt-1 line-clamp-2 text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.reason}</p></div>{item.route?<Link to={item.route}><Button variant="secondary">Abrir</Button></Link>:null}</div>)}</div>}
      </Card>

      <div className="space-y-4">
        <Card><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Preparação</p><p className="mt-1 text-3xl font-black">{study.readinessScore}%</p></div><Target className="h-6 w-6 text-violet-500"/></div><p className="mt-2 text-sm font-semibold">{study.readinessLabel}</p><Progress value={study.readinessScore}/><p className="mt-3 text-xs leading-5 text-slate-500">Indicador interno; não é garantia de aprovação.</p></Card>
        <Card><div className="flex items-center gap-2"><Brain className="h-5 w-5 text-emerald-500"/><h2 className="font-bold">Flashcards</h2></div><p className="mt-2 text-sm leading-6 text-slate-500">Revise com Again, Hard, Good e Easy. O intervalo se adapta ao seu histórico.</p><Link to="/flashcards"><Button variant="secondary" className="mt-4 w-full">Abrir Flashcards</Button></Link></Card>
        <Card><h2 className="font-bold">Por macrotema</h2><div className="mt-4 space-y-4">{study.macroSummary.map((item)=><div key={item.macroCode}><div className="mb-1 flex items-center justify-between text-xs"><span className="font-semibold">Tema {item.macroCode}</span><span>{item.score}/100</span></div><Progress value={item.score}/></div>)}</div></Card>
      </div>
    </div>
  </div>
}
