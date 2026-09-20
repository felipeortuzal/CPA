# CPA V21 — Relatório de fechamento

Data-base: **20/09/2026**

## Objetivo

Fechar a plataforma como uma base de estudos completa para a CPA antes de qualquer expansão para outra certificação.

## Conteúdo

- Programa Detalhado CPA v1.2 preservado.
- 590 nós curriculares.
- 445 PDs terminais.
- **445 aulas completas**.
- **1.780 flashcards** derivados das aulas.
- 3 perguntas de mini quiz por aula.
- Fontes oficiais por aula.
- Tema 1: 105 aulas.
- Tema 2: 167 aulas.
- Tema 3: 110 aulas.
- Tema 4: 63 aulas.

## Banco de questões

- 100 questões originais históricas preservadas.
- 445 novas questões autorais de cobertura.
- Total: **545 questões**.
- Pelo menos uma questão para cada PD terminal.
- Tipos: multiple choice, case e dialog tree.
- Validação de alternativas duplicadas, PD, fontes, gabarito e enunciados.

As questões novas não são cópias do Caderno de Questões da ANBIMA. Guia, caderno e questões interativas públicas servem apenas como referência de estilo e formato.

## Simulados

Mantidos:

- Modo Prova: 50 questões / 2h30 / corte 35.
- 10/20/15/5 por Tema 1/2/3/4.
- Simulado 10.
- Simulado 20.
- Tema.
- Fraquezas.
- Inéditas.
- Histórico e resultado detalhado.

## Study Engine

Agora pode usar aulas e questões em todos os PDs terminais, mantendo:

- domínio;
- confiança;
- suficiência de amostra;
- falsa confiança;
- pontos fracos;
- Prontidão CPA;
- recomendações;
- revisão espaçada;
- plano adaptativo.

## V20 — Estatísticas

Implementado:

- acerto acumulado e recente;
- tempo ativo;
- desempenho por tema;
- desempenho por dificuldade;
- evolução de simulados;
- heatmap por PD;
- erros recorrentes;
- associação descritiva entre tempo e prática.

Nenhuma métrica é enviada a servidor.

## V21 — Estudo Ativo

Implementado:

- treino intercalado;
- treino de fraquezas;
- recuperação ativa;
- revisão de véspera;
- repetição espaçada;
- glossário e fórmulas pesquisáveis;
- links diretos às aulas.

## Arquitetura

Mantida arquitetura local-first:

- GitHub guarda conteúdo.
- IndexedDB guarda progresso.
- Sem login.
- Sem backend obrigatório.
- Sem API paga.
- DB_VERSION permanece 2.
- Backup v2 continua compatível com v1.
- Atualização de código não apaga progresso.

## Critério de conclusão

A V21 só pode ser considerada concluída quando o commit final passar:

- validate:curriculum;
- validate:lessons;
- validate:questions;
- validate:sources;
- validate:experience;
- audit:v13;
- validate:v21;
- testes;
- lint;
- typecheck;
- build.

O estado final no `main` precisa repetir a mesma suíte com sucesso.
