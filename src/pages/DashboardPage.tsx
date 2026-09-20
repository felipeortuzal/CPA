import { ArrowRight, BookOpen, CheckCircle2, Clock3, Flame, Gauge, HelpCircle, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Progress } from '../components/ui/Progress'
import { Skeleton } from '../components/ui/Skeleton'
import { StatCard } from '../components/ui/StatCard'
import { useDashboardData } from '../features/dashboard/useDashboardData'
import { useStudyEngine } from '../features/study/useStudyEngine'

function formatActivity(value:string|null){
  return value?new Intl.DateTimeFormat('pt-BR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value)):'Nenhuma atividade ainda'
}

export function DashboardPage(){
  const {data:d,loading}=useDashboardData()
  const {snapshot:study,loading:studyLoading}=useStudyEngine()
  if(loading||!d)return <div className="mx-auto max-w-7xl space-y-6"><Skeleton className="h-24"/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-28"/>)}</div><Skeleton className="h-80"/></div>

  return <div className="mx-auto max-w-7xl space-y-6">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div><p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">CPA · progresso local</p><h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Olá, {d.name}.</h1><p className="mt-2 text-slate-500">Seu progresso está salvo neste navegador e continua disponível depois de fechar a plataforma.</p></div>
      <Card className="min-w-[280px]"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Última atividade</p><p className="mt-2 text-sm font-semibold">{formatActivity(d.lastActivity)}</p></Card>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Progresso CPA" value={`${d.cpaProgress}%`} helper="cobertura dos itens terminais do PD" icon={<Gauge className="h-5 w-5"/>}/>
      <StatCard label="Aulas estudadas" value={`${d.lessonsStudied}/105`} helper="Macrotema 1" icon={<CheckCircle2 className="h-5 w-5"/>}/>
      <StatCard label="Mini quizzes" value={String(d.quizzesCompleted)} helper={d.accuracy===null?'sem respostas ainda':`${d.accuracy}% de acerto`} icon={<HelpCircle className="h-5 w-5"/>}/>
      <StatCard label="Tempo ativo" value={`${d.studyHours}h`} helper={`${d.streak} dia(s) de sequência`} icon={<Clock3 className="h-5 w-5"/>}/>
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
      <Card>
        <div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="font-semibold">Macrotema 1</h2><p className="text-sm text-slate-500">Estrutura e dinâmica do Sistema Financeiro Nacional · peso oficial 20%.</p></div><span className="text-2xl font-black">{d.macro1Progress}%</span></div>
        <Progress value={d.macro1Progress}/>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Estudadas</p><p className="mt-1 text-xl font-bold">{d.lessonsStudied}/105</p></div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Quizzes</p><p className="mt-1 text-xl font-bold">{d.quizzesCompleted}</p></div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Acerto</p><p className="mt-1 text-xl font-bold">{d.accuracy===null?'—':`${d.accuracy}%`}</p></div>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">Macrotemas 2, 3 e 4 ainda não possuem aulas completas nesta versão. O indicador da CPA não inventa avanço nesses blocos.</p>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-400/[0.08] dark:to-white/[0.02]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">Continuar estudando</p>
        {d.continueLesson?<><p className="mt-4 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-300">PD {d.continueLesson.pdCode}</p><h2 className="mt-1 text-xl font-bold">{d.continueLesson.title}</h2><p className="mt-3 text-sm leading-6 text-slate-500">Retome a aula em andamento ou avance para o próximo ponto ainda não estudado.</p><Link to={`/conteudos/${d.continueLesson.pdCode}`} className="mt-6 block"><Button className="w-full">Continuar agora <ArrowRight className="h-4 w-4"/></Button></Link></>:<div className="mt-6 rounded-xl bg-emerald-400/10 p-4 text-sm"><BookOpen className="mb-2 h-5 w-5"/><p className="font-semibold">Macrotema 1 concluído</p></div>}
      </Card>
    </div>

    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-slate-950 p-5 text-white dark:border-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">V7 · Study Engine</p><h2 className="mt-1 text-xl font-black">Seu próximo melhor passo</h2></div>{study?<div className="text-right"><p className="text-2xl font-black">{study.readinessScore}%</p><p className="text-xs text-slate-400">{study.readinessLabel}</p></div>:null}</div>
      </div>
      {studyLoading||!study?<div className="p-6 text-sm text-slate-500">Calculando plano inteligente...</div>:<div className="p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Domínio ponderado</p><p className="mt-1 text-xl font-black">{study.overallMastery}%</p></div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Revisões vencidas</p><p className="mt-1 text-xl font-black">{study.dueReviews}</p></div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Plano de hoje</p><p className="mt-1 text-xl font-black">{study.recommendedMinutes} min</p></div>
        </div>
        {study.today[0]?<div className="mt-4 flex flex-col gap-3 rounded-2xl border border-emerald-300/50 bg-emerald-50 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/[0.05] sm:flex-row sm:items-center"><Target className="h-5 w-5 shrink-0 text-emerald-600"/><div className="min-w-0 flex-1"><p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">PD {study.today[0].pdCode}</p><p className="mt-1 font-semibold">{study.today[0].title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{study.today[0].reason}</p></div><Link to={study.today[0].route}><Button>Fazer agora <ArrowRight className="h-4 w-4"/></Button></Link></div>:null}
        <div className="mt-4 flex items-center justify-between gap-3"><p className="text-xs leading-5 text-slate-500">O indicador usa apenas evidências reais do seu histórico e não representa garantia de aprovação.</p><Link to="/revisao"><Button variant="secondary">Abrir plano completo</Button></Link></div>
      </div>}
    </Card>

    <Card><div className="flex items-center gap-3"><Flame className="h-5 w-5 text-orange-500"/><div><p className="font-semibold">Streak: {d.streak} dia(s)</p><p className="text-sm text-slate-500">Conta apenas atividade significativa, como concluir aula ou responder quiz. Apenas abrir o site não conta.</p></div></div></Card>
  </div>
}
