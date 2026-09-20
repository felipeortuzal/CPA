import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowRight, Brain, CalendarClock, CheckCircle2, Gauge, RefreshCw, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Progress } from '../components/ui/Progress'
import { useStudyEngine } from '../features/study/useStudyEngine'
import type { MasteryLevel, StudyRecommendationKind } from '../lib/study-engine/types'

const kindLabel:Record<StudyRecommendationKind,string>={learn:'Estudar',review:'Revisar',practice:'Praticar',recover_error:'Corrigir erro'}
const levelLabel:Record<MasteryLevel,string>={new:'Novo',weak:'Fraco',developing:'Em desenvolvimento',strong:'Forte',mastered:'Dominado'}
const macroLabel:Record<string,string>={'1':'Tema 1','2':'Tema 2','3':'Tema 3','4':'Tema 4'}

function formatReview(value:string|null){
  if(!value)return'—'
  return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short'}).format(new Date(value))
}

export function ReviewPage(){
  const {snapshot,loading,refresh}=useStudyEngine()
  const [query,setQuery]=useState('')
  const [macro,setMacro]=useState('all')
  const filtered=useMemo(()=>{
    if(!snapshot)return[]
    const normalized=query.trim().toLowerCase()
    return snapshot.mastery
      .filter((item)=>macro==='all'||item.macroCode===macro)
      .filter((item)=>!normalized||[item.pdCode,item.title,item.macroTitle].join(' ').toLowerCase().includes(normalized))
      .sort((a,b)=>a.score-b.score||b.unresolvedErrors-a.unresolvedErrors||a.pdCode.localeCompare(b.pdCode,undefined,{numeric:true}))
  },[snapshot,query,macro])

  if(loading||!snapshot)return <div className="mx-auto max-w-7xl"><Card><p className="py-12 text-center text-sm text-slate-500">Calculando seu plano de estudo...</p></Card></div>

  return <div className="mx-auto max-w-7xl space-y-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div><div className="mb-2 flex items-center gap-2"><Badge>V7 · Study Engine</Badge><span className="text-sm text-slate-500">plano calculado com seus dados locais</span></div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Revisão de hoje</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">O motor combina estudo, mini quizzes, questões, simulados, recência, dúvidas e erros para decidir o que merece sua atenção agora.</p></div>
      <Button variant="secondary" onClick={()=>void refresh()}><RefreshCw className="h-4 w-4"/>Recalcular plano</Button>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card><div className="flex items-center justify-between"><Gauge className="h-5 w-5 text-emerald-500"/><span className="text-2xl font-black">{snapshot.overallMastery}%</span></div><p className="mt-3 text-sm font-semibold">Domínio ponderado</p><p className="mt-1 text-xs leading-5 text-slate-500">Média dos PDs ponderada pelos pesos oficiais 20/40/30/10.</p></Card>
      <Card><div className="flex items-center justify-between"><Target className="h-5 w-5 text-violet-500"/><span className="text-2xl font-black">{snapshot.readinessScore}%</span></div><p className="mt-3 text-sm font-semibold">{snapshot.readinessLabel}</p><p className="mt-1 text-xs leading-5 text-slate-500">Indicador interno de preparação; não é garantia de aprovação.</p></Card>
      <Card><div className="flex items-center justify-between"><CalendarClock className="h-5 w-5 text-amber-500"/><span className="text-2xl font-black">{snapshot.dueReviews}</span></div><p className="mt-3 text-sm font-semibold">Revisões vencidas</p><p className="mt-1 text-xs leading-5 text-slate-500">PDs já estudados cujo intervalo de revisão chegou ao fim.</p></Card>
      <Card><div className="flex items-center justify-between"><Brain className="h-5 w-5 text-sky-500"/><span className="text-2xl font-black">{snapshot.coveragePercent}%</span></div><p className="mt-3 text-sm font-semibold">Cobertura com evidência</p><p className="mt-1 text-xs leading-5 text-slate-500">Itens terminais com alguma evidência real de estudo ou prática.</p></Card>
    </div>

    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-slate-950 p-5 text-white dark:border-white/10 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Plano de hoje</p><h2 className="mt-1 text-2xl font-black">{snapshot.recommendedMinutes} min recomendados</h2></div>{snapshot.readyForExam?<span className="inline-flex items-center gap-2 rounded-xl bg-emerald-400/15 px-3 py-2 text-xs font-bold text-emerald-200"><CheckCircle2 className="h-4 w-4"/>Indicadores consistentes para testar a prova</span>:<span className="text-xs text-slate-400">Continue acumulando evidência antes de tratar a preparação como estável.</span>}</div>
      </div>
      {snapshot.today.length===0?<div className="p-8 text-center text-sm text-slate-500">Não há ação recomendada com o conteúdo disponível nesta versão.</div>:<div className="divide-y divide-slate-100 dark:divide-white/[0.06]">{snapshot.today.map((item,index)=><div key={item.pdCode} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-400/12 text-sm font-black text-emerald-700 dark:text-emerald-300">{index+1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Badge>{kindLabel[item.kind]}</Badge><span className="font-mono text-xs font-bold text-slate-500">PD {item.pdCode}</span><span className="text-xs text-slate-400">{macroLabel[item.macroCode]}</span></div><p className="mt-2 font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.reason}</p></div><div className="flex items-center gap-4 sm:text-right"><div><p className="text-lg font-black">{item.score}/100</p><p className="text-[11px] text-slate-500">domínio · ~{item.targetMinutes} min</p></div><Link to={item.route}><Button>Começar <ArrowRight className="h-4 w-4"/></Button></Link></div></div>)}</div>}
    </Card>

    <div className="grid gap-4 lg:grid-cols-4">{snapshot.macroSummary.map((item)=><Card key={item.macroCode}><div className="flex items-center justify-between"><span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-300">{item.macroCode}</span><span className="text-xs font-bold text-slate-500">peso {item.officialWeight}%</span></div><p className="mt-2 min-h-10 text-sm font-semibold leading-5">{item.title}</p><div className="mt-4 flex items-end justify-between"><span className="text-3xl font-black">{item.score}</span><span className="text-xs text-slate-500">/100</span></div><Progress value={item.score}/><div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500"><span>{item.coveragePercent}% cobertura</span><span>{item.dueReviews} vencidas</span><span>{item.weakItems} fracos</span><span>{item.totalItems} PDs</span></div></Card>)}</div>

    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="font-bold">Domínio por PD</h2><p className="mt-1 text-xs leading-5 text-slate-500">0–100 é um score de estudo interno e explicável; confiança separada evita tratar pouca evidência como domínio sólido.</p></div><div className="flex flex-col gap-2 sm:flex-row"><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Buscar PD ou assunto..." className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-white/5"/><select value={macro} onChange={(event)=>setMacro(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5"><option value="all">Todos os temas</option><option value="1">Tema 1</option><option value="2">Tema 2</option><option value="3">Tema 3</option><option value="4">Tema 4</option></select></div></div>
      <div className="mt-5 max-h-[680px] overflow-auto rounded-2xl border border-slate-200 dark:border-white/10"><table className="w-full min-w-[820px] text-left text-sm"><thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-[0.12em] text-slate-400 dark:bg-[#0b1824]"><tr><th className="px-4 py-3">PD</th><th>Assunto</th><th>Domínio</th><th>Confiança</th><th>Estado</th><th>Próxima revisão</th><th className="pr-4">Ação</th></tr></thead><tbody>{filtered.map((item)=>{const route=item.lessonAvailable?`/conteudos/${item.pdCode}`:item.questionAvailable?`/questoes?pd=${encodeURIComponent(item.pdCode)}`:'/trilha';return <tr key={item.pdCode} className="border-t border-slate-100 dark:border-white/[0.05]"><td className="px-4 py-3 font-mono text-xs font-bold">{item.pdCode}</td><td className="max-w-md py-3 pr-4"><p className="line-clamp-2">{item.title}</p>{item.unresolvedErrors>0?<p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600"><AlertTriangle className="h-3 w-3"/>{item.unresolvedErrors} erro(s) pendente(s)</p>:null}</td><td className="py-3 font-black">{item.score}</td><td className="py-3">{item.confidence}%</td><td className="py-3"><span className="text-xs font-semibold">{levelLabel[item.level]}</span></td><td className={`py-3 text-xs ${item.overdue?'font-bold text-amber-600':'text-slate-500'}`}>{item.evidenceCount===0?'Ainda não estudado':item.overdue?'Revisar agora':formatReview(item.nextReviewAt)}</td><td className="py-3 pr-4"><Link className="text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-300" to={route}>{item.lessonAvailable?'Abrir aula':item.questionAvailable?'Treinar':'Ver trilha'}</Link></td></tr>})}</tbody></table></div>
    </Card>

    <Card><h2 className="font-bold">Como o ciclo de revisão funciona</h2><p className="mt-2 text-sm leading-6 text-slate-500">A V7 usa uma heurística local e transparente: quanto maior o domínio, maior o intervalo até a próxima revisão. O intervalo varia de 1 a 30 dias e é recalculado sempre que surge nova evidência. Erros pendentes e dúvidas reduzem o domínio e antecipam a recomendação. Isso organiza o estudo; não pretende substituir uma medida científica de memória.</p>{snapshot.recentOfficialExamAverage!==null?<p className="mt-3 text-sm font-semibold">Média dos últimos simulados CPA completos: {snapshot.recentOfficialExamAverage}%.</p>:<p className="mt-3 text-sm text-slate-500">Ainda não há Modo Prova CPA completo suficiente para entrar no indicador de preparação.</p>}</Card>
  </div>
}