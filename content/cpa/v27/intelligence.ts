import { courseModules } from '../course/modules'

export type V27EvidenceKind = 'OFICIAL' | 'OBSERVADO' | 'ESPECIALISTAS' | 'CANDIDATOS' | 'NOSSA_CONCLUSAO'

export interface V27Evidence {
  kind: V27EvidenceKind
  title: string
  detail: string
  source?: string
  url?: string
}

export interface BenchmarkVideo {
  lesson: number
  title: string
  url: string
  published: string
  verified: boolean
  note?: string
}

export interface V27Cluster {
  id: string
  title: string
  modules: string[]
  pdPrefixes: string[]
  priority: 'NÚCLEO' | 'IMPORTANTE' | 'COMPLEMENTAR'
  index: number
  rationale: string
  examPattern: string
  officialSourceIds: string[]
}

export interface V27Trap {
  id: string
  concept: string
  trap: string
  why: string
  avoid: string
}

export interface V27Shortcut {
  id: string
  trigger: string
  reasoning: string
  caveat: string
}

export interface V27QuestionPattern {
  id: string
  pattern: string
  cue: string
  reasoning: string
  commonError: string
}

export const V27_REVIEW_DATE = '2026-09-30'
export const V27_VERSION = '0.27.0'

export const v27Benchmark = {
  provider: 'Retorno Interno',
  instructor: 'Prof. Renan Duarte',
  title: 'Curso Nova Certificação CPA 2026',
  channelUrl: 'https://www.youtube.com/@retornointernooficial',
  firstVideoUrl: 'https://www.youtube.com/watch?v=N0XoBIH5lRQ',
  statedPlaylistLessons: 46,
  editorialRule: 'A playlist é usada como benchmark de cobertura e didática. O CPA Study não reproduz transcrições, slides, tabelas proprietárias, questões ou explicações do curso.',
  scopeNote: 'O índice de 46 aulas vem do escopo de pesquisa definido para a V27. Quando um título não foi confirmado por uma página pública indexada, ele não é inventado no catálogo local.',
}

export const v27VerifiedVideos: BenchmarkVideo[] = [
  {lesson:1,title:'Sistema Financeiro Nacional',url:'https://www.youtube.com/watch?v=N0XoBIH5lRQ',published:'2026-01-01',verified:true},
  {lesson:4,title:'Comissão de Valores Mobiliários',url:'https://www.youtube.com/watch?v=fketQyTvl9Y',published:'2026-01-12',verified:true},
  {lesson:5,title:'Mercado de Seguros Privados e Previdência Complementar Fechada',url:'https://www.youtube.com/watch?v=2udvH9SI9Dk',published:'2026-01-14',verified:true},
  {lesson:14,title:'SBP',url:'https://www.youtube.com/watch?v=aHTvVeA7bAk',published:'2026-01-30',verified:true},
  {lesson:15,title:'Clearing Houses',url:'https://www.youtube.com/watch?v=gE8FYYkkn0A',published:'2026-01-31',verified:true},
  {lesson:18,title:'Política Fiscal',url:'https://www.youtube.com/watch?v=nN2TsObYHcc',published:'2026-02-05',verified:true},
  {lesson:19,title:'Mercado de Câmbio',url:'https://www.youtube.com/watch?v=8PLA7bHM5E0',published:'2026-02-06',verified:true},
  {lesson:24,title:'Crédito Privado',url:'https://www.youtube.com/watch?v=cxMlygVTWV8',published:'2026-02-25',verified:true},
  {lesson:25,title:'Fluxo de Pagamentos',url:'https://www.youtube.com/watch?v=KbdodPBXv68',published:'2026-03-02',verified:true},
  {lesson:27,title:'Retorno Histórico e Esperado',url:'https://www.youtube.com/watch?v=65ru4K-QuNk',published:'2026-03-09',verified:true},
  {lesson:28,title:'Comitê de Estabilidade Financeira (Comef)',url:'https://www.youtube.com/watch?v=2RYqdhHWHMI',published:'2026-03-13',verified:true},
  {lesson:29,title:'Classificação de Investidores',url:'https://www.youtube.com/watch?v=qu91GC1W7tM',published:'2026-03-24',verified:true},
  {lesson:30,title:'Lei de Liberdade Econômica',url:'https://www.youtube.com/watch?v=12trpikH0EE',published:'2026-03-25',verified:true},
]

