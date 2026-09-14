begin;

with parsed as (
  select
    row_number() over ()::int as sort_order,
    split_part(line, '|', 1) as pd_code,
    substr(line, strpos(line, '|') + 1) as title
  from regexp_split_to_table(btrim($curriculum$
1|Estrutura e dinâmica do sistema financeiro nacional
1.1|Sistema financeiro nacional.
1.1.1|Órgãos normativos.
1.1.1.1|Características, funções e objetivos.
1.1.1.1.1|Conselho Monetário Nacional (CMN).
1.1.1.1.2|Conselho Nacional de Seguros Privados (CNSP).
1.1.1.1.3|Conselho Nacional de Previdência Complementar (CNPC).
1.1.2|Supervisão.
1.1.2.1|Características, funções e objetivos.
1.1.2.1.1|Banco Central (BC).
1.1.2.1.2|Comissão de Valores Mobiliários (CVM).
1.1.2.1.3|Superintendência de Seguros Privados (SUSEP).
1.1.2.1.4|Superintendência Nacional de Previdência Complementar (PREVIC).
1.1.3|Operadores e participantes do sistema.
1.1.3.1|Características, funções e objetivos.
1.1.3.1.1|Bancos e caixas econômicas.
1.1.3.1.2|Cooperativas de crédito e banco cooperativo.
1.1.3.1.3|Instituições de pagamento.
1.1.3.1.4|Administradoras de consórcios.
1.1.3.1.5|Corretoras e distribuidoras.
1.1.3.1.6|Fintechs.
1.1.3.1.7|Sociedades de crédito, financiamento e investimento.
1.1.3.1.8|Companhias hipotecárias.
1.1.3.1.9|Agências de fomento.
1.1.3.1.10|Sociedades de crédito à pessoa microempreendedora e à empresa de pequeno porte.
1.1.3.1.11|Sociedade de Crédito Imobiliário (SCI).
1.1.3.1.12|B3 S/A – Brasil, bolsa e balcão.
1.1.3.1.13|Seguradoras e resseguradoras.
1.1.3.1.14|Entidades Abertas de Previdência Complementar (EAPC).
1.1.3.1.15|Sociedades de capitalização.
1.1.3.1.16|Entidades Fechadas de Previdência Complementar (EFPC) (Fundos de pensão).
1.1.3.1.17|Corretoras de seguros.
1.1.4|Autorreguladores e demais participantes do mercado.
1.1.4.1|Anbima.
1.1.4.2|Apimec, Planejar e Ancord.
1.1.4.3|Fundo Garantidor de Créditos (FGC) e Fundo Garantidor do Cooperativismo de Crédito (FGCCoop).
1.1.5|Sistema Brasileiro de Pagamentos (SBP).
1.2|Política econômica.
1.2.1|Fluxo circular da renda.
1.2.1.1|Principais componentes do fluxo circular de renda (famílias, empresas, mercado e governo) e os impactos de suas decisões/ações sobre a economia.
1.2.2|Mercado financeiro e suas subdivisões.
1.2.2.1|Mercado monetário.
1.2.2.2|Mercado cambial.
1.2.2.3|Mercado de crédito.
1.2.2.4|Mercado de capitais.
1.2.3|Política fiscal.
1.2.3.1|Conceito e objetivos.
1.2.3.2|Modelos e funções da política fiscal.
1.2.3.3|Relações entre política fiscal, dívida pública, inflação, taxa de juros e investimentos.
1.2.3.4|Financiamento do Governo (Lei de Responsabilidade fiscal e equilíbrio das contas públicas).
1.2.4|Política monetária.
1.2.4.1|Política monetária expansionista e contracionista.
1.2.4.2|Instrumentos de política monetária: open market, redesconto e depósito compulsório.
1.2.4.3|Principais canais de transmissão.
1.2.4.4|Influência dos instrumentos e decisões de política monetária nas taxas de juros de curto e longo prazo, nos preços dos ativos financeiros, na inflação e na atividade econômica.
1.2.4.5|Copom (atribuições, relação com a política monetária e o impacto de suas decisões na atividade econômica e no mercado financeiro).
1.2.4.6|Regime de metas para a inflação e expectativas inflacionárias.
1.2.4.7|A relação entre a meta Selic, a taxa Selic, a taxa do CDI e suas definições.
1.2.5|Política cambial.
1.2.5.1|Definição e objetivos da política cambial.
1.2.5.2|Conceito de regimes de taxas de câmbio, cupom cambial e reservas internacionais.
1.2.5.3|Relação entre cupom cambial e investimentos.
1.2.5.4|Swap cambial.
1.2.5.5|Taxa de câmbio nominal e real, taxa PTAX, câmbio turismo e câmbio comercial.
1.2.6|Principais indicadores econômicos e de mercado.
1.2.6.1|Definição de PIB e seus principais componentes.
1.2.6.2|Definições e aplicações de IPCA, IGP-M, IPA e IPC-Fipe e como se relacionam.
1.2.6.3|Taxa de desemprego e seu impacto na economia.
1.2.6.4|Taxa básica de juros (Selic), Taxa DI e Taxa Referencial (TR).
1.2.7|Risco de liquidez, crédito e mercado.
1.3|Operações do mercado financeiro.
1.3.1|Taxa de juros nominal e taxa de juros real: como se relacionam e conceito de indexador.
1.3.2|Capitalização simples versus capitalização composta: conceito, desconto, equivalência e proporcionalidade.
1.3.3|Principais diferenças do efeito dos juros versus tempo de alocação dos ativos.
1.3.3.1|Pagamento de amortização e juros dos ativos de crédito privado.
1.3.3.2|Regime de capitalização em empréstimos e mútuo.
1.3.3.2.1|Fluxo de pagamentos: relações e conceitos.
1.3.3.2.2|Fluxo de caixa: cupom, amortizações e valores.
1.3.3.2.3|Valor Presente, Valor Futuro e Valor Presente Líquido (VPL).
1.3.3.3|Taxa de desconto.
1.3.3.4|Taxa bruta versus taxa líquida de impostos.
1.3.3.5|Amortização.
1.3.3.5.1|Prazo médio e vencimento.
1.3.3.5.2|Taxa Interna de Retorno (TIR).
1.3.3.5.3|Conceito de custo de oportunidade.
1.3.3.5.4|Conceito de taxa livre de risco.
1.3.3.5.5|Conceito de Custo Médio Ponderado de Capital (CMPC).
1.3.3.5.6|Duration versus prazo.
1.3.3.5.6.1|Alavancagem financeira, custos de captações (dívidas e/ou capital).
1.3.3.6|Retorno histórico e retorno esperado.
1.3.3.6.1|De um ativo.
1.3.3.6.2|De uma carteira.
1.3.4|Taxas de juros.
1.3.4.1|Nominal, efetiva e real (fórmula de Fisher).
1.3.4.2|Taxas prefixada e pós-fixada.
1.3.4.3|Juros simples e compostos.
1.3.5|Taxa de desconto comercial.
1.3.6|Prazo de retorno (payback).
1.3.7|Sistemas de amortização (SAC e price).
1.3.8|Aplicabilidade do desconto bancário na antecipação de recebíveis bancários ou de direitos creditórios.
1.3.8.1|Desconto bancário simples.
1.4|Regulação e infraestrutura de mercado.
1.4.1|Principais Infraestruturas do Mercado Financeiro (IMFs) e função de gatekeepers.
1.4.1.1|Sistemas de pagamentos: conceitos, atribuições e exemplos.
1.4.1.1.1|Sistema de Pagamentos Brasileiro (SPB).
1.4.1.1.2|Sistema de Pagamentos Instantâneos (SPI).
1.4.1.2|Sistema de liquidação de títulos: conceitos, atribuições e exemplos.
1.4.1.2.1|Sistema Especial de Liquidação e Custódia (Selic).
1.4.1.3|Contrapartes centrais: conceitos, atribuições e exemplos.
1.4.1.4|Depositários centrais: conceitos, atribuições e exemplos.
1.4.1.5|Entidade registradora: conceitos, atribuições e exemplos.
1.4.2|Normas e procedimentos adotados pelo Bacen para manter a estabilidade financeira do Brasil.
1.4.2.1|Comitê de estabilização financeira (Comef), Depósito Compulsório, Linhas Financeiras de Liquidez (LLI e LLT).
1.4.3|Ferramentas utilizadas pelo Bacen para intermediação financeira e suas características.
1.4.3.1|Definição de risco sistêmico.
1.4.3.2|Índice de Basileia I, II e III e os principais riscos (liquidez e alavancagem) que as normas e regras buscam evitar para a economia real.
1.4.4|Clearings houses e suas principais funções no mercado financeiro.
1.4.5|Impactos do risco da contraparte.
1.4.6|B3, Selic e suas responsabilidades.
1.4.7|Portabilidades de custódia entre instituições.
1.4.8|Desintermediação financeira.
1.4.9|BSM (supervisão de mercados).
1.4.10|Classificação de pessoas investidoras.
1.4.10.1|Pessoas investidoras qualificadas, profissionais e não-residentes.
1.4.10.1.1|Definições.
1.4.10.1.2|Definição do tipo de pessoa investidora e regras de enquadramento, segundo a resolução CVM 30.
1.4.11|Lei de Liberdade Econômica lei 13.874/19 (garantia de livre mercado).
1.4.12|Autorregulação Anbima.
1.4.12.1|Código de distribuição de produtos de investimento.
1.4.12.1.1|Objetivo e abrangência (título I, capítulo I).
1.4.12.1.2|Princípios gerais de conduta (título II, capítulo III).
1.4.12.1.3|Regras gerais de distribuição de produtos de investimento (Título III, Capítulo IV).
1.4.12.1.3.1|Conheça sua clientela (capítulo V).
1.4.12.1.3.2|Suitability (capítulo VI).
1.4.12.1.3.3|Publicidade (capítulo VII).
1.4.12.1.3.4|Transparência na remuneração do canal de distribuição (capítulo VIII).
1.4.12.1.3.5|Serviços de intermediação no exterior (capítulo X).
1.4.12.1.3.6|Transferência de produtos de investimento (capítulo XI).
1.4.12.1.3.7|Apuração de valores de referência (capítulo XII).
1.4.12.1.3.8|Distribuição para o private (título IV, capítulo XIV).
$curriculum$), E'\n') as line
), source as (
  select *,
    case when strpos(pd_code, '.') = 0 then null else regexp_replace(pd_code, '\.[^.]+$', '') end as parent_code,
    case
      when array_length(string_to_array(pd_code, '.'), 1) = 1 then 'macro'
      when array_length(string_to_array(pd_code, '.'), 1) = 2 then 'topic'
      when array_length(string_to_array(pd_code, '.'), 1) = 3 then 'subtopic'
      else 'micro'
    end as item_type
  from parsed
)
insert into public.curriculum_items (
  certification_id, parent_id, program_version, pd_code, title, item_type, weight, sort_order,
  official_source, source_url, source_date, last_verified, content_version, metadata
)
select
  'CPA', null, '1.2', pd_code, title, item_type,
  case when pd_code = '1' then 20 else null end, sort_order,
  'ANBIMA — Programa Detalhado CPA',
  'https://www.anbima.com.br/data/files/6A/52/6F/A1/BED73910B07B2739B82BA2A8/Programa-Detalhado-CPA-ANBIMA.pdf',
  date '2025-06-04', date '2026-09-14', '1.2',
  jsonb_build_object('description', 'Tópico oficial do Programa Detalhado CPA.', 'parentCode', parent_code, 'effectiveFrom', '2026-01-01')
from source
on conflict (certification_id, pd_code) do update set
  program_version = excluded.program_version,
  title = excluded.title,
  item_type = excluded.item_type,
  weight = excluded.weight,
  sort_order = excluded.sort_order,
  official_source = excluded.official_source,
  source_url = excluded.source_url,
  source_date = excluded.source_date,
  last_verified = excluded.last_verified,
  content_version = excluded.content_version,
  metadata = excluded.metadata,
  updated_at = now();

update public.curriculum_items child
set parent_id = parent.id
from public.curriculum_items parent
where child.certification_id = 'CPA'
  and parent.certification_id = 'CPA'
  and child.pd_code like '1.%'
  and parent.pd_code = regexp_replace(child.pd_code, '\.[^.]+$', '');

update public.curriculum_items set parent_id = null where certification_id = 'CPA' and pd_code = '1';

commit;
