Você está trabalhando no repositório GitHub chamado "CPA".

OBJETIVO

Construir uma plataforma web completa de estudos para certificações financeiras brasileiras, começando pela NOVA CPA da ANBIMA vigente em 2026.

A plataforma será usada inicialmente por duas pessoas, Felipe e Thó, mas sua arquitetura deve permitir adicionar futuramente:

- CPA
- C-Pro R
- C-Pro I
- CFG
- CGA
- CGE
- outras certificações

IMPORTANTE:
NÃO estamos estudando para a antiga CPA-10 ou CPA-20.

Estamos estudando para a nova:

CPA — Certificado Profissional ANBIMA

que entrou em vigor em 2026.

==================================================
REGRA Nº 1 — CONTEÚDO SEMPRE ATUALIZADO
==================================================

Nunca invente conteúdo regulatório.

Antes de implementar ou alterar conteúdos de estudo, consulte fontes oficiais atualizadas.

Ordem de prioridade:

1. ANBIMA / ANBIMA Edu
2. CVM
3. Banco Central do Brasil
4. Tesouro Nacional / Tesouro Direto
5. Receita Federal
6. B3
7. SUSEP / PREVIC / demais órgãos oficiais quando pertinentes

O Programa Detalhado da CPA da ANBIMA deve ser a fonte de verdade sobre o conteúdo cobrado.

Cada conteúdo da plataforma deverá possuir metadata:

- certification
- programVersion
- pdCode
- topic
- subtopic
- officialSource
- sourceUrl
- sourceDate
- lastVerified
- contentVersion

Nunca copie apostilas comerciais.

Produza explicações originais baseadas nas fontes oficiais.

==================================================
ESTRUTURA ATUAL DA NOVA CPA
==================================================

Utilizar como referência o Programa Detalhado oficial vigente.

Macrotemas:

1. Estrutura e dinâmica do Sistema Financeiro Nacional
Peso aproximado da prova: 20%

2. Produtos do mercado financeiro
Peso aproximado: 40%

3. Relacionamento com o cliente
(prospecção, atendimento e suporte)
Peso aproximado: 30%

4. Inovação e desenvolvimento de mercado
Peso aproximado: 10%

Preservar também os códigos do Programa Detalhado:
1
1.1
1.1.1
...
2.1
...
etc.

Isso permitirá rastrear exatamente quais assuntos cada aluno domina.

==================================================
FORMATO DA PROVA
==================================================

Configuração da CPA vigente:

- 50 questões
- 2h30
- aprovação: 35 acertos
- aproximadamente 70%
- questões contextualizadas
- múltipla escolha
- cases
- árvores de diálogo / decisão quando aplicável

O simulador deverá reproduzir essa experiência.

==================================================
STACK
==================================================

Priorizar serviços gratuitos.

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS

Backend:
- Supabase Free Tier

Supabase:
- Authentication
- PostgreSQL
- progresso
- resultados
- flashcards
- respostas
- simulados

Deploy:
- Cloudflare Pages

Código:
- GitHub

Não criar qualquer dependência obrigatória de API paga.

==================================================
DESIGN
==================================================

Criar interface premium de plataforma educacional financeira.

Referências conceituais:
- Bloomberg
- Linear
- Duolingo
- Khan Academy
- ANBIMA

Não copiar nenhuma interface.

Estilo:

- clean
- financeiro
- moderno
- profissional
- responsivo
- dark/light mode
- excelente UX mobile e desktop

Evitar aparência de template genérico.

==================================================
ESTRUTURA PRINCIPAL
==================================================

Sidebar:

Dashboard
Trilha de Estudos
Conteúdos
Questões
Simulados
Revisão
Flashcards
Caderno de Erros
Estatísticas
Fontes
Configurações

Topo:

Certificação:
[ CPA ▼ ]

Arquitetura deve permitir trocar futuramente para:
C-Pro R
C-Pro I
etc.

==================================================
DASHBOARD
==================================================

Mostrar:

- nome do aluno
- certificação atual
- progresso geral
- percentual do edital dominado
- questões respondidas
- taxa de acerto
- sequência de estudos
- tempo estudado
- desempenho por macrotema
- previsão de aprovação
- últimos estudos
- recomendação "Continue daqui"
- assuntos fracos
- simulados recentes

Criar indicador:

"Pronto para a prova"

calculado a partir de:

- cobertura do programa
- desempenho recente
- desempenho por macrotema
- simulados completos
- consistência

Não apresentar isso como garantia de aprovação.

==================================================
TRILHA
==================================================

Representar TODO o Programa Detalhado.

Exemplo:

1. Sistema Financeiro Nacional
  1.1 Sistema Financeiro Nacional
  1.2 Política econômica
  1.3 Operações do mercado financeiro
  1.4 Regulação e infraestrutura

Cada item pode estar:

○ Não iniciado
◔ Em andamento
● Concluído
★ Dominado

Cada microtema deve abrir uma aula.

==================================================
AULA
==================================================

Cada aula deverá conter:

