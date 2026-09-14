import type { LessonSource } from './types'
const verifiedAt='2026-09-14'
export const lessonSources={
  ANBIMA_PD:{id:'ANBIMA_PD',institution:'ANBIMA',title:'Programa Detalhado CPA — versão 1.2',url:'https://www.anbima.com.br/data/files/6A/52/6F/A1/BED73910B07B2739B82BA2A8/Programa-Detalhado-CPA-ANBIMA.pdf',verifiedAt},
  ANBIMA_DISTRIBUICAO:{id:'ANBIMA_DISTRIBUICAO',institution:'ANBIMA',title:'Código de Distribuição de Produtos de Investimento',url:'https://www.anbima.com.br/pt_br/autorregular/codigos/distribuicao-de-produtos-de-investimento.htm',verifiedAt},
  BCB_SFN:{id:'BCB_SFN',institution:'Banco Central do Brasil',title:'Sistema Financeiro Nacional',url:'https://www.bcb.gov.br/estabilidadefinanceira/sfn',verifiedAt},
  BCB_SPB:{id:'BCB_SPB',institution:'Banco Central do Brasil',title:'Sistema de Pagamentos Brasileiro',url:'https://www.bcb.gov.br/estabilidadefinanceira/spb',verifiedAt},
  BCB_POLITICA:{id:'BCB_POLITICA',institution:'Banco Central do Brasil',title:'Política monetária e inflação',url:'https://www.bcb.gov.br/controleinflacao',verifiedAt},
  BCB_SELIC:{id:'BCB_SELIC',institution:'Banco Central do Brasil',title:'Taxa Selic',url:'https://www.bcb.gov.br/controleinflacao/taxaselic',verifiedAt},
  BCB_CAMBIO:{id:'BCB_CAMBIO',institution:'Banco Central do Brasil',title:'Câmbio e capitais internacionais',url:'https://www.bcb.gov.br/estabilidadefinanceira/cambio',verifiedAt},
  BCB_ESTABILIDADE:{id:'BCB_ESTABILIDADE',institution:'Banco Central do Brasil',title:'Estabilidade financeira',url:'https://www.bcb.gov.br/estabilidadefinanceira',verifiedAt},
  BCB_BASILEIA:{id:'BCB_BASILEIA',institution:'Banco Central do Brasil',title:'Recomendações de Basileia',url:'https://www.bcb.gov.br/estabilidadefinanceira/recomendacoesbasileia',verifiedAt},
  CMN:{id:'CMN',institution:'Ministério da Fazenda',title:'Conselho Monetário Nacional',url:'https://www.gov.br/fazenda/pt-br/assuntos/cmn',verifiedAt},
  CVM:{id:'CVM',institution:'Comissão de Valores Mobiliários',title:'Sobre a CVM',url:'https://www.gov.br/cvm/pt-br/acesso-a-informacao-cvm/institucional',verifiedAt},
  CVM_RES30:{id:'CVM_RES30',institution:'Comissão de Valores Mobiliários',title:'Resolução CVM 30',url:'https://conteudo.cvm.gov.br/legislacao/resolucoes/resol030.html',verifiedAt},
  SUSEP:{id:'SUSEP',institution:'Superintendência de Seguros Privados',title:'Institucional',url:'https://www.gov.br/susep/pt-br/acesso-a-informacao/institucional',verifiedAt},
  PREVIC:{id:'PREVIC',institution:'Superintendência Nacional de Previdência Complementar',title:'Previdência complementar fechada',url:'https://www.gov.br/previc/pt-br',verifiedAt},
  CNPC:{id:'CNPC',institution:'Ministério da Previdência Social',title:'Conselho Nacional de Previdência Complementar',url:'https://www.gov.br/previdencia/pt-br/assuntos/previdencia-complementar/conselho-nacional-de-previdencia-complementar',verifiedAt},
  B3:{id:'B3',institution:'B3',title:'Infraestrutura do mercado financeiro',url:'https://www.b3.com.br/pt_br/b3/institucional/',verifiedAt},
  IBGE:{id:'IBGE',institution:'Instituto Brasileiro de Geografia e Estatística',title:'Inflação e indicadores econômicos',url:'https://www.ibge.gov.br/explica/inflacao.php',verifiedAt},
  PLANALTO_LRF:{id:'PLANALTO_LRF',institution:'Presidência da República',title:'Lei Complementar nº 101/2000 — Lei de Responsabilidade Fiscal',url:'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm',verifiedAt},
  PLANALTO_LIBERDADE:{id:'PLANALTO_LIBERDADE',institution:'Presidência da República',title:'Lei nº 13.874/2019 — Liberdade Econômica',url:'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/lei/l13874.htm',verifiedAt}
} satisfies Record<string,LessonSource>
export type LessonSourceId=keyof typeof lessonSources
