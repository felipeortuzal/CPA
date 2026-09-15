# PROJECT_SPEC.md

Você está trabalhando no repositório GitHub `CPA`.

## Objetivo

Construir uma plataforma completa de estudos para certificações financeiras brasileiras, começando pela **NOVA CPA — Certificado Profissional ANBIMA**, vigente no novo modelo a partir de 2026.

Não usar conteúdo da antiga CPA-10 ou CPA-20.

A arquitetura deve permitir futuramente CPA, C-Pro R, C-Pro I, CFG, CGA, CGE e outras certificações, sem misturar conteúdos ou progressos.

## Regra nº 1 — conteúdo sempre atualizado

Nunca invente conteúdo regulatório.

Antes de implementar ou alterar conteúdo de estudo, consultar fontes oficiais atualizadas nesta prioridade:

1. ANBIMA / ANBIMA Edu
2. CVM
3. Banco Central do Brasil
4. Tesouro Nacional / Tesouro Direto
5. Receita Federal
6. B3
7. SUSEP / PREVIC / demais órgãos oficiais quando pertinentes

O Programa Detalhado da CPA da ANBIMA é a fonte de verdade sobre o conteúdo cobrado. Se existir versão mais nova, ela prevalece.

Cada conteúdo regulatório deve manter metadata quando aplicável:

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

Nunca copiar apostilas comerciais. Produzir explicações originais baseadas em fontes oficiais.

## Programa atual versionado

Programa Detalhado CPA ANBIMA atualmente versionado no projeto:

- versão: 1.2
- revisão: 04/06/2025
- vigência: 01/01/2026

Antes de qualquer nova produção de conteúdo, verificar novamente a ANBIMA.

Macrotemas oficiais:

1. Estrutura e dinâmica do Sistema Financeiro Nacional — 20%
2. Produtos do mercado financeiro — 40%
3. Relacionamento com o cliente — 30%
4. Inovação e desenvolvimento de mercado — 10%

Preservar todos os PD Codes do Programa Detalhado.

## Arquitetura atual — local-first e custo R$ 0

Esta seção substitui qualquer arquitetura antiga baseada em Supabase, Firebase, login ou backend remoto.

A plataforma é inicialmente **100% local**.

Felipe e Thó usam o mesmo código em computadores/navegadores separados. Cada instalação mantém seu próprio progresso local.

Não exigir:

- Supabase
- Firebase
- autenticação
- login/cadastro
- servidor próprio
- API paga
- `.env` para estudar

Stack:

- React
- TypeScript strict
- Vite
- Tailwind CSS
- React Router
- IndexedDB via biblioteca `idb`
- PWA
- GitHub para versionamento do código e conteúdo

Princípio obrigatório:

- **GitHub = conteúdo da plataforma**
- **IndexedDB = progresso e dados pessoais do aluno**

O conteúdo oficial, aulas e banco base de questões não devem ser duplicados no IndexedDB.

## Persistência local

A camada de storage deve ficar centralizada em `src/lib/storage/` ou arquitetura equivalente. Não espalhar chamadas IndexedDB pela aplicação.

O banco local deve ser versionado por `DB_VERSION` e evoluir por migrations aditivas (`v1 → v2 → v3`). Nunca apagar o banco como estratégia de migration.

Persistir localmente, conforme forem implementados:

- perfil/nome
- aulas iniciadas/concluídas/dominadas
- progresso por PD
- favoritos
- mini quizzes e respostas
- erros
- questões marcadas
- flashcards e revisões
- simulados
- tempo estudado
- streak
- estatísticas
- preferências
- plano de estudos

Atualizações via `git pull` não podem apagar o IndexedDB do navegador.

## Identidade local

Na primeira abertura perguntar apenas:

> Bem-vindo ao CPA
> Como podemos te chamar?

Salvar o nome localmente. Isso não é autenticação.

Nas próximas visitas entrar direto no Dashboard e mostrar discretamente `Olá, <nome>`.

Configurações deve permitir alterar o nome.

## Backup obrigatório

Configurações > Dados e Backup deve oferecer:

- Exportar progresso para `cpa-backup-YYYY-MM-DD.json`
- Importar progresso com validação de estrutura e versão e confirmação explícita
- Apagar todo o progresso com confirmação forte

Nunca substituir ou apagar dados silenciosamente.

## Funcionamento offline

Depois que dependências e assets da aplicação estiverem instalados/carregados, estudar deve funcionar sem internet obrigatória para:

