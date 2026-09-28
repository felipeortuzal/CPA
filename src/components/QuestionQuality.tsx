import { cpaQuestions } from '../../content/cpa/questions'
import { bankQuality } from '../../content/cpa/questions/quality'
import { Card } from './ui/Card'
export function QuestionQuality() {
  const q=bankQuality(cpaQuestions)
  return <Card><h2 className="font-bold">Qualidade do banco</h2><dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{[['Total',q.total],['Autorais',q.authored],['Verificadas',q.verified],['Revisadas',q.reviewed],['Rascunhos autorais',q.draft],['Cobertura automática',q.generated]].map(([label,value])=><div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 text-xl font-bold">{value}</dd></div>)}</dl><p className="mt-4 text-xs leading-6 text-slate-500">Revisada: enunciado, alternativas e explicação conferidos em revisão editorial assistida. Verificada: também possui conferência específica registrada contra uma fonte. Simulados, domínio e indicadores de desempenho usam apenas autorais revisadas ou verificadas. Rascunhos continuam acessíveis para consulta e seu histórico é preservado.</p></Card>
}
