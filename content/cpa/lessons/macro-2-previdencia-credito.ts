import { module2 } from '../module-2'
import { buildTerminalLessons } from './build-terminal-lessons'
import { macro2PrevidenciaCreditoDefinitions } from './macro-2-previdencia-credito-definitions'
import type { LessonComparison, LessonFormula } from './types'

const sourceIds=(code:string)=>{
  if(code.startsWith('2.2'))return ['ANBIMA_PD','SUSEP_PREVIDENCIA','SUSEP'] as const
  if(code.startsWith('2.3.1.3'))return ['ANBIMA_PD','BCB_SCR','BCB_SFN'] as const
  return ['ANBIMA_PD','BCB_SFN'] as const
}

const comparisons=(code:string):LessonComparison[]=>{
  if(code==='2.2.1.1'||code==='2.2.1.2')return[{left:'PGBL',right:'VGBL',explanation:'PGBL e VGBL podem usar fundos semelhantes, mas têm tratamento fiscal diferente: no PGBL elegível há dedução limitada e tributação sobre o valor recebido; no VGBL não há a mesma dedução e o IR recai sobre rendimentos.'}]
  if(code.startsWith('2.2.2'))return[{left:'Progressivo',right:'Regressivo',explanation:'O progressivo se relaciona à renda tributável e ajuste anual; o regressivo reduz alíquota conforme o tempo de cada contribuição e é definitivo na fonte.'}]
  if(code.startsWith('2.2.3.4'))return[{left:'Renda vitalícia',right:'Renda por prazo certo',explanation:'A vitalícia depende da sobrevivência e das regras de reversão; a renda por prazo certo tem duração contratual definida.'}]
  if(code==='2.3.1.2')return[{left:'Empréstimo',right:'Financiamento',explanation:'Empréstimo normalmente não exige destinação específica; financiamento costuma estar vinculado a um bem ou finalidade e pode contar com garantia associada.'}]
  if(code.startsWith('2.3.4'))return[{left:'Consignado',right:'Crédito pessoal sem garantia',explanation:'O consignado usa desconto direto e tende a ter menor risco para o credor; crédito pessoal sem garantia depende mais da avaliação de renda e score.'}]
  return[{left:'Taxa nominal',right:'CET',explanation:'Taxa nominal é apenas um componente; o Custo Efetivo Total incorpora juros, tarifas, tributos e demais despesas obrigatórias da operação.'}]
}

const formulas=(code:string):LessonFormula[]=>{
  if(code==='2.3.2.2'||code==='2.3.3.1')return[{name:'Juro proporcional simplificado',expression:'J = principal × taxa do período × número de períodos',explanation:'Serve para exercícios simples. Em operações reais, observe capitalização, CET, IOF e periodicidade informada.'}]
  if(code.startsWith('2.3.4.1'))return[{name:'Margem consignável',expression:'parcela máxima = renda elegível × percentual de margem',explanation:'O percentual aplicável depende da categoria e da legislação vigente; a prova pode fornecer o limite.'}]
  return[]
}