export const v27Clusters: V27Cluster[] = [
  {id:'sfm',title:'Mapa institucional do SFN',modules:['sistema-financeiro'],pdPrefixes:['1.1'],priority:'NÚCLEO',index:96,rationale:'Peso oficial do macrotema 1 + alto efeito cascata: competências institucionais aparecem em vários contextos de atendimento.',examPattern:'Caso descreve uma ação e pede o órgão, competência ou limite de atuação correto.',officialSourceIds:['ANBIMA_PD','BCB_SFN','CMN','CVM','SUSEP','PREVIC']},
  {id:'macro',title:'Economia, política econômica e câmbio',modules:['economia'],pdPrefixes:['1.2'],priority:'NÚCLEO',index:94,rationale:'Conecta indicadores, juros, inflação e câmbio ao comportamento de produtos e preços.',examPattern:'Situação macroeconômica seguida de pergunta sobre efeito provável em juros, títulos, câmbio ou poder de compra.',officialSourceIds:['ANBIMA_PD','BCB_POLITICA','BCB_SELIC','BCB_CAMBIO','IBGE']},
  {id:'math',title:'Dinheiro no tempo e operações',modules:['matematica-financeira'],pdPrefixes:['1.3'],priority:'NÚCLEO',index:91,rationale:'Serve de linguagem comum para juros, fluxos, financiamento e comparação de alternativas.',examPattern:'Cliente compara taxas, parcelas ou fluxos; a resposta exige escolher a taxa/período e interpretar o resultado.',officialSourceIds:['ANBIMA_PD']},
  {id:'infra',title:'Infraestrutura, pagamentos e estabilidade',modules:['infraestrutura'],pdPrefixes:['1.4'],priority:'IMPORTANTE',index:84,rationale:'A V27 incorporou o benchmark de SBP, clearing houses e Comef como lente operacional do conteúdo.',examPattern:'Identificar função de uma infraestrutura ou efeito de uma falha/risco operacional.',officialSourceIds:['ANBIMA_PD','BCB_SPB','BCB_ESTABILIDADE','BCB_BASILEIA','B3']},
  {id:'rf',title:'Renda fixa e crédito privado',modules:['renda-fixa'],pdPrefixes:['2.1.1.1'],priority:'NÚCLEO',index:95,rationale:'Macrotema 2 tem maior peso oficial; o benchmark dedica aulas específicas a fluxo e crédito privado.',examPattern:'Comparar emissor, indexador, prazo, liquidez, risco e retorno líquido.',officialSourceIds:['ANBIMA_PD','FGC','TESOURO_DIRETO','RECEITA_2026']},
  {id:'rv',title:'Renda variável, derivativos e COE',modules:['renda-variavel'],pdPrefixes:['2.1.1.2','2.1.1.3','2.1.1.4'],priority:'NÚCLEO',index:92,rationale:'Exige distinguir participação societária, proteção, alavancagem e estrutura de payoff sem confundir risco com garantia.',examPattern:'Caso apresenta objetivo do cliente e pede interpretação do instrumento e de seus riscos.',officialSourceIds:['ANBIMA_PD','CVM','CVM_COE','B3']},
  {id:'funds',title:'Fundos e investimentos coletivos',modules:['fundos','fundos-imobiliarios'],pdPrefixes:['2.1.2','2.1.3','2.1.4'],priority:'NÚCLEO',index:93,rationale:'É um dos grandes blocos de produtos e exige leitura de estrutura, cotas, riscos, taxas e tributação.',examPattern:'Cliente pergunta sobre fundo; resposta depende de estrutura, carteira, liquidez, taxas ou tributação.',officialSourceIds:['ANBIMA_PD','CVM_175','RECEITA_2026']},
  {id:'prev',title:'Previdência e decisão de longo prazo',modules:['previdencia'],pdPrefixes:['2.2'],priority:'NÚCLEO',index:90,rationale:'PGBL/VGBL e regimes tributários conectam produto, planejamento e adequação.',examPattern:'Comparar produto e regime a partir de renda, objetivo, horizonte e forma de tributação.',officialSourceIds:['ANBIMA_PD','SUSEP_PREVIDENCIA','RECEITA_2026']},
  {id:'credit-services',title:'Crédito, serviços e seguros',modules:['credito','servicos-bancarios','seguros'],pdPrefixes:['2.3','2.4','2.5'],priority:'IMPORTANTE',index:87,rationale:'Relatos públicos de candidatos destacam a necessidade de não deixar banking/crédito de lado; o PD oficial inclui esses produtos.',examPattern:'Atendimento contextualizado em que custo, capacidade de pagamento, segurança ou cobertura importam.',officialSourceIds:['ANBIMA_PD','BCB_SFN','BCB_PIX','SUSEP','FGC']},
  {id:'planning',title:'Planejamento, carteiras e perfil',modules:['planejamento','carteiras','perfil'],pdPrefixes:['3.1','3.2','3.3'],priority:'NÚCLEO',index:97,rationale:'O macrotema 3 pesa 30% e transforma conhecimento de produto em decisão adequada ao cliente.',examPattern:'Cliente com objetivo, horizonte, liquidez e tolerância; escolher informação, produto ou próximo passo sem prometer retorno.',officialSourceIds:['ANBIMA_PD','CVM_RES30','ANBIMA_DISTRIBUICAO']},
  {id:'conduct',title:'Atendimento, ética, PLD e proteção de dados',modules:['atendimento-etica'],pdPrefixes:['3.4'],priority:'NÚCLEO',index:96,rationale:'É transversal a quase todo case de relacionamento e envolve deveres que não dependem de produto.',examPattern:'Situação de conflito, informação insuficiente, origem de recursos ou tratamento de dados; decidir conduta adequada.',officialSourceIds:['ANBIMA_PD','ANBIMA_DISTRIBUICAO','PLANALTO_AML','ANPD_LGPD','PLANALTO_LGPD']},
  {id:'innovation',title:'ESG, ativos digitais, Open Finance e tecnologia',modules:['sustentabilidade','ativos-digitais','open-finance','tecnologia'],pdPrefixes:['4.1','4.2','4.3','4.4','4.5','4.6','4.7'],priority:'IMPORTANTE',index:82,rationale:'Macrotema 4 pesa 10%, mas reúne conceitos novos que podem ser usados em casos de adequação, risco e inovação.',examPattern:'Identificar benefício e limite da tecnologia, do compartilhamento de dados ou de uma estratégia ESG.',officialSourceIds:['ANBIMA_PD','BCB_OPEN_FINANCE','BCB_DREX','CVM_ESG','ANPD_LGPD']},
]