1. Explicação simples
2. Explicação completa
3. Conceitos importantes
4. "O que você precisa saber para a prova"
5. Exemplos reais
6. Fórmulas quando aplicável
7. Pegadinhas comuns
8. Comparações
9. Flashcards
10. Mini quiz
11. Fontes oficiais
12. Data da última verificação

Adicionar botão:

"Marcar como estudado"

e

"Treinar este assunto"

==================================================
QUESTÕES
==================================================

Criar banco de questões original.

Cada questão possui:

id
certification
pdCode
macroTopic
topic
difficulty
cognitiveLevel
questionType
context
question
options
correctAnswer
explanation
whyOthersAreWrong
officialSources
createdAt
verifiedAt

difficulty:
easy
medium
hard

cognitiveLevel:
knowledge
comprehension
application
analysis

questionType:
multiple_choice
case
dialog_tree

Nunca usar questões vazadas ou obtidas ilegalmente da prova.

Questões oficiais publicadas pela própria ANBIMA podem ser tratadas
separadamente como "Questões oficiais de referência", respeitando
direitos autorais e preferencialmente apontando a fonte.

==================================================
MODO QUESTÕES
==================================================

Permitir:

- questões aleatórias
- por tema
- por subtema
- por dificuldade
- somente erradas
- somente marcadas
- questões não vistas
- revisão inteligente

Depois da resposta:

CORRETO ou INCORRETO

mostrar:

- resposta correta
- explicação
- por que cada alternativa está errada
- assunto do Programa Detalhado
- link para revisar aula

==================================================
SIMULADOS
==================================================

Criar:

Simulado CPA Completo

- 50 questões
- 2h30
- distribuição aproximada:
  20% Tema 1
  40% Tema 2
  30% Tema 3
  10% Tema 4

Resultado:

Pontuação
XX / 50

Status:
APROVADO / REPROVADO

Corte:
35/50

Mostrar desempenho detalhado por tema.

Criar também:

Simulado rápido 10 questões
Simulado 20 questões
Simulado por tema
Simulado somente assuntos fracos
Simulado personalizado

Durante o simulado:

- timer
- navegação 1–50
- marcar para revisão
- bloco de notas
- calculadora
- finalizar prova

Não mostrar respostas antes da finalização no modo prova.

==================================================
CADERNO DE ERROS
==================================================

Toda questão errada entra automaticamente.

Mostrar:

- questão
- erro cometido
- resposta escolhida
- resposta correta
- explicação
- tema
- número de vezes errada

Permitir:

"Já aprendi"

e repetir depois.

==================================================
FLASHCARDS
==================================================

Criar sistema de repetição espaçada.

Estados:

Again
Hard
Good
Easy

Registrar:

lastReviewed
nextReview
interval
ease

Criar flashcards automaticamente associados aos conteúdos,
mas armazenados estaticamente no projeto inicialmente.

==================================================
REVISÃO
==================================================

Criar:

Revisão de hoje

baseada em:

- questões erradas
- conteúdos esquecidos
- flashcards vencidos
- temas com baixo desempenho

Criar também:

Modo véspera da prova

com:

- conceitos essenciais
- fórmulas
- diferenças importantes
- pegadinhas
- pontos de alta incidência

==================================================
ANALYTICS
==================================================

Mostrar:

- acerto total
- acerto por tema
- acerto por PD
- desempenho por dificuldade
- evolução semanal
- simulados
- tempo estudado
- assuntos mais fracos
- assuntos dominados

Cada usuário possui seus próprios dados.

==================================================
FELIPE E THÓ
==================================================

Usuários separados.

Cada um deve possuir:

- conta
- progresso
- simulados
- erros
- flashcards
- estatísticas

Criar opcionalmente painel:

"Felipe x Thó"

apenas com informações leves:

- progresso
- questões realizadas
- taxa de acerto
- sequência de estudos

Sem misturar os dados individuais.

==================================================
PWA
==================================================

Transformar o site em Progressive Web App.

Permitir:

- instalar no celular
- carregar rapidamente
- estudar conteúdos offline quando possível
- sincronizar progresso quando conexão voltar

==================================================
QUALIDADE
==================================================

Usar:

- TypeScript strict
- componentes reutilizáveis
- boas práticas de segurança
- validação de dados
- RLS do Supabase
- tratamento de erros
- loading states
- empty states
- responsividade

Nunca expor SERVICE_ROLE_KEY.

Somente variáveis públicas necessárias no frontend.

==================================================
ARQUITETURA FUTURA
==================================================

Não hardcodar CPA na aplicação inteira.

Criar abstraction:

Certification

permitindo posteriormente:

CPA
C-Pro R
C-Pro I
CFG
CGA
CGE

Conteúdos e questões devem indicar a certificação.

==================================================
REGRA DE EXECUÇÃO
==================================================

Antes de alterar código:

1. leia o repositório inteiro relevante;
2. entenda a arquitetura atual;
3. preserve funcionalidades existentes;
4. implemente a alteração;
5. rode build;
6. rode testes;
7. corrija erros;
8. documente o que mudou.

Não deixe TODOs quando puder concluir a implementação.
