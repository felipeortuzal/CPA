## 0.27.1 — 01/10/2026

### Mestre CPA
- Adiciona chatbot flutuante persistente em todas as páginas.
- Interface em formato de chat/WhatsApp, sem troca de página.
- Usa a logo oficial da CPA Study no avatar e na navegação.
- Histórico local da conversa, limpar conversa, copiar resposta, atalhos de dúvidas e suporte mobile.
- Contexto da página atual enviado ao tutor.
- Backend preparado com Cloudflare Worker + OpenAI Responses API.
- GPT-5.6 Luna como modelo padrão, com busca web opcional e restrita a fontes institucionais prioritárias.
- Fontes retornadas pela busca são exibidas como links clicáveis.
- OPENAI_API_KEY permanece somente no backend.
- store: false para não persistir as respostas na API.
- Documentação de deploy e .env.example adicionados.
## 0.27.0 — 30/09/2026

### Inteligência da prova
- Central V27 de engenharia de prova.
- Benchmark estruturado do curso público do Retorno Interno / Renan Duarte sem copiar conteúdo protegido.
- 13 aulas com título e URL verificados publicamente.
- Mapa dos 20 módulos em 12 clusters de raciocínio.
- Radar de evidências, atalhos mentais, padrões de questão e 100 pegadinhas autorais.
- Benchmark externo de materiais gratuitos e simulados.
- Programa Detalhado e fontes oficiais permanecem como fonte de verdade.

### Confiabilidade
- Validação V27 para cobertura, benchmark, pegadinhas e métricas.
- Versão do pacote: 0.27.0.

# Changelog

## 0.26.0 — 30/09/2026

### Apostila Digital Completa
- Integra os 445 pontos terminais do Programa Detalhado à trilha de 20 módulos.
- Adiciona Modo Apostila contínuo por módulo, com índice, impressão/PDF, fontes oficiais por tópico e data de revisão.
- Separa trilha principal de aprofundamento: o essencial fica visível para avançar; teoria integral e exemplos completos continuam disponíveis sob demanda.
- Mantém comparações, fórmulas, confusões comuns, resumos e 3 checkpoints por PD.

### Questões e simulados
- Mantém o banco em 745 itens: 300 questões autorais revisadas e 445 exercícios de cobertura ainda fora da base confiável de simulados/indicadores.
- Recalibra dificuldade, nível cognitivo e tipo das questões revisadas sem alterar enunciado, alternativas ou gabarito.
- Não promove nenhuma questão a `verified` sem confronto específico e recuperável com fonte oficial.
- Normaliza diálogos objetivos como `case`; `dialog_tree` fica reservado para futuras árvores com ramificações reais.
- Simulados passam a priorizar inéditas e diversidade de conceito, PD, dificuldade, nível cognitivo e tipo de questão.

### Estudo e progresso
- Expõe checklist transparente de domínio por módulo: leitura, simulado, questões distintas, dias de prática, janela temporal, acerto recente e consistência.
- Adiciona sessões rápidas de 10, 25 ou 45 minutos, além da meta pessoal.
- Corrige a discrepância entre meta configurável e limite real: faixa suportada passa a 10–120 minutos.
- Separa tempo de `daily` e `review` mantendo compatibilidade com dados e backups existentes.

### Confiabilidade
- Adiciona validação específica da V26 para cobertura dos 445 PDs, profundidade, fontes, banco confiável e diversidade dos simulados.
- Amplia o smoke test offline para a rota da Apostila em desktop/mobile e após restauração de backup.
- Mantém PWA, GitHub Pages, IndexedDB local, backup JSON e arquivo standalone sem dependências externas.

### Limites declarados
- A plataforma não é prova oficial nem homologada pela ANBIMA e não prevê aprovação.
- As 445 questões de cobertura automática continuam fora da base revisada.
- A V26 não implementa árvore de decisão dinâmica; itens objetivos não são apresentados como se implementassem esse formato.

## 0.25.0
- Consolidou a trilha de 20 módulos, sessão diária, indicadores de domínio, revisão espaçada e expansão do banco para 745 itens, mantendo 300 questões autorais revisadas como base confiável.
