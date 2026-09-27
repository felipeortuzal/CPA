import { ExternalLink } from 'lucide-react'
import { Card } from './ui/Card'
const materials = [
  { title: 'ANBIMA · caderno de questões CPA', description: 'Questões oficiais para conhecer o formato da certificação atual.', url: 'https://www.anbima.com.br/data/files/DF/86/EE/B6/EB6F8910C03A3F89B82BA2A8/Caderno-de-questoes-CPA.pdf' },
  { title: 'ANBIMA · programa e materiais', description: 'Confira o programa detalhado e os exemplos de questões interativas.', url: 'https://www.anbima.com.br/pt_br/especial/pds-certificacoes-distribuicao.htm' },
  { title: 'Elite Bancária · simulados CPA', description: 'Página de simulados gratuitos por tema e provas completas.', url: 'https://elitebancaria.com.br/cpa-simulados/' },
  { title: 'TopInvest · apostilas', description: 'Biblioteca de apostilas gratuitas. Selecione a CPA vigente em 2026.', url: 'https://www.topinvest.com.br/apostilas/' },
  { title: 'TopInvest · simulados da nova CPA', description: 'Exercícios externos para complementar a prática dos módulos.', url: 'https://simulados.topinvest.com.br/simulados/nova-cpa-2026' },
]
export function FreeMaterials() {
  return <section id="materiais" className="space-y-4"><div><h2 className="text-xl font-bold">Para ir além · materiais gratuitos</h2><p className="mt-2 text-sm leading-6 text-slate-500">Seleção consultada em 27/09/2026. Links externos exigem internet; alguns fornecedores podem pedir cadastro. Confira a versão CPA 2026 e as condições de acesso. Conteúdos de terceiros não foram copiados para este curso.</p></div><div className="grid gap-3 sm:grid-cols-2">{materials.map(item => <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="group"><Card className="h-full transition group-hover:border-emerald-400"><div className="flex gap-3"><div className="min-w-0 flex-1"><h3 className="text-sm font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p></div><ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-600"/></div></Card></a>)}</div></section>
}
