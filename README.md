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
- **IndexedDB do navegador = progresso, tentativas, favoritos, simulados e erros do aluno**

Felipe e Thó usam o mesmo código, mas cada computador/navegador possui progresso próprio.

## Como rodar

```bash
git clone https://github.com/felipeortuzal/CPA.git
cd CPA
npm install
npm run dev
```

No Windows também existe `start-cpa.bat`. Para atualizar: `git pull`, `npm install` e `npm run dev`. O `git pull` não apaga o IndexedDB do navegador.

## Backup

Em **Configurações > Dados e Backup** é possível exportar `cpa-backup-YYYY-MM-DD.json`, importar com validação/confirmação e apagar o progresso com confirmação forte. A versão atual do backup é v2 e já inclui o store de simulados; backups v1 continuam importáveis.

## Programa e edital oficiais

Currículo versionado:

- Programa Detalhado CPA ANBIMA v1.2
- revisão 04/06/2025
- vigência 01/01/2026
- verificado novamente em 16/09/2026

Modo Prova:

- Edital dos Exames de Certificação Profissional ANBIMA v1.4, de 28/05/2026
- CPA: **50 questões**
- duração: **2h30**
- aprovação: **35 acertos**
- formatos previstos: múltipla escolha, árvore de diálogo e cases

A estrutura completa do PD possui 590 nós curriculares e preserva os PD Codes oficiais.

## Sistema de aulas

O Macrotema 1 possui 105 aulas terminais completas em `content/cpa/lessons/`, com explicações, conceitos, foco de prova, exemplos, comparações, fórmulas, pegadinhas, revisão, flashcards, mini quiz e fontes oficiais.

Status local: Não iniciado → Em andamento → Estudado → Dominado. Domínio exige aula estudada e melhor mini quiz >= 75%.

## Question Engine

O banco inicial contém **100 questões originais** em `content/cpa/questions/`:

- Tema 1: 20
- Tema 2: 40
- Tema 3: 30
- Tema 4: 10
- dificuldade: 30 fáceis, 45 médias, 25 difíceis
- nível cognitivo: 30 compreensão, 45 aplicação, 25 análise
- tipo: 70 `multiple_choice`, 20 `case`, 10 `dialog_tree`
- posição do gabarito: 25 A, 25 B, 25 C, 25 D

A página **Questões** filtra por tema, subtema, dificuldade, tipo, não respondidas, erradas e favoritas. Respostas incorretas entram automaticamente no **Caderno de Erros**.

## Modo Prova e simulados — v0.6

A página **Simulados** oferece:

- Modo Prova CPA — 50 questões, 2h30, corte 35/50
- Simulado 10
- Simulado 20
- Simulado por tema
- Simulado de assuntos fracos
- Simulado somente com questões inéditas

A prova completa usa exatamente 10/20/15/5 questões dos Temas 1/2/3/4, refletindo 20%/40%/30%/10%.

A interface de prova é separada da navegação normal e contém cronômetro, questão atual, mapa de navegação, respondida/não respondida, marcação para revisão, bloco de notas, calculadora e finalização. Durante a prova não mostra gabarito, correção, tema, dificuldade ou dica.

Ao finalizar são exibidos:

- acertos e percentual
- aprovado/reprovado apenas no modo oficial
- corte 35/50 no modo oficial
- desempenho por macrotema
- tempo utilizado
- questões erradas e em branco
- questões marcadas
- desempenho por dificuldade
- desempenho por PD

Erros respondidos incorretamente entram automaticamente no Caderno de Erros. Questões deixadas em branco não são tratadas como erro conceitual no caderno.

O histórico em **Simulados > Histórico** mostra gráfico de evolução, média, melhor resultado e acesso ao detalhamento de cada tentativa.

## Persistência local

A camada fica em `src/lib/storage/`. O schema continua em `DB_VERSION = 2` porque o store `simulations` já existia desde v1; esta versão apenas tipa e passa a usar essa estrutura existente.

- v1: perfil, aulas, quizzes, favoritos, flashcards, erros, simulados, sessões, streak, preferências etc.
- v2: adiciona `questionAttempts` com índices por questão, PD e data.

Nunca apagar o banco como estratégia de migration.

## Qualidade

```bash
npm run validate:curriculum
npm run validate:questions
npm test
npm run typecheck
npm run build
```

Ou execute tudo com `npm run validate`.

Os testes cobrem currículo, banco de questões, persistência local, geração dos simulados, composição oficial 10/20/15/5, corte 35, modos de treino e integração com Caderno de Erros.

## Próximas etapas

Ainda não fazem parte desta versão: revisão inteligente completa, repetição espaçada dos flashcards, analytics avançado, ranking Felipe x Thó, aulas completas dos Macrotemas 2–4 e demais certificações.
