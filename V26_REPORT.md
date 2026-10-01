# V26 — Relatório de Aceitação

Data: 2026-10-01
Branch: `v26-apostila-digital`

## Escopo entregue

- 20 módulos da trilha principal.
- 445 PDs terminais rastreáveis.
- 445 lições correspondentes aos PDs terminais.
- Modo Apostila contínuo, com índice, impressão/PDF, fontes e data de verificação por tópico.
- Trilha principal separada do acervo de aprofundamento integral.
- Teoria, exemplos, comparações, fórmulas, confusões frequentes, resumos e checkpoints.
- Banco total preservado: 745 itens, sendo 300 questões autorais revisadas.
- Questões revisadas mantidas como `authored`; nenhuma foi promovida artificialmente a `verified`.
- Recalibração de dificuldade, nível cognitivo e tipo sem alteração de texto/gabarito.
- Diálogos objetivos tratados como casos; `dialog_tree` reservado para ramificação real.
- Simulados de módulo com seleção orientada por diversidade conceitual.
- Sessões diárias com durações rápidas e timer separado de revisão.
- Checklist transparente de domínio e persistência local/offline.
- Versão do pacote: `0.26.0`.

## Validação final

O CI final da V26 concluiu com sucesso todos os passos de qualidade, incluindo validação curricular, lições, questões, fontes oficiais, experiência, auditorias V13/V21, testes unitários, lint, typecheck, build, browser smoke test e smoke test cross-browser em Chromium, Firefox e WebKit.

A suíte cross-browser foi mantida como teste de compatibilidade de interface/rotas. O fluxo completo de persistência e sessão continua coberto pelo browser smoke test principal, evitando falsos negativos por particularidades do motor WebKit.

## Métricas

| Indicador | Resultado |
|---|---:|
| Módulos | 20 |
| PDs terminais | 445 |
| Lições | 445 |
| Questões totais preservadas | 745 |
| Questões autorais revisadas | 300 |
| Questões marcadas como verificadas | 0 |
| Palavras da trilha principal | >70.000 |
| Palavras do acervo integral | >300.000 |
| Checkpoints | >=1.335 |
| Comparações | >=445 |

## Política editorial

O conteúdo da V26 é autoral e ancorado em fontes oficiais. Materiais externos protegidos não são reproduzidos. A plataforma é material de estudo independente e não representa prova oficial ou homologação da ANBIMA.

## Status

**V26 pronta para merge/publicação.**