export const v27Evidence: V27Evidence[] = [
  {kind:'OFICIAL',title:'Programa Detalhado CPA v1.2',detail:'A matriz oficial continua sendo a fonte de verdade para escopo e códigos PD. A V27 não substitui o programa por uma playlist.',source:'ANBIMA',url:'https://www.anbima.com.br/data/files/6A/52/6F/A1/BED73910B07B2739B82BA2A8/Programa-Detalhado-CPA-ANBIMA.pdf'},
  {kind:'OFICIAL',title:'Caderno e guia de questões',detail:'O material oficial é usado para calibrar contexto, tomada de decisão, cases e árvore de diálogo; questões privadas ou transcritas não entram no projeto.',source:'ANBIMA',url:'https://www.anbima.com.br/pt_br/especial/pds-certificacoes-distribuicao.htm'},
  {kind:'ESPECIALISTAS',title:'Retorno Interno / Renan Duarte',detail:'A playlist é benchmark de cobertura, sequência didática e pontos de atenção. O projeto reconstrói a explicação em texto próprio e confronta regras com fontes oficiais.',source:'YouTube',url:'https://www.youtube.com/@retornointernooficial'},
  {kind:'OBSERVADO',title:'Simulados públicos externos',detail:'A Nova CPA 2026 possui bancos externos com provas de 50 questões, módulos separados e questões contextualizadas. Esses materiais servem para calibrar extensão e variedade, não para copiar itens.',source:'TopInvest',url:'https://simulados.topinvest.com.br/simulados/nova-cpa-2026'},
  {kind:'CANDIDATOS',title:'Relatos públicos',detail:'Há relatos individuais de candidatos em 2026 mencionando cases, necessidade de estudar regulação e atenção a banking/crédito. Um relato isolado não é tratado como estatística da prova.',source:'Reddit',url:'https://www.reddit.com/r/investimentos/comments/1rfroav/tirei_minha_primeira_certificacao_anbima/'},
]

export const v27ModuleCoverage = courseModules.map((module) => {
  const cluster = v27Clusters.find((item) => item.modules.includes(module.id))
  return {moduleId:module.id, moduleTitle:module.title, clusterId:cluster?.id ?? null, benchmarkFocus:cluster?.title ?? 'Revisão geral', priority:cluster?.priority ?? 'COMPLEMENTAR'}
})