const blueprint={
  area:(code:string)=>code.startsWith('2.2')?'previdência complementar aberta':'crédito e financiamento',
  beginner:(code:string,title:string,def:string)=>code.startsWith('2.2')
    ?`Previdência combina objetivo de longo prazo, benefício fiscal possível e escolha de renda futura. ${def} Em ${title}, conecte sempre prazo, regime tributário, beneficiários e necessidade de liquidez.`
    :`Crédito resolve uma necessidade hoje usando renda futura. ${def} Em ${title}, compare finalidade, garantia, prazo, CET, capacidade de pagamento e risco de superendividamento.`,
  complete:(code:string,title:string,def:string)=>[
    `${def} Este item faz parte de ${code.startsWith('2.2')?'previdência complementar':'produtos de financiamento'} no Programa Detalhado CPA 1.2.`,
    code.startsWith('2.2')
      ?'A análise deve considerar PGBL ou VGBL, horizonte, fase de acumulação, regime progressivo ou regressivo, portabilidade, taxas, forma de recebimento e situação fiscal do cliente.'
      :'A concessão responsável de crédito exige adequação à necessidade, capacidade de pagamento, renda disponível, garantias, histórico, CET, prazo e consequências de atraso.',
    `Na CPA, ${title} tende a aparecer em situação de atendimento: o objetivo é escolher ou explicar a alternativa compatível com a necessidade do cliente, e não apenas repetir uma definição.`,
  ],
  essentials:(code:string,title:string,def:string)=>[
    def.split(/[.;]/)[0],
    `PD ${code} · ${title}`,
    code.startsWith('2.2')?'Prazo + tributação + portabilidade + renda futura':'Necessidade + capacidade de pagamento + garantia + CET + prazo',
    code.startsWith('2.2')?'Benefício fiscal não substitui adequação do produto':'Crédito mais barato nem sempre é crédito adequado se a parcela não couber no orçamento',
  ],
  focus:(code:string,title:string)=>code.startsWith('2.2')?[
    `Escolher ou explicar ${title} em um caso de planejamento de longo prazo.`,
    'Distinguir PGBL, VGBL, regime progressivo, regressivo, portabilidade e formas de renda.',
    'Avaliar impacto tributário e necessidade de liquidez sem prometer benefício automático.',
  ]:[
    `Escolher ou explicar ${title} a partir da necessidade e capacidade de pagamento do cliente.`,
    'Comparar CET, prazo, garantia, parcela e valor total a pagar.',
    'Reconhecer sinais de endividamento excessivo e evitar oferecer crédito apenas pelo limite disponível.',
  ],
  practical:(code:string,title:string)=>code.startsWith('2.2')
    ?`Uma cliente de 38 anos quer aposentadoria aos 60, faz declaração completa e não pretende usar o dinheiro no curto prazo. Ao discutir ${title}, você avalia PGBL/VGBL, regime de tributação, portabilidade, taxas e modalidade de renda, sem tratar benefício fiscal como retorno garantido.`
    :`Um cliente precisa financiar uma despesa e recebe duas propostas. Ao discutir ${title}, você compara CET, parcela, prazo, garantia e impacto no orçamento mensal antes de recomendar qualquer contratação.`,
  comparisons,
  formulas,
  traps:(code:string,title:string)=>code.startsWith('2.2')?[
    `Não trate ${title} como investimento de liquidez imediata ou como benefício fiscal automático para qualquer cliente.`,
    'PGBL e VGBL não diferem apenas pelo nome do produto; a base tributável é diferente.',
    'Portabilidade não é resgate e não deve ser tratada como entrada de dinheiro na conta do cliente.',
  ]:[
    `Não trate limite de crédito disponível como prova de que ${title} cabe no orçamento do cliente.`,
    'Compare CET e valor total, não apenas a menor taxa anunciada.',
    'Garantia reduz risco do credor, mas não elimina o risco de endividamento do cliente.',
  ],
  summary:(code:string,title:string,def:string)=>[
    `${code} · ${title}.`,
    def,
    code.startsWith('2.2')?'Pergunte: qual objetivo, qual prazo, qual regime tributário e como o benefício será recebido?':'Pergunte: para que serve, quanto custa no total, qual parcela cabe e qual garantia está envolvida?',
  ],
  sourceIds,
}

export const macro2PrevidenciaCreditoLessons=buildTerminalLessons(module2,'2.2.',macro2PrevidenciaCreditoDefinitions,blueprint)
  .concat(buildTerminalLessons(module2,'2.3.',macro2PrevidenciaCreditoDefinitions,blueprint))
  .sort((a,b)=>a.pdCode.localeCompare(b.pdCode,undefined,{numeric:true,sensitivity:'base'}))

if(macro2PrevidenciaCreditoLessons.length!==27)throw new Error(`Temas 2.2 e 2.3 deveriam possuir 27 aulas; foram geradas ${macro2PrevidenciaCreditoLessons.length}.`)
export const macro2PrevidenciaCreditoLessonMap=new Map(macro2PrevidenciaCreditoLessons.map((lesson)=>[lesson.pdCode,lesson]))
