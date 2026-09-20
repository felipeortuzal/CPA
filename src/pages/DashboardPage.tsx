import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Clock3, Flame, Gauge, HelpCircle, Target } from 'lucide-react'
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

const factorLabel={
  coverage:'Cobertura do edital',
  mastery:'Domínio dos PDs',
  fullExams:'Simulados completos',
  recentPerformance:'Desempenho recente',
  consistency:'Consistência',
  themeBalance:'Equilíbrio entre temas',
} as const

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
      <StatCard label="Aulas estudadas" value={`${d.lessonsStudied}/${d.availableLessons}`} helper="445 PDs terminais disponíveis" icon={<CheckCircle2 className="h-5 w-5"/>}/>
      <StatCard label="Mini quizzes" value={String(d.quizzesCompleted)} helper={d.accuracy===null?'sem respostas ainda':`${d.accuracy}% de acerto`} icon={<HelpCircle className="h-5 w-5"/>}/>
      <StatCard label="Tempo ativo" value={`${d.studyHours}h`} helper={`${d.streak} dia(s) de sequência`} icon={<Clock3 className="h-5 w-5"/>}/>
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
      <Card>
        <div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="font-semibold">Cobertura das aulas</h2><p className="text-sm text-slate-500">Todos os 445 PDs terminais possuem aula completa.</p></div><span className="text-2xl font-black">{d.cpaProgress}%</span></div>
        <div className="space-y-5">{d.themeProgress.map((theme)=><div key={theme.macroCode}>
          <div className="mb-2 flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Tema {theme.macroCode} · {theme.title}</p><p className="text-xs text-slate-500">Peso oficial {theme.weight}% · {theme.studied}/{theme.total} aulas</p></div><span className="text-sm font-black">{theme.progress}%</span></div>
          <Progress value={theme.progress}/>
        </div>)}</div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Estudadas</p><p className="mt-1 text-xl font-bold">{d.lessonsStudied}/{d.availableLessons}</p></div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Mini quizzes</p><p className="mt-1 text-xl font-bold">{d.quizzesCompleted}</p></div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Acerto</p><p className="mt-1 text-xl font-bold">{d.accuracy===null?'—':`${d.accuracy}%`}</p></div>
        </div>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-400/[0.08] dark:to-white/[0.02]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">Continuar estudando</p>
        {d.continueLesson?<><p className="mt-4 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-300">PD {d.continueLesson.pdCode}</p><h2 className="mt-1 text-xl font-bold">{d.continueLesson.title}</h2><p className="mt-3 text-sm leading-6 text-slate-500">Retome a aula em andamento ou avance para o próximo ponto ainda não estudado.</p><Link to={`/conteudos/${d.continueLesson.pdCode}`} className="mt-6 block"><Button className="w-full">Continuar agora <ArrowRight className="h-4 w-4"/></Button></Link></>:<div className="mt-6 rounded-xl bg-emerald-400/10 p-4 text-sm"><BookOpen className="mb-2 h-5 w-5"/><p className="font-semibold">Todas as aulas da CPA foram concluídas</p></div>}
      </Card>
    </div>

    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-slate-950 p-5 text-white dark:border-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">V9 · Study Engine</p><h2 className="mt-1 text-2xl font-black">Prontidão CPA</h2></div>
          {study?<div className="sm:text-right"><p className="text-3xl font-black">{study.readinessScore===null?'Dados insuficientes':`${study.readinessScore}%`}</p><p className="text-xs text-slate-400">{study.readinessLabel}</p></div>:null}
        </div>
      </div>
      {studyLoading||!study?<div className="p-6 text-sm text-slate-500">Calculando evidências reais do seu histórico...</div>:<div className="space-y-5 p-5">
        <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
          <p className="text-sm font-semibold">{study.readinessMessage}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">A pontuação considera cobertura, domínio, simulados completos recentes, desempenho recente, consistência e equilíbrio entre os quatro temas. Simulados completos recentes recebem peso maior.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Domínio ponderado</p><p className="mt-1 text-xl font-black">{study.overallMastery}%</p></div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Cobertura com evidência</p><p className="mt-1 text-xl font-black">{study.coveragePercent}%</p><p className="mt-1 text-[11px] text-slate-400">{study.sufficientCoveragePercent}% com amostra suficiente</p></div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-xs text-slate-500">Modo Prova recente</p><p className="mt-1 text-xl font-black">{study.recentOfficialExamAverage===null?'—':`${study.recentOfficialExamAverage}%`}</p><p className="mt-1 text-[11px] text-slate-400">{study.officialExamCount} simulado(s) completo(s) usados</p></div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{Object.entries(study.readinessBreakdown).map(([key,value])=><div key={key} className="rounded-xl border border-slate-200 p-3 dark:border-white/10"><div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold">{factorLabel[key as keyof typeof factorLabel]}</span><span>{value}%</span></div><Progress value={value}/></div>)}</div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div><div className="mb-3 flex items-center justify-between"><h3 className="font-bold">O que estudar agora</h3><span className="text-xs text-slate-400">máx. 3 recomendações</span></div>{study.recommendations.length===0?<p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-500 dark:bg-white/5">Ainda não há recomendação baseada em evidência suficiente.</p>:<div className="space-y-2">{study.recommendations.map((item,index)=><Link key={item.pdCode} to={item.route} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-emerald-400 dark:border-white/10"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-400/10 text-xs font-black text-emerald-700 dark:text-emerald-300">{index+1}</div><div className="min-w-0 flex-1"><p className="font-mono text-[11px] font-bold text-emerald-600">PD {item.pdCode}</p><p className="line-clamp-1 text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.reason}</p></div><ArrowRight className="h-4 w-4 shrink-0"/></Link>)}</div>}</div>

          <div><div className="mb-3 flex items-center justify-between"><h3 className="font-bold">Pontos fracos</h3><span className="text-xs text-slate-400">ranking por evidência real</span></div>{study.weakTopics.length===0?<p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-500 dark:bg-white/5">Sem fraquezas confiáveis para ranquear ainda.</p>:<div className="space-y-2">{study.weakTopics.slice(0,5).map((item)=><Link key={item.pdCode} to={item.route} className="block rounded-xl border border-slate-200 p-3 transition hover:border-amber-400 dark:border-white/10"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[11px] font-bold text-slate-400">PD {item.pdCode} · Tema {item.macroCode}</p><p className="mt-1 line-clamp-1 text-sm font-semibold">{item.title}</p></div>{item.falseConfidence?<AlertTriangle className="h-4 w-4 shrink-0 text-amber-500"/>:null}</div><p className="mt-1 text-xs text-slate-500">{item.reason}</p></Link>)}</div>}</div>
        </div>

        <div className="flex items-center justify-between gap-3"><p className="text-xs leading-5 text-slate-500">Indicador interno baseado no seu desempenho na plataforma. Nunca deve ser tratado como garantia de aprovação.</p><Link to="/revisao"><Button variant="secondary">Abrir revisão</Button></Link></div>
      </div>}
    </Card>

    <Card><div className="flex items-center gap-3"><Flame className="h-5 w-5 text-orange-500"/><div><p className="font-semibold">Streak: {d.streak} dia(s)</p><p className="text-sm text-slate-500">Conta apenas atividade significativa, como concluir aula, praticar, revisar flashcard ou fazer simulado.</p></div></div></Card>
  </div>
}
