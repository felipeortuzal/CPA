import { useEffect, useMemo, useRef, useState } from 'react'
import { Calculator, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Flag, NotebookPen, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { getSimulation, finishSimulation, saveSimulationAnswer, saveSimulationNotes, toggleSimulationReview, getSimulationQuestions, saveSimulationPosition } from '../lib/storage/repositories/simulationRepository'
import type { SimulationRecord } from '../lib/storage/types'

function formatTime(seconds: number) {
  const safe = Math.max(0, seconds)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const secs = safe % 60
  return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(secs).padStart(2,'0')}`
}

function BasicCalculator({onClose}:{onClose:()=>void}) {
  const [display,setDisplay]=useState('0'); const [stored,setStored]=useState<number|null>(null); const [operator,setOperator]=useState<string|null>(null); const [replace,setReplace]=useState(true)
  function input(value:string){setDisplay((current)=>replace?value:(current==='0'?value:current+value));setReplace(false)}
  function decimal(){if(replace){setDisplay('0.');setReplace(false)}else if(!display.includes('.'))setDisplay(`${display}.`)}
  function choose(next:string){const value=Number(display);if(operator&&stored!==null){const result=calculate(stored,value,operator);setStored(result);setDisplay(String(result))}else setStored(value);setOperator(next);setReplace(true)}
  function calculate(a:number,b:number,op:string){if(op==='+')return a+b;if(op==='−')return a-b;if(op==='×')return a*b;if(op==='÷')return b===0?0:a/b;return b}
  function equals(){if(operator===null||stored===null)return;const result=calculate(stored,Number(display),operator);setDisplay(String(Number(result.toFixed(8))));setStored(null);setOperator(null);setReplace(true)}
  const keys=['7','8','9','÷','4','5','6','×','1','2','3','−','0','.','=','+']
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4"><div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl dark:bg-[#0b1824]"><div className="flex items-center justify-between"><h2 className="font-bold">Calculadora</h2><button aria-label="Fechar calculadora" onClick={onClose}><X className="h-5 w-5"/></button></div><div className="mt-4 overflow-hidden rounded-2xl bg-slate-950 px-4 py-5 text-right font-mono text-3xl text-white">{display}</div><div className="mt-4 grid grid-cols-4 gap-2">{keys.map((key)=><button key={key} onClick={()=>key==='.'?decimal():key==='='?equals():['+','−','×','÷'].includes(key)?choose(key):input(key)} className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5">{key}</button>)}</div><button onClick={()=>{setDisplay('0');setStored(null);setOperator(null);setReplace(true)}} className="mt-3 w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold dark:border-white/10">Limpar</button></div></div>
}

export function ExamPage(){
  const { simulationId } = useParams(); const navigate=useNavigate()
  const [simulation,setSimulation]=useState<SimulationRecord|null>(null); const [index,setIndex]=useState(0); const [remaining,setRemaining]=useState(0); const [loading,setLoading]=useState(true); const [notesOpen,setNotesOpen]=useState(false); const [calculatorOpen,setCalculatorOpen]=useState(false); const [finishOpen,setFinishOpen]=useState(false); const [finishing,setFinishing]=useState(false); const [notes,setNotes]=useState('')

  const [error, setError] = useState('')
  const [writing, setWriting] = useState(false)
  const writeLock = useRef(false)
  const finishLock = useRef(false)
  const autoFinishFailed = useRef(false)
  const pendingNotes = useRef<Promise<unknown>>(Promise.resolve())

  useEffect(()=>{if(!simulationId)return;let active=true;void getSimulation(simulationId).then((record)=>{if(!active)return;if(!record){navigate('/simulados',{replace:true});return}if(record.completedAt){navigate(`/prova/${record.id}/resultado`,{replace:true});return}const elapsed=Math.floor((Date.now()-new Date(record.payload.startedAt).getTime())/1000);setRemaining(Math.max(0,record.payload.durationSeconds-elapsed));setSimulation(record);setIndex(record.payload.currentIndex ?? 0);setNotes(record.payload.notes);setLoading(false)}).catch(()=>{if(active){setError('Não foi possível abrir o simulado. Tente recarregar a página.');setLoading(false)}});return()=>{active=false}},[simulationId,navigate])
  useEffect(()=>{if(!simulation)return;const tick=()=>{const elapsed=Math.floor((Date.now()-new Date(simulation.payload.startedAt).getTime())/1000);setRemaining(Math.max(0,simulation.payload.durationSeconds-elapsed))};tick();const id=window.setInterval(tick,1000);return()=>window.clearInterval(id)},[simulation])
  useEffect(()=>{if(!simulation||remaining!==0||loading||finishing||autoFinishFailed.current)return;const elapsed=Math.floor((Date.now()-new Date(simulation.payload.startedAt).getTime())/1000);if(elapsed<simulation.payload.durationSeconds)return;void finish()},[simulation,remaining,loading,finishing])
  useEffect(() => { if (!simulation || loading) return; void saveSimulationPosition(simulation.id, index).catch(() => setError('Não foi possível salvar sua posição.')) }, [simulation?.id, index, loading])

  const questions=useMemo(()=>simulation ? getSimulationQuestions(simulation) : [],[simulation])
  const current=questions[index]
  const answeredCount=simulation?Object.values(simulation.payload.answers).filter((value)=>value!==null).length:0
  const marked=new Set(simulation?.payload.markedForReview??[])
  async function answer(option:number){
    if(!simulation||!current||writeLock.current||finishLock.current)return
    writeLock.current=true;setWriting(true);setError('')
    try { const updated=await saveSimulationAnswer(simulation.id,current.id,option);if(updated)setSimulation(updated) }
    catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível salvar a resposta. Tente novamente.')}
    finally{writeLock.current=false;setWriting(false)}
  }
  async function mark(){
    if(!simulation||!current||writeLock.current||finishLock.current)return
    writeLock.current=true;setWriting(true);setError('')
    try{const updated=await toggleSimulationReview(simulation.id,current.id);if(updated)setSimulation(updated)}
    catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível salvar a marcação.')}
    finally{writeLock.current=false;setWriting(false)}
  }
  function updateNotes(value:string){
    setNotes(value)
    if(!simulation)return
    pendingNotes.current = pendingNotes.current.then(()=>saveSimulationNotes(simulation.id,value)).catch(()=>{setError('Não foi possível salvar as notas. Tente novamente.')})
  }
  async function finish(){
    if(!simulation||finishLock.current||writeLock.current)return
    finishLock.current=true;setFinishing(true);setError('')
    try{
      await pendingNotes.current
      await saveSimulationNotes(simulation.id,notes)
      const record=await finishSimulation(simulation.id)
      navigate(`/prova/${record.id}/resultado`,{replace:true})
    }catch(cause){autoFinishFailed.current=true;setError(cause instanceof Error?cause.message:'Não foi possível finalizar. Tente novamente.')}
    finally{finishLock.current=false;setFinishing(false)}
  }

  if(loading)return <div className="p-8" role="status">Preparando prova...</div>
  if(!simulation||!current||questions.length!==simulation.questionCount)return <div className="p-8" role="alert">{error||'Não foi possível carregar todas as questões deste simulado. Seu progresso foi preservado.'}<Button onClick={()=>navigate('/simulados')}>Voltar aos simulados</Button></div>
  const selected=simulation.payload.answers[current.id]
  const urgent=remaining<=15*60
  return <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-[#07111c] dark:text-slate-100">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#091621]/95"><div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-3 sm:px-6"><div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400 font-black text-slate-950">C</div><div><p className="text-sm font-black">{simulation.payload.label}</p><p className="text-[11px] text-slate-500">CPA · ambiente de prova</p></div><div className={`ml-auto flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-sm font-black ${urgent?'bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300':'bg-slate-100 dark:bg-white/5'}`}><Clock3 className="h-4 w-4"/>{formatTime(remaining)}</div></div></header>
    {error?<p role="alert" className="mx-auto max-w-5xl rounded-xl bg-rose-100 p-4 text-rose-900">{error}</p>:null}<main className="mx-auto grid max-w-[1500px] gap-6 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_330px]">
      <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b1824] sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Questão {index+1} de {questions.length}</p><p className="mt-1 text-xs text-slate-500">{answeredCount} respondidas · {simulation.payload.markedForReview.length} marcadas</p></div>{marked.has(current.id)?<span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"><Flag className="h-3.5 w-3.5"/>Revisar</span>:null}</div>
        <div className="mt-7 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700 dark:bg-white/[0.04] dark:text-slate-200">{current.context}</div><h1 className="mt-6 text-lg font-bold leading-8 sm:text-xl">{current.prompt}</h1>
        <div className="mt-6 space-y-3">{current.options.map((option,optionIndex)=><button disabled={writing||finishing||remaining===0} key={option} onClick={()=>void answer(optionIndex)} className={`flex w-full gap-3 rounded-2xl border p-4 text-left text-sm leading-6 transition ${selected===optionIndex?'border-emerald-400 bg-emerald-400/10':'border-slate-200 hover:border-emerald-400/50 dark:border-white/10'}`}><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-current text-xs font-black">{String.fromCharCode(65+optionIndex)}</span><span>{option}</span></button>)}</div>
        <div className="mt-8 flex flex-wrap items-center gap-2"><Button variant="secondary" disabled={writing||finishing||index===0} onClick={()=>setIndex((value)=>Math.max(0,value-1))}><ChevronLeft className="h-4 w-4"/>Anterior</Button><Button variant="secondary" disabled={writing||finishing} onClick={()=>void mark()}><Flag className="h-4 w-4"/>{marked.has(current.id)?'Desmarcar revisão':'Marcar para revisão'}</Button><Button className="ml-auto" disabled={writing||finishing||index===questions.length-1} onClick={()=>setIndex((value)=>Math.min(questions.length-1,value+1))}>Próxima<ChevronRight className="h-4 w-4"/></Button></div>
      </section>
      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start"><div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#0b1824]"><div className="flex items-center justify-between"><p className="text-sm font-bold">Navegação</p><span className="text-xs text-slate-500">{answeredCount}/{questions.length}</span></div><div className="mt-4 grid grid-cols-5 gap-2">{questions.map((question,qIndex)=>{const answered=simulation.payload.answers[question.id]!==null;const flagged=marked.has(question.id);return <button disabled={writing||finishing} key={question.id} onClick={()=>setIndex(qIndex)} className={`relative aspect-square rounded-xl border text-xs font-bold transition ${qIndex===index?'border-slate-900 ring-2 ring-slate-900/10 dark:border-white':answered?'border-emerald-400 bg-emerald-400/12 text-emerald-700 dark:text-emerald-300':'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/[0.03]'} ${flagged?'after:absolute after:right-1 after:top-1 after:h-2 after:w-2 after:rounded-full after:bg-amber-400':''}`}>{qIndex+1}</button>})}</div><div className="mt-4 space-y-2 text-[11px] text-slate-500"><p><span className="mr-2 inline-block h-2.5 w-2.5 rounded bg-emerald-400/60"/>Respondida</p><p><span className="mr-2 inline-block h-2.5 w-2.5 rounded border border-slate-300"/>Não respondida</p><p><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-amber-400"/>Marcada para revisão</p></div></div>
        <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={()=>setNotesOpen(true)}><NotebookPen className="h-4 w-4"/>Notas</Button><Button variant="secondary" onClick={()=>setCalculatorOpen(true)}><Calculator className="h-4 w-4"/>Calculadora</Button></div><Button className="w-full" variant="secondary" onClick={()=>setFinishOpen(true)}><CheckCircle2 className="h-4 w-4"/>Finalizar</Button><p className="px-1 text-[11px] leading-5 text-slate-500">Durante a prova não são exibidos gabarito, correção, assunto, dificuldade ou dicas.</p>
      </aside>
    </main>
    {notesOpen?<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4"><div className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl dark:bg-[#0b1824]"><div className="flex items-center justify-between"><div><h2 className="font-bold">Bloco de notas</h2><p className="mt-1 text-xs text-slate-500">As notas ficam salvas neste simulado.</p></div><button aria-label="Fechar notas" onClick={()=>setNotesOpen(false)}><X className="h-5 w-5"/></button></div><textarea autoFocus value={notes} maxLength={10000} disabled={finishing||writing} onChange={(event)=>updateNotes(event.target.value)} className="mt-4 h-72 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-white/[0.04]" placeholder="Anote cálculos, dúvidas ou pontos para revisar..."/><Button className="mt-3" onClick={()=>setNotesOpen(false)}>Fechar</Button></div></div>:null}
    {calculatorOpen?<BasicCalculator onClose={()=>setCalculatorOpen(false)}/>:null}
    {finishOpen?<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/65 p-4"><div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#0b1824]"><h2 className="text-xl font-black">Finalizar simulado?</h2><p className="mt-3 text-sm leading-6 text-slate-500">Você respondeu <strong>{answeredCount}</strong> de {questions.length}. {questions.length-answeredCount>0?`Há ${questions.length-answeredCount} questão(ões) em branco.`:'Todas as questões foram respondidas.'}</p><div className="mt-5 flex gap-2"><Button variant="secondary" onClick={()=>setFinishOpen(false)}>Continuar prova</Button><Button disabled={finishing||writing} onClick={()=>void finish()}>{finishing?'Finalizando...':'Finalizar agora'}</Button></div></div></div>:null}
  </div>
}
