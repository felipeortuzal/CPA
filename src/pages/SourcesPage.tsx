import { CalendarDays, ExternalLink, FileCheck2, ShieldCheck } from 'lucide-react'
import metadata from '../../content/cpa/metadata.json'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'

const officialReferences = [
  {
    title: 'Edital dos Exames de Certificação Profissional ANBIMA — versão 1.4',
    url: 'https://www.anbima.com.br/data/files/98/96/A6/10/9C24C910CF6A83C9F82BA2A8/Edital-dos-Exames-de-Certificacao-Profissional-Anbima.pdf',
    note: 'Edital vigente pesquisado em 16/09/2026. Para a CPA: 50 questões, 2h30 e mínimo de 35 acertos; prevê múltipla escolha, árvore de diálogo e cases.',
  },
  {
    title: 'Guia de Elaboração de Questões das Certificações ANBIMA',
    url: 'https://www.anbima.com.br/data/files/40/C6/A8/5E/FCBF891048BA3F89EA2BA2A8/Guia-de-Elaboracao-de-Questao-Certificacoes-Anbima.pdf',
    note: 'Referência oficial para contexto profissional, comando, distratores e níveis cognitivos.',
  },
  {
    title: 'Caderno de Questões CPA — ANBIMA',
    url: 'https://www.anbima.com.br/data/files/DF/86/EE/B6/EB6F8910C03A3F89B82BA2A8/Caderno-de-questoes-CPA.pdf',
    note: 'Questões oficiais estudadas somente para estilo e desenho cognitivo. O banco da plataforma é autoral.',
  },
]

export function SourcesPage() {
  const source = metadata.officialSource
  return <div className="mx-auto max-w-5xl space-y-6">
    <div><div className="mb-2 flex items-center gap-2"><Badge>Fontes oficiais</Badge><span className="text-sm text-slate-500">Rastreabilidade do conteúdo e do Modo Prova</span></div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Fontes</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">A trilha usa o Programa Detalhado vigente da CPA como fonte de verdade; o Modo Prova usa o edital vigente para quantidade, tempo, corte e formatos de questão.</p></div>

    <Card className="overflow-hidden p-0"><div className="border-b border-slate-200 bg-emerald-50 p-5 dark:border-white/10 dark:bg-emerald-400/[0.06] sm:p-6"><div className="flex items-start gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-400 text-slate-950"><FileCheck2 className="h-5 w-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Programa oficial vigente</p><h2 className="mt-1 text-xl font-bold">Programa Detalhado · CPA — Certificado Profissional ANBIMA</h2></div></div></div><div className="grid gap-px bg-slate-200 dark:bg-white/10 sm:grid-cols-2 lg:grid-cols-4">{[['Versão', metadata.programVersion], ['Revisão', '04/06/2025'], ['Vigência', '01/01/2026'], ['Última verificação', '16/09/2026']].map(([label, value]) => <div key={label} className="bg-white p-5 dark:bg-[#0b1824]"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p><p className="mt-1 font-bold">{value}</p></div>)}</div><div className="space-y-4 p-5 sm:p-6"><div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><CalendarDays className="h-4 w-4 text-slate-400" />Data de elaboração: 02/09/2024</div><div className="flex flex-col gap-2 sm:flex-row"><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">Abrir Programa Detalhado oficial <ExternalLink className="h-4 w-4" /></a><a href={source.landingPage} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10">Página oficial dos programas <ExternalLink className="h-4 w-4" /></a></div></div></Card>

    <Card><h2 className="font-semibold">Edital e referências oficiais de avaliação</h2><p className="mt-2 text-sm leading-6 text-slate-500">O banco da plataforma é autoral. Os materiais da ANBIMA são usados para reproduzir regras e estilo, não para copiar questões.</p><div className="mt-4 space-y-3">{officialReferences.map((item) => <a key={item.title} href={item.url} target="_blank" rel="noreferrer" className="block rounded-xl border border-slate-200 p-4 transition hover:border-emerald-400/50 dark:border-white/10"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p></div><ExternalLink className="h-4 w-4 shrink-0 text-slate-400" /></div></a>)}</div></Card>

    <Card><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /><div><h2 className="font-semibold">Política de atualização</h2><p className="mt-1 text-sm leading-6 text-slate-500">Antes de alterar regras de prova, conteúdo regulatório ou banco de questões, verificar novamente edital, Programa Detalhado e demais canais oficiais da ANBIMA. Documento oficial mais recente prevalece.</p></div></div></Card>
  </div>
}
