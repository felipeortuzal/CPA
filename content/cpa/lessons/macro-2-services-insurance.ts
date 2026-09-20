import { module2 } from '../module-2'
import { buildTerminalLessons } from './build-terminal-lessons'
import { macro2ServicesInsuranceDefinitions } from './macro-2-services-insurance-definitions'
import type { LessonComparison } from './types'

const blueprint={
  area:(code:string)=>code.startsWith('2.4')?'serviços bancários e câmbio':'seguros de vida e patrimoniais',
  beginner:(code:string,title:string,def:string)=>code.startsWith('2.4')
    ?`Serviços bancários são a infraestrutura do dia a dia financeiro. ${def} Ao estudar ${title}, foque em funcionamento, custo, segurança, liquidação, direitos do cliente e quando cada serviço é adequado.`
    :`Seguro transfere um risco específico para a seguradora mediante pagamento de prêmio. ${def} Em ${title}, identifique o evento coberto, o capital segurado, franquias, exclusões, beneficiários e prazo de proteção.`,
  complete:(code:string,title:string,def:string)=>[
    `${def} Este item integra o bloco de ${code.startsWith('2.4')?'serviços bancários':'seguros'} do Programa Detalhado CPA 1.2.`,
    code.startsWith('2.4')
      ?'A prova pode combinar tarifa, canal, liquidação, segurança, câmbio, IOF e atendimento. O raciocínio correto começa pela finalidade concreta do serviço e pelo risco operacional ou financeiro envolvido.'
      :'Seguro não é investimento por definição. A análise adequada separa risco coberto, prêmio, capital segurado, franquia, carência, exclusões, prazo e necessidade real de proteção.',
    `Em atendimento, ${title} deve ser explicado em linguagem simples, sem prometer gratuidade, cobertura, liquidez ou proteção além do que as regras e o contrato realmente oferecem.`,
  ],
  essentials:(code:string,title:string,def:string)=>[
    def.split(/[.;]/)[0],
    `PD ${code} · ${title}`,
    code.startsWith('2.4')?'Finalidade + custo + canal + liquidação + segurança':'Risco coberto + prêmio + capital segurado + exclusões + prazo',
    code.startsWith('2.4')?'Serviço conveniente também precisa ser seguro e transparente':'Cobertura só existe para eventos e condições previstos na apólice',
  ],
  focus:(code:string,title:string)=>code.startsWith('2.4')?[
    `Explicar ou escolher ${title} em uma situação real de movimentação, pagamento, câmbio ou atendimento.`,
    'Identificar custos, tarifas, IOF, liquidação e riscos operacionais.',
    'Distinguir conta, pagamento, Pix, câmbio e serviço digital sem confundir suas regras.',
  ]:[
    `Escolher ou explicar ${title} a partir do risco que o cliente quer proteger.`,
    'Distinguir cobertura, exclusão, franquia, capital segurado e beneficiário.',
    'Evitar tratar seguro como promessa de indenização para qualquer evento.',
  ],
  practical:(code:string,title:string)=>code.startsWith('2.4')
    ?`Um cliente precisa realizar uma operação envolvendo ${title}. Antes de responder, você verifica finalidade, valor, urgência, tarifa, segurança, risco de fraude, eventual câmbio/IOF e o canal mais adequado.`
    :`Uma família quer proteger seu patrimônio e sua renda. Ao discutir ${title}, você identifica o risco que realmente precisa ser transferido, compara coberturas e exclusões e dimensiona a proteção sem confundir seguro com investimento.`,
  comparisons:(code:string):LessonComparison[]=>{
    if(code.startsWith('2.4.1.5'))return[{left:'Pix',right:'Transferência tradicional',explanation:'Pix opera em arranjo instantâneo com disponibilidade ampla; outros meios têm regras, horários, tarifas e liquidação diferentes.'}]
    if(code.startsWith('2.4.2')||code.startsWith('2.4.3'))return[{left:'Conta doméstica',right:'Conta/operação internacional',explanation:'A operação internacional acrescenta conversão cambial, regras fiscais, custos e exposição à variação de moeda.'}]
    if(code==='2.5.1.1'||code==='2.5.1.2')return[{left:'Vida inteira',right:'Vida temporário',explanation:'Vida inteira busca proteção de prazo indeterminado enquanto vigente; temporário cobre período definido.'}]
    if(code.startsWith('2.5.2'))return[{left:'Seguro patrimonial',right:'Seguro de vida',explanation:'Patrimonial protege bens e responsabilidades; vida protege riscos ligados à pessoa segurada e beneficiários.'}]
    return[{left:'Preço/tarifa',right:'Valor do serviço',explanation:'Preço é um componente da decisão; conveniência, segurança, cobertura, prazo e necessidade também importam.'}]
  },
  traps:(code:string,title:string)=>code.startsWith('2.4')?[
    `Não presuma que ${title} é gratuito ou disponível da mesma forma para todo tipo de cliente.`,
    'Canal digital reduz fricção, mas não elimina risco de fraude ou necessidade de autenticação.',
    'Em câmbio, finalidade da operação influencia regra, custo e tributação.',
  ]:[
    `Não presuma que ${title} cobre qualquer prejuízo relacionado ao bem ou à pessoa.`,
    'Indenização depende de evento coberto, limites, franquias, exclusões e documentação.',
    'Seguro não deve ser apresentado como rentabilidade garantida.',
  ],
  summary:(code:string,title:string,def:string)=>[
    `${code} · ${title}.`,
    def,
    code.startsWith('2.4')?'Pergunte: para que serve, quanto custa, como liquida e qual risco operacional existe?':'Pergunte: qual risco está sendo transferido, o que está coberto e quais limites/exclusões existem?',
  ],
  sourceIds:(code:string)=>{
    if(code.startsWith('2.4.1.5'))return ['ANBIMA_PD','BCB_PIX','BCB_SPB'] as const
    if(code.startsWith('2.4.2')||code.startsWith('2.4.3'))return ['ANBIMA_PD','BCB_CAMBIO'] as const
    if(code.startsWith('2.4.1'))return ['ANBIMA_PD','BCB_SFN','BCB_SPB'] as const
    return ['ANBIMA_PD','SUSEP'] as const
  },
}

export const macro2ServicesInsuranceLessons=buildTerminalLessons(module2,'2.4.',macro2ServicesInsuranceDefinitions,blueprint)
  .concat(buildTerminalLessons(module2,'2.5.',macro2ServicesInsuranceDefinitions,blueprint))
  .sort((a,b)=>a.pdCode.localeCompare(b.pdCode,undefined,{numeric:true,sensitivity:'base'}))

if(macro2ServicesInsuranceLessons.length!==23)throw new Error(`Temas 2.4 e 2.5 deveriam possuir 23 aulas; foram geradas ${macro2ServicesInsuranceLessons.length}.`)
export const macro2ServicesInsuranceLessonMap=new Map(macro2ServicesInsuranceLessons.map((lesson)=>[lesson.pdCode,lesson]))
