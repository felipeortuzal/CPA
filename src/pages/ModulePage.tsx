import { isReviewed } from '../../content/cpa/questions/quality'
import { moduleStateLabels, MASTERY_RULE } from '../lib/course/progress'
import { getSeenQuestionIds } from '../lib/storage/repositories/simulationRepository'
import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, FileText } from 'lucide-react'
import { courseModules, courseModuleMap, matchesModule } from '../../content/cpa/course/modules'
import { moduleReadings } from '../../content/cpa/course/readings'
import { moduleApostilaStats, V26_EDITORIAL_REVIEW_DATE } from '../../content/cpa/course/apostila'
import { cpaLessons } from '../../content/cpa/lessons'
import { lessonSources } from '../../content/cpa/lessons/sources'
import { cpaQuestions } from '../../content/cpa/questions'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Progress } from '../components/ui/Progress'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { setSectionRead } from '../lib/storage/repositories/courseRepository'
import { createSimulation } from '../lib/storage/repositories/simulationRepository'
import { generateSimulation } from '../lib/simulations/engine'

function check(ok:boolean) { return ok ? '✓' : '○' }

export function ModulePage() {
  const { moduleId } = useParams()
  return <ModuleContent key={moduleId} moduleId={moduleId ?? ''}/>
}
function ModuleContent({moduleId}: {moduleId: string}) {
  const navigate = useNavigate()
  useEffect(() => { window.scrollTo({top:0}) }, [moduleId])
  const {progress, simulations, modules, loading} = useCourseProgress()
  const {busy, error, run} = useAsyncAction()
  const module = courseModuleMap.get(moduleId)
  const reading = moduleReadings[moduleId]
  if (!module || !reading) return <Card><h1 className="text-2xl font-bold">Módulo não encontrado</h1><Link to="/conteudos">Voltar aos módulos</Link></Card>
  const index = courseModules.indexOf(module)
  const read = new Set(progress[moduleId]?.readSections ?? [])
  const lessons = cpaLessons.filter(lesson => matchesModule(module, lesson.pdCode))
  const handbook = moduleApostilaStats(moduleId)
  const status = modules.find(row=>row.module.id===moduleId)!
  const poolSize = cpaQuestions.filter(q=>isReviewed(q) && matchesModule(module,q.pdCode)).length
  const exams = simulations.filter(row => row.payload.moduleId === moduleId)
  const ongoing = exams.find(row => !row.completedAt)
  const last = exams.find(row => row.completedAt)
  const count = Math.min(8,cpaQuestions.filter(q => isReviewed(q) && matchesModule(module,q.pdCode)).length)
  const progressPercent = reading.sections.length ? read.size / reading.sections.length * 100 : 0
  async function startExam() {
    await run(async () => {
      if (ongoing) { navigate(`/prova/${ongoing.id}`); return }
      const record = await createSimulation(generateSimulation(cpaQuestions,{mode:'module',moduleId,seenQuestionIds:await getSeenQuestionIds()}))
      navigate(`/prova/${record.id}`)
    })
  }
  return <article className="mx-auto max-w-5xl space-y-7">
    <Link to="/conteudos" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300"><ArrowLeft className="h-4 w-4"/>Todos os módulos</Link>
    <header className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-sky-400/5 p-6 sm:p-8"><Badge>{moduleStateLabels[status.state]}</Badge> <Badge>Módulo {String(index+1).padStart(2,'0')} · {module.stage}</Badge><h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{module.title}</h1><p className="mt-3 text-slate-500">{module.subtitle}</p><p className="mt-4 flex items-center gap-2 text-sm text-slate-500"><BookOpen className="h-4 w-4"/>~{handbook.minutes} min de leitura e estudo · {handbook.lessons.length} pontos do edital · {count} questões ao final</p><div className="mt-5 flex flex-wrap gap-3"><Link to={`/apostila/${moduleId}`}><Button><FileText className="h-4 w-4"/>Ler como apostila completa</Button></Link><span className="self-center text-xs text-slate-500">{handbook.comparisons} comparações · {handbook.formulas} fórmulas · {handbook.checkpoints} checkpoints</span></div><div className="mt-6 border-t border-emerald-400/20 pt-5"><h2 className="font-bold">Ao terminar, você vai conseguir</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{reading.objectives.map(text => <li key={text}>{text}</li>)}</ul></div></header>
    <Card><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold">Progresso desta leitura</h2><p className="mt-1 text-sm text-slate-500">{read.size} de {reading.sections.length} seções introdutórias concluídas. A marcação continua manual.</p></div><span className="text-sm font-bold">{Math.round(progressPercent)}%</span></div><div className="mt-3"><Progress value={progressPercent}/></div></Card>
    <nav aria-label="Partes do módulo" className="flex flex-wrap gap-2">{reading.sections.map((section,i) => <a key={section.id} href={`#section-${section.id}`} onClick={event => {event.preventDefault();document.getElementById(`section-${section.id}`)?.scrollIntoView({behavior:'smooth',block:'start'})}} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold dark:border-white/10">{i+1}. {section.title}</a>)}<Link to={`/apostila/${moduleId}`} className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">Apostila completa</Link><button onClick={() => document.getElementById('module-exam')?.scrollIntoView({behavior:'smooth'})} className="rounded-xl bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">Ir ao simulado</button></nav>
    {error && <p role="alert" className="rounded-xl bg-rose-100 p-4 text-rose-900">{error}</p>}
    <div className="space-y-6">{reading.sections.map((section,i) => <section key={section.id} id={`section-${section.id}`} className="scroll-mt-24"><Card><p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">Leitura {i+1}</p><h2 className="mt-2 text-xl font-bold">{section.title}</h2><div className="mt-4 max-w-prose space-y-4 text-base leading-8 text-slate-700 dark:text-slate-300">{section.paragraphs.map(text => <p key={text}>{text}</p>)}</div><label className="mt-6 flex w-fit cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold dark:bg-white/5"><input type="checkbox" className="h-4 w-4 accent-emerald-500" checked={read.has(section.id)} disabled={busy || loading} onChange={event => {const checked = event.target.checked;void run(async () => {await setSectionRead(moduleId,section.id,checked)})}}/>Li e revisei esta parte</label></Card></section>)}</div>
    <Card className="border-emerald-400/30"><Badge>Caso resolvido · exemplo hipotético</Badge><h2 className="mt-3 text-xl font-bold">{reading.example.title}</h2><p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{reading.example.scenario}</p><ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7">{reading.example.steps.map(step => <li key={step}>{step}</li>)}</ol><p className="mt-5 rounded-2xl bg-emerald-400/10 p-4 text-sm font-semibold leading-7">{reading.example.conclusion}</p></Card>
    <section><h2 className="mb-3 text-xl font-bold">Compare para não confundir</h2><div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-slate-100 dark:bg-white/5"><tr>{reading.comparison.headers.map(text => <th key={text} scope="col" className="p-4">{text}</th>)}</tr></thead><tbody>{reading.comparison.rows.map(row => <tr key={row[0]} className="border-t border-slate-200 dark:border-white/10">{row.map((text,i) => i === 0 ? <th key={i} scope="row" className="p-4 align-top font-semibold">{text}</th> : <td key={i} className="p-4 align-top leading-6 text-slate-500">{text}</td>)}</tr>)}</tbody></table></div></section>
    <div className="grid gap-5 md:grid-cols-2"><Card className="bg-amber-400/5"><h2 className="text-lg font-bold">Confusões comuns</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7">{reading.traps.map(text => <li key={text}>{text}</li>)}</ul></Card><Card><h2 className="text-lg font-bold">Teste a sua memória</h2><p className="mt-2 text-sm text-slate-500">Tente responder antes de abrir.</p><div className="mt-4 space-y-3">{reading.recall.map(item => <details key={item.question} className="rounded-xl border border-slate-200 p-3 dark:border-white/10"><summary className="cursor-pointer text-sm font-semibold leading-6">{item.question}</summary><p className="mt-3 text-sm leading-7 text-slate-500">{item.answer}</p></details>)}</div></Card></div>
    <Card className="border-sky-300/30"><div className="flex flex-wrap items-start justify-between gap-4"><div><Badge>Programa Detalhado</Badge><h2 className="mt-3 text-xl font-bold">Conteúdo completo deste módulo</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">A V26 integra {lessons.length} pontos terminais do Programa Detalhado neste módulo. Leia em sequência no Modo Apostila ou abra um ponto específico abaixo.</p></div><Link to={`/apostila/${moduleId}`}><Button variant="secondary">Abrir apostila contínua</Button></Link></div><details className="mt-5"><summary className="cursor-pointer text-sm font-semibold">Ver índice detalhado · {lessons.length} tópicos</summary><div className="mt-4 grid gap-2 sm:grid-cols-2">{lessons.map(lesson => <Link key={lesson.pdCode} to={`/conteudos/${lesson.pdCode}`} className="rounded-xl bg-slate-50 p-3 text-sm leading-6 hover:text-emerald-600 dark:bg-white/5"><span className="font-bold">{lesson.pdCode}</span> · {lesson.title}</Link>)}</div></details></Card>
    <details className="rounded-2xl border border-slate-200 p-5 dark:border-white/10"><summary className="cursor-pointer font-semibold">Fontes e revisão editorial</summary><p className="mt-3 text-sm leading-6 text-slate-500">Leitura principal autoral revisada em {V26_EDITORIAL_REVIEW_DATE.split('-').reverse().join('/')} · referências do módulo: {module.prefixes.join(', ')}. O Modo Apostila mostra a fonte oficial e a data de verificação de cada PD separadamente.</p><ul className="mt-3 space-y-2">{reading.sources.map(id => <li key={id}><a href={lessonSources[id].url} target="_blank" rel="noreferrer" className="text-sm text-emerald-700 underline dark:text-emerald-300">{lessonSources[id].institution} — {lessonSources[id].title} ↗</a></li>)}</ul></details>
    <Card><h2 className="text-xl font-bold">Caminho para dominar</h2><p className="mt-2 text-sm leading-6 text-slate-500">Isto é uma meta interna de estudo, não uma previsão de aprovação.</p><div className="mt-4 grid gap-2 text-sm sm:grid-cols-2"><p className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">{check(status.read===status.total)} Leitura introdutória: {status.read}/{status.total}</p><p className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">{check(Boolean(status.exam))} Simulado concluído</p><p className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">{check(status.distinct>=12)} Questões distintas: {status.distinct}/12</p><p className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">{check(status.practiceDays>=3)} Dias praticados: {status.practiceDays}/3</p><p className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">{check(status.spanDays>=7)} Janela de prática: {status.spanDays}/7 dias</p><p className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">{check((status.accuracy??0)>=80)} Acerto recente: {status.accuracy??0}%/80%</p><p className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">{check(status.consistentRecentDays>=2)} Práticas recentes consistentes: {status.consistentRecentDays}/2</p><p className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">{check((status.eligibleExamScore??0)>=70)} Simulado elegível: {status.eligibleExamScore??0}%/70%</p></div><details className="mt-4 text-xs leading-6 text-slate-500"><summary className="cursor-pointer font-semibold">Regra completa</summary><p>{MASTERY_RULE}</p></details></Card>
    <section id="module-exam" className="scroll-mt-24 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6 sm:p-8"><div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500"/><h2 className="text-2xl font-bold">Simulado do módulo</h2></div><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">{count} questões selecionadas de um banco de {poolSize} revisadas sobre {module.title.toLowerCase()}, com até {count*3} minutos e correção ao final. A V26 prioriza questões inéditas e diversidade de conceitos e metadados. É uma revisão deste módulo, sem equivalência à prova oficial.</p><p className="mt-3 text-sm">Leitura: {read.size}/{reading.sections.length} partes{last ? ` · Último resultado: ${last.score}%` : ''}</p><div className="mt-5 flex flex-wrap gap-3"><Button disabled={busy || loading} onClick={() => void startExam()}>{busy ? 'Abrindo...' : ongoing ? 'Continuar simulado do módulo' : last ? 'Refazer simulado do módulo' : 'Iniciar simulado do módulo'}<ArrowRight className="h-4 w-4"/></Button>{last && <Link to={`/prova/${last.id}/resultado`} className="rounded-xl border border-emerald-400/30 px-4 py-3 text-sm font-semibold">Ver última correção</Link>}</div></section>
    <nav aria-label="Navegação entre módulos" className="flex flex-wrap justify-between gap-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">{index > 0 ? <Link to={`/modulos/${courseModules[index-1].id}`}>← {courseModules[index-1].title}</Link> : <Link to="/conteudos">← Todos os módulos</Link>}{index < courseModules.length-1 ? <Link to={`/modulos/${courseModules[index+1].id}`}>Próximo: {courseModules[index+1].title} →</Link> : <Link to="/simulados">Treinar a prova completa →</Link>}</nav>
  </article>
}
