export interface ExamBlueprint {
  mustMaster: string[]
  examPatterns: string[]
  traps: string[]
}

export const examBlueprints: Record<string, ExamBlueprint> = {
  'sistema-financeiro': {
    mustMaster: ['Estrutura do SFN e diferença entre órgão normativo, supervisor e operador', 'CMN, BCB/Copom, CVM, CNSP/Susep, CNPC/Previc e autorregulação da ANBIMA', 'Intermediação financeira, mercados monetário, de crédito, de capitais e cambial', 'FGC: finalidade, produtos potencialmente cobertos e diferença para custódia/registro'],
    examPatterns: ['Caso em que o cliente pergunta quem cria a regra e quem fiscaliza', 'Situação em que é preciso identificar BCB, CVM ou Susep pela atividade', 'Questão que mistura distribuidor, emissor, custodiante e garantidor'],
    traps: ['CMN não fiscaliza instituição nem executa política monetária', 'ANBIMA não substitui regulador estatal', 'Comprar um ativo no banco não significa que o banco é o emissor ou que existe FGC'],
  },
  'economia': {
    mustMaster: ['Selic, Copom e transmissão da política monetária', 'Inflação, IPCA, juro nominal e juro real', 'PIB, atividade, desemprego e política fiscal', 'Câmbio nominal x real e efeitos sobre importadores, exportadores e preços'],
    examPatterns: ['Notícia econômica seguida de pergunta sobre impacto em crédito ou investimentos', 'Cenário de alta/queda da Selic e efeito sobre ativos', 'Comparação entre retorno nominal e poder de compra'],
    traps: ['Desinflação não é deflação', 'Selic maior não faz todo investimento render mais da mesma forma', 'Câmbio mais alto em R$/US$ significa real depreciado'],
  },
  'matematica-financeira': {
    mustMaster: ['Juros simples e compostos', 'Taxas proporcionais, equivalentes, nominal, efetiva e real', 'Valor presente, valor futuro e fluxo de caixa', 'SAC, Price, descontos, VPL e noções de CET'],
    examPatterns: ['Cálculo curto dentro de um caso de investimento ou financiamento', 'Comparação de duas taxas em periodicidades diferentes', 'Identificação da lógica de amortização em uma prestação'],
    traps: ['Taxa equivalente não é simples multiplicação da taxa mensal por 12', 'Prestação não é sinônimo de amortização', 'Retorno real exato usa fatores, não apenas subtração de percentuais'],
  },
  'infraestrutura': {
    mustMaster: ['Negociação, registro, compensação, liquidação e custódia', 'B3, Selic, SPB e infraestruturas de pagamento', 'Risco de contraparte, garantias e mecanismos de liquidação', 'Distribuição de produtos e responsabilidade dos participantes'],
    examPatterns: ['Caso perguntando o que acontece depois que a ordem é executada', 'Questão sobre Pix/SPB e liquidação', 'Situação que diferencia infraestrutura de garantia de retorno'],
    traps: ['Custódia não elimina risco de mercado', 'Registro não transforma ativo em produto garantido', 'Liquidez e solvência são conceitos diferentes'],
  },
  'renda-fixa': {
    mustMaster: ['Prefixados, pós-fixados e híbridos', 'Tesouro, CDB, LCI/LCA, debêntures e demais títulos cobrados no PD', 'Marcação a mercado e relação inversa entre taxa e preço', 'Risco de crédito, mercado, liquidez, tributação e FGC quando aplicável'],
    examPatterns: ['Cliente precisa vender antes do vencimento e pergunta por que perdeu dinheiro', 'Comparação entre produto isento e tributado', 'Escolha de produto conforme prazo e necessidade de liquidez'],
    traps: ['Renda fixa não significa preço fixo', 'FGC depende do instrumento e das regras, não do aplicativo de compra', 'Taxa anunciada maior não garante melhor retorno líquido'],
  },
  'renda-variavel': {
    mustMaster: ['Ações, mercado primário/secundário e proventos', 'Risco e retorno do acionista', 'Futuros, opções, swaps e hedge', 'COE, cenários de payoff, proteção nominal e risco do emissor'],
    examPatterns: ['Empresa ou investidor buscando proteção com derivativos', 'Questão sobre direito x obrigação em opções', 'Estrutura de COE em diferentes cenários de mercado'],
    traps: ['Hedge reduz risco; não promete lucro', 'Alavancagem amplia ganhos e perdas', 'Proteção nominal no COE não elimina risco de crédito'],
  },
  'fundos': {
    mustMaster: ['Cota, patrimônio, classes/subclasses e política de investimento', 'Administrador, gestor, custodiante, distribuidor e demais prestadores', 'Aplicação, cotização, resgate, taxas e despesas', 'Classificações, riscos e tributação/come-cotas quando aplicável'],
    examPatterns: ['Identificação do prestador responsável por determinada função', 'Cliente confunde prazo de pedido de resgate com recebimento', 'Comparação de fundos com mesmo rótulo mas riscos diferentes'],
    traps: ['Fundo não tem FGC', 'Benchmark não é garantia de rentabilidade', 'Distribuidor não vira garantidor do fundo'],
  },
  'fundos-imobiliarios': {
    mustMaster: ['FIIs de imóveis, recebíveis e fundos de fundos', 'Vacância, inadimplência, concentração e qualidade dos ativos', 'Rendimentos, valor patrimonial e preço de mercado', 'Liquidez e sensibilidade a juros'],
    examPatterns: ['Cliente escolhe FII apenas por dividend yield', 'Comparação entre fundo de tijolo e papel', 'Necessidade de renda x necessidade de valor certo em data próxima'],
    traps: ['Distribuição passada não é renda garantida', 'P/VP baixo não significa automaticamente barato', 'FII não é imóvel direto nem depósito bancário'],
  },
  'previdencia': {
    mustMaster: ['PGBL x VGBL e base de tributação', 'Regime progressivo x regressivo', 'Portabilidade, resgate e beneficiários', 'Taxas, fundos do plano e adequação ao horizonte'],
    examPatterns: ['Cliente informa forma de declaração de IR e pergunta qual plano escolher', 'Caso de longo prazo com comparação dos regimes tributários', 'Troca de plano via portabilidade x resgate'],
    traps: ['PGBL não é sempre melhor para quem declara completo', 'VGBL não é isento de IR', 'Portabilidade não é sinônimo de resgate e reinvestimento'],
  },
  'credito': {
    mustMaster: ['Empréstimo, financiamento, cheque especial, cartão, consignado e outros produtos do PD', 'CET, taxa, tarifas e custo total', 'Capacidade de pagamento e comprometimento de renda', 'Garantias e sistemas de amortização quando aplicável'],
    examPatterns: ['Comparar duas propostas com parcelas e prazos diferentes', 'Cliente quer refinanciar dívida cara', 'Escolha do produto conforme finalidade e garantia'],
    traps: ['Menor parcela não significa menor custo total', 'Garantia não elimina risco', 'Taxa nominal sozinha não substitui CET'],
  },
  'servicos-bancarios': {
    mustMaster: ['Tipos de conta e serviços', 'Pix, cartões, boletos, transferências e débito automático', 'Tarifas, pacotes e canais', 'Fraudes, autenticação e segurança do cliente'],
    examPatterns: ['Cliente recebe contato suspeito pedindo código ou transferência', 'Diferença entre meio de pagamento e crédito', 'Identificação da função de instituições de pagamento'],
    traps: ['Chave Pix não é conta nem saldo separado', 'Limite de cartão não é renda', 'Canal digital não muda a natureza jurídica do produto'],
  },
  'seguros': {
    mustMaster: ['Prêmio, risco, cobertura, sinistro e indenização', 'Franquia, carência, exclusões e capital segurado', 'Seguros de vida, patrimoniais e prestamista', 'Capitalização e diferenças em relação a investimentos'],
    examPatterns: ['Evento ocorre e é preciso verificar se está coberto', 'Cliente compara seguro, previdência e investimento', 'Situação com franquia ou limite de indenização'],
    traps: ['Prêmio é preço do seguro, não indenização', 'Franquia não é carência', 'Capitalização não deve ser vendida como CDB ou fundo'],
  },
  'planejamento': {
    mustMaster: ['Orçamento, receitas, despesas e fluxo de caixa', 'Patrimônio líquido, ativos e passivos', 'Reserva de emergência e despesas previsíveis', 'Metas financeiras, endividamento e priorização'],
    examPatterns: ['Família com sobra ou déficit e necessidade de reorganização', 'Definição de reserva compatível com situação do cliente', 'Meta com valor e prazo definidos'],
    traps: ['Renda alta não significa patrimônio saudável', 'Reserva de emergência não busca retorno máximo', 'Despesa anual previsível não deve ser tratada como emergência'],
  },
  'carteiras': {
    mustMaster: ['Objetivo, horizonte, liquidez e restrições', 'Alocação por classes e diversificação', 'Concentração, correlação e risco total', 'Monitoramento e rebalanceamento'],
    examPatterns: ['Cliente tem vários objetivos com horizontes distintos', 'Carteira com muitos produtos mas mesma exposição', 'Desvio dos pesos após movimentos de mercado'],
    traps: ['Quantidade de produtos não é diversificação', 'Diversificar reduz riscos específicos, não elimina perdas', 'Rebalancear não é girar a carteira por impulso'],
  },
  'perfil': {
    mustMaster: ['Objetivos, situação financeira e conhecimento/experiência', 'Capacidade, disposição e necessidade de assumir risco', 'Suitability e compatibilidade do produto', 'Classificações e atualizações cadastrais aplicáveis'],
    examPatterns: ['Cliente agressivo no questionário, mas precisa do dinheiro no curto prazo', 'Produto incompatível com perfil ou informação insuficiente', 'Mudança relevante de objetivo ou situação financeira'],
    traps: ['Perfil não é definido apenas pela idade', 'Tolerância emocional não substitui capacidade financeira', 'Nunca se altera resposta para fazer o cliente caber no produto'],
  },
  'atendimento-etica': {
    mustMaster: ['Ética, transparência e conflitos de interesse', 'Comunicação e dever de informação', 'PLD/FTP, conheça seu cliente e sinais de alerta', 'Privacidade, proteção de dados, segurança e registros'],
    examPatterns: ['Meta comercial entra em conflito com interesse do cliente', 'Operação atípica exige procedimento interno', 'Cliente vulnerável ou com baixa compreensão do produto'],
    traps: ['Operação atípica não prova crime', 'Não se promete retorno ou restituição antes da análise', 'Não se avisa cliente sobre comunicação sigilosa de suspeita'],
  },
  'sustentabilidade': {
    mustMaster: ['Fatores ambientais, sociais e de governança', 'Riscos físicos, de transição e materialidade', 'Exclusão, integração, best-in-class, temáticos e impacto', 'Fundos IS, integração ESG e greenwashing'],
    examPatterns: ['Classificar estratégia de investimento sustentável', 'Identificar fator ESG material em uma empresa', 'Avaliar comunicação enganosa sobre sustentabilidade'],
    traps: ['ESG não garante maior retorno', 'Rating ESG não substitui análise financeira', 'Rótulo sustentável precisa corresponder ao processo efetivo'],
  },
  'ativos-digitais': {
    mustMaster: ['Blockchain, tokens e criptoativos', 'Custódia, chaves e riscos operacionais', 'Smart contracts e DeFi', 'Stablecoins, volatilidade, governança e riscos de protocolo'],
    examPatterns: ['Cliente confunde blockchain com criptoativo específico', 'Protocolo DeFi promete retorno elevado', 'Stablecoin perde paridade ou envolve reserva de qualidade duvidosa'],
    traps: ['Descentralizado não significa sem risco', 'Stablecoin não é garantia absoluta de estabilidade', 'Tecnologia não elimina risco de mercado ou de código'],
  },
  'open-finance': {
    mustMaster: ['Consentimento, finalidade e compartilhamento de dados', 'APIs, autenticação e segurança', 'Open Investment/Open Insurance e ecossistema', 'Portabilidade, competição e comparação de ofertas'],
    examPatterns: ['Cliente autoriza compartilhamento e depois quer revogar', 'Terceiro pede senha fora do fluxo oficial', 'Oferta de crédito nova com parcela menor mas prazo maior'],
    traps: ['Open Finance não torna dados automaticamente públicos', 'Compartilhamento não dispensa consentimento', 'Mais dados não garantem automaticamente melhor oferta'],
  },
  'tecnologia': {
    mustMaster: ['Fintechs e modelos de atuação', 'Inteligência artificial no mercado financeiro', 'Automação, vieses, explicabilidade e governança', 'Novos meios de pagamento, inovação e proteção de dados'],
    examPatterns: ['Modelo de IA gera decisão inadequada ou enviesada', 'Fintech presta serviço mas não possui a licença que o cliente presume', 'Pagamento digital aumenta velocidade e exige controles de fraude'],
    traps: ['Fintech não é uma única categoria regulatória', 'IA não elimina responsabilidade institucional', 'Inovação tecnológica não suspende regras de conduta e segurança'],
  },
}
