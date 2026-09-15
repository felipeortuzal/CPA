import type { QuestionOfficialSource, QuestionSourceId } from './types'

export const QUESTION_VERIFIED_AT = '2026-09-14'

export const questionSources: Record<QuestionSourceId, QuestionOfficialSource> = {
  ANBIMA_PD: { id: 'ANBIMA_PD', institution: 'ANBIMA', title: 'Programa Detalhado CPA — versão 1.2', url: 'https://www.anbima.com.br/data/files/6A/52/6F/A1/BED73910B07B2739B82BA2A8/Programa-Detalhado-CPA-ANBIMA.pdf', verifiedAt: QUESTION_VERIFIED_AT },
  BCB_SFN: { id: 'BCB_SFN', institution: 'Banco Central do Brasil', title: 'Sistema Financeiro Nacional', url: 'https://www.bcb.gov.br/estabilidadefinanceira/sfn', verifiedAt: QUESTION_VERIFIED_AT },
  BCB_SPB: { id: 'BCB_SPB', institution: 'Banco Central do Brasil', title: 'Sistema de Pagamentos Brasileiro', url: 'https://www.bcb.gov.br/estabilidadefinanceira/spb', verifiedAt: QUESTION_VERIFIED_AT },
  BCB_MONETARY: { id: 'BCB_MONETARY', institution: 'Banco Central do Brasil', title: 'Política monetária e inflação', url: 'https://www.bcb.gov.br/controleinflacao', verifiedAt: QUESTION_VERIFIED_AT },
  BCB_SELIC: { id: 'BCB_SELIC', institution: 'Banco Central do Brasil', title: 'Taxa Selic', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic', verifiedAt: QUESTION_VERIFIED_AT },
  BCB_CAMBIO: { id: 'BCB_CAMBIO', institution: 'Banco Central do Brasil', title: 'Câmbio e capitais internacionais', url: 'https://www.bcb.gov.br/estabilidadefinanceira/cambio', verifiedAt: QUESTION_VERIFIED_AT },
  BCB_PIX: { id: 'BCB_PIX', institution: 'Banco Central do Brasil', title: 'Pix', url: 'https://www.bcb.gov.br/estabilidadefinanceira/pix', verifiedAt: QUESTION_VERIFIED_AT },
  BCB_SCR: { id: 'BCB_SCR', institution: 'Banco Central do Brasil', title: 'Sistema de Informações de Créditos (SCR)', url: 'https://www.bcb.gov.br/estabilidadefinanceira/scr', verifiedAt: QUESTION_VERIFIED_AT },
  BCB_OPEN_FINANCE: { id: 'BCB_OPEN_FINANCE', institution: 'Banco Central do Brasil', title: 'Open Finance', url: 'https://www.bcb.gov.br/estabilidadefinanceira/cliente-open-finance', verifiedAt: QUESTION_VERIFIED_AT },
  BCB_DREX: { id: 'BCB_DREX', institution: 'Banco Central do Brasil', title: 'Drex', url: 'https://www.bcb.gov.br/estabilidadefinanceira/drex', verifiedAt: QUESTION_VERIFIED_AT },
  CVM: { id: 'CVM', institution: 'Comissão de Valores Mobiliários', title: 'Institucional — CVM', url: 'https://www.gov.br/cvm/pt-br/acesso-a-informacao-cvm/institucional', verifiedAt: QUESTION_VERIFIED_AT },
  CVM_30: { id: 'CVM_30', institution: 'Comissão de Valores Mobiliários', title: 'Resolução CVM nº 30', url: 'https://conteudo.cvm.gov.br/legislacao/resolucoes/resol030.html', verifiedAt: QUESTION_VERIFIED_AT },
  CVM_62: { id: 'CVM_62', institution: 'Comissão de Valores Mobiliários', title: 'Resolução CVM nº 62', url: 'https://conteudo.cvm.gov.br/legislacao/resolucoes/resol062.html', verifiedAt: QUESTION_VERIFIED_AT },
  CVM_175: { id: 'CVM_175', institution: 'Comissão de Valores Mobiliários', title: 'Resolução CVM nº 175 — fundos de investimento', url: 'https://conteudo.cvm.gov.br/legislacao/resolucoes/resol175.html', verifiedAt: QUESTION_VERIFIED_AT },
  CVM_ESG: { id: 'CVM_ESG', institution: 'Comissão de Valores Mobiliários', title: 'Finanças sustentáveis — regulação', url: 'https://www.gov.br/cvm/pt-br/assuntos/financas-sustentaveis/regulacao', verifiedAt: QUESTION_VERIFIED_AT },
  ANBIMA_DISTRIBUICAO: { id: 'ANBIMA_DISTRIBUICAO', institution: 'ANBIMA', title: 'Código de Distribuição de Produtos de Investimento', url: 'https://www.anbima.com.br/pt_br/autorregular/codigos/distribuicao-de-produtos-de-investimento.htm', verifiedAt: QUESTION_VERIFIED_AT },
  SUSEP: { id: 'SUSEP', institution: 'Superintendência de Seguros Privados', title: 'Institucional', url: 'https://www.gov.br/susep/pt-br/acesso-a-informacao/institucional', verifiedAt: QUESTION_VERIFIED_AT },
  SUSEP_PREVIDENCIA: { id: 'SUSEP_PREVIDENCIA', institution: 'Superintendência de Seguros Privados', title: 'PGBL e VGBL', url: 'https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/providencia-complementar-aberta/pgbl-vgbl', verifiedAt: QUESTION_VERIFIED_AT },
  SUSEP_OPEN_INSURANCE: { id: 'SUSEP_OPEN_INSURANCE', institution: 'Superintendência de Seguros Privados', title: 'Open Insurance', url: 'https://www.gov.br/susep/pt-br/assuntos/open-insurance', verifiedAt: QUESTION_VERIFIED_AT },
  PREVIC: { id: 'PREVIC', institution: 'Superintendência Nacional de Previdência Complementar', title: 'Previdência complementar fechada', url: 'https://www.gov.br/previc/pt-br', verifiedAt: QUESTION_VERIFIED_AT },
  FGC: { id: 'FGC', institution: 'Fundo Garantidor de Créditos', title: 'Garantia FGC', url: 'https://www.fgc.org.br/sobre-garantia-fgc', verifiedAt: QUESTION_VERIFIED_AT },
  TESOURO_DIRETO: { id: 'TESOURO_DIRETO', institution: 'Tesouro Nacional', title: 'Tesouro Direto', url: 'https://www.tesourodireto.com.br/', verifiedAt: QUESTION_VERIFIED_AT },
  B3: { id: 'B3', institution: 'B3', title: 'Institucional e infraestrutura de mercado', url: 'https://www.b3.com.br/pt_br/b3/institucional/', verifiedAt: QUESTION_VERIFIED_AT },
  ANPD_LGPD: { id: 'ANPD_LGPD', institution: 'Autoridade Nacional de Proteção de Dados', title: 'Perguntas frequentes — LGPD', url: 'https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes', verifiedAt: QUESTION_VERIFIED_AT },
  PLANALTO_LGPD: { id: 'PLANALTO_LGPD', institution: 'Presidência da República', title: 'Lei nº 13.709/2018 — LGPD', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm', verifiedAt: QUESTION_VERIFIED_AT },
  PLANALTO_LRF: { id: 'PLANALTO_LRF', institution: 'Presidência da República', title: 'Lei Complementar nº 101/2000 — Lei de Responsabilidade Fiscal', url: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm', verifiedAt: QUESTION_VERIFIED_AT },
}
