import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, BookOpen, ExternalLink, Printer, Target } from 'lucide-react'
import { courseModuleMap } from '../../content/cpa/course/modules'
import { getModuleLessons, moduleApostilaStats, V28_EDITORIAL_REVIEW_DATE } from '../../content/cpa/course/apostila'
import { examBlueprints } from '../../content/cpa/course/exam-blueprint'
import { V28CourseLayer } from '../components/course/V28CourseLayer'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

function formatDate(value: string) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function ApostilaPage() {
  const { moduleId = '' } = useParams()
  const module = courseModuleMap.get(moduleId)
  const stats = moduleApostilaStats(moduleId)
  const lessons = getModuleLessons(moduleId)
  const blueprint = examBlueprints[moduleId]
  if (!module || !lessons.length) return <Card><h1 className="text-2xl font-bold">Módulo não encontrado</h1><Link to="/conteudos">Voltar aos módulos</Link></Card>

  return <article className="apostila-print mx-auto max-w-6xl space-y-7">
    <div className="print:hidden flex flex-wrap items-center justify-between gap-3">
      <Link to="/conteudos" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300"><ArrowLeft className="h-4 w-4"/>Voltar à trilha da prova</Link>
      <Button variant="secondary" onClick={() => window.print()}><Printer className="h-4 w-4"/>Imprimir / salvar PDF</Button>
    </div>

    <header className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-sky-400/5 p-6 sm:p-9">
      <div className="flex flex-wrap gap-2"><Badge>Apostila de prova · V29</Badge><Badge>{module.stage}</Badge></div>
      <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">{module.title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">{module.subtitle}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Programa detalhado</p><p className="mt-1 text-xl font-bold">{lessons.length} tópicos</p></div>
        <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Apostila completa</p><p className="mt-1 text-xl font-bold">~{stats.minutes} min</p></div>
        <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Checkpoints</p><p className="mt-1 text-xl font-bold">{stats.checkpoints}</p></div>
        <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Fórmulas</p><p className="mt-1 text-xl font-bold">{stats.formulas}</p></div>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-500">Esta é a leitura principal. A organização segue a lógica da Nova CPA e foi revisada para ficar mais próxima de um preparatório: primeiro a régua da prova, depois a explicação em sequência, exemplos e, por fim, o detalhamento integral dos pontos do edital.</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">Referências didáticas públicas: curso CPA 2026 do Prof. Renan Duarte / Retorno Interno e estrutura temática da TopInvest. O texto é autoral. Normas e dados regulatórios são conferidos nas fontes oficiais. Revisão editorial: {formatDate(V28_EDITORIAL_REVIEW_DATE)}.</p>
    </header>

    {blueprint && <section className="grid gap-4 lg:grid-cols-3">
      <Card className="border-emerald-300/30"><div className="flex items-center gap-2"><Target className="h-4 w-4 text-emerald-600"/><h2 className="font-black">O que você precisa dominar</h2></div><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7">{blueprint.mustMaster.map(item => <li key={item}>{item}</li>)}</ul></Card>
      <Card className="border-sky-300/30"><div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-sky-600"/><h2 className="font-black">Como isso aparece na prova</h2></div><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7">{blueprint.examPatterns.map(item => <li key={item}>{item}</li>)}</ul></Card>
      <Card className="border-amber-300/40"><div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600"/><h2 className="font-black">Pegadinhas que você não pode errar</h2></div><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7">{blueprint.traps.map(item => <li key={item}>{item}</li>)}</ul></Card>
    </section>}

    <V28CourseLayer moduleId={moduleId} printFriendly/>

    <div className="grid gap-7 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="print:hidden lg:sticky lg:top-24 lg:self-start">
        <Card>
          <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-emerald-500"/><h2 className="font-bold">Índice do Programa Detalhado</h2></div>
          <p className="mt-2 text-xs leading-5 text-slate-500">Abaixo está o conteúdo granular do edital. Use como apostila de aprofundamento e checklist final.</p>
          <nav aria-label="Índice da apostila" className="mt-4 max-h-[70vh] space-y-1 overflow-y-auto pr-1">
            {lessons.map((lesson, index) => <a key={lesson.pdCode} href={`#pd-${lesson.pdCode.replaceAll('.', '-')}`} className="block rounded-lg px-2 py-2 text-xs leading-5 text-slate-600 hover:bg-emerald-400/10 hover:text-emerald-700 dark:text-slate-300">{index + 1}. {lesson.title}</a>)}
          </nav>
        </Card>
      </aside>

      <div className="min-w-0 space-y-8">
        {lessons.map((lesson, lessonIndex) => <section key={lesson.pdCode} id={`pd-${lesson.pdCode.replaceAll('.', '-')}`} className="scroll-mt-24 break-inside-avoid-page">
          <Card className="apostila-section p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-2"><Badge>PD {lesson.pdCode}</Badge><span className="text-xs text-slate-500">Tópico {lessonIndex + 1} de {lessons.length}</span></div>
            <h2 className="mt-4 text-2xl font-black tracking-tight">{lesson.title}</h2>
            <p className="mt-3 rounded-2xl bg-emerald-400/10 p-4 text-sm font-semibold leading-7">{lesson.oneSentence}</p>

            <div className="mt-7 space-y-6">
              <div><h3 className="text-lg font-bold">Entenda do zero</h3><p className="mt-2 text-base leading-8 text-slate-700 dark:text-slate-300">{lesson.beginnerExplanation}</p></div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"><p className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">O que saber</p><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">{lesson.essentialConcepts.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"><p className="text-xs font-black uppercase tracking-widest text-sky-700 dark:text-sky-300">Como pode cair</p><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">{lesson.examFocus.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </div>

              <details open className="rounded-2xl border border-slate-200 p-5 dark:border-white/10"><summary className="cursor-pointer font-bold">Teoria completa + exemplo</summary><div className="mt-5 space-y-5"><div><div className="space-y-4 text-base leading-8 text-slate-700 dark:text-slate-300">{lesson.completeExplanation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div><div className="rounded-2xl bg-slate-50 p-5 dark:bg-white/5"><p className="text-xs font-black uppercase tracking-widest text-slate-500">Exemplo de aplicação</p><p className="mt-3 text-sm leading-7">{lesson.practicalExample}</p></div></div></details>

              {lesson.comparisons.length > 0 && <div><h3 className="text-lg font-bold">Compare para não confundir</h3><div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-slate-100 dark:bg-white/5"><tr><th className="p-3">Conceito A</th><th className="p-3">Conceito B</th><th className="p-3">Diferença que a prova explora</th></tr></thead><tbody>{lesson.comparisons.map((item) => <tr key={`${item.left}-${item.right}`} className="border-t border-slate-200 dark:border-white/10"><th className="p-3 align-top">{item.left}</th><td className="p-3 align-top">{item.right}</td><td className="p-3 align-top leading-6 text-slate-500">{item.explanation}</td></tr>)}</tbody></table></div></div>}

              {lesson.formulas.length > 0 && <div><h3 className="text-lg font-bold">Fórmulas que você precisa saber</h3><div className="mt-3 space-y-3">{lesson.formulas.map((formula) => <div key={formula.name} className="rounded-2xl border border-violet-300/40 bg-violet-400/5 p-4"><p className="font-bold">{formula.name}</p><code className="mt-2 block overflow-x-auto rounded-lg bg-slate-950 p-3 text-sm text-white">{formula.expression}</code><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{formula.explanation}</p></div>)}</div></div>}

              <div className="rounded-2xl border border-amber-300/50 bg-amber-400/5 p-5"><p className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">Pegadinhas / confusões comuns</p><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">{lesson.traps.map((item) => <li key={item}>{item}</li>)}</ul></div>

              <div><h3 className="text-lg font-bold">Resumo para revisão de véspera</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">{lesson.reviewSummary.map((item) => <li key={item}>{item}</li>)}</ul></div>

              <details className="print:hidden rounded-2xl border border-emerald-300/40 p-4"><summary className="cursor-pointer font-bold">Checkpoint · 3 perguntas</summary><div className="mt-4 space-y-5">{lesson.miniQuiz.map((question, index) => <div key={question.question}><p className="text-sm font-semibold">{index + 1}. {question.question}</p><ul className="mt-2 space-y-1 text-sm text-slate-500">{question.options.map((option, optionIndex) => <li key={option}>{String.fromCharCode(65 + optionIndex)}. {option}</li>)}</ul><details className="mt-2"><summary className="cursor-pointer text-xs font-bold text-emerald-700 dark:text-emerald-300">Revelar resposta</summary><p className="mt-2 text-sm leading-6">Resposta: {String.fromCharCode(65 + question.correctIndex)}. {question.explanation}</p></details></div>)}</div></details>

              <details className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"><summary className="cursor-pointer text-sm font-bold">Fontes oficiais deste tópico · verificado em {formatDate(lesson.lastVerified)}</summary><ul className="mt-3 space-y-2">{lesson.officialSources.map((source) => <li key={`${source.id}-${source.url}`}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 text-xs leading-5 text-emerald-700 underline dark:text-emerald-300">{source.institution} — {source.title}<ExternalLink className="mt-0.5 h-3 w-3 shrink-0"/></a></li>)}</ul></details>
            </div>
          </Card>
        </section>)}
      </div>
    </div>
  </article>
}
