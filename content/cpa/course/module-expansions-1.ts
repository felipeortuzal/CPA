import type { ReadingSection } from './readings'

export const moduleExpansionSections: Record<string, ReadingSection[]> = {
  "sistema-financeiro": [
    {
      "id": "robusto-sfn-estrutura",
      "title": "SFN do zero: quem participa, por que existe e como o dinheiro circula",
      "paragraphs": [
        "O Sistema Financeiro Nacional (SFN) não é uma instituição e não é sinônimo de “bancos”. Ele é o conjunto organizado de instituições, mercados, regras, infraestruturas e mecanismos que permitem que recursos financeiros circulem entre agentes econômicos. De um lado estão agentes superavitários, que possuem recursos disponíveis para poupar ou investir; de outro estão agentes deficitários, que precisam captar recursos para consumir, investir ou financiar suas atividades. Entre esses dois lados existe uma rede que transforma necessidades diferentes de prazo, risco, liquidez e informação em operações possíveis.",
        "Existem duas formas importantes de enxergar essa circulação. Na intermediação financeira, uma instituição pode captar recursos e conceder crédito, assumindo uma posição própria entre poupador e tomador. Na desintermediação, o tomador pode acessar diretamente investidores por meio do mercado de capitais, como em uma emissão de valores mobiliários. Isso não significa ausência de intermediários: corretoras, distribuidoras, bolsas, depositários, custodiantes e outras infraestruturas continuam podendo participar. A pergunta-chave é sempre: quem fornece o dinheiro, quem recebe, quem assume a obrigação econômica e qual instituição torna a operação possível?",
        "Para a CPA, transforme essa visão em um mapa. Se o caso fala de crédito bancário, pense em intermediação e risco de crédito. Se fala de emissão de ações ou debêntures, pense em mercado de capitais e captação. Se fala de compra de moeda estrangeira, pense em mercado cambial. Se fala de seguro, pense em transferência de risco. Se fala de pagamento, pense em infraestrutura de pagamentos. O SFN deixa de ser uma lista de siglas quando você consegue acompanhar o caminho econômico da operação."
      ]
    },
    {
      "id": "robusto-sfn-orgaos",
      "title": "Órgãos normativos e supervisores: não decore a sigla, entenda a competência",
      "paragraphs": [
        "A primeira grande separação do SFN é entre normatização e supervisão. Órgãos normativos estabelecem diretrizes gerais dentro de suas competências. Na estrutura cobrada pela CPA, o Conselho Monetário Nacional (CMN) está associado às diretrizes dos mercados de moeda, crédito e câmbio; o Conselho Nacional de Seguros Privados (CNSP) ao sistema de seguros privados; e o Conselho Nacional de Previdência Complementar (CNPC) à previdência complementar fechada. A lógica é mais importante que a lista: o órgão normativo define o “quadro de regras” do segmento.",
        "A supervisão é diferente. O Banco Central do Brasil (BCB) exerce competências de supervisão sobre instituições e atividades sob sua esfera, além de executar atribuições relacionadas à política monetária e ao funcionamento do sistema financeiro. A Comissão de Valores Mobiliários (CVM) supervisiona o mercado de valores mobiliários dentro de sua competência. A Susep supervisiona seguros, previdência complementar aberta, capitalização e resseguros nos termos aplicáveis; a Previc supervisiona a previdência complementar fechada. Uma questão pode apresentar uma instituição correta e atribuir a ela a competência errada. Por isso, memorize sempre em pares: entidade + função.",
        "Uma boa técnica é responder mentalmente quatro perguntas: “quem estabelece diretrizes?”, “quem supervisiona?”, “quem opera?” e “quem fornece a infraestrutura?”. Se o enunciado disser “fiscalizar uma corretora no mercado de valores mobiliários”, não escolha o órgão pelo nome mais conhecido; classifique a atividade primeiro. Se disser “estabelecer diretrizes gerais de política monetária”, a natureza da competência é diferente de executar a política ou supervisionar uma instituição."
      ]
    },
    {
      "id": "robusto-sfn-operadores",
      "title": "Operadores e participantes: bancos, cooperativas, fintechs, corretoras e muito mais",
      "paragraphs": [
        "O SFN também é formado por operadores. Bancos e caixas econômicas captam recursos, oferecem crédito e prestam serviços bancários conforme suas autorizações e características. Cooperativas de crédito possuem estrutura cooperativa e prestam serviços financeiros aos seus cooperados; bancos cooperativos podem atuar como instituições bancárias dentro da estrutura permitida. Instituições de pagamento atuam na prestação de serviços de pagamento, sem que “instituição de pagamento” seja simplesmente outro nome para banco. Fintech é uma descrição de atuação baseada em tecnologia, não uma autorização regulatória única: uma fintech pode operar em atividades diferentes e estar sujeita a regras diferentes.",
        "No mercado de capitais, corretoras e distribuidoras fazem a intermediação de operações e a distribuição de produtos, mas isso não significa que sejam emissoras de tudo aquilo que vendem. A B3 fornece infraestrutura para negociação, registro, compensação, liquidação e/ou custódia conforme o mercado e a função específica. Seguradoras assumem riscos mediante contratos de seguro; resseguradoras participam da transferência de riscos entre seguradoras; EAPCs atuam na previdência complementar aberta; EFPCs administram planos de previdência complementar fechada; sociedades de capitalização trabalham com produtos de capitalização. Administradoras de consórcio, sociedades de crédito e outras instituições aparecem no edital porque cada uma resolve um problema específico.",
        "A regra de ouro é não classificar uma instituição pelo canal utilizado pelo cliente. Um cliente pode comprar um CDB em um aplicativo de uma corretora, mas o emissor continua sendo o banco que captou os recursos. Pode comprar uma debênture por uma plataforma, mas a dívida é da companhia emissora. Pode investir em um fundo por um banco, mas o patrimônio do fundo possui estrutura própria. Na prova, o canal é frequentemente uma distração; a natureza jurídica e econômica do produto é o que resolve a questão."
      ]
    },
    {
      "id": "robusto-sfn-protecao",
      "title": "Autorregulação, FGC, FGCCoop e proteção: o que realmente está sendo protegido?",
      "paragraphs": [
        "Autorregulação e regulação estatal cumprem papéis diferentes. A ANBIMA estabelece códigos e padrões de autorregulação para participantes sujeitos a eles, além de atividades de representação, informação e educação. Isso não transforma a ANBIMA em um órgão estatal equivalente ao BCB ou à CVM. Na prova, se uma alternativa disser que uma entidade privada de autorregulação substitui a supervisão estatal, desconfie: as competências são distintas.",
        "O FGC e o FGCCoop também precisam ser entendidos pelo mecanismo de proteção, e não como “seguro de investimento”. O FGC possui regras de cobertura, produtos elegíveis, instituições associadas, limites e condições. O FGCCoop está ligado à proteção de determinados depósitos e instrumentos de cooperativas de crédito dentro de sua estrutura. A existência de uma garantia não elimina risco de mercado, risco de liquidez, risco operacional ou risco de inflação. E produtos como cotas de fundos, ações e títulos públicos não devem ser tratados como se fossem depósitos cobertos pelo FGC.",
        "Na prática, antes de afirmar que um cliente está protegido, siga uma sequência: identifique o produto; identifique o emissor ou devedor; identifique a instituição envolvida; verifique se existe mecanismo de garantia; confira se o produto e a situação estão dentro das regras e limites aplicáveis. Esse procedimento é muito mais seguro do que memorizar uma lista de produtos “seguros”."
      ]
    },
    {
      "id": "robusto-sfn-caso",
      "title": "Caso completo: como desmontar uma questão de SFN",
      "paragraphs": [
        "Imagine uma pessoa que recebe salário em um banco, compra um CDB por uma corretora, investe em ações por uma plataforma e contrata um seguro. O enunciado pergunta quais entidades estão envolvidas. Comece separando as atividades: serviço bancário, captação por título de renda fixa, intermediação de valores mobiliários e seguro. Depois identifique emissor, intermediário e supervisor de cada atividade. Não tente resolver a questão olhando somente para o nome da instituição que aparece no aplicativo.",
        "Agora imagine uma segunda pergunta: “qual dessas aplicações possui proteção do FGC?”. O raciocínio muda. A pergunta não é mais “quem supervisiona?”, e sim “qual é a natureza do instrumento e quais regras de garantia se aplicam?”. Um CDB pode estar sujeito às regras do FGC, observados os requisitos; uma ação e uma cota de fundo não viram produtos garantidos porque foram compradas dentro de um banco ou corretora.",
        "Esse é o modelo de raciocínio que queremos no módulo: atividade → produto → emissor → participante → supervisor → risco → proteção. Se você conseguir reconstruir essa sequência sem consultar a apostila, o SFN deixa de ser decoreba e passa a ser uma estrutura que você consegue aplicar em qualquer caso."
      ]
    }
  ],
  "economia": [
    {
      "id": "robusto-economia-fluxo",
      "title": "Fluxo circular da renda: a economia antes das siglas",
      "paragraphs": [
        "O fluxo circular da renda é a porta de entrada para entender economia. Famílias oferecem fatores de produção e recebem renda; empresas produzem bens e serviços e recebem receitas; o governo arrecada tributos e realiza gastos; o sistema financeiro canaliza poupança e financiamento; e o setor externo conecta a economia a outros países. Uma decisão de um agente altera o fluxo dos demais. Quando famílias consomem mais, empresas podem vender mais; quando empresas investem, demandam financiamento e bens de capital; quando o governo altera gastos ou tributos, modifica a demanda e a renda disponível.",
        "O ponto importante para a CPA é entender que dinheiro e bens circulam em sentidos relacionados, mas não idênticos. Uma empresa pode receber R$ 100 de uma família pela venda de um produto; esses R$ 100 se tornam receita da empresa e, posteriormente, podem financiar salários, fornecedores, impostos ou investimento. Se a empresa toma crédito, surge uma relação financeira adicional. A prova pode usar uma pequena história e perguntar qual decisão afeta consumo, investimento, renda ou financiamento.",
        "Use o fluxo circular para construir causa e consequência. Em vez de decorar “consumo aumenta PIB”, pergunte em que condições a mudança de consumo aumenta a demanda por produção e como isso pode afetar renda, emprego e preços. O raciocínio contextual é mais útil do que frases isoladas."
      ]
    },
    {
      "id": "robusto-economia-mercados",
      "title": "Os quatro grandes mercados: monetário, crédito, câmbio e capitais",
      "paragraphs": [
        "O mercado financeiro não é um bloco único. O mercado monetário está ligado à liquidez e às operações de curto prazo; o mercado de crédito conecta recursos a tomadores por empréstimos e financiamentos; o mercado cambial envolve compra e venda de moedas estrangeiras; e o mercado de capitais permite a captação e a negociação de valores mobiliários, aproximando empresas e investidores. Eles se conectam: condições monetárias influenciam crédito, taxas de desconto e preços de ativos; câmbio influencia empresas expostas a importações e exportações.",
        "Uma questão pode colocar duas operações lado a lado para testar a classificação. Um empréstimo bancário para comprar uma máquina é uma operação de crédito. Uma empresa emitindo debêntures para investidores está acessando o mercado de capitais. Uma empresa comprando dólares para pagar uma obrigação externa está no mercado cambial. Uma operação de curto prazo relacionada à gestão de liquidez do sistema pode estar ligada ao mercado monetário. O objetivo não é decorar definições abstratas, mas identificar o problema econômico que a operação resolve.",
        "Na prática, pergunte: quem precisa de recursos? quem fornece? qual instrumento foi usado? qual é o prazo? existe negociação de valores mobiliários? envolve moeda estrangeira? Essa sequência ajuda a classificar rapidamente."
      ]
    },
    {
      "id": "robusto-economia-politicas",
      "title": "Política fiscal, monetária e cambial: instrumentos, transmissão e expectativas",
      "paragraphs": [
        "Política fiscal envolve decisões de receitas, despesas e financiamento do governo. Política monetária envolve a condução das condições monetárias e de liquidez, com instrumentos como operações de mercado aberto, compulsórios e redesconto. Política cambial envolve o funcionamento e a atuação relacionada ao mercado de câmbio. São políticas diferentes, com autoridades, instrumentos e canais diferentes, ainda que seus efeitos se encontrem na economia.",
        "Na política monetária, a CPA exige mais do que saber que juros altos “reduzem inflação”. O raciocínio passa por canais: juros afetam custo de crédito, consumo, investimento, preços de ativos, câmbio e expectativas. Esses efeitos possuem defasagens. O Copom toma decisões considerando o cenário econômico e o regime de metas de inflação. Diferencie meta Selic, taxa Selic efetivamente observada e taxa DI/CDI. Termos próximos podem representar conceitos diferentes.",
        "Na política fiscal, separe fluxo de resultado fiscal de estoque de dívida pública. Uma expansão de gastos pode aumentar a demanda em certas condições, mas seu efeito final depende de financiamento, capacidade ociosa, expectativas e reação da política monetária. Não transforme uma relação econômica condicional em uma regra absoluta. É exatamente esse tipo de excesso que uma alternativa de prova pode explorar."
      ]
    },
    {
      "id": "robusto-economia-cambio",
      "title": "Câmbio e indicadores: transforme números em interpretação",
      "paragraphs": [
        "Câmbio é o preço de uma moeda em relação a outra. Uma depreciação do real significa, em termos simples, que são necessários mais reais para comprar determinada quantidade de moeda estrangeira. Isso tende a encarecer importações em reais e pode favorecer receitas de exportadores quando as demais condições permanecem constantes. Mas uma empresa que exporta e também importa insumos possui exposição líquida, então “dólar alto é sempre bom para exportador” é uma simplificação inadequada.",
        "O edital também cobra taxa de câmbio nominal e real, PTAX, câmbio comercial e turismo, reservas internacionais e swap cambial. O ponto é entender o papel de cada conceito. A PTAX é uma referência calculada pelo Banco Central; câmbio comercial e turismo estão associados a contextos diferentes de operação e formação de preço; reservas internacionais são ativos externos mantidos pelo país; swap cambial é um instrumento utilizado pelo Banco Central para oferecer proteção cambial e atuar nas condições do mercado, conforme a operação.",
        "Para indicadores, faça sempre três perguntas: o que mede, qual é a unidade/período e o que significa uma alta ou queda? PIB mede produção de bens e serviços finais; índices como IPCA, IGP-M, IPA e IPC-Fipe possuem metodologias e cestas diferentes; desemprego descreve uma dimensão do mercado de trabalho. O indicador só ganha significado quando você conecta o número ao mecanismo econômico."
      ]
    }
  ],
  "matematica-financeira": [
    {
      "id": "robusto-mat-taxas",
      "title": "Taxas e indexadores: a conta começa antes da fórmula",
      "paragraphs": [
        "A primeira regra da matemática financeira é colocar grandezas comparáveis na mesma base. Se a taxa é mensal e o fluxo é anual, você precisa entender como a taxa foi definida e qual regime de capitalização está sendo utilizado. Em juros compostos, taxas equivalentes preservam o mesmo efeito de capitalização; em juros simples, a relação é linear. Taxa nominal, efetiva e real também não são sinônimos.",
        "Um indexador é uma referência utilizada para atualizar ou remunerar um contrato. Quando uma aplicação é pós-fixada, o retorno depende da evolução do indexador e da regra contratada. Quando é prefixada, a taxa é conhecida na contratação, mas o preço de mercado pode variar antes do vencimento. A taxa real procura medir o retorno descontado do efeito da inflação; a relação exata usa fatores, não uma subtração automática.",
        "Na prova, antes de calcular escreva: taxa = ?, período = ?, regime = ?, fluxo = ?, data de comparação = ?. Essa pequena linha evita grande parte dos erros."
      ]
    },
    {
      "id": "robusto-mat-fluxos",
      "title": "Fluxo de caixa, VP, VF, VPL, TIR e custo de oportunidade",
      "paragraphs": [
        "Um fluxo de caixa é uma sequência de entradas e saídas em datas determinadas. O valor presente traz fluxos futuros para uma data de referência usando uma taxa de desconto; o valor futuro leva um valor atual para uma data posterior. O VPL reúne os fluxos descontados e inclui o investimento inicial. Se o VPL é positivo à taxa escolhida, o projeto cria valor em relação àquela referência de custo de capital.",
        "A TIR é a taxa que faz o VPL ser igual a zero. Ela pode ser útil, mas não substitui a análise do VPL, da escala do investimento, do momento dos fluxos e de possíveis fluxos não convencionais. Custo de oportunidade é o retorno que se deixa de obter ao escolher uma alternativa em vez da melhor alternativa disponível dentro do contexto. Taxa livre de risco é uma referência teórica/prática para remuneração de um investimento considerado de risco muito baixo, não uma promessa de retorno.",
        "Na resolução, desenhe uma linha do tempo. Coloque t=0, entradas, saídas, cupons e amortizações. Depois escolha a taxa compatível com os períodos. A conta fica muito mais simples quando a estrutura está clara."
      ]
    },
    {
      "id": "robusto-mat-credito",
      "title": "Amortização, SAC, Price e o verdadeiro custo de uma dívida",
      "paragraphs": [
        "Em uma operação de crédito, a parcela normalmente combina juros e amortização. Juros remuneram o capital emprestado durante o período; amortização reduz o saldo devedor. No SAC, a amortização é constante, então os juros tendem a cair conforme o saldo diminui e as prestações tendem a ser decrescentes. Na Price, a prestação é constante nas condições tradicionais, mas a composição muda: no começo há maior parcela de juros e menor amortização; ao longo do tempo, a amortização cresce.",
        "O custo de uma operação não deve ser analisado apenas pela taxa anunciada ou pelo tamanho da parcela. Tarifas, seguros, tributos e demais encargos podem entrar no custo efetivo da operação conforme as regras aplicáveis. Um prazo maior pode reduzir a parcela mensal e aumentar o desembolso total. A pergunta correta é “qual é o fluxo completo de pagamentos?”, e não “qual parcela parece mais confortável?”.",
        "A prova pode misturar matemática e interpretação. Se a prestação caiu, isso não significa automaticamente que o financiamento ficou mais barato. Se o saldo devedor caiu, parte da prestação foi destinada à amortização. Se a taxa mudou, o efeito depende do contrato e da forma de cálculo."
      ]
    },
    {
      "id": "robusto-mat-retorno",
      "title": "Duration, prazo, retorno histórico, retorno esperado e alavancagem",
      "paragraphs": [
        "Prazo e duration não são a mesma coisa. Prazo é a data contratual de vencimento; duration procura medir, de forma simplificada, a sensibilidade do preço de um título a mudanças nas taxas e o momento médio ponderado dos fluxos. Um título com vários cupons pode ter duration inferior ao prazo final. Quanto maior a duration, em geral, maior a sensibilidade do preço a mudanças nas taxas, mantidas as demais condições.",
        "Retorno histórico descreve o que ocorreu; retorno esperado é uma estimativa sobre o que pode ocorrer. O primeiro não garante o segundo. Em uma carteira, o retorno esperado pode depender dos pesos dos ativos e das expectativas para cada componente. Alavancagem financeira utiliza recursos de terceiros para aumentar a exposição do capital próprio: ela pode ampliar ganhos, mas também ampliar perdas e custos.",
        "O CMPC/WACC aparece como referência de custo médio ponderado das fontes de capital de uma empresa. Para a CPA, entenda a lógica: uma empresa compara o retorno esperado de um investimento com o custo dos recursos utilizados para financiá-lo. Não memorize a fórmula sem saber o que cada componente representa."
      ]
    }
  ],
  "infraestrutura": [
    {
      "id": "robusto-infra-imfs",
      "title": "Infraestrutura do mercado: quem faz a operação acontecer depois do clique",
      "paragraphs": [
        "Uma operação financeira não termina quando o cliente aperta “comprar”. Depois da negociação existem processos de registro, compensação, gerenciamento de risco, liquidação e custódia, conforme o mercado. As Infraestruturas do Mercado Financeiro (IMFs) existem para padronizar esses processos, reduzir riscos e permitir que muitos participantes operem com regras comuns. O conceito de gatekeeper ajuda a pensar em instituições e controles que funcionam como pontos de entrada e validação no sistema.",
        "A diferença entre as etapas é essencial. Negociação determina as condições da operação. Compensação apura direitos e obrigações. Liquidação efetiva a entrega de recursos e ativos. Custódia mantém o controle dos ativos ou registros de titularidade conforme a estrutura. Registro mantém informações sobre determinadas operações. Uma questão pode descrever apenas uma dessas funções e esperar que você identifique o mecanismo.",
        "Não confunda infraestrutura com supervisor. Uma infraestrutura pode operar sistemas fundamentais para o mercado, enquanto uma autoridade supervisora fiscaliza participantes e atividades dentro de sua competência. São funções complementares, não equivalentes."
      ]
    },
    {
      "id": "robusto-infra-pagamentos",
      "title": "SPB, SPI e Selic: três conceitos que precisam ficar separados",
      "paragraphs": [
        "O Sistema de Pagamentos Brasileiro (SPB) é a estrutura ampla que organiza sistemas e procedimentos relacionados a pagamentos e transferências de recursos no país. Dentro desse ecossistema existem diferentes sistemas e arranjos. O Sistema de Pagamentos Instantâneos (SPI) é a infraestrutura associada à liquidação das transações do Pix entre participantes diretos, dentro do desenho do Banco Central. Pix, SPI e SPB não são três nomes para a mesma coisa.",
        "O Selic, por sua vez, é o sistema relacionado ao registro e à liquidação de títulos públicos federais, além de outras funções de infraestrutura previstas. Ele não deve ser confundido com a taxa Selic definida como referência de política monetária. Uma é uma infraestrutura/sistema; a outra é uma taxa de juros. Essa diferença aparece com frequência em questões.",
        "Para memorizar, use uma frase: SPB é o ecossistema de pagamentos; SPI é uma infraestrutura específica ligada ao Pix; Selic é a infraestrutura do mercado de títulos públicos federais. Depois associe cada um à função, não apenas à sigla."
      ]
    },
    {
      "id": "robusto-infra-risco",
      "title": "Contraparte central, depositário, registradora e risco sistêmico",
      "paragraphs": [
        "A contraparte central (CCP) atua como contraparte das operações dentro de uma estrutura de compensação e gerenciamento de risco. O objetivo é organizar obrigações e reduzir a exposição bilateral entre participantes por meio de mecanismos como margens e garantias. Isso reduz determinados riscos, mas não transforma a operação em algo sem risco. A existência de uma CCP não elimina risco de mercado, liquidez, operacional ou falhas de participantes.",
        "O depositário central exerce funções relacionadas à guarda e ao controle centralizado de determinados ativos e registros de titularidade. Uma entidade registradora mantém registros de operações ou ativos conforme seu escopo. A distinção pode parecer técnica, mas a prova pode descrever a função sem citar o nome da entidade. Aprenda a reconhecer o que cada infraestrutura faz.",
        "Risco sistêmico é a possibilidade de problemas em uma instituição, mercado ou infraestrutura se propagarem de maneira relevante para o sistema financeiro e a economia. É diferente do risco individual de uma aplicação. Regras prudenciais, capital, liquidez, garantias e linhas de liquidez existem, entre outras razões, para reduzir a probabilidade e o impacto de eventos sistêmicos."
      ]
    },
    {
      "id": "robusto-infra-basileia",
      "title": "Basileia, estabilidade e liquidez: por que o regulador olha o sistema inteiro",
      "paragraphs": [
        "A regulação prudencial procura garantir que instituições financeiras tenham capacidade de absorver perdas e honrar obrigações. Os acordos de Basileia evoluíram ao longo do tempo e incorporaram requisitos de capital e mecanismos relacionados a riscos. Para a CPA, a ideia central é entender por que capital e liquidez importam: uma instituição excessivamente alavancada ou sem liquidez suficiente pode transformar um problema individual em uma ameaça maior.",
        "Depósito compulsório, linhas financeiras de liquidez e instrumentos de estabilidade possuem funções diferentes. Compulsório afeta a estrutura de liquidez e intermediação das instituições conforme as regras do Banco Central. Linhas de liquidez podem oferecer recursos em situações previstas para preservar o funcionamento do sistema. O Comef participa da estrutura de acompanhamento de riscos à estabilidade financeira.",
        "A pergunta de prova costuma ser funcional: “qual risco essa ferramenta procura reduzir?” Se o enunciado fala de incapacidade de cumprir pagamentos imediatos, pense em liquidez. Se fala de perdas que reduzem patrimônio, pense em solvência/capital. Se fala de propagação para outras instituições, pense em risco sistêmico."
      ]
    }
  ],
  "renda-fixa": [
    {
      "id": "robusto-rf-titulos",
      "title": "Renda fixa começa pelo emissor e pelo fluxo, não pela taxa",
      "paragraphs": [
        "Renda fixa significa que as condições de remuneração ou de pagamento são estabelecidas por regras conhecidas na contratação; isso não significa que o preço do investimento permanecerá fixo. Comece sempre pelo emissor e pelo fluxo. Títulos públicos representam dívida do governo federal. CDB, RDB e instrumentos bancários representam relações de crédito com instituições financeiras. Debêntures são títulos de dívida corporativa. CRI e CRA representam estruturas de recebíveis. Cada emissor possui risco de crédito diferente.",
        "Depois identifique a remuneração: prefixada, pós-fixada ou híbrida. Um prefixado estabelece uma taxa conhecida; um pós-fixado acompanha um indexador; um híbrido combina referência de inflação ou outro indexador com componente definido. Em seguida, analise prazo, carência, liquidez, garantias e tributação. Uma taxa aparentemente maior pode simplesmente compensar maior risco de crédito, menor liquidez ou prazo mais longo.",
        "A prova pode apresentar dois títulos com taxas próximas e perguntar qual é mais adequado a determinado objetivo. A resposta exige analisar o conjunto de características, não escolher automaticamente o maior percentual."
      ]
    },
    {
      "id": "robusto-rf-publicos",
      "title": "Tesouro: entenda LFT, LTN, NTN-B e os produtos do Tesouro Direto",
      "paragraphs": [
        "Os títulos públicos federais são instrumentos de dívida do governo. O edital apresenta famílias históricas como LTN e LFT e títulos vinculados à inflação, além dos produtos atualmente oferecidos pelo Tesouro Direto. A lógica econômica permanece: você está financiando o governo e recebe fluxos conforme as condições do título. O Tesouro Direto é uma plataforma de acesso de pessoas investidoras aos títulos públicos, não um emissor separado.",
        "O Tesouro Prefixado concentra a remuneração contratada em uma taxa definida na compra, enquanto o Tesouro Selic acompanha a dinâmica da taxa básica. O Tesouro IPCA+ combina inflação medida pelo índice aplicável com uma taxa real. Tesouro Renda+ e Educa+ possuem estruturas voltadas a fluxos futuros específicos. O ponto da CPA não é decorar nomes comerciais isoladamente: é saber qual é o indexador, quando o dinheiro é recebido, como o preço pode oscilar e qual objetivo combina com o produto.",
        "Mesmo um título público pode oscilar antes do vencimento. Se a pessoa precisa vender antes da data final, o preço de mercado importa. “É Tesouro” descreve o emissor; não significa “o preço nunca cai”."
      ]
    },
    {
      "id": "robusto-rf-privados",
      "title": "CDB, LCI, LCA, LCD, debêntures, CRI e CRA: monte uma matriz de comparação",
      "paragraphs": [
        "Nos títulos bancários, o risco central é relacionado à instituição emissora. CDB é uma captação bancária; RDB possui características próprias de emissão e liquidez; LCI e LCA possuem lastros e regras específicas; LCD integra a estrutura de títulos de desenvolvimento prevista no edital. Para comparar, pergunte: quem emite? qual a remuneração? existe liquidez? há carência? existe garantia? qual tributação? qual é o prazo?",
        "Debêntures são títulos de dívida de empresas. Podem ter estruturas diferentes de garantia e remuneração, inclusive modalidades previstas no edital. Debêntures conversíveis ou permutáveis adicionam direitos e possibilidades específicas. CRI e CRA estão ligados a recebíveis imobiliários e do agronegócio. O risco não desaparece porque existe um lastro: é preciso analisar a estrutura, os devedores, garantias, fluxo e mecanismos de proteção.",
        "Rating é uma opinião de avaliação de risco de crédito produzida por uma agência, não uma garantia de pagamento. Um rating pode mudar. Para a prova, não transforme “rating alto” em “sem risco”. A função do rating é fornecer informação adicional sobre capacidade e risco de crédito."
      ]
    },
    {
      "id": "robusto-rf-mtm",
      "title": "Marcação a mercado: por que um título pode perder valor antes do vencimento",
      "paragraphs": [
        "Imagine um título que pagará R$ 1.100 daqui a um ano. Se o mercado exige 10%, seu valor presente é aproximadamente R$ 1.000. Se a taxa exigida passa a 12%, o preço necessário para que o mesmo fluxo ofereça 12% cai. Essa relação inversa entre taxa e preço explica a marcação a mercado de muitos títulos. O fluxo contratado não precisa mudar para o preço mudar.",
        "A sensibilidade aumenta com o prazo e depende da distribuição dos fluxos. Títulos com pagamentos mais distantes tendem a reagir mais às mudanças nas taxas. Por isso, uma pessoa pode ter comprado um título “com taxa garantida” e ainda observar variação negativa no extrato. Se mantiver o título até o vencimento e as condições do contrato forem cumpridas, a lógica do retorno contratado é diferente da venda antecipada.",
        "Na prova, procure a palavra-chave: “venda antes do vencimento”. Ela frequentemente transforma uma questão de remuneração contratada em uma questão de preço de mercado, liquidez e risco."
      ]
    }
  ],
  "renda-variavel": [
    {
      "id": "robusto-rv-acoes",
      "title": "Ações: capital próprio, direitos e relação com a empresa",
      "paragraphs": [
        "Ao comprar uma ação, a pessoa investidora adquire uma participação societária, não um direito de receber juros fixos da empresa. A companhia pode ser uma sociedade limitada ou uma sociedade por ações; para acessar o mercado organizado, a estrutura de companhia aberta e listagem possui requisitos próprios. Ações ordinárias e preferenciais possuem direitos diferentes conforme a legislação e os estatutos aplicáveis. Units podem combinar classes de valores mobiliários; BDRs representam valores mobiliários de emissores estrangeiros em uma estrutura própria.",
        "Capital próprio é recurso pertencente aos acionistas; capital de terceiros é dívida. Um IPO é uma oferta pública inicial, enquanto um follow-on ocorre quando uma companhia já listada realiza nova oferta. O mercado primário é aquele em que os recursos da emissão vão para o emissor, enquanto no secundário os investidores negociam entre si. O preço da ação no secundário pode mudar sem que a companhia receba dinheiro naquela negociação.",
        "Para a CPA, não confunda “comprar uma ação” com “emprestar dinheiro à empresa”. O acionista participa do resultado econômico e assume risco de mercado e de negócio. O credor possui uma relação de dívida e prioridade contratual diferente."
      ]
    },
    {
      "id": "robusto-rv-eventos",
      "title": "Eventos corporativos: dividendos, JCP, bonificação, desdobramento e subscrição",
      "paragraphs": [
        "Eventos corporativos alteram a relação entre empresa e acionistas. Dividendos representam distribuição de resultados aos acionistas segundo as regras aplicáveis. JCP é outra forma de remuneração ao acionista, com tratamento jurídico e tributário específico. Restituição de capital devolve parte do capital em determinadas situações. Cada evento possui efeitos próprios sobre quantidade de ações, preço de referência e posição do investidor.",
        "Desdobramento aumenta a quantidade de ações e reduz proporcionalmente o preço unitário, sem criar valor econômico por si só. Grupamento faz o movimento inverso. Bonificação pode aumentar a quantidade de ações recebidas pelos acionistas conforme a operação. Subscrição dá ao acionista direito de participar de uma nova emissão em condições definidas. O ponto é separar alteração de quantidade/preço unitário de criação efetiva de valor.",
        "Na prova, faça uma tabela mental: o evento mudou a quantidade? mudou o caixa do acionista? mudou o capital da companhia? criou um direito? O erro clássico é confundir uma alteração mecânica da cotação com ganho econômico."
      ]
    },
    {
      "id": "robusto-rv-governanca",
      "title": "Índices e governança: o que está por trás de uma ação listada",
      "paragraphs": [
        "Índices como Ibovespa, IBrX 100 e IBrX 50 procuram representar determinados conjuntos de ações segundo metodologias próprias. Um índice não é uma ação e não representa automaticamente todo o mercado. Sua composição e metodologia determinam quais ativos entram e qual peso possuem. Para interpretar uma alta do índice, pense no desempenho dos componentes e em seus pesos.",
        "Governança corporativa trata da forma como decisões, controles, direitos e interesses são organizados dentro da companhia. Conselho de administração, segmentos de listagem, free float, tag along e drag along aparecem no edital porque ajudam a compreender direitos de acionistas e estrutura de controle. Tag along está relacionado à proteção de determinados acionistas em situações de mudança de controle, enquanto free float representa a parcela de ações em circulação no mercado conforme a metodologia aplicável.",
        "A prova pode apresentar uma companhia com boa performance operacional e perguntar sobre um direito societário. Não misture governança com rentabilidade: governança trata de estrutura, direitos, controles e relacionamento entre agentes."
      ]
    },
    {
      "id": "robusto-rv-derivativos-coe",
      "title": "Derivativos e COE: primeiro descubra qual risco está sendo assumido",
      "paragraphs": [
        "Derivativos têm valor relacionado a um ativo ou variável de referência. Podem ser usados para proteção, especulação ou arbitragem. Hedge busca reduzir uma exposição existente; especulação assume uma exposição para tentar obter resultado com movimentos de mercado. A mesma ferramenta pode servir a objetivos diferentes. O que define o uso é a posição econômica e o objetivo do participante.",
        "O COE combina características de diferentes instrumentos, frequentemente utilizando derivativos para criar uma estrutura de retorno condicionada ao comportamento de um ativo ou índice. A pessoa investidora precisa entender ativo de referência, prazo, cenários, barreiras, participação na alta ou baixa, possibilidade de perda do principal e condições de liquidez. “Capital protegido” não significa que todo retorno seja garantido nem que não exista risco de crédito do emissor.",
        "A técnica de prova é montar três cenários: ativo sobe, ativo cai, ativo fica próximo do ponto inicial. Em cada cenário, pergunte quanto o investidor recebe, se existe limite, se perde principal e quando pode sair. Se você consegue responder isso, a estrutura deixou de ser um texto comercial e virou um fluxo econômico."
      ]
    }
  ],
  "fundos": [
    {
      "id": "robusto-fundos-estrutura",
      "title": "Fundo de investimento do zero: patrimônio coletivo, cotas e classes",
      "paragraphs": [
        "Um fundo de investimento reúne recursos de diferentes investidores em uma estrutura coletiva. A pessoa compra cotas e passa a participar economicamente do patrimônio da classe conforme suas regras. O dinheiro não fica simplesmente “na conta do banco distribuidor”: a classe possui patrimônio e política de investimento próprios. A Resolução CVM 175 introduziu uma estrutura baseada em classes e subclasses, com segregação patrimonial entre classes em determinadas condições.",
        "Classe aberta e classe fechada possuem diferenças importantes de entrada e saída. Em uma classe aberta, existe possibilidade de resgate segundo as regras e prazos previstos. Em uma classe fechada, a saída costuma depender de eventos definidos ou negociação de cotas, conforme a estrutura. Emissão, subscrição, integralização, amortização e resgate são conceitos diferentes e devem ser entendidos pelo fluxo de dinheiro.",
        "A pergunta que resolve a maioria das questões é: “quem coloca dinheiro, onde esse dinheiro fica, quem decide a carteira e como o investidor sai?”. Depois disso, entram taxas, riscos, tributação e prestadores."
      ]
    },
    {
      "id": "robusto-fundos-prestadores",
      "title": "Administrador, gestor, custodiante e distribuidor: quem faz o quê",
      "paragraphs": [
        "O administrador fiduciário possui responsabilidades relacionadas ao funcionamento e à administração da classe, dentro das regras aplicáveis. O gestor toma decisões de investimento dentro da política e dos limites da classe. O custodiante participa da guarda e do controle dos ativos e das atividades de custódia previstas. O distribuidor oferece o produto ao investidor e executa as atividades de distribuição. Uma instituição pode desempenhar determinadas funções quando autorizada e estruturada para isso, mas não devemos tratar todos os papéis como sinônimos.",
        "Essa separação é essencial porque a prova pode apresentar uma situação de conflito. Se a questão pergunta quem decide comprar ou vender ativos da carteira, pense na gestão. Se pergunta quem administra a estrutura e assegura o cumprimento de obrigações administrativas, pense na administração. Se fala de guarda e controle de ativos, pense em custódia. Se fala da oferta ao cliente, pense em distribuição.",
        "Não memorize apenas “administrador = burocracia” e “gestor = compra”. Entenda a responsabilidade formal e operacional de cada função dentro da regulamentação. A resposta correta precisa seguir o escopo da atividade."
      ]
    },
    {
      "id": "robusto-fundos-riscos-taxas",
      "title": "Carteira, riscos, taxas e rentabilidade: como ler um fundo de verdade",
      "paragraphs": [
        "O risco de um fundo vem dos ativos que compõem sua carteira e da estratégia utilizada. Um fundo de renda fixa pode ter risco de crédito, mercado e liquidez; um fundo de ações possui forte exposição ao mercado acionário; um multimercado pode combinar juros, câmbio, ações e outros riscos; fundos cambiais têm foco em exposição cambial. A classificação ajuda, mas a carteira e a política de investimento são o que realmente explicam o comportamento.",
        "Taxa de administração remunera serviços relacionados à estrutura e gestão conforme as regras. Taxas de ingresso e saída podem existir em determinadas classes. Taxa de performance, quando aplicável, remunera desempenho segundo critérios estabelecidos. A existência de taxa não significa que o fundo seja ruim ou bom: ela precisa ser comparada com estratégia, serviço e resultado líquido.",
        "Rentabilidade passada mostra o que ocorreu, não o que necessariamente ocorrerá. Um fundo que rendeu muito pode ter assumido riscos que não aparecem em uma única janela. Na análise, combine retorno, risco, liquidez, custos, prazo e objetivo do investidor."
      ]
    },
    {
      "id": "robusto-fundos-fif",
      "title": "FIF e limites de carteira: o que a classificação realmente significa",
      "paragraphs": [
        "Os Fundos de Investimento Financeiro (FIF) possuem regras específicas sobre composição, limites de concentração, exposição ao exterior, tipos de ativos e estratégias. As categorias de renda fixa, ações, cambiais e multimercados ajudam a identificar o principal risco e a lógica de gestão. FI-Infra possui estrutura própria relacionada a investimentos em infraestrutura. A classificação não é apenas um nome comercial: ela está ligada a regras de carteira.",
        "Concentração em um emissor, modalidade de ativo ou grupo econômico pode aumentar o risco específico. Investir em cotas de outros fundos cria uma camada adicional de análise: você precisa entender tanto o fundo investido quanto os ativos que ele possui. Exposição a risco de capital também merece atenção em estruturas permitidas.",
        "Na prova, leia a pergunta procurando a palavra que indica o limite ou a função: “concentração”, “exterior”, “risco de capital”, “prestador”, “classe restrita”. Não escolha a resposta apenas porque ela cita uma categoria de fundo correta."
      ]
    },
    {
      "id": "robusto-fundos-tributacao",
      "title": "Tributação de fundos: entenda a lógica antes de decorar a tabela",
      "paragraphs": [
        "A tributação de fundos depende da estrutura do fundo, da natureza do rendimento e do evento que gera a incidência. IOF pode aparecer em situações específicas de curto prazo; Imposto de Renda incide segundo as regras aplicáveis ao tipo de fundo e ao rendimento. O objetivo da CPA é que você consiga identificar o imposto e o evento corretos, não aplicar uma alíquota decorada em qualquer fundo.",
        "A comparação deve ser feita pelo retorno líquido. Dois fundos podem apresentar rentabilidade bruta semelhante e entregar resultados diferentes depois de taxas e tributos. O investidor também precisa considerar o horizonte e a liquidez. Regras tributárias são sensíveis à legislação vigente, então a plataforma deve sempre manter a referência oficial atualizada.",
        "Quando uma questão fornecer uma alíquota explicitamente, use a informação do enunciado. Quando pedir uma regra geral, identifique primeiro o tipo de fundo e o evento tributável. Esse passo evita aplicar a tributação de renda fixa diretamente a qualquer veículo de investimento."
      ]
    }
  ],
  "fundos-imobiliarios": [
    {id:"robusto-fii-analise",title:"Como analisar um FII como uma carteira de fluxo de caixa",paragraphs:["Uma análise de FII pode começar como uma análise de empresa: de onde vem a receita, quais são os custos, qual é a qualidade dos contratos, quais riscos podem interromper o fluxo e qual preço o mercado está pagando por essa exposição? Em um FII de tijolo, olhe ocupação, concentração de locatários, localização, contratos, reajustes e despesas. Em um FII de papel, olhe devedores, garantias, indexadores, spreads, concentração e qualidade do crédito. Em um híbrido, identifique qual parcela do resultado vem de cada fonte.","Depois, conecte o fluxo ao preço da cota. Um rendimento mensal alto pode refletir uma distribuição extraordinária, uma carteira mais arriscada ou uma oportunidade de preço; não existe interpretação correta sem contexto. Também compare o valor patrimonial com o preço de mercado sem tratar essa diferença como prova automática de desconto ou sobrepreço. A liquidez da cota, os custos e o horizonte do investidor completam a análise. Na CPA, a resposta mais forte é a que identifica o mecanismo econômico por trás do rendimento, e não a que escolhe o maior dividend yield."]},

    {
      "id": "robusto-fii-estrutura",
      "title": "FII do zero: o patrimônio, a cota e o ambiente de negociação",
      "paragraphs": [
        "O Fundo de Investimento Imobiliário reúne recursos em uma estrutura coletiva voltada a ativos e estratégias imobiliárias. A pessoa investidora compra cotas e participa economicamente do patrimônio do fundo. A cota pode ser negociada em mercado organizado conforme as regras aplicáveis, o que cria uma diferença importante em relação à propriedade direta de um imóvel: o investidor não precisa vender o imóvel para sair da posição, mas depende da liquidez da cota.",
        "O preço da cota é determinado pelo mercado e pode ficar acima ou abaixo do valor patrimonial por diversos fatores. Juros, expectativas, qualidade dos ativos, liquidez, renda distribuída e percepção de risco influenciam a cotação. Portanto, receber rendimentos não impede que a cota caia de preço.",
        "Na CPA, sempre separe três coisas: patrimônio do fundo, renda distribuída e preço de mercado da cota. Juntas, elas explicam o retorno total."
      ]
    },
    {
      "id": "robusto-fii-tijolo-papel",
      "title": "Tijolo, papel e híbridos: de onde realmente vem o dinheiro?",
      "paragraphs": [
        "FIIs de tijolo concentram exposição em imóveis físicos ou operações diretamente relacionadas a eles. O resultado pode depender de aluguéis, ocupação, reajustes, despesas e valor dos imóveis. Vacância reduz receita potencial; concentração em um único imóvel ou locatário aumenta risco específico. Um imóvel bem localizado pode ter características de risco diferentes de um imóvel com alta dependência de um único contrato.",
        "FIIs de papel investem em recebíveis e estruturas de crédito imobiliário. Nesse caso, o risco dominante pode estar mais ligado à capacidade de pagamento dos devedores, indexadores, garantias e spreads. FIIs híbridos combinam diferentes exposições. Não basta perguntar “é FII?”: descubra de onde vem o fluxo econômico.",
        "Essa distinção também ajuda a interpretar uma queda de rendimento. Em tijolo, pode haver vacância ou renegociação. Em papel, pode haver inadimplência, pré-pagamento ou alteração de indexadores. O mesmo sintoma pode ter causas completamente diferentes."
      ]
    },
    {
      "id": "robusto-fii-rendimento",
      "title": "Dividendos, retorno total, subscrição e riscos",
      "paragraphs": [
        "O rendimento distribuído é apenas uma parte da história. O retorno total de uma pessoa investidora combina variação do preço da cota e distribuições recebidas, considerando custos e tributos quando aplicáveis. Um FII pode distribuir R$ 0,80 por cota e, simultaneamente, cair R$ 3,00 no preço. Olhar somente para o rendimento mensal pode esconder uma perda de patrimônio.",
        "Subscrição permite que investidores participem de determinadas emissões de novas cotas segundo condições específicas. Taxas de administração e outros custos reduzem o retorno líquido. Liquidez da cota é diferente da liquidez do imóvel: um fundo pode possuir ativos valiosos e, ainda assim, ter dificuldade de negociação em determinado momento.",
        "Na prova, procure o risco dominante: mercado, liquidez, crédito, vacância ou concentração. A resposta correta normalmente depende de identificar qual componente da carteira está causando a exposição."
      ]
    }
  ],
  "previdencia": [
    {
      "id": "robusto-prev-pgbl-vgbl",
      "title": "PGBL e VGBL: a diferença está principalmente na base tributável",
      "paragraphs": [
        "PGBL e VGBL são produtos de previdência complementar com estruturas diferentes de tributação. A pergunta central é: em qual base o imposto incide no momento do resgate ou benefício? No PGBL, dentro das condições tributárias aplicáveis, as contribuições podem ter tratamento de dedução na declaração para quem atende aos requisitos, e a tributação posterior considera o valor total recebido. No VGBL, a contribuição não funciona da mesma forma como dedução, e a tributação no resgate incide sobre a parcela de rendimento, conforme as regras.",
        "Isso significa que a escolha não deve ser feita pela frase “PGBL é melhor” ou “VGBL é melhor”. Depende do perfil tributário, forma de declaração, contribuição para previdência oficial, horizonte e objetivo. Um profissional precisa explicar a lógica sem prometer vantagem fiscal universal.",
        "A prova pode apresentar uma pessoa com determinado tipo de declaração e perguntar qual produto faz sentido. Primeiro identifique a base tributável; depois analise o contexto."
      ]
    },
    {
      "id": "robusto-prev-regimes",
      "title": "Progressivo e regressivo: tempo, renda e objetivo mudam a análise",
      "paragraphs": [
        "No regime progressivo, a tributação segue uma lógica relacionada à tabela progressiva aplicável e pode envolver compensação na declaração, conforme a natureza do pagamento. No regime regressivo, a alíquota tende a diminuir conforme o tempo de permanência dos recursos, seguindo a tabela específica. O ponto fundamental é entender que o regime regressivo valoriza horizonte mais longo, enquanto o progressivo pode fazer sentido em diferentes situações de renda e recebimento.",
        "A escolha do regime precisa considerar se o dinheiro será resgatado de uma vez ou transformado em benefício, o prazo, a renda tributável e as regras vigentes. Não existe uma resposta universal baseada apenas na idade. A questão pode fornecer um horizonte muito longo e uma renda futura elevada; esses dados são pistas para a análise.",
        "Quando houver tabela no enunciado, não decore valores externos: aplique a regra fornecida. Quando a pergunta for conceitual, explique a diferença entre base de cálculo e alíquota."
      ]
    },
    {
      "id": "robusto-prev-portabilidade",
      "title": "Portabilidade, taxas e fases do produto",
      "paragraphs": [
        "Previdência possui uma fase de contribuição/acumulação e uma fase de benefício. Durante a acumulação, o saldo é formado pelas contribuições e pela rentabilidade líquida dos custos. Na transformação em renda, o saldo pode ser convertido em diferentes modalidades, como renda mensal vitalícia, renda temporária ou renda por prazo certo, conforme as condições contratadas.",
        "Portabilidade permite transferir recursos de um plano para outro dentro das regras aplicáveis, preservando a natureza previdenciária da operação. Não deve ser confundida com resgate: resgatar pode gerar consequências tributárias e encerrar a estrutura. Portabilidade interna e externa possuem procedimentos e carências próprios.",
        "Taxa de administração, taxa de carregamento quando aplicável e demais custos afetam o patrimônio ao longo de muitos anos. Em previdência, pequenas diferenças de custo podem ter efeito relevante porque o dinheiro permanece investido por longo período."
      ]
    },
    {
      "id": "robusto-prev-caso",
      "title": "Caso prático: escolha do plano pela situação do cliente",
      "paragraphs": [
        "Considere uma pessoa com renda tributável, que faz declaração completa, contribui para a previdência oficial e pretende acumular recursos para aposentadoria por décadas. Outra pessoa tem perfil diferente, não busca dedução das contribuições e quer utilizar a previdência como veículo de planejamento patrimonial. A análise pode levar a estruturas diferentes. O ponto não é decorar “perfil A = produto X”, mas entender qual benefício tributário e financeiro está sendo procurado.",
        "Depois compare regime tributário, custos, fundo de investimento vinculado ao plano, portabilidade, liquidez e forma futura de recebimento. A previdência é um produto de longo prazo, então a adequação depende do horizonte. Um produto com custo elevado ou estrutura incompatível pode comprometer o objetivo mesmo que tenha uma boa rentabilidade em determinado período.",
        "Na prova, siga: objetivo → horizonte → situação tributária → produto → regime → custos → forma de saída."
      ]
    }
  ],
  "credito": [
    {
      "id": "robusto-credito-fundamentos",
      "title": "Crédito: antes da taxa, entenda finalidade, capacidade e risco",
      "paragraphs": [
        "Crédito é a antecipação de recursos em troca de pagamento futuro. A análise começa pela finalidade: consumo, aquisição de um bem, capital de giro, imóvel, veículo ou outra necessidade. Depois entram capacidade de pagamento, histórico, renda, garantias, prazo e risco de crédito. Uma taxa baixa não torna uma dívida automaticamente adequada se o valor financiado for incompatível com o orçamento.",
        "Rating, score e comprovação de renda são informações diferentes. Rating é uma avaliação de risco de crédito aplicada a determinados emissores ou operações; score é uma pontuação baseada em informações e modelos de crédito; comprovação de renda ajuda a avaliar capacidade de pagamento. O SCR reúne informações sobre operações de crédito no sistema financeiro e auxilia análises dentro das regras de acesso.",
        "A questão pode apresentar uma pessoa com renda suficiente, mas alto endividamento. Não escolha a resposta apenas pela renda. Capacidade de pagamento é uma análise do fluxo completo."
      ]
    },
    {
      "id": "robusto-credito-modalidades",
      "title": "Empréstimo, financiamento, CDC, consignado e crédito imobiliário",
      "paragraphs": [
        "Empréstimo é uma disponibilização de recursos que, em geral, não está necessariamente vinculada à aquisição de um bem específico. Financiamento costuma estar associado a uma finalidade definida, como imóvel ou veículo. CDC é uma modalidade de crédito voltada ao consumo de bens e serviços. Crédito consignado possui desconto das parcelas diretamente na fonte pagadora, dentro das regras aplicáveis, reduzindo determinado risco para o credor e podendo resultar em condições diferentes.",
        "Crédito imobiliário possui prazos longos e normalmente envolve garantia sobre o próprio imóvel. CDC pode utilizar o bem adquirido como garantia em determinadas estruturas. Leasing possui lógica própria de arrendamento e opção de compra. A questão pode misturar essas modalidades para verificar se você sabe identificar finalidade, garantia e fluxo de pagamento.",
        "Sempre compare CET, prazo, parcela, garantia, custo total e possibilidade de antecipação. A menor parcela não é necessariamente a menor dívida."
      ]
    },
    {
      "id": "robusto-credito-cartao",
      "title": "Cartão, rotativo e cheque especial: o perigo de olhar apenas para o limite",
      "paragraphs": [
        "O limite do cartão não é renda adicional. É uma capacidade de compra/crédito concedida pela instituição. Se a pessoa paga integralmente a fatura, a dinâmica é diferente de quando paga apenas uma parte e entra em financiamento/rotativo ou outra modalidade prevista. O custo do crédito deve ser analisado pelo fluxo de pagamento e pelas regras vigentes.",
        "Cheque especial é uma linha de crédito vinculada à conta. Se utilizada, gera encargos conforme as condições. O fato de o limite estar disponível não significa que seja um recurso gratuito. Para qualquer modalidade, o profissional deve separar saldo próprio de crédito disponível.",
        "Na prova, quando aparecer uma pessoa usando constantemente cartão e cheque especial para fechar o mês, a questão provavelmente está testando gestão de dívida e capacidade de pagamento, não apenas conhecimento de produto."
      ]
    },
    {
      "id": "robusto-credito-garantias",
      "title": "Garantias, prazo e custo total: por que o desenho da operação importa",
      "paragraphs": [
        "Garantia reduz o risco de perda do credor em determinados cenários, mas não elimina o risco de inadimplência nem significa que o tomador nunca perderá o bem. Uma dívida garantida pode ter taxa diferente de uma dívida sem garantia porque o risco de crédito esperado pode ser diferente. O prazo também influencia a parcela, os juros acumulados e a exposição do credor.",
        "Capital de giro financia necessidades operacionais de empresas. Crédito imobiliário financia aquisição ou construção de imóveis. Consórcio não é empréstimo tradicional: existe uma estrutura de autofinanciamento coletivo, contemplação e pagamento de parcelas, com regras próprias. Essa diferença é importante porque a pessoa pode confundir “parcela” com “juros de financiamento”.",
        "O raciocínio final é: finalidade → valor → prazo → capacidade → garantia → CET → risco. Se um desses elementos estiver incompatível, a taxa isolada não resolve o problema."
      ]
    }
  ]
}
