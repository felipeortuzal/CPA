import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { moduleReadings } from '../../content/cpa/course/readings'
import { courseModuleMap } from '../../content/cpa/course/modules'
import { useDailyStudy } from '../hooks/useDailyStudy'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { startDailySession, advanceDailySession, dailyAttemptId } from '../lib/daily/repository'
import type { DailyKind, DailySession, DailyStep } from '../lib/daily/engine'
import { answerQuestion, markQuestionErrorResolved } from '../lib/storage/repositories/questionRepository'
import { setSectionRead } from '../lib/storage/repositories/courseRepository'
import { reviewFlashcard } from '../lib/storage/repositories/flashcardRepository'
import type { QuestionAttemptRecord } from '../lib/storage/types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useStudyTimer } from '../hooks/useStudyTimer'

export function DailySessionPage() {
  const [params]=useSearchParams()
  const kind:DailyKind=params.get('kind')==='review'?'review':'today'
  return <DailySession key={kind} kind={kind}/>
}
function DailySession({kind}:{kind:DailyKind}) {
  const daily=useDailyStudy()
  const [session,setSession]=useState<DailySession|null>(null)
  const {busy,error,run}=useAsyncAction()
  useStudyTimer('daily', 'review')
  const steps=kind==='today'?daily.today:daily.review
  useEffect(()=>{
    if(daily.loading)return
    const stored=daily.sessions[kind]
    if(stored){setSession(current=>current&&current.date===stored.date&&current.index>stored.index?current:stored);return}
    if(!session&&steps.length)void run(async()=>{setSession(await startDailySession(kind,steps))})
  },[daily.loading,daily.sessions,kind,steps.length])
  async function advance(skipped=false) {if(session)await run(async()=>{setSession(await advanceDailySession(session,skipped))})}
  if(daily.loading||(!session&&steps.length&&!error))return <Card><p role="status">Preparando sua sessão...</p></Card>
  const current=session?.steps[session.index]
  return <div className="mx-auto max-w-3xl space-y-5">
    <Link to={kind==='review'?'/revisao':'/'} className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">← Sair e continuar depois</Link>
    <h1 className="text-3xl font-bold">{kind==='review'?'Revisão de hoje':'Sessão de hoje'}</h1>
    {error&&<p role="alert" className="text-rose-700">{error}</p>}
    {session&&current?<><p className="text-sm text-slate-500">Etapa {session.index+1} de {session.steps.length} · {session.steps.reduce((sum,s)=>sum+s.minutes,0)} min estimados · progresso salvo</p><div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full bg-emerald-400" style={{width:`${session.index/session.steps.length*100}%`}}/></div><DailyStepView key={`${session.date}:${session.kind}:${session.index}`} step={current} session={session} attempt={daily.data?.attempts.find(row=>row.id===dailyAttemptId(session))} onAdvance={()=>advance()} disabled={busy}/><button disabled={busy} onClick={()=>void advance(true)} className="text-sm font-semibold text-slate-500 underline">Pular por hoje</button></>:<Card><h2 className="text-xl font-bold">{session?.steps.length?'Sessão concluída':'Nada pendente por enquanto'}</h2><p className="mt-3 text-sm leading-7 text-slate-500">{session?`${session.done.length} etapas realizadas e ${session.skipped.length} puladas. A próxima sessão diária será montada amanhã com seu histórico atualizado.`:'Comece a leitura de um módulo. Seus conceitos e questões alimentarão a revisão, sem incluir matéria que você ainda não começou.'}</p><Link className="mt-5 inline-block" to="/conteudos"><Button>Continuar os módulos</Button></Link></Card>}
  </div>
}
function DailyStepView({step,session,attempt,onAdvance,disabled}:{step:DailyStep;session:DailySession;attempt?:QuestionAttemptRecord;onAdvance:()=>Promise<void>;disabled:boolean}) {
  const [selected,setSelected]=useState<number|null>(null)
  const [saved,setSaved]=useState<QuestionAttemptRecord|undefined>(attempt)
  const [revealed,setRevealed]=useState(false)
  const {busy,error,run}=useAsyncAction()
  const result=saved??attempt
  const locked=busy||disabled
  return <Card><p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">{step.reason}</p>{error&&<p role="alert" className="my-3 text-rose-700">{error}</p>}
    {step.type==='reading'&&<><h2 className="mt-3 text-xl font-bold">{moduleReadings[step.moduleId].sections.find(s=>s.id===step.sectionId)!.title}</h2><div className="mt-4 space-y-4 text-base leading-8 text-slate-700 dark:text-slate-300">{moduleReadings[step.moduleId].sections.find(s=>s.id===step.sectionId)!.paragraphs.map(p=><p key={p}>{p}</p>)}</div><Link to={`/modulos/${step.moduleId}`} className="mt-5 block text-sm text-emerald-700 underline dark:text-emerald-300">Abrir o módulo completo: {courseModuleMap.get(step.moduleId)!.title}</Link><Button className="mt-5" disabled={locked} onClick={()=>void run(async()=>{await setSectionRead(step.moduleId,step.sectionId,true);await onAdvance()})}>Li esta parte · continuar</Button></>}
    {step.type==='question'&&<><p className="mt-4 text-sm leading-7 text-slate-500">{step.question.context}</p><h2 className="mt-4 text-lg font-bold">{step.question.prompt}</h2><fieldset disabled={locked||Boolean(result)} className="mt-4 space-y-3"><legend className="sr-only">Escolha uma alternativa</legend>{step.question.options.map((option,i)=><label key={option} className={`flex gap-3 rounded-xl border p-3 text-sm leading-6 ${result&&i===step.question.correctAnswer?'border-emerald-400 bg-emerald-400/10':'border-slate-200 dark:border-white/10'}`}><input type="radio" name={step.id} checked={(result?.selectedAnswer??selected)===i} onChange={()=>setSelected(i)}/><span>{option}</span></label>)}</fieldset>{result?<div className="mt-5 space-y-3"><h3 className="font-bold">{result.isCorrect?'Resposta correta':'Vamos revisar'}</h3><p className="text-sm leading-7">{step.question.explanation}</p>{!result.isCorrect&&<p className="text-sm leading-6 text-slate-500">{step.question.whyOthersAreWrong[result.selectedAnswer]}</p>}<Button disabled={locked} onClick={()=>void run(async()=>{if(result.isCorrect&&step.errorId)await markQuestionErrorResolved(step.errorId);await onAdvance()})}>Continuar sessão</Button></div>:<Button className="mt-5" disabled={locked||selected===null} onClick={()=>void run(async()=>{if(selected!==null)setSaved(await answerQuestion(step.question,selected,{id:dailyAttemptId(session),mode:'review'}))})}>Responder e conferir</Button>}</>}
    {step.type==='flashcard'&&<><h2 className="my-6 text-xl font-bold leading-8">{step.card.front}</h2>{!revealed?<Button onClick={()=>setRevealed(true)}>Mostrar resposta</Button>:<><p className="rounded-xl bg-emerald-400/10 p-4 text-base leading-8">{step.card.back}</p><p className="mt-4 text-sm text-slate-500">Como foi lembrar? Sua avaliação define a próxima revisão.</p><div className="mt-4 flex flex-wrap gap-2">{([['again','Não lembrei'],['hard','Difícil'],['good','Lembrei'],['easy','Fácil']] as const).map(([rating,label])=><Button key={rating} variant="secondary" disabled={locked} onClick={()=>void run(async()=>{await reviewFlashcard(step.card.id,rating,new Date(),dailyAttemptId(session));await onAdvance()})}>{label}</Button>)}</div></>}</>}
  </Card>
}
