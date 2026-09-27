import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react'
import { courseModules, courseModuleMap, matchesModule } from '../../content/cpa/course/modules'
import { moduleReadings, readingMinutes } from '../../content/cpa/course/readings'
import { cpaLessons } from '../../content/cpa/lessons'
import { lessonSources } from '../../content/cpa/lessons/sources'
import { cpaQuestions } from '../../content/cpa/questions'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { setSectionRead } from '../lib/storage/repositories/courseRepository'
import { createSimulation } from '../lib/storage/repositories/simulationRepository'
import { generateSimulation } from '../lib/simulations/engine'

export function ModulePage() {
  const { moduleId } = useParams()
  return <ModuleContent key={moduleId} moduleId={moduleId ?? ''}/>
}
function ModuleContent({moduleId}: {moduleId: string}) {
  const navigate = useNavigate()
  useEffect(() => { window.scrollTo({top:0}) }, [moduleId])
  const {progress, simulations, loading} = useCourseProgress()
  const {busy, error, run} = useAsyncAction()
  const module = courseModuleMap.get(moduleId)
  const reading = moduleReadings[moduleId]
  if (!module || !reading) return <Card><h1 className="text-2xl font-bold">Módulo não encontrado</h1><Link to="/conteudos">Voltar aos módulos</Link></Card>
  const index = courseModules.indexOf(module)
  const read = new Set(progress[moduleId]?.readSections ?? [])
  const lessons = cpaLessons.filter(lesson => matchesModule(module, lesson.pdCode))
  const exams = simulations.filter(row => row.payload.moduleId === moduleId)
  const ongoing = exams.find(row => !row.completedAt)
  const last = exams.find(row => row.completedAt)
  const count = Math.min(10,cpaQuestions.filter(q => q.origin === 'authored' && matchesModule(module,q.pdCode)).length)
  async function startExam() {
    await run(async () => {
      if (ongoing) { navigate(`/prova/${ongoing.id}`); return }
      const record = await createSimulation(generateSimulation(cpaQuestions,{mode:'module',moduleId}))
      navigate(`/prova/${record.id}`)
    })
  }
  return <article className="mx-auto max-w-5xl space-y-7">
    <Link to="/conteudos" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300"><ArrowLeft className="h-4 w-4"/>Todos os módulos</Link>
    <header className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-sky-400/5 p-6 sm:p-8"><Badge>Módulo {String(index+1).padStart(2,'0')} · {module.stage}</Badge><h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{module.title}</h1><p className="mt-3 text-slate-500">{module.subtitle}</p><p className="mt-4 flex items-center gap-2 text-sm text-slate-500"><BookOpen className="h-4 w-4"/>{readingMinutes(reading)} min de leitura · {count} questões ao final</p><div className="mt-6 border-t border-emerald-400/20 pt-5"><h2 className="font-bold">Ao terminar, você vai conseguir</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{reading.objectives.map(text => <li key={text}>{text}</li>)}</ul></div></header>
    <nav aria-label="Partes do módulo" className="flex flex-wrap gap-2">{reading.sections.map((section,i) => <a key={section.id} href={`#section-${section.id}`} onClick={event => {event.preventDefault();document.getElementById(`section-${section.id}`)?.scrollIntoView({behavior:'smooth',block:'start'})}} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold dark:border-white/10">{i+1}. {section.title}</a>)}<button onClick={() => document.getElementById('module-exam')?.scrollIntoView({behavior:'smooth'})} className="rounded-xl bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">Ir ao simulado</button></nav>
    {error && <p role="alert" className="rounded-xl bg-rose-100 p-4 text-rose-900">{error}</p>}
    <div className="space-y-6">{reading.sections.map((section,i) => <section key={section.id} id={`section-${section.id}`} className="scroll-mt-24"><Card><p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">Leitura {i+1}</p><h2 className="mt-2 text-xl font-bold">{section.title}</h2><div className="mt-4 max-w-prose space-y-4 text-base leading-8 text-slate-700 dark:text-slate-300">{section.paragraphs.map(text => <p key={text}>{text}</p>)}</div><label className="mt-6 flex w-fit cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold dark:bg-white/5"><input type="checkbox" className="h-4 w-4 accent-emerald-500" checked={read.has(section.id)} disabled={busy || loading} onChange={event => {const checked = event.target.checked;void run(async () => {await setSectionRead(moduleId,section.id,checked)})}}/>Li e revisei esta parte</label></Card></section>)}</div>
    <Card className="border-emerald-400/30"><Badge>Caso resolvido · exemplo hipotético</Badge><h2 className="mt-3 text-xl font-bold">{reading.example.title}</h2><p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{reading.example.scenario}</p><ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7">{reading.example.steps.map(step => <li key={step}>{step}</li>)}</ol><p className="mt-5 rounded-2xl bg-emerald-400/10 p-4 text-sm font-semibold leading-7">{reading.example.conclusion}</p></Card>
    <section><h2 className="mb-3 text-xl font-bold">Compare para não confundir</h2><div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-slate-100 dark:bg-white/5"><tr>{reading.comparison.headers.map(text => <th key={text} scope="col" className="p-4">{text}</th>)}</tr></thead><tbody>{reading.comparison.rows.map(row => <tr key={row[0]} className="border-t border-slate-200 dark:border-white/10">{row.map((text,i) => i === 0 ? <th key={i} scope="row" className="p-4 align-top font-semibold">{text}</th> : <td key={i} className="p-4 align-top leading-6 text-slate-500">{text}</td>)}</tr>)}</tbody></table></div></section>
    <div className="grid gap-5 md:grid-cols-2"><Card className="bg-amber-400/5"><h2 className="text-lg font-bold">Pegadinhas para lembrar</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7">{reading.traps.map(text => <li key={text}>{text}</li>)}</ul></Card><Card><h2 className="text-lg font-bold">Puxe da memória</h2><p className="mt-2 text-sm text-slate-500">Tente responder antes de abrir.</p><div className="mt-4 space-y-3">{reading.recall.map(item => <details key={item.question} className="rounded-xl border border-slate-200 p-3 dark:border-white/10"><summary className="cursor-pointer text-sm font-semibold leading-6">{item.question}</summary><p className="mt-3 text-sm leading-7 text-slate-500">{item.answer}</p></details>)}</div></Card></div>
    <details className="rounded-2xl border border-slate-200 p-5 dark:border-white/10"><summary className="cursor-pointer font-semibold">Aprofunde o módulo · {lessons.length} aulas de consulta</summary><p className="my-3 text-sm leading-6 text-slate-500">Explore os pontos específicos do programa. O progresso dessas aulas é registrado separadamente da leitura acima.</p><div className="grid gap-2 sm:grid-cols-2">{lessons.map(lesson => <Link key={lesson.pdCode} to={`/conteudos/${lesson.pdCode}`} className="rounded-xl bg-slate-50 p-3 text-sm leading-6 hover:text-emerald-600 dark:bg-white/5">{lesson.title}</Link>)}</div></details>
    <details className="rounded-2xl border border-slate-200 p-5 dark:border-white/10"><summary className="cursor-pointer text-sm font-semibold">Fontes e correspondência com o edital</summary><p className="mt-3 text-sm leading-6 text-slate-500">Leitura autoral de 27/09/2026 · CPA, PD 1.2 · referências: {module.prefixes.join(', ')}. Consulte as fontes para condições e regras vigentes.</p><ul className="mt-3 space-y-2">{reading.sources.map(id => <li key={id}><a href={lessonSources[id].url} target="_blank" rel="noreferrer" className="text-sm text-emerald-700 underline dark:text-emerald-300">{lessonSources[id].institution} — {lessonSources[id].title} ↗</a></li>)}</ul></details>
    <section id="module-exam" className="scroll-mt-24 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6 sm:p-8"><div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500"/><h2 className="text-2xl font-bold">Simulado do módulo</h2></div><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">{count} questões autorais sobre {module.title.toLowerCase()}, com até {count*3} minutos e correção ao final. É uma revisão deste módulo, sem equivalência à prova oficial.</p><p className="mt-3 text-sm">Leitura: {read.size}/{reading.sections.length} partes{last ? ` · Último resultado: ${last.score}%` : ''}</p><div className="mt-5 flex flex-wrap gap-3"><Button disabled={busy || loading} onClick={() => void startExam()}>{busy ? 'Abrindo...' : ongoing ? 'Continuar simulado do módulo' : last ? 'Refazer simulado do módulo' : 'Iniciar simulado do módulo'}<ArrowRight className="h-4 w-4"/></Button>{last && <Link to={`/prova/${last.id}/resultado`} className="rounded-xl border border-emerald-400/30 px-4 py-3 text-sm font-semibold">Ver última correção</Link>}</div></section>
    <nav aria-label="Navegação entre módulos" className="flex flex-wrap justify-between gap-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">{index > 0 ? <Link to={`/modulos/${courseModules[index-1].id}`}>← {courseModules[index-1].title}</Link> : <Link to="/conteudos">← Todos os módulos</Link>}{index < courseModules.length-1 ? <Link to={`/modulos/${courseModules[index+1].id}`}>Próximo: {courseModules[index+1].title} →</Link> : <Link to="/simulados">Treinar a prova completa →</Link>}</nav>
  </article>
}
