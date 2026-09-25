import { Activity, BarChart3, BookOpenCheck, Clock3, RefreshCw, Target, TrendingUp, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Progress } from '../components/ui/Progress'
import { useAnalyticsData } from '../features/analytics/useAnalyticsData'

function Stat({label,value,helper,icon:Icon}:{label:string;value:string;helper:string;icon:typeof Activity}){
  return <Card><Icon className="h-5 w-5 text-emerald-500"/><p className="mt-3 text-2xl font-black">{value}</p><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-slate-500">{helper}</p></Card>
}
function Bar({label,value,total}:{label:string;value:number;total:number}){
  return <div><div className="mb-1 flex items-center justify-between gap-3 text-xs"><span className="font-semibold">{label}</span><span>{total?value+'%':'sem amostra'}</span></div><Progress value={total?value:0}/><p className="mt-1 text-[11px] text-slate-400">{total} resposta(s)</p></div>
}
function TrendChart({rows}:{rows:Array<{date:string;score:number;label:string}>}){
  if(rows.length<2)return <div className="grid h-56 place-items-center rounded-2xl bg-slate-50 text-center text-sm text-slate-500 dark:bg-white/[0.03]"><div><TrendingUp className="mx-auto mb-2 h-7 w-7 text-slate-300"/><p>Faça pelo menos dois simulados para formar a curva.</p></div></div>
  const width=720,height=210,pad=28
  const points=rows.map((row,index)=>{
    const x=pad+(index/(rows.length-1))*(width-pad*2)
    const y=height-pad-(row.score/100)*(height-pad*2)
    return{x,y,...row}
  })
  return <div className="overflow-x-auto"><svg viewBox={'0 0 '+width+' '+height} className="min-w-[620px]">
    {[0,25,50,75,100].map((tick)=>{const y=height-pad-(tick/100)*(height-pad*2);return <g key={tick}><line x1={pad} x2={width-pad} y1={y} y2={y} className="stroke-slate-200 dark:stroke-white/10"/><text x={4} y={y+4} className="fill-slate-400 text-[10px]">{tick}</text></g>})}
    <polyline fill="none" stroke="currentColor" strokeWidth="3" points={points.map((p)=>p.x+','+p.y).join(' ')} className="text-emerald-500"/>
    {points.map((p,index)=><g key={p.date}><circle cx={p.x} cy={p.y} r="4.5" fill="currentColor" className="text-emerald-500"/><text x={p.x} y={height-6} textAnchor="middle" className="fill-slate-400 text-[9px]">{index+1}</text></g>)}
  </svg><div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">{rows.map((row,index)=><span key={row.date}>{index+1}. {row.label}: <strong>{row.score}%</strong></span>)}</div></div>
}