- abrir aulas
- marcar progresso
- responder mini quiz
- favoritos
- flashcards
- dashboard
- trilha

Links de fontes oficiais podem abrir páginas externas, mas o conteúdo local não pode depender dessas chamadas em tempo de uso.

## Design

Interface premium de educação financeira, limpa, moderna, profissional, responsiva e desktop-first com boa experiência mobile.

Manter dark/light mode. Evitar aparência infantil ou template genérico.

## Estrutura principal

Sidebar:

- Dashboard
- Trilha de Estudos
- Conteúdos
- Questões
- Simulados
- Revisão
- Flashcards
- Caderno de Erros
- Estatísticas
- Fontes
- Configurações

Topo com seletor de certificação, preparado para expansão futura.

## Dashboard

Usar apenas dados locais reais. Não inventar números.

Mostrar conforme houver dados:

- nome
- certificação
- progresso geral
- aulas estudadas
- progresso por macrotema
- mini quizzes realizados
- taxa de acerto
- tempo estudado
- streak
- última atividade
- continuar estudando
- simulados e assuntos fracos quando existirem dados suficientes

Estados sem histórico devem aparecer como vazios, não como mocks.

## Trilha

Representar todo o Programa Detalhado e preservar hierarquia PD.

Estados:

- Não iniciado
- Em andamento
- Estudado
- Dominado

Nós-pai agregam dinamicamente o status dos itens estudáveis abaixo deles.

## Sistema de aulas

Cada aula completa deve conter:

1. Em uma frase
2. Explicação para iniciante
3. Explicação completa
4. Conceitos essenciais
5. Como pode aparecer na prova
6. Exemplo prático
7. Comparações importantes
8. Fórmulas quando aplicável
9. Pegadinhas
10. Resumo para revisão
11. Flashcards
12. Mini quiz
13. Fontes oficiais

Sempre apresentar nome completo antes da primeira ocorrência relevante de uma sigla.

Recursos:

- Marcar como estudado
- Tenho dúvida
- Favoritar
- Treinar este assunto
- Aula anterior / próxima aula
- índice lateral
- busca por título, palavra, conceito, sigla e PD Code

Enquanto o Question Engine não existir, `Treinar este assunto` deve ficar desabilitado com mensagem `Banco de questões em construção`.

Conteúdo regulatório deve exibir `Verificado em: DD/MM/YYYY` e fonte.

Critério atual de status:

- abrir pela primeira vez → Em andamento
- marcar como estudada → Estudado
- Estudado + melhor mini quiz >= 75% → Dominado

## Conteúdo atual desta fase

O mecanismo de aulas está implementado somente para o Macrotema 1.

Macrotemas 2, 3 e 4 continuam no currículo/trilha, mas não devem receber aulas completas até solicitação futura.

## Busca

A busca deve localizar aulas por:

- título
- palavra/conceito
- sigla
- PD Code

## Tempo e streak

Não contar indefinidamente tempo de aba aberta.

Usar visibility API, atividade recente e sessões de estudo.

Dia de streak só conta por atividade significativa, como concluir aula, responder mini quiz, revisar flashcard ou responder questões no futuro. Abrir o site sozinho não conta.

## Questões — fase futura

Criar banco original, nunca usar questões vazadas. Cada questão deve rastrear certification, pdCode, tema, dificuldade, nível cognitivo, tipo, opções, resposta correta, explicação e fontes oficiais.

## Simulados — fase futura

CPA completa: 50 questões, 2h30, corte 35/50 e distribuição aproximada pelos pesos vigentes. Também prever simulados rápidos, por tema, assuntos fracos e personalizado.

## Flashcards/revisão/caderno de erros — evolução futura

A arquitetura local já deve suportar dados desses recursos, mas não criar implementação falsa antes das etapas específicas.

## PWA

Permitir instalação e uso offline dos conteúdos já empacotados. Não exigir sincronização remota.

## Qualidade

Obrigatório:

- TypeScript strict
- componentes reutilizáveis
- validação de dados
- tratamento de erros
- loading/empty states
- responsividade
- testes de persistência local
- nenhum segredo ou chave obrigatória

Antes de concluir uma mudança relevante:

1. ler o repositório relevante;
2. preservar funcionalidades boas;
3. implementar sem duplicatas;
4. executar validação curricular;
5. executar testes;
6. executar typecheck;
7. executar build;
8. corrigir erros antes de atualizar `main`;
9. documentar mudanças e pendências reais.

Não deixar TODOs quando for possível concluir a implementação.