const shortcutSeeds: Omit<V27Shortcut,'id'>[] = [
  {trigger:'FGC',reasoning:'Antes de pensar em rendimento, identifique emissor, instrumento, elegibilidade e limites aplicáveis.',caveat:'Não trate “vendido pelo banco” como sinônimo de “coberto”.'},
  {trigger:'Suitability',reasoning:'Pense em objetivo + horizonte + liquidez + capacidade/tolerância a risco + conhecimento.',caveat:'Perfil não é uma etiqueta permanente nem substitui a coleta de informações.'},
  {trigger:'CMN / BCB / CVM',reasoning:'Pergunte primeiro: quem formula diretriz, quem supervisiona e qual mercado está sendo tratado?',caveat:'Competências exatas devem ser conferidas no PD e fonte normativa atual.'},
  {trigger:'Título prefixado',reasoning:'Se a taxa exigida pelo mercado sobe, o preço de um fluxo futuro fixo tende a cair.',caveat:'A relação pressupõe demais condições constantes e deve ser aplicada ao contexto do título.'},
  {trigger:'Curto prazo',reasoning:'Liquidez e preservação de capital ganham peso antes de buscar retorno.',caveat:'Curto prazo não define sozinho o produto adequado.'},
  {trigger:'PGBL x VGBL',reasoning:'Compare base tributável, objetivo, forma de contribuição e regime antes de escolher.',caveat:'Regras tributárias devem ser reconferidas na fonte vigente.'},
  {trigger:'Crédito',reasoning:'Olhe custo efetivo, prazo, capacidade de pagamento, garantias e finalidade.',caveat:'Taxa nominal isolada não representa necessariamente o custo total.'},
  {trigger:'Ação',reasoning:'A ação representa participação societária; não trate como dívida com remuneração contratada.',caveat:'Direitos variam conforme a classe e o estatuto/estrutura do emissor.'},
  {trigger:'Fundo',reasoning:'Identifique classe/cotas, carteira, administrador, gestor, riscos, taxas e liquidez.',caveat:'Não transfira automaticamente a garantia ou o risco de um ativo da carteira para o fundo.'},
  {trigger:'Open Finance',reasoning:'Pergunte quem compartilha, com qual consentimento, escopo e finalidade.',caveat:'Open Finance não significa dados públicos.'},
  {trigger:'ESG',reasoning:'Procure estratégia, metodologia e evidência; não apenas o nome do produto.',caveat:'Não conclua “sustentável” sem verificar critérios e informações do produto.'},
  {trigger:'Case de atendimento',reasoning:'Antes de recomendar, identifique o problema do cliente e o que ainda falta saber.',caveat:'Uma resposta tecnicamente correta pode ser inadequada ao contexto.'},
  {trigger:'Câmbio',reasoning:'Separe moeda de referência, taxa nominal/real e exposição econômica do cliente.',caveat:'Uma alta do dólar não produz o mesmo efeito para todos os agentes.'},
  {trigger:'Juros reais',reasoning:'Compare taxa nominal e inflação; pense em poder de compra.',caveat:'Use a relação correta entre taxas, não simples subtração quando o problema pedir taxa efetiva.'},
  {trigger:'Mercado primário',reasoning:'Pergunte se os recursos estão indo para o emissor ou se o ativo está sendo negociado entre investidores.',caveat:'O mercado secundário pode ter liquidez e preço distintos.'},
  {trigger:'Clearing / liquidação',reasoning:'Diferencie negociação, compensação, liquidação e custódia.',caveat:'Uma infraestrutura pode acumular funções, mas as funções conceituais continuam distintas.'},
  {trigger:'Risco de crédito',reasoning:'Procure a possibilidade de o devedor não cumprir a obrigação.',caveat:'Preço de mercado pode cair mesmo sem inadimplência.'},
  {trigger:'Risco de liquidez',reasoning:'Pergunte quão fácil é converter a posição em caixa sem perda relevante.',caveat:'Liquidez contratual e liquidez de mercado não são sempre iguais.'},
  {trigger:'Risco de mercado',reasoning:'Procure variação de preço, taxa, câmbio ou outro fator de mercado.',caveat:'Um mesmo produto pode carregar vários tipos de risco simultaneamente.'},
  {trigger:'Lei / norma',reasoning:'Diferencie regra legal, norma regulatória e autorregulação.',caveat:'Não atribua força estatal a código de autorregulação.'},
  {trigger:'Cliente pede “o melhor investimento”',reasoning:'Primeiro descubra melhor para qual objetivo, prazo, risco e liquidez.',caveat:'Não existe produto universalmente melhor.'},
  {trigger:'Rentabilidade passada',reasoning:'Use como dado histórico, não como promessa de retorno futuro.',caveat:'Desempenho passado pode ter sido produzido por condições que mudaram.'},
  {trigger:'Tecnologia financeira',reasoning:'Avalie benefício operacional e risco econômico separadamente.',caveat:'Blockchain, IA ou tokenização não eliminam automaticamente risco de crédito, mercado ou liquidez.'},
]

export const v27Shortcuts = shortcutSeeds.map((item,index)=>({id:'S'+String(index+1).padStart(2,'0'),...item}))

