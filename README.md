# CPA Study — Nova CPA ANBIMA 2026

Plataforma local e gratuita de estudos para a **CPA — Certificado Profissional ANBIMA** do novo modelo vigente em 2026. Não é material da antiga CPA-10 ou CPA-20.

## Arquitetura atual

- React + TypeScript + Vite + Tailwind CSS
- IndexedDB via `idb` para progresso pessoal
- conteúdo, currículo e banco base de questões versionados no GitHub
- PWA para facilitar uso offline depois que os arquivos da aplicação foram carregados
- sem login, sem cadastro, sem Supabase/Firebase e sem servidor obrigatório
- custo operacional obrigatório: **R$ 0**

Princípio:

- **GitHub = conteúdo da plataforma**
- **IndexedDB do navegador = progresso, tentativas, favoritos e erros do aluno**

Felipe e Thó usam o mesmo código, mas cada computador/navegador possui progresso próprio.

## Como rodar

Primeira instalação:

```bash
git clone https://github.com/felipeortuzal/CPA.git
cd CPA
npm install
npm run dev
```

Nas próximas vezes, `npm run dev`. No Windows também existe `start-cpa.bat`.

Para atualizar:

```bash
git pull
npm install
npm run dev
```

O `git pull` altera os arquivos do projeto, não o IndexedDB do navegador.

## Backup

Em **Configurações > Dados e Backup**:

- Exportar progresso para `cpa-backup-YYYY-MM-DD.json`.
- Importar progresso com validação e confirmação.
- Apagar todo o progresso com confirmação forte.

A versão atual do backup é v2 e inclui tentativas de questões. Backups v1 continuam importáveis.

## Programa oficial

O currículo versionado utiliza o **Programa Detalhado CPA da ANBIMA, versão 1.2**, revisão de **04/06/2025**, vigente desde **01/01/2026**. Antes de alterar conteúdo regulatório ou questões, a versão oficial mais recente deve ser verificada novamente.

A estrutura completa do PD está em `content/cpa/`. São 590 nós curriculares, preservando os PD Codes oficiais.

## Sistema de aulas

O Macrotema 1 possui 105 aulas terminais completas em `content/cpa/lessons/`, com explicações, conceitos, foco de prova, exemplos, comparações, fórmulas, pegadinhas, revisão, flashcards, mini quiz e fontes oficiais.

Status local: Não iniciado → Em andamento → Estudado → Dominado. Domínio exige aula estudada e melhor mini quiz >= 75%.

## Question Engine

O banco inicial contém **100 questões originais** em `content/cpa/questions/`.

Distribuição:

- Tema 1: 20
- Tema 2: 40
- Tema 3: 30
- Tema 4: 10
- dificuldade: 30 fáceis, 45 médias, 25 difíceis
- nível cognitivo: 30 compreensão, 45 aplicação, 25 análise
- tipo: 70 `multiple_choice`, 20 `case`, 10 `dialog_tree`

Cada questão possui certificação, PD Code, tema, subtema, dificuldade, nível cognitivo, tipo, contexto, comando, quatro alternativas, uma resposta correta, explicação, explicação das incorretas, fontes oficiais e data de verificação.

Antes da elaboração foram estudados o Guia de Elaboração de Questões da ANBIMA, o Caderno de Questões CPA oficial e os modelos interativos divulgados pela ANBIMA. Materiais públicos de preparação foram observados apenas para calibrar extensão e dificuldade. Não são copiadas questões privadas, vazadas ou de terceiros.

A página **Questões** permite filtrar por tema, subtema, dificuldade, tipo, não respondidas, erradas e favoritas. Após responder, mostra feedback completo, PD e acesso ao conteúdo relacionado.

Respostas incorretas entram automaticamente no **Caderno de Erros**, que registra recorrência e permite refazer a questão ou marcar `Já aprendi`.

## Persistência local

A camada fica em `src/lib/storage/`. O schema atual é `DB_VERSION = 2`.

- v1: perfil, aulas, quizzes, favoritos, flashcards, erros, simulados, sessões, streak, preferências etc.
- v2: migration aditiva cria `questionAttempts` com índices por questão, PD e data.

Nunca apagar o banco como estratégia de migration.

## Tempo e streak

O timer de aula só soma tempo quando a aba está visível e houve interação recente. Um dia conta para o streak quando ocorre atividade significativa, incluindo conclusão de aula, mini quiz ou resposta de questão.

## Comandos de qualidade

```bash
npm run validate:curriculum
npm run validate:questions
npm test
npm run typecheck
npm run build
```

Ou:

```bash
npm run validate
```

A validação de questões exige 100 itens, distribuição 20/40/30/10, PD Code existente, quatro alternativas únicas, uma resposta correta válida e pelo menos uma fonte oficial por questão.

## Próximas etapas

Ainda não fazem parte desta versão: simulado completo de 50 questões, revisão inteligente completa, repetição espaçada dos flashcards, analytics avançado, ranking Felipe x Thó e demais certificações. O Question Engine e o storage v2 já servem de base para essas etapas.
