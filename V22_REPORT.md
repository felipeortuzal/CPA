# CPA V22 — consolidação local e confiabilidade

Base auditada: `ef7faffd0ffc02c15b3a987f7facb1819cbcf2d5` (V21).

## Entregue

- `CPA_Study.html`: aplicação completa em um arquivo, com CSS, JavaScript, conteúdo e rotas incorporados. Não exige npm, servidor ou internet para estudar. O código-fonte organizado e o site continuam existindo.
- Build único produz site + HTML; dependências travadas em `package-lock.json`; CI usa `npm ci` e disponibiliza o arquivo offline.
- Leitura e escrita concorrentes de respostas, notas, posição e marcações do simulado dentro de transações, evitando sobrescrita de atualizações.
- Finalização idempotente e transacional: resultado, caderno de erros e atividade são salvos juntos. Duas finalizações simultâneas não duplicam erros.
- Bloqueio de respostas após o prazo, recuperação da posição e mensagens de falha de armazenamento, inclusive no carregamento inicial.
- Snapshots de novas questões respondidas, erros e simulados; revisão do conteúdo e identificadores de alternativas nas tentativas. Mudanças futuras no banco não alteram os novos históricos.
- IDs históricos das questões geradas congelados por código do PD, independentes da posição da aula na lista.
- Backup consistente dos 14 stores; validação de payloads internos de simulação, gabaritos, resultados, números e IDs duplicados. Importação transacional com rollback inclusive em falha de clonagem de dados.
- Interface baixa uma cópia anterior antes de substituir o histórico; botão de restaurar backup já na tela inicial. Backups v1/v2 estruturalmente válidos continuam aceitos.
- Feedback continua associado à questão respondida mesmo no filtro de inéditas. Falha de gravação é exibida sem confirmar resposta salva.
- Primeira tentativa, repetições e quantidade de questões distintas separadas nas estatísticas de treino. Simulados permanecem identificados à parte.
- Correção de overflow de selects na tela de questões em celular.
- Rotulagem editorial: questões geradas não se tornam verificadas automaticamente. Treino completo usa apenas as 100 autorais, sem estimativa de aprovação. Diálogo objetivo não é apresentado como árvore ramificada.

## Verificação

- `npm run validate`: validadores existentes de currículo, aulas, questões, fontes, experiência, auditoria; testes; TypeScript e builds web/standalone.
- 82 testes automatizados, incluindo regressões de concorrência, dupla finalização, perda/alteração da questão no banco, prazo expirado, backup malformado, rollback e preservação de IDs.
- `npm run test:browser`: Chromium headless Linux, abertura por `file://` com conexão offline; criação de perfil, resposta/feedback, recarga, retomada de posição e notas do simulado, finalização, exportação e importação em contexto novo, tela de armazenamento bloqueado e larguras desktop/390 px.
- Nesse fluxo, nenhuma requisição HTTP(S) da página e nenhum erro JavaScript não tratado. Capturas de desktop e celular inspecionadas.
- Chrome e Edge em Windows não foram executados neste ambiente; o teste usou Chromium.

## Limitações concretas

1. **Conteúdo:** não foi realizada conferência financeira individual das 545 questões nem das 445 aulas. Existem 100 questões autorais e 445 exercícios gerados automaticamente; a cobertura quantitativa não prova qualidade. Datas/links legados não são evidência de validação de gabarito.
2. **Formato oficial:** árvores de decisão com ramificações e pontuação oficialmente conferida ainda não estão implementadas. O treino completo é uma ferramenta de prática, não uma réplica validada do exame.
3. **Histórico antigo:** tentativas/simulados anteriores à V22 não têm snapshots retroativos. O fallback usa o banco atual; não é possível reconstruir conteúdo antigo que não foi guardado.
4. **Armazenamento:** `file://` depende do navegador. Mover/renomear o arquivo, trocar navegador, limpar dados ou usar navegação privada pode mudar a disponibilidade do histórico. Exportar/importar continua sendo a forma de transferência e recuperação.
5. **Backup:** importação substitui, não mescla, o histórico. O limite de arquivo permanece 25 MB. O download preventivo depende de o navegador permitir e o usuário guardar o arquivo.
6. **Offline:** referências externas e atualizações de conteúdo exigem conexão; o HTML já baixado não se atualiza sozinho.

## Como entregar ao Thó

Enviar `CPA_Study.html`. Ele salva em uma pasta fixa, abre no navegador e informa um nome local. Para transferir ou atualizar, usa Configurações → Exportar progresso, guarda o JSON e importa no novo local. Não há conta, custo ou sincronização remota.