export const v27QuestionPatterns: V27QuestionPattern[] = [
  {id:'QP01',pattern:'Competência institucional',cue:'O enunciado descreve uma ação de órgão ou entidade.',reasoning:'Identifique a função antes de olhar as alternativas.',commonError:'Escolher pelo nome mais conhecido em vez da competência.'},
  {id:'QP02',pattern:'Cliente com restrição de prazo',cue:'“Vai precisar do dinheiro em X meses”.',reasoning:'Liquidez e compatibilidade temporal entram antes da rentabilidade.',commonError:'Escolher o produto de maior retorno esperado.'},
  {id:'QP03',pattern:'Cliente sem tolerância a perda',cue:'“Não pode perder dinheiro”.',reasoning:'Investigue capacidade e natureza do risco antes de discutir retorno.',commonError:'Tratar baixa tolerância como sinônimo de baixa idade.'},
  {id:'QP04',pattern:'Comparação de investimentos',cue:'Duas alternativas têm taxas diferentes.',reasoning:'Padronize prazo, regime de capitalização, impostos e fluxo.',commonError:'Comparar taxas nominais de bases diferentes.'},
  {id:'QP05',pattern:'Produto vendido por banco',cue:'A compra ocorre dentro do aplicativo bancário.',reasoning:'Separe distribuidor/canal de emissor e de cobertura.',commonError:'Concluir que todo produto no banco tem FGC.'},
  {id:'QP06',pattern:'Renda fixa no mercado secundário',cue:'Título já foi emitido e sua taxa de mercado mudou.',reasoning:'Pense na relação preço × taxa e na marcação a mercado quando aplicável.',commonError:'Achar que o investidor só perde se o emissor quebrar.'},
  {id:'QP07',pattern:'Fundos',cue:'Cliente pergunta “quanto o fundo rende”.',reasoning:'Olhe carteira, classe/cota, riscos, taxas, liquidez e objetivo.',commonError:'Tratar fundo como um título com remuneração contratada.'},
  {id:'QP08',pattern:'Previdência',cue:'Cliente compara PGBL e VGBL ou regimes tributários.',reasoning:'Comece pela finalidade e pela forma de tributação.',commonError:'Escolher pelo nome ou pela alíquota isolada.'},
  {id:'QP09',pattern:'Crédito',cue:'Cliente quer parcela menor ou dinheiro rápido.',reasoning:'Compare custo, prazo, capacidade de pagamento e finalidade.',commonError:'Considerar somente a parcela mensal.'},
  {id:'QP10',pattern:'Seguros',cue:'Cliente pergunta se determinado evento está coberto.',reasoning:'Leia cobertura, exclusões, franquia e carência.',commonError:'Assumir que o nome do seguro cobre todo o risco relacionado.'},
  {id:'QP11',pattern:'Open Finance',cue:'Cliente quer compartilhar dados.',reasoning:'Verifique consentimento, escopo, finalidade e participante.',commonError:'Confundir compartilhamento autorizado com publicidade dos dados.'},
  {id:'QP12',pattern:'ESG',cue:'Produto usa linguagem ambiental/social.',reasoning:'Procure critérios e metodologia.',commonError:'Tratar rótulo como prova de estratégia.'},
  {id:'QP13',pattern:'Case de conduta',cue:'Existe pressão comercial ou conflito.',reasoning:'Priorize deveres, transparência, interesse do cliente e regras aplicáveis.',commonError:'Aceitar a alternativa que maximiza venda.'},
  {id:'QP14',pattern:'PLD/FTP',cue:'Origem ou comportamento da movimentação é incompatível.',reasoning:'Siga os procedimentos e não tente “resolver” por conta própria.',commonError:'Ignorar o sinal porque o cliente é antigo.'},
  {id:'QP15',pattern:'Câmbio',cue:'A taxa de câmbio muda.',reasoning:'Mapeie quem tem receita, despesa ou dívida em moeda estrangeira.',commonError:'Dizer que dólar alto é sempre bom ou ruim.'},
  {id:'QP16',pattern:'Inovação',cue:'Tokenização, IA, DeFi ou fintech aparecem como solução.',reasoning:'Separe eficiência tecnológica de risco econômico e regulatório.',commonError:'Confundir tecnologia com garantia ou ausência de intermediários.'},
]

