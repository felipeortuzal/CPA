import { createCurriculumModule } from './schema'

const raw = `
3|Relacionamento com o cliente (prospecção, atendimento e suporte)
3.1|Finanças pessoais.
3.1.1|Faixa etária versus exposição ao risco versus produtos orientados ao perfil da pessoa investidora.
3.1.2|Ciclo de vida da pessoa investidora.
3.1.2.1|Acumulação de capital.
3.1.2.2|Crescimento patrimonial.
3.1.2.3|Preservação de capital.
3.1.2.4|Distribuição de renda.
3.1.3|Orçamento e fluxo de caixa pessoal ou familiar.
3.1.3.1|Educação financeira básica.
3.1.3.2|Receitas e despesas pessoais ou familiares (definição da capacidade de poupança).
3.1.3.3|Gestão de dívidas e crédito.
3.1.3.3.1|Avaliação da melhor dívida em função da necessidade atual do cliente.
3.1.3.3.2|Empréstimo e financiamento.
3.1.3.3.3|Modalidades de operações de crédito, crédito direto ao consumidor, crédito pessoal e consignado.
3.1.3.3.4|Garantias.
3.1.3.3.5|Controle de gastos e orçamento.
3.1.3.3.6|Financiamento imobiliário e de veículos.
3.1.3.3.7|Cartão de crédito e gerenciamento de dívidas.
3.1.3.3.8|Empréstimo com garantia e crédito rotativo.
3.1.3.3.9|Cheque especial e financiamento estudantil.
3.1.3.3.10|Microcrédito e crédito rural.
3.1.3.3.11|Crédito para reforma e construção.
3.1.3.3.12|Crédito para energia sustentável.
3.1.3.4|Reserva de emergência.
3.1.3.4.1|Montante necessário.
3.1.3.4.2|Ativos de alta liquidez.
3.1.4|Balanço patrimonial pessoal ou familiar.
3.1.4.1|Indicadores: liquidez, cobertura de despesas mensais e endividamento.
3.1.4.2|Ativos de uso e não uso.
3.1.4.3|Patrimônio líquido pessoal.
3.1.5|Planejamento familiar ou pessoal.
3.1.5.1|Etapas do processo do planejamento financeiro pessoal (objetivos financeiros da clientela, avaliação da situação financeira atual, desenvolvimento do plano de ação, implementação do plano, monitoramento e revisão regular).
3.1.5.2|Definição do momento de vida e financeiro da clientela.
3.1.5.3|Estabelecimento de metas financeiras.
3.1.5.4|Planejamento de investimentos.
3.1.5.5|Planejamento de fundo educacional para descendentes.
3.1.5.6|Planejamento para aposentadoria (cálculo para independência financeira).
3.1.6|Tributação – Conceitos básicos sobre tributação de pessoas físicas.
3.1.6.1|Declaração de imposto de renda da pessoa física (conhecimento básico sobre o que deve ser declarado).
3.1.6.2|Classificação de rendimentos (visão básica para compreensão dos impactos dos rendimentos dos investimentos na declaração).
3.1.6.3|Modelo completo x desconto simplificado (visão básica para compreensão das diferenças entre os modelos).
3.2|Orientações financeiras para o cliente.
3.2.1|Tipos de investimento versus tolerância a risco e horizonte de investimento.
3.2.2|Gestão financeira.
3.2.2.1|Financiamento de emergências (estratégias e produtos).
3.2.2.2|Utilização de crédito e gestão de dívidas.
3.2.3|Gestão de investimentos.
3.2.4|Gestão de risco e seguros.
3.3|Classificação das pessoas investidoras.
3.3.1|Perfis da pessoa investidora.
3.3.2|Adequação de produtos financeiros.
3.3.3|Avaliação de risco e retorno.
3.3.4|Diversificação de carteira.
3.3.5|Pessoa investidora profissional e qualificada.
3.4|Regras e condutas aplicáveis para atuação profissional e no relacionamento com o cliente.
3.4.1|Código de conduta ética para pessoas candidatas e profissionais com certificação Anbima.
3.4.1.1|Os nove princípios éticos.
3.4.1.2|Regras gerais de conduta para pessoas candidatas.
3.4.1.3|Regras gerais de conduta para profissionais com certificação.
3.4.1.4|Deveres profissionais.
3.4.2|Suitability e código de distribuição da Anbima.
3.4.2.1|Objetivos do código Anbima.
3.4.2.2|Documentação e registro de Informações da clientela.
3.4.2.3|Ferramentas e metodologias de avaliação de suitability.
3.4.2.4|Adequação dos produtos ao perfil da clientela.
3.4.2.5|Adequação dos produtos ao objetivo da clientela.
3.4.2.6|Monitoramento contínuo da suitability.
3.4.2.7|Comunicação clara e transparente com a clientela.
3.4.2.8|Gestão de conflitos de interesses.
3.4.3|Ética profissional e atendimento ao cliente.
3.4.3.1|Técnicas de atendimento.
3.4.3.1.1|Escuta ativa.
3.4.3.1.2|Personalização do atendimento.
3.4.3.1.3|Solução proativa de problemas.
3.4.3.1.4|Educação continuada e conhecimento dos produtos e serviços.
3.4.3.1.5|Gerenciamento de expectativas.
3.4.3.2|Ética e responsabilidade no atendimento.
3.4.3.3|Conflitos de interesses.
3.4.3.3.1|Relações pessoais e familiares.
3.4.3.3.2|Benefícios e incentivos.
3.4.3.3.3|Medidas de gestão de conflitos de interesse.
3.4.3.3.3.1|Políticas e procedimentos claros.
3.4.3.3.3.1.1|Treinamento e educação.
3.4.3.3.3.1.2|Divulgação obrigatória.
3.4.3.3.3.1.3|Segregação de funções.
3.4.3.3.3.1.4|Revisão e monitoramento contínuos.
3.4.3.3.3.1.5|Comitês de ética e compliance.
3.4.3.3.3.1.6|Proibição de atividades específicas.
3.4.3.3.3.1.7|Relatórios de transparência.
3.4.4|Riscos associados à atividade profissional.
3.4.4.1|Riscos operacionais.
3.4.4.2|Riscos regulatórios.
3.4.4.3|Riscos legais.
3.4.4.4|Riscos de imagem.
3.4.5|Prevenção e Combate à Lavagem de Dinheiro e Combate ao Terrorismo (PLDFT) e fraudes eletrônicas.
3.4.5.1|Legislação e regulamentação aplicável (crime e infração administrativa).
3.4.5.2|Responsabilidades administrativa e legal (entidades e pessoas físicas sujeitas à lei e a regulamentação).
3.4.5.3|Modelo de abordagem baseada em risco.
3.4.5.3.1|Avaliação interna de risco.
3.4.5.3.2|Política direcionada às características e riscos relevantes da instituição.
3.4.5.3.3|Controle de efetividade das políticas e procedimentos.
3.4.5.4|Princípio do “conheça seu cliente” (KYC).
3.4.5.4.1|Função do cadastro e implicações de um cadastro desatualizado e análise da capacidade financeira da clientela.
3.4.5.4.2|O princípio “conheça seu cliente” como forma de proteção da instituição financeira e do profissional.
3.4.6|Lei Geral de Proteção de Dados (LGPD).
3.4.6.1|Normativas (lei n° 13.709/2018).
3.4.6.2|Conceito.
3.4.6.3|Aplicabilidade.
3.4.6.4|Confidencialidade de dados no mundo digital e internet.
3.4.6.5|Sigilo Bancário (lei complementar nº 105, de 10 de janeiro de 2001).
3.4.6.6|Registro de operações.
3.4.6.7|Operações suspeitas.
3.4.6.8|Caracterização.
3.4.6.9|Obrigatoriedade de comunicação e controle (instituições, empresas e autoridades competentes).
3.4.6.10|Indisponibilidade de bens, direitos e valores em decorrência de resoluções do conselho de segurança das nações unidas.
3.4.6.11|Princípio do “conheça sua parceria”.
3.4.7|Dos crimes e dos ilícitos contra o mercado de capitais.
3.4.7.1|Crimes contra o mercado de capitais (capítulo VII-B da lei 6.385/76).
3.4.7.1.1|Manipulação do mercado (art. 27-C).
3.4.7.1.2|Uso indevido de informação privilegiada (art. 27-D).
3.4.7.1.2.1|Insider trading primário.
3.4.7.1.2.2|Insider trading secundário.
3.4.7.1.2.3|Repasse de informação privilegiada.
3.4.7.1.3|Exercício irregular de cargo, profissão, atividade ou função regulada (art. 27-E).
3.4.7.1.4|Omissão imprópria (art. 13, § 2º do Código Penal).
3.4.7.2|Ilícitos de mercado (resolução CVM nº 62).
3.4.7.2.1|Conceito de tipologia aberta e suas implicações para os profissionais.
3.4.7.2.2|Os ilícitos de mercado.
3.4.7.2.2.1|Criação de condições artificiais.
3.4.7.2.2.1.1|Conceito.
3.4.7.2.2.1.2|Money pass.
3.4.7.2.2.2|Manipulação de preços.
3.4.7.2.2.2.1|Conceito.
3.4.7.2.2.2.2|Spoofing.
3.4.7.2.2.2.3|Layering.
3.4.7.2.2.2.4|Manipulação de benchmark.
3.4.7.2.2.3|Operações fraudulentas.
3.4.7.2.2.3.1|Conceito.
3.4.7.2.2.3.2|Churning.
3.4.7.2.2.4|Práticas não equitativas.
3.4.7.2.2.4.1|Conceito.
3.4.7.2.2.4.2|Insider trading.
3.4.7.2.2.4.3|Front running.
`

export const module3 = createCurriculumModule(raw, 30)
