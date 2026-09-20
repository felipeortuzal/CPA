import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AlertCircle, BookOpen, CheckCircle2, CircleHelp, Heart, Search, Star } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { cpaLessonMap, cpaLessons, lessonGroups } from '../../content/cpa/lessons'
import type { CPALesson } from '../../content/cpa/lessons/types'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Progress } from '../components/ui/Progress'
import { useStudyTimer } from '../hooks/useStudyTimer'
import { getLessonProgress, isLessonFavorite, markLessonOpened, markLessonStudied, saveQuizAttempt, toggleLessonDoubt, toggleLessonFavorite } from '../lib/storage/repositories/learningRepository'
import type { LessonProgressRecord } from '../lib/storage/types'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="scroll-mt-24"><h2 className="mb-3 text-lg font-bold tracking-tight">{title}</h2>{children}</section>
}

function BulletList({ items }: { items: string[] }) {
  return <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{items.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" /><span>{item}</span></li>)}</ul>
}

function statusLabel(progress: LessonProgressRecord | null) {
  if (!progress) return 'Não iniciado'
  if (progress.status === 'mastered') return 'Dominado'
  if (progress.status === 'completed') return 'Estudado'
  return 'Em andamento'
}

function MiniQuiz({ lesson, progress, onSaved }: { lesson: CPALesson; progress: LessonProgressRecord | null; onSaved: (progress: LessonProgressRecord) => void }) {
  const [answers, setAnswers] = useState<number[]>(() => lesson.miniQuiz.map(() => -1))
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const correct = answers.reduce((sum, answer, index) => sum + (answer === lesson.miniQuiz[index].correctIndex ? 1 : 0), 0)
  const score = Math.round(correct / lesson.miniQuiz.length * 100)

  async function submit() {
    if (answers.some((answer) => answer < 0)) return
    setSaving(true)
    try {
      const result = await saveQuizAttempt(lesson.pdCode, answers, correct, lesson.miniQuiz.length)
      onSaved(result.progress)
      setSubmitted(true)
    } finally {
      setSaving(false)
    }
  }

  return <Card className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-lg font-bold">Mini quiz</h2><p className="mt-1 text-sm text-slate-500">3 perguntas · domínio exige aula estudada + pelo menos 75%.</p></div>
      {progress?.quizBestScore !== null && progress?.quizBestScore !== undefined ? <Badge>Melhor: {progress.quizBestScore}%</Badge> : null}
    </div>
    {lesson.miniQuiz.map((item, questionIndex) => <fieldset key={item.question} className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-white/10" disabled={submitted}>
      <legend className="px-1 text-sm font-semibold">{questionIndex + 1}. {item.question}</legend>
      <div className="space-y-2">{item.options.map((option, optionIndex) => {
        const checked = answers[questionIndex] === optionIndex
        const good = submitted && optionIndex === item.correctIndex
        const bad = submitted && checked && optionIndex !== item.correctIndex
        return <label key={option} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm leading-5 transition ${good ? 'border-emerald-400 bg-emerald-400/10' : bad ? 'border-rose-400 bg-rose-400/10' : checked ? 'border-emerald-400/60 bg-emerald-400/5' : 'border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5'}`}>
          <input type="radio" name={`quiz-${lesson.pdCode}-${questionIndex}`} className="mt-1" checked={checked} onChange={() => setAnswers((current) => current.map((value, index) => index === questionIndex ? optionIndex : value))} />
          <span>{option}</span>
        </label>
      })}</div>
      {submitted ? <p className="rounded-xl bg-slate-100 p-3 text-xs leading-5 text-slate-600 dark:bg-white/5 dark:text-slate-300">{item.explanation}</p> : null}
    </fieldset>)}
    {submitted ? <div className={`rounded-2xl p-4 ${score >= 75 ? 'bg-emerald-400/12 text-emerald-800 dark:text-emerald-200' : 'bg-amber-400/12 text-amber-900 dark:text-amber-200'}`}><p className="font-bold">Resultado: {correct}/{lesson.miniQuiz.length} · {score}%</p><p className="mt-1 text-sm">{score >= 75 ? 'Bom resultado. Se a aula estiver marcada como estudada, ela passa para Dominado.' : 'Revise os pontos acima e tente novamente. O melhor resultado fica salvo.'}</p></div> : null}
    <div>{submitted ? <Button variant="secondary" onClick={() => { setAnswers(lesson.miniQuiz.map(() => -1)); setSubmitted(false) }}>Refazer quiz</Button> : <Button disabled={saving || answers.some((answer) => answer < 0)} onClick={() => void submit()}>{saving ? 'Salvando...' : 'Corrigir quiz'}</Button>}</div>
  </Card>
}

function LessonSidebar({ lesson }: { lesson: CPALesson }) {
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLowerCase()
  const items = normalized ? cpaLessons.filter((item) => [item.pdCode, item.title, item.oneSentence, ...item.searchTerms].join(' ').toLowerCase().includes(normalized)) : cpaLessons
  return <aside className="space-y-4 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-auto">
    <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar aula..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-white/5" /></div>
    {lessonGroups.map((group) => {
      const groupItems = items.filter((item) => item.pdCode.startsWith(`${group.code}.`) || item.pdCode === group.code)
      if (!groupItems.length) return null
      return <div key={group.code}><p className="mb-2 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-300">{group.code} · {group.title}</p><div className="space-y-1">{groupItems.map((item) => <Link key={item.pdCode} to={`/conteudos/${item.pdCode}`} className={`block rounded-lg px-2.5 py-2 text-xs leading-4 transition ${item.pdCode === lesson.pdCode ? 'bg-emerald-400/15 font-semibold text-emerald-800 dark:text-emerald-200' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}><span className="mr-1.5 font-mono font-bold">{item.pdCode}</span>{item.title}</Link>)}</div></div>
    })}
  </aside>
}

export function LessonPage() {
  const { pdCode } = useParams()
  const navigate = useNavigate()
  const lesson = pdCode ? cpaLessonMap.get(pdCode) : undefined
  const index = lesson ? cpaLessons.findIndex((item) => item.pdCode === lesson.pdCode) : -1
  const previous = index > 0 ? cpaLessons[index - 1] : null
  const next = index >= 0 && index < cpaLessons.length - 1 ? cpaLessons[index + 1] : null
  const [progress, setProgress] = useState<LessonProgressRecord | null>(null)
  const [favorite, setFavorite] = useState(false)
  const [busy, setBusy] = useState(false)
  useStudyTimer(lesson?.pdCode ?? null)

  useEffect(() => {
    if (!lesson) return
    let active = true
    void Promise.all([markLessonOpened(lesson.pdCode), isLessonFavorite(lesson.pdCode)]).then(([nextProgress, nextFavorite]) => {
      if (active) { setProgress(nextProgress); setFavorite(nextFavorite) }
    })
    return () => { active = false }
  }, [lesson])

  const position = useMemo(() => index >= 0 ? `${index + 1} de ${cpaLessons.length}` : '', [index])

  if (!lesson) return <div className="mx-auto max-w-3xl"><Card><div className="py-10 text-center"><AlertCircle className="mx-auto h-8 w-8 text-amber-500" /><h1 className="mt-3 text-xl font-bold">Aula não encontrada</h1><p className="mt-2 text-sm text-slate-500">Aulas completas estão disponíveis para todos os 445 PDs terminais da CPA.</p><Button className="mt-5" onClick={() => navigate('/conteudos')}>Voltar aos conteúdos</Button></div></Card></div>

  const lessonPdCode = lesson.pdCode
  async function study() { setBusy(true); try { setProgress(await markLessonStudied(lessonPdCode)) } finally { setBusy(false) } }
  const progressValue = progress?.status === 'mastered' ? 100 : progress?.status === 'completed' ? 80 : progress?.status === 'in_progress' ? 25 : 0

  return <div className="mx-auto max-w-7xl"><div className="grid gap-6 xl:grid-cols-[250px_minmax(0,1fr)]">
    <LessonSidebar lesson={lesson} />
    <div className="min-w-0 space-y-6">
      <div><div className="mb-3 flex flex-wrap items-center gap-2"><Badge>PD {lesson.pdCode}</Badge><span className="text-xs text-slate-500">Aula {position}</span><span className="text-xs font-semibold text-slate-500">{statusLabel(progress)}</span></div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">{lesson.title}</h1><p className="mt-3 text-sm text-slate-500">Verificado em: {new Intl.DateTimeFormat('pt-BR').format(new Date(`${lesson.lastVerified}T12:00:00`))} · Programa Detalhado CPA {lesson.programVersion}</p><div className="mt-4"><Progress value={progressValue} /></div></div>

      <Card className="border-emerald-400/25 bg-emerald-400/[0.06]"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Em uma frase</p><p className="mt-3 text-lg font-semibold leading-7">{lesson.oneSentence}</p></Card>

      <Card className="space-y-7">
        <Section title="Explicação para iniciante"><p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{lesson.beginnerExplanation}</p></Section>
        <Section title="Explicação completa"><div className="space-y-3">{lesson.completeExplanation.map((paragraph) => <p key={paragraph} className="text-sm leading-7 text-slate-600 dark:text-slate-300">{paragraph}</p>)}</div></Section>
        <Section title="Conceitos essenciais"><BulletList items={lesson.essentialConcepts} /></Section>
        <Section title="Como isso pode aparecer na prova"><BulletList items={lesson.examFocus} /></Section>
        <Section title="Exemplo prático"><div className="rounded-2xl bg-slate-100 p-4 text-sm leading-7 text-slate-700 dark:bg-white/5 dark:text-slate-200">{lesson.practicalExample}</div></Section>
        <Section title="Comparações importantes"><div className="space-y-3">{lesson.comparisons.map((comparison) => <div key={`${comparison.left}-${comparison.right}`} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"><p className="font-semibold">{comparison.left} × {comparison.right}</p><p className="mt-2 text-sm leading-6 text-slate-500">{comparison.explanation}</p></div>)}</div></Section>
        {lesson.formulas.length ? <Section title="Fórmulas"><div className="space-y-3">{lesson.formulas.map((formula) => <div key={formula.name} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"><p className="text-sm font-bold">{formula.name}</p><code className="mt-2 block overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 text-sm text-emerald-300">{formula.expression}</code><p className="mt-2 text-xs leading-5 text-slate-500">{formula.explanation}</p></div>)}</div></Section> : null}
        <Section title="Pegadinhas"><BulletList items={lesson.traps} /></Section>
        <Section title="Resumo para revisão"><div className="rounded-2xl bg-slate-950 p-5 text-slate-100 dark:bg-white/[0.06]"><BulletList items={lesson.reviewSummary} /></div></Section>
        <Section title="Flashcards"><div className="grid gap-3 md:grid-cols-2">{lesson.flashcards.map((card) => <div key={card.front} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"><p className="text-sm font-bold">{card.front}</p><p className="mt-2 text-xs leading-5 text-slate-500">{card.back}</p></div>)}</div></Section>
      </Card>

      <MiniQuiz lesson={lesson} progress={progress} onSaved={setProgress} />

      <Card><h2 className="font-bold">Fontes oficiais</h2><p className="mt-1 text-xs text-slate-500">Material didático original; os links abaixo sustentam o conteúdo regulatório e institucional.</p><div className="mt-4 space-y-3">{lesson.officialSources.map((source) => <div key={source.id} className="rounded-xl border border-slate-200 p-3 dark:border-white/10"><p className="text-sm font-semibold">{source.institution} · {source.title}</p><a href={source.url} target="_blank" rel="noreferrer" className="mt-1 block break-all text-xs text-emerald-700 hover:underline dark:text-emerald-300">{source.url}</a><p className="mt-1 text-xs text-slate-500">Última verificação: {new Intl.DateTimeFormat('pt-BR').format(new Date(`${source.verifiedAt}T12:00:00`))}</p></div>)}</div></Card>

      <Card className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button disabled={busy || progress?.status === 'completed' || progress?.status === 'mastered'} onClick={() => void study()}><CheckCircle2 className="h-4 w-4" />{progress?.status === 'mastered' ? 'Dominado' : progress?.status === 'completed' ? 'Estudado' : busy ? 'Salvando...' : 'Marcar como estudado'}</Button>
          <Button variant={progress?.hasDoubt ? 'primary' : 'secondary'} onClick={() => void toggleLessonDoubt(lesson.pdCode).then(setProgress)}><CircleHelp className="h-4 w-4" />{progress?.hasDoubt ? 'Dúvida marcada' : 'Tenho dúvida'}</Button>
          <Button variant={favorite ? 'primary' : 'secondary'} onClick={() => void toggleLessonFavorite(lesson.pdCode).then(setFavorite)}>{favorite ? <Star className="h-4 w-4" /> : <Heart className="h-4 w-4" />}{favorite ? 'Favoritado' : 'Favoritar'}</Button>
          <Link to={`/questoes?pd=${encodeURIComponent(lesson.pdCode)}`}><Button variant="secondary"><BookOpen className="h-4 w-4" />Treinar este assunto</Button></Link>
        </div>
        <p className="text-xs text-slate-500">Abre o Question Engine filtrado pelo PD {lesson.pdCode}. Se ainda não houver questão exatamente nesse PD, a tela mostrará um estado vazio para você ajustar os filtros.</p>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {previous ? <Link to={`/conteudos/${previous.pdCode}`}><Card className="h-full transition hover:border-emerald-400/40"><p className="text-xs text-slate-500">← Aula anterior</p><p className="mt-1 text-sm font-semibold">{previous.pdCode} · {previous.title}</p></Card></Link> : <div />}
        {next ? <Link to={`/conteudos/${next.pdCode}`}><Card className="h-full text-right transition hover:border-emerald-400/40"><p className="text-xs text-slate-500">Próxima aula →</p><p className="mt-1 text-sm font-semibold">{next.pdCode} · {next.title}</p></Card></Link> : null}
      </div>
    </div>
  </div></div>
}