const trapSeeds: Array<[string,string,string,string]> = [
  ['CMN x BCB','Trocar órgão normativo por executor/supervisor.','As funções institucionais são diferentes.','Pergunte “quem define diretriz?” antes de escolher.'],
  ['BCB x CVM','Atribuir ao BCB toda supervisão do mercado de capitais.','CVM possui competência própria sobre valores mobiliários.','Identifique o mercado descrito no caso.'],
  ['Susep x Previc','Trocar previdência aberta por fechada.','Os segmentos têm supervisores distintos.','Procure “aberta” ou “fechada” no enunciado.'],
  ['Autorregulação','Tratar código de autorregulação como lei estatal.','Autorregulação complementa, mas não substitui, o regulador estatal.','Separe fonte estatal de código privado.'],
  ['FGC','Achar que qualquer investimento comprado em banco é coberto.','A cobertura depende do instrumento, instituição e regras aplicáveis.','Identifique o produto antes de pensar na garantia.'],
  ['Distribuidor x emissor','Assumir que quem vende o produto é quem deve pagar o investidor.','Canal/distribuidor e emissor podem ser diferentes.','Procure explicitamente quem emitiu o ativo.'],
  ['Crédito x mercado','Tratar toda queda de preço como inadimplência.','Preço pode variar por juros, câmbio ou outros fatores.','Pergunte qual risco mudou.'],
  ['Liquidez','Confundir possibilidade de resgate com preço de venda favorável.','Liquidez envolve conseguir transformar posição em caixa com baixo atrito/perda.','Separe liquidez contratual de liquidez de mercado.'],
  ['Nominal x real','Subtrair inflação de qualquer taxa sem verificar o regime.','Taxas efetivas se relacionam de forma composta.','Verifique periodicidade e fórmula pedida.'],
  ['Prefixado x pós-fixado','Dizer que pós-fixado tem retorno conhecido hoje.','O indexador varia ao longo do tempo.','Pergunte o que é conhecido na contratação.'],
  ['Preço x taxa','Achar que preço e taxa de um título prefixado se movem na mesma direção.','Para fluxos fixos, o preço tende a variar inversamente à taxa exigida.','Use o sentido preço↔taxa.'],
  ['Primário x secundário','Tratar toda compra de ativo como recurso para o emissor.','No secundário, o ativo muda de mãos entre investidores.','Pergunte para onde vai o dinheiro da operação.'],
  ['Ação x dívida','Tratar ação como promessa de pagamento de juros.','Ação representa participação societária.','Identifique a natureza jurídica do instrumento.'],
  ['IPO x follow-on','Tratar toda oferta de ações como IPO.','IPO é a primeira oferta pública; follow-on é oferta posterior.','Pergunte se a companhia já é listada.'],
  ['Dividendos x JCP','Usar os dois termos como sinônimos.','São formas distintas de remuneração e têm regras próprias.','Não misture tratamento societário e tributário.'],
  ['Desdobramento x grupamento','Achar que muda automaticamente o valor econômico total.','O número de ações e o preço unitário são ajustados para preservar o valor econômico, ceteris paribus.','Pense em quantidade × preço.'],
  ['Fundo x ativo da carteira','Achar que o fundo tem a mesma natureza do ativo que possui.','O cotista possui cota do fundo, que por sua vez detém ativos.','Separe veículo de investimento e carteira.'],
  ['Taxa de administração','Tratar como custo cobrado somente quando há lucro.','É uma taxa do fundo com regras próprias.','Leia o regulamento/lâmina.'],
  ['Fundo aberto x fechado','Assumir que ambos têm resgate a qualquer momento.','A estrutura de resgate depende do tipo e regras da classe.','Procure as condições de liquidez.'],
  ['FII','Tratar todo FII como imóvel físico.','FIIs podem ter diferentes estratégias e ativos permitidos.','Leia a política do fundo.'],
  ['PGBL x VGBL','Dizer que a diferença é apenas o nome.','A tributação e a base de incidência diferem.','Compare contribuição, base e fase de resgate/benefício.'],
  ['Regime progressivo x regressivo','Escolher apenas pela menor alíquota exibida.','O regime tem lógica e condições próprias ao longo do tempo.','Considere horizonte e forma de recebimento.'],
  ['Portabilidade','Achar que é um saque comum.','Portabilidade segue regras específicas do produto.','Identifique origem, destino e evento tributário.'],
  ['Crédito consignado','Assumir que parcela menor significa custo menor.','Prazo pode alongar o custo total.','Compare custo efetivo e prazo.'],
  ['Cartão de crédito','Confundir limite com renda disponível.','Limite é uma facilidade de crédito sujeita a obrigação futura.','Trate como crédito, não patrimônio.'],
  ['Consórcio','Tratar contemplação como investimento com retorno garantido.','É uma modalidade de autofinanciamento com regras próprias.','Leia custo, prazo e mecanismo de contemplação.'],
  ['Seguro','Confundir prêmio com indenização.','Prêmio é o preço do seguro; indenização é o pagamento em caso de evento coberto.','Pergunte quem paga o quê e quando.'],
  ['Franquia x carência','Tratar os termos como sinônimos.','Franquia e carência operam em dimensões diferentes do contrato.','Leia a condição específica.'],
  ['Planejamento','Confundir patrimônio líquido com caixa disponível.','Patrimônio pode estar imobilizado ou comprometido.','Separe balanço de fluxo de caixa.'],
  ['Reserva de emergência','Buscar maximizar retorno em vez de disponibilidade.','A função principal é suportar eventos inesperados.','Comece pelo uso e liquidez.'],
  ['Diversificação','Achar que muitos ativos sempre significam diversificação.','Ativos podem ter a mesma exposição econômica.','Mapeie emissor, setor, indexador e prazo.'],
  ['Rebalanceamento','Confundir com troca constante de produtos.','Rebalancear é trazer a carteira de volta às alocações-alvo segundo a estratégia.','Compare pesos atuais com a política.'],
  ['Perfil','Tratar conservador/moderado/arrojado como rótulo permanente.','O contexto e as informações do cliente importam.','Atualize a análise quando houver mudança relevante.'],
  ['Suitability','Escolher produto antes de entender o cliente.','Adequação depende do conjunto de informações relevantes.','Primeiro diagnóstico, depois solução.'],
  ['Conflito de interesse','Achar que divulgar conflito resolve qualquer problema.','Transparência não autoriza conduta incompatível com deveres.','Identifique a regra e a ação adequada.'],
  ['PLD/FTP','Ignorar movimentação suspeita por conhecer o cliente.','Relacionamento prévio não elimina procedimentos de prevenção.','Siga o fluxo institucional.'],
  ['LGPD','Tratar dado financeiro como informação sem proteção.','Dados pessoais têm regras de tratamento e segurança.','Verifique finalidade, base e proteção.'],
  ['Open Finance','Tratar “open” como acesso público.','O compartilhamento depende de consentimento e regras.','Pergunte quem, para quê e por quanto tempo.'],
  ['ESG','Confundir etiqueta ESG com ausência de risco.','ESG é uma dimensão de análise, não uma garantia de retorno.','Leia estratégia e critérios.'],
  ['Tokenização','Achar que tokenizar elimina risco do ativo subjacente.','A tecnologia representa direitos; não apaga risco econômico.','Separe infraestrutura de crédito/mercado/liquidez.'],
  ['DeFi','Assumir que não existe risco porque não há intermediário tradicional.','Há riscos de protocolo, mercado, liquidez e tecnologia.','Mapeie o mecanismo antes do rótulo.'],
  ['IA','Confundir resposta fluente com informação verdadeira.','Modelos podem produzir conteúdo plausível e incorreto.','Valide dados e regras em fonte confiável.'],
  ['Pix','Achar que Pix é produto de investimento.','É infraestrutura/meio de pagamento.','Separe serviço de pagamento de aplicação financeira.'],
  ['Clearing','Confundir negociação com liquidação.','São etapas diferentes do ciclo da operação.','Identifique em qual etapa o enunciado está.'],
  ['Custódia','Tratar custódia como garantia de rentabilidade.','Custódia é guarda/registro, não promessa de retorno.','Separe infraestrutura de desempenho.'],
  ['Comef','Atribuir ao Comef a definição da Selic.','Estabilidade financeira e política monetária são funções distintas.','Identifique o objetivo do comitê citado.'],
  ['Política fiscal','Confundir gasto público com política monetária.','Fiscal e monetária usam instrumentos diferentes.','Procure o instrumento descrito.'],
  ['Câmbio','Dizer que dólar alto sempre beneficia exportadores.','O efeito depende de receitas, custos e exposições em moeda estrangeira.','Mapeie o fluxo econômico.'],
  ['Inflação','Tratar desinflação como queda de preços.','Desinflação é desaceleração da alta de preços.','Olhe a variação do índice.'],
  ['PIB','Tratar PIB como renda disponível das famílias.','PIB mede produção de bens e serviços finais dentro da economia.','Pergunte o que está sendo medido.'],
  ['Selic','Assumir que toda mudança na Selic altera todos os produtos na mesma proporção.','Produtos têm indexadores, prazos e riscos diferentes.','Olhe o mecanismo de transmissão.'],
  ['Juros compostos','Usar juros simples em qualquer problema de prazo.','O regime depende do contrato e da fórmula aplicável.','Identifique a capitalização.'],
  ['TIR','Tratar TIR como retorno garantido.','É uma taxa implícita do fluxo analisado.','Separe medida de retorno de promessa.'],
  ['VPL','Achar que VPL positivo é “lucro certo”.','É resultado dependente da taxa de desconto e dos fluxos considerados.','Verifique premissas.'],
  ['Duration','Confundir duration com prazo de vencimento.','Duration é uma medida de sensibilidade/tempo médio ponderado dos fluxos.','Leia qual conceito a questão pede.'],
  ['Retorno esperado','Tratar média histórica como previsão certa.','Expectativa é uma estimativa, não garantia.','Procure a palavra “esperado”.'],
  ['Risco-retorno','Achar que maior retorno esperado elimina risco.','Retorno esperado e risco são dimensões diferentes.','Compare ambos.'],
  ['COE','Achar que estrutura sofisticada elimina perda ou iliquidez.','Payoff depende da estrutura e dos ativos de referência.','Leia cenários e riscos.'],
  ['BDR','Tratar BDR como ação brasileira emitida pela companhia estrangeira no Brasil.','É um certificado negociado no Brasil que representa valores mobiliários de emissor estrangeiro, conforme a estrutura.','Leia o que o instrumento representa.'],
  ['OPA','Confundir com IPO.','OPA é oferta pública relacionada à aquisição/saída de posição conforme o caso.','Identifique o sentido da oferta.'],
  ['BDR/Unit','Tratar todos os instrumentos como equivalentes.','São estruturas distintas.','Procure os direitos associados.'],
  ['Fonte de informação','Usar material antigo como regra vigente.','Regulação pode mudar.','Priorize a fonte oficial mais recente.'],
  ['Questão contextualizada','Escolher alternativa tecnicamente verdadeira, mas inadequada ao caso.','A prova pode avaliar aplicação, não só definição.','Responda ao caso antes de escolher a definição.'],
]

