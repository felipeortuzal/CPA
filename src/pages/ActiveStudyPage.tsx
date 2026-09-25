import { useAsyncAction } from '../hooks/useAsyncAction'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Brain, Calculator, Layers3, MoonStar, Search, Sparkles, Target, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { cpaLessons } from '../../content/cpa/lessons'
import { cpaQuestions } from '../../content/cpa/questions'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useReviewCenter } from '../features/review/useReviewCenter'
import { generateSimulation, samplesFromAttempts, samplesFromSimulations } from '../lib/simulations/engine'
import { getQuestionAttempts } from '../lib/storage/repositories/questionRepository'
import { createSimulation, getSimulations } from '../lib/storage/repositories/simulationRepository'
import { reviewFlashcard } from '../lib/storage/repositories/flashcardRepository'
import { getLatestFlashcardState, type FlashcardRating } from '../lib/review/flashcardEngine'

const ratingLabel:Record<FlashcardRating,string>={again:'Again',hard:'Hard',good:'Good',easy:'Easy'}

export function ActiveStudyPage(){
  const navigate=useNavigate()
  const {flashcards,reviews,loading,refresh}=useReviewCenter()
  const [revealed,setRevealed]=useState(false)
  const { busy: saving, error: saveError, run } = useAsyncAction()
  const [busy,setBusy]=useState(false)
  const startLock=useRef(false)
  const [message,setMessage]=useState('')
  const [query,setQuery]=useState('')

  const due=useMemo(()=>flashcards
    .map((card)=>({card,state:getLatestFlashcardState(card.id,reviews)}))
    .filter(({state})=>state.due)
    .sort((a,b)=>(a.state.nextReviewAt??'9999').localeCompare(b.state.nextReviewAt??'9999')||a.card.id.localeCompare(b.card.id)),[flashcards,reviews])
  const recall=due[0]
  useEffect(()=>setRevealed(false),[recall?.card.id])

  const library=useMemo(()=>{
    const normalized=query.trim().toLocaleLowerCase('pt-BR')
    return cpaLessons
      .filter((lesson)=>!normalized||[lesson.pdCode,lesson.title,lesson.oneSentence,...lesson.essentialConcepts,...lesson.formulas.map((formula)=>formula.name+' '+formula.expression)].join(' ').toLocaleLowerCase('pt-BR').includes(normalized))
      .slice(0,50)
  },[query])

  async function start(mode:'quick10'|'weak'){
    if(startLock.current)return
    startLock.current=true
    setBusy(true);setMessage('')
    try{
      if(mode==='quick10'){
        const definition=generateSimulation(cpaQuestions,{mode:'quick10'})
        const record=await createSimulation(definition)
        navigate('/prova/'+record.id)
        return
      }
      const [attempts,simulations]=await Promise.all([getQuestionAttempts(),getSimulations()])
      const samples=[...samplesFromAttempts(attempts),...samplesFromSimulations(simulations)]
      const definition=generateSimulation(cpaQuestions,{mode:'weak',performanceSamples:samples})
      const record=await createSimulation(definition)
      navigate('/prova/'+record.id)
    }catch(error){
      setMessage(error instanceof Error?error.message:'Não foi possível iniciar o treino.')
    }finally{startLock.current=false;setBusy(false)}
  }

  async function rate(rating:FlashcardRating){
    await run(async () => {
      if(!recall)return
      await reviewFlashcard(recall.card.id,rating)
      setRevealed(false)
      await refresh()

    })
  }

  return <div className="mx-auto max-w-7xl space-y-6">
    {saveError?<p role="alert" className="text-sm text-rose-600">{saveError}</p>:null}
    <div><div className="mb-2 flex items-center gap-2"><Badge>V21 · Estudo Ativo</Badge><span className="text-sm text-slate-500">recuperação + interleaving + revisão</span></div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Estudo Ativo</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Troque releitura passiva por recuperação, mistura de assuntos e prática orientada pelos seus erros. Todos os modos abaixo usam o mesmo histórico local da plataforma.</p></div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="flex flex-col"><Layers3 className="h-6 w-6 text-emerald-500"/><h2 className="mt-4 font-bold">Intercalar assuntos</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-500">10 questões misturadas em 20/40/30/10 entre os quatro temas. Evita estudar blocos sempre isolados.</p><Button className="mt-5 w-full" disabled={busy} onClick={()=>void start('quick10')}><Zap className="h-4 w-4"/>Começar 10</Button></Card>
      <Card className="flex flex-col"><Target className="h-6 w-6 text-rose-500"/><h2 className="mt-4 font-bold">Atacar pontos fracos</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-500">Monta um simulado com PDs em que seu histórico mostra erros ou desempenho abaixo do restante.</p><Button className="mt-5 w-full" variant="secondary" disabled={busy} onClick={()=>void start('weak')}>Gerar treino fraco</Button></Card>
      <Card className="flex flex-col"><MoonStar className="h-6 w-6 text-violet-500"/><h2 className="mt-4 font-bold">Véspera inteligente</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-500">Só revisa conteúdo já visto: flashcards vencidos, erros e tópicos fracos. Não introduz matéria nova.</p><Link className="mt-5" to="/revisao/sessao?mode=eve"><Button className="w-full" variant="secondary">Abrir véspera</Button></Link></Card>
      <Card className="flex flex-col"><Sparkles className="h-6 w-6 text-amber-500"/><h2 className="mt-4 font-bold">Revisão espaçada</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-500">Use Again, Hard, Good e Easy. O próximo intervalo é ajustado a partir do seu histórico local.</p><Link className="mt-5" to="/flashcards"><Button className="w-full" variant="secondary">Abrir flashcards</Button></Link></Card>
    </div>

    {message?<div role="alert" className="rounded-xl bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-800 dark:text-amber-200">{message}</div>:null}

    <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
      <Card className="overflow-hidden p-0">
        <div className="bg-slate-950 p-5 text-white"><div className="flex items-center gap-2 text-emerald-300"><Brain className="h-5 w-5"/><span className="text-xs font-bold uppercase tracking-[.16em]">Recuperação ativa</span></div><h2 className="mt-2 text-xl font-black">Tente lembrar antes de revelar</h2></div>
        {loading?<p className="p-8 text-center text-sm text-slate-500">Carregando fila...</p>:!recall?<div className="p-8 text-center"><p className="font-bold">Nenhum cartão vencido agora.</p><p className="mt-2 text-sm text-slate-500">Abra ou estude novas aulas para ativar flashcards, ou volte quando a revisão vencer.</p></div>:<div className="p-5">
          <div className="flex flex-wrap gap-2"><Badge>{recall.card.source==='lesson'?'Aula':'Pessoal'}</Badge>{recall.card.pdCode?<Badge>PD {recall.card.pdCode}</Badge>:null}</div>
          <p className="mt-5 text-lg font-bold leading-7">{recall.card.front}</p>
          {!revealed?<Button className="mt-6 w-full" onClick={()=>setRevealed(true)}>Revelar resposta</Button>:<>
            <div className="mt-5 rounded-2xl bg-emerald-400/10 p-4 text-sm leading-7">{recall.card.back}</div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{(Object.keys(ratingLabel) as FlashcardRating[]).map((rating)=><button key={rating} disabled={saving} onClick={()=>void rate(rating)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold hover:border-emerald-400 dark:border-white/10">{ratingLabel[rating]}</button>)}</div>
          </>}
        </div>}
      </Card>

      <Card>
        <div className="flex items-center gap-2"><Calculator className="h-5 w-5 text-sky-500"/><h2 className="font-bold">Glossário, conceitos e fórmulas</h2></div><p className="mt-1 text-xs text-slate-500">Pesquise os 445 PDs sem sair do estudo. Use como consulta rápida, não como substituto da recuperação ativa.</p>
        <div className="relative mt-4"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input value={query} onChange={(event)=>setQuery(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm dark:border-white/10 dark:bg-white/5" placeholder="Ex.: PGBL, suitability, IOF, blockchain, SAC..."/></div>
        <div className="mt-4 max-h-[560px] space-y-2 overflow-auto">{library.map((lesson)=><details key={lesson.pdCode} className="rounded-xl border border-slate-200 p-3 dark:border-white/10"><summary className="cursor-pointer list-none"><span className="font-mono text-[11px] font-bold text-emerald-600">PD {lesson.pdCode}</span><p className="mt-1 text-sm font-semibold">{lesson.title}</p></summary><p className="mt-3 text-xs leading-6 text-slate-500">{lesson.oneSentence}</p>{lesson.formulas.length?<div className="mt-3 space-y-2">{lesson.formulas.map((formula)=><div key={formula.name} className="rounded-lg bg-slate-950 p-3 text-xs text-slate-100"><p className="font-bold text-emerald-300">{formula.name}</p><code className="mt-1 block overflow-x-auto">{formula.expression}</code><p className="mt-1 text-slate-400">{formula.explanation}</p></div>)}</div>:null}<Link to={'/conteudos/'+lesson.pdCode} className="mt-3 inline-block text-xs font-bold text-emerald-600 hover:underline">Abrir aula completa</Link></details>)}</div>
      </Card>
    </div>
  </div>
}
