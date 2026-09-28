import { Link } from 'react-router-dom'
import { useDailyStudy } from '../hooks/useDailyStudy'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
export function ReviewPage() {
  const daily=useDailyStudy()
  const session=daily.sessions.review
  const steps=session?.steps??daily.review
  if(daily.loading)return <Card><p role="status">Montando sua revisão...</p></Card>
  return <div className="mx-auto max-w-5xl space-y-6"><header><h1 className="text-3xl font-bold">Revisão de hoje</h1><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">Uma sessão que mistura erros, flashcards, pontos fracos e conceitos antigos. Você responde e recebe feedback aqui, sem precisar escolher uma ferramenta a cada etapa.</p></header><Card className="border-emerald-400/30"><h2 className="text-2xl font-bold">{steps.reduce((sum,s)=>sum+s.minutes,0)} minutos estimados</h2><p className="mt-3 text-sm leading-7 text-slate-500">{steps.filter(s=>s.type==='question'&&s.errorId).length} erros · {steps.filter(s=>s.type==='flashcard').length} flashcards · {steps.filter(s=>s.type==='question'&&!s.errorId).length} questões de reforço e revisão espaçada.</p>{steps.length?<Link to="/hoje?kind=review" className="mt-5 inline-block"><Button>{session?.index===steps.length?'Ver revisão concluída':session?'Continuar revisão':'Começar revisão'}</Button></Link>:<p className="mt-4 text-sm">Nenhuma pendência selecionada. <Link to="/conteudos" className="font-bold text-emerald-700 dark:text-emerald-300">Continue um módulo →</Link></p>}</Card>
    <section><h2 className="mb-3 text-lg font-bold">Na sua fila</h2><ol className="space-y-2">{steps.map((step,i)=><li key={step.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-white/10"><span className="mr-3 font-bold text-emerald-700 dark:text-emerald-300">{i+1}</span>{step.reason}{session&&i<session.index?' · realizada ou pulada':''}</li>)}</ol></section>
    <details className="rounded-2xl border border-slate-200 p-5 dark:border-white/10"><summary className="cursor-pointer font-semibold">Escolher uma ferramenta de revisão</summary><div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300"><Link to="/erros">Caderno de erros</Link><Link to="/flashcards">Flashcards</Link><Link to="/estudo-ativo">Estudo ativo</Link><Link to="/revisao/sessao?mode=5">Sessão livre de 5 minutos</Link><Link to="/revisao/sessao?mode=eve">Revisão de véspera</Link></div></details>
  </div>
}