export function AnalyticsPage(){
  const {snapshot:s,loading,refresh}=useAnalyticsData()
  if(loading||!s)return <div className="mx-auto max-w-7xl"><Card><p className="py-12 text-center text-sm text-slate-500">Calculando suas estatísticas locais...</p></Card></div>
  const activeDays=s.daily.filter((day)=>day.questions>0||day.studyMinutes>0)
  const daysWithBoth=s.daily.filter((day)=>day.questions>=3&&day.studyMinutes>0)
  const avgMinutesWithPractice=daysWithBoth.length?Math.round(daysWithBoth.reduce((sum,day)=>sum+day.studyMinutes,0)/daysWithBoth.length):null
  const avgAccuracyWithPractice=daysWithBoth.length?Math.round(daysWithBoth.reduce((sum,day)=>sum+(day.accuracy??0),0)/daysWithBoth.length):null

  return <div className="mx-auto max-w-7xl space-y-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><div className="mb-2 flex items-center gap-2"><Badge>Desempenho CPA</Badge><span className="text-sm text-slate-500">100% local</span></div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Estatísticas</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Use seus dados reais para decidir o que estudar. Nenhuma métrica é enviada para servidor e nenhuma porcentagem é inventada quando não há amostra.</p></div><Button variant="secondary" onClick={()=>void refresh()}><RefreshCw className="h-4 w-4"/>Atualizar</Button></div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat label="Tentativas de questões" value={String(s.totalAnswered)} helper={s.overallAccuracy===null?'sem acurácia ainda':s.overallAccuracy+'% de acerto acumulado'} icon={Target}/>
      <Stat label="Acerto recente" value={s.recentAccuracy===null?'—':s.recentAccuracy+'%'} helper="últimos 30 dias no treinos de questões" icon={Activity}/>
      <Stat label="Tempo ativo" value={(Math.round(s.studyMinutes/60*10)/10)+'h'} helper={activeDays.length+' dia(s) ativos nos últimos 30'} icon={Clock3}/>
      <Stat label="Simulados" value={s.simulationAverage===null?'—':s.simulationAverage+'%'} helper="média dos simulados concluídos" icon={BarChart3}/>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">
      <Stat label="Questões diferentes" value={String(s.uniqueQuestions)} helper="cobertura nos treinos de questões" icon={Target}/>
      <Stat label="Primeira tentativa" value={s.firstAttemptAccuracy===null?'—':s.firstAttemptAccuracy+'%'} helper="antes de repetir cada questão nos treinos" icon={Activity}/>
      <Stat label="Tentativas repetidas" value={s.repeatAccuracy===null?'—':s.repeatAccuracy+'%'} helper={s.repeatAttempts+' repetição(ões); simulados separados'} icon={RefreshCw}/>
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <Card><h2 className="font-bold">Desempenho por tema</h2><p className="mt-1 text-xs text-slate-500">treinos de questões + respostas de simulados.</p><div className="mt-5 space-y-5">{s.byMacro.map((row)=><Bar key={row.label} label={row.label} value={row.percent} total={row.total}/>)}</div></Card>
      <Card><h2 className="font-bold">Desempenho por dificuldade</h2><p className="mt-1 text-xs text-slate-500">Ajuda a detectar acerto alto sustentado só por questões fáceis.</p><div className="mt-5 space-y-5">{s.byDifficulty.map((row)=><Bar key={row.label} label={row.label} value={row.percent} total={row.total}/>)}</div><div className="mt-6 rounded-xl bg-slate-100 p-4 text-xs leading-5 text-slate-500 dark:bg-white/5"><strong>Mini quizzes:</strong> {s.quizAverage===null?'sem amostra':s.quizAverage+'% de média'} · <strong>Aulas estudadas:</strong> {s.lessonsStudied}/445.</div></Card>
    </div>

    <Card><div className="flex items-end justify-between gap-3"><div><h2 className="font-bold">Evolução em simulados</h2><p className="mt-1 text-xs text-slate-500">Últimos 12 simulados concluídos, sem suavização artificial.</p></div><Link to="/simulados/historico" className="text-xs font-bold text-emerald-600 hover:underline">Abrir histórico</Link></div><div className="mt-5"><TrendChart rows={s.simulationTrend}/></div></Card>

    <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
      <Card>
        <div className="flex items-end justify-between gap-3"><div><h2 className="font-bold">Heatmap de PDs praticados</h2><p className="mt-1 text-xs text-slate-500">Ordenado por risco de estudo: baixa acurácia + amostra suficiente primeiro.</p></div><span className="text-xs text-slate-400">{s.pdHeatmap.length} PDs com prática</span></div>
        {s.pdHeatmap.length===0?<p className="py-10 text-center text-sm text-slate-500">Responda questões para preencher o heatmap.</p>:<div className="mt-4 grid gap-2 md:grid-cols-2">{s.pdHeatmap.slice(0,30).map((row)=><Link key={row.pdCode} to={'/questoes?pd='+encodeURIComponent(row.pdCode)} className={'rounded-xl border p-3 transition hover:-translate-y-0.5 '+(row.severity==='high'?'border-rose-300 bg-rose-50/70 dark:border-rose-400/20 dark:bg-rose-400/[0.06]':row.severity==='medium'?'border-amber-300 bg-amber-50/70 dark:border-amber-400/20 dark:bg-amber-400/[0.06]':'border-slate-200 dark:border-white/10')}><div className="flex items-center justify-between gap-3"><span className="font-mono text-[11px] font-bold text-emerald-600">PD {row.pdCode}</span><span className="text-sm font-black">{row.percent}%</span></div><p className="mt-1 line-clamp-1 text-sm font-semibold">{row.title}</p><p className="mt-1 text-[11px] text-slate-500">{row.correct}/{row.total} acertos · {row.errors} erro(s) registrados</p></Link>)}</div>}
      </Card>

      <div className="space-y-6">
        <Card><TriangleAlert className="h-5 w-5 text-rose-500"/><h2 className="mt-3 font-bold">Erros recorrentes</h2><p className="mt-1 text-xs text-slate-500">Questões erradas pelo menos duas vezes.</p>{s.recurrentErrors.length===0?<p className="mt-5 rounded-xl bg-slate-100 p-4 text-sm text-slate-500 dark:bg-white/5">Nenhum erro recorrente ainda.</p>:<div className="mt-4 space-y-2">{s.recurrentErrors.slice(0,6).map((row)=><Link key={row.questionId} to={'/questoes?question='+encodeURIComponent(row.questionId)} className="block rounded-xl border border-slate-200 p-3 hover:border-rose-300 dark:border-white/10"><div className="flex items-center justify-between gap-2"><span className="font-mono text-[10px] text-slate-400">{row.pdCode??'sem PD'}</span><span className="text-xs font-black text-rose-500">{row.count}×</span></div><p className="mt-1 line-clamp-2 text-xs font-semibold">{row.prompt}</p></Link>)}</div>}</Card>
        <Card><BookOpenCheck className="h-5 w-5 text-sky-500"/><h2 className="mt-3 font-bold">Tempo × prática</h2><p className="mt-2 text-sm leading-6 text-slate-500">{daysWithBoth.length===0?'Ainda não há dias suficientes com tempo ativo e pelo menos 3 questões para comparar.':'Em '+daysWithBoth.length+' dia(s) comparáveis, você estudou em média '+avgMinutesWithPractice+' min e acertou '+avgAccuracyWithPractice+'% das questões.'}</p><p className="mt-3 text-[11px] leading-5 text-slate-400">Isso é uma associação descritiva do seu histórico, não prova de causalidade.</p></Card>
      </div>
    </div>
  </div>
}