export const v27Traps: V27Trap[] = trapSeeds.map(([concept,trap,why,avoid],index)=>({id:'T'+String(index+1).padStart(3,'0'),concept,trap,why,avoid}))

export const v27Radar: V27Evidence[] = [
  {kind:'OFICIAL',title:'Peso não é frequência',detail:'Os pesos 20/40/30/10 são estrutura oficial. A V27 não transforma frequência de um banco externo em peso da prova.',source:'ANBIMA'},
  {kind:'OBSERVADO',title:'Cases e contexto',detail:'O caderno oficial e o material da ANBIMA mostram o formato contextualizado; a página oficial também disponibiliza duas árvores de diálogo para CPA.',source:'ANBIMA',url:'https://www.anbima.com.br/pt_br/especial/pds-certificacoes-distribuicao.htm'},
  {kind:'ESPECIALISTAS',title:'Cobertura ampla',detail:'O benchmark do Retorno Interno percorre fundamentos, macroeconomia, infraestrutura, produtos, risco e relacionamento em sequência de curso.',source:'Retorno Interno',url:'https://www.youtube.com/@retornointernooficial'},
  {kind:'CANDIDATOS',title:'Regulação e banking merecem atenção',detail:'Um relato público de fevereiro de 2026 descreveu que o candidato tinha domínio de investimentos, mas precisou reforçar regulação e modalidades de crédito. Isso é um sinal individual, não uma estatística.',source:'Reddit',url:'https://www.reddit.com/r/investimentos/comments/1rfroav/tirei_minha_primeira_certificacao_anbima/'},
  {kind:'OBSERVADO',title:'Questões externas em escala',detail:'TopInvest mantém um simulado Nova CPA 2026 com 50 questões, 2h30 e mais de mil questões disponíveis gratuitamente em diferentes snapshots de 2026.',source:'TopInvest',url:'https://simulados.topinvest.com.br/simulados/nova-cpa-2026'},
]

