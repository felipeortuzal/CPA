# CPA V23 — auditoria técnica e correções

Data: 25/09/2026. Base: V22 (`bb6e69d`). Versão: `0.23.0`.

## Correções

- **Aulas e mini quizzes:** navegar para outra aula reinicia o formulário e o estado da aula. Cliques repetidos não duplicam a tentativa; alternativas ficam bloqueadas durante a gravação. Falhas aparecem na interface e permitem tentar novamente.
- **Persistência:** conclusão, melhor nota e dúvida são atualizadas em transações. Quiz, progresso e atividade são gravados juntos. Perfil, favoritos, tempo ativo e resolução de erros também deixam de usar leitura/gravação em transações separadas.
- **Flashcards:** revisões concorrentes leem o agendamento dentro da transação; empates de horário usam o contador de revisões. Exclusão do cartão e de seu histórico é atômica. Cartões excluídos não recebem revisões órfãs. A avaliação tem trava contra cliques duplicados nas três telas de revisão.
- **Sessão de revisão:** conta itens distintos, bloqueia avanço manual durante gravações e usa a cópia histórica da questão quando disponível.
- **Backups:** valida datas opcionais, agendamentos de flashcards, contadores de erros, preferências, consistência das notas de quiz, vínculo entre tentativa e cópia da questão e configurações do plano. Continua aceitando os formatos 1 e 2 quando os registros são válidos. Importações inválidas não substituem o progresso.
- **Plano:** datas inválidas são rejeitadas na gravação/importação e normalizadas defensivamente no motor. O dia atual segue o calendário local. Datas muito distantes têm agenda limitada aos próximos 366 dias, com explicação na tela.
- **Navegação:** links de revisão no resultado do simulado e caderno de erros passam a considerar aulas dos quatro temas, não apenas o tema 1.
- **Recuperação:** falhas assíncronas de leitura nos painéis e telas principais abrem a tela de recuperação; falhas de gravação de quizzes, cartões e plano têm mensagem visível. Alterações do histórico não recarregam o perfil inteiro se ele continua igual.
- **Simulados e questões:** trava contra início duplicado; geração aguarda o histórico; filtros e alternativas não mudam durante a gravação da resposta.
- **Dependências:** Vitest 2.1.9 → 4.1.11. A auditoria npm passou de 5 alertas (dependência de desenvolvimento e transitivas) para 0 vulnerabilidades conhecidas. Referências: [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9) e [GHSA-5xrq-8626-4rwp](https://github.com/advisories/GHSA-5xrq-8626-4rwp).
- **Publicação:** o workflow do Pages agora exige também o teste de navegador antes do deploy. CI usa permissão de leitura e cancela execuções substituídas na mesma referência.

## Evidências

- Oito testes inicialmente falharam na V22, reproduzindo perda de conclusão/dúvida, tempo acumulado, agendamento concorrente e aceitação de backups inválidos. Todos passam após as correções.
- `npm run validate`: aprovado; inclui auditorias estruturais do currículo, aulas, questões, fontes, experiência, testes, TypeScript e builds do site/HTML.
- **94 testes em 19 arquivos**, sendo 12 testes novos nesta revisão.
- Playwright/Chromium: aprovado em `file://`, com rede desligada. Cobre cadastro, respostas, recarga, retomada e conclusão de simulado, notas, exportação/importação em outro contexto, troca de aulas, clique duplicado em quiz/revisão e recuperação após falha de gravação simulada.
- Treze rotas principais verificadas em 1440 px e 390 px, sem overflow horizontal. Também verificados acesso bloqueado ao IndexedDB, ausência de erros de página e zero solicitações HTTP no HTML offline.
- `npm audit --json`: 0 alertas em todas as dependências na data da auditoria.
- `CPA_Study.html` regenerado com as correções, aproximadamente 0,86 MB, sem dependências externas.

## Limites da varredura

A auditoria técnica não é uma conferência financeira individual dos 545 gabaritos e das 445 aulas. As verificações do conteúdo cobrem estrutura, cobertura e integridade das referências cadastradas; a revisão editorial individual continua pendente. O texto da data nas aulas foi ajustado para não apresentá-la como comprovação dessa revisão.

Os testes de navegador usam Chromium. Safari/Firefox, acessibilidade completa e funcionamento em todo dispositivo não foram certificados. Transações protegem gravações concorrentes, mas não há sincronização instantânea da interface entre abas. Continuam valendo os limites da V22: progresso local, origens distintas entre site/HTML, importação substitutiva de até 25 MB e cópias históricas apenas para registros que já as armazenavam.
