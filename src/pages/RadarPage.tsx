import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { v27Metrics, v27Clusters } from '../../content/cpa/v27/intelligence'

export function RadarPage() {
  return <div className="mx-auto max-w-6xl space-y-6">
    <header className="rounded-3xl border border-violet-400/25 bg-violet-400/5 p-6 sm:p-9">
      <Badge>V27 · Radar CPA</Badge>
      <h1 className="mt-4 text-3xl font-black">Radar CPA</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">Camada de benchmark, raciocínio e revisão criada sobre a base da V26. A fonte de verdade continua sendo a ANBIMA.</p>
    </header>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card><p className="text-xs text-slate-500">Aulas benchmark</p><p className="mt-1 text-2xl font-black">{v27Metrics.playlistScopeLessons}</p></Card>
      <Card><p className="text-xs text-slate-500">Vídeos verificados</p><p className="mt-1 text-2xl font-black">{v27Metrics.verifiedBenchmarkVideos}</p></Card>
      <Card><p className="text-xs text-slate-500">Padrões</p><p className="mt-1 text-2xl font-black">{v27Metrics.questionPatterns}</p></Card>
      <Card><p className="text-xs text-slate-500">Pegadinhas</p><p className="mt-1 text-2xl font-black">{v27Metrics.traps}</p></Card>
    </div>
    <section className="grid gap-3 md:grid-cols-2">{v27Clusters.map(item=><Card key={item.id}><Badge>{item.priority}</Badge><h2 className="mt-3 font-bold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{item.rationale}</p><p className="mt-2 text-xs leading-5 text-slate-500">{item.examPattern}</p></Card>)}</section>
    <Card><h2 className="font-bold">Aprofundamento</h2><p className="mt-2 text-sm leading-6 text-slate-500">A estrutura completa da V27 está no módulo de dados do projeto.</p><Link to="/conteudos" className="mt-4 inline-block text-sm font-bold text-emerald-600 hover:underline">Voltar aos módulos</Link></Card>
  </div>
}