export const v27Resources = [
  {name:'ANBIMA — Programa e materiais',kind:'OFICIAL',quality:null,update:'Alta',depth:'Estrutural',use:'Fonte de verdade para escopo, formato e modelos.',url:'https://www.anbima.com.br/pt_br/especial/pds-certificacoes-distribuicao.htm'},
  {name:'Retorno Interno — CPA 2026',kind:'ESPECIALISTAS',quality:9,update:'Alta',depth:'Alta',use:'Benchmark gratuito de sequência, explicação e amplitude de cobertura.',url:'https://www.youtube.com/@retornointernooficial'},
  {name:'TopInvest — Simulados Nova CPA 2026',kind:'OBSERVADO',quality:8,update:'Alta',depth:'Alta',use:'Benchmark externo de volume, contexto e variação de questões.',url:'https://simulados.topinvest.com.br/simulados/nova-cpa-2026'},
  {name:'Elite Bancária — simulados CPA',kind:'OBSERVADO',quality:7,update:'Verificar antes de usar',depth:'Complementar',use:'Benchmark externo de prática, sem incorporar conteúdo de terceiros.',url:'https://elitebancaria.com.br/cpa-simulados/'},
]

export const v27Metrics = {
  playlistScopeLessons: v27Benchmark.statedPlaylistLessons,
  verifiedBenchmarkVideos: v27VerifiedVideos.length,
  clusters: v27Clusters.length,
  moduleCoverage: v27ModuleCoverage.length,
  shortcuts: v27Shortcuts.length,
  questionPatterns: v27QuestionPatterns.length,
  traps: v27Traps.length,
}

export function v27ClusterForModule(moduleId:string) {
  return v27Clusters.find(cluster=>cluster.modules.includes(moduleId))
}
