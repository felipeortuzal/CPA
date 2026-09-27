# V24 — leituras e simulados por módulo

## Entrega

- 20 módulos temáticos com títulos claros. Os 445 pontos de consulta pertencem a exatamente um módulo; a árvore oficial continua disponível em `/edital`.
- 61 seções de leitura autoral, 20 casos resolvidos, 20 tabelas de comparação, 60 alertas de confusão e 40 perguntas de recuperação ativa.
- Um simulado por módulo, com 6–10 questões autorais selecionadas exclusivamente do assunto, cronômetro, retomada e correção completa, incluindo acertos e questões não respondidas.
- 38 casos autorais novos com explicação da resposta correta e dos três distratores. Banco total: 583 questões, sendo 138 autorais e 445 exercícios gerados. Exercícios gerados não entram nos simulados de módulo.
- Progresso de leitura separado do progresso das aulas, salvo em transações IndexedDB e incluído no backup. Modo de simulado e identificação do módulo preservados na exportação e importação.
- Catálogo pesquisável, fontes, leituras complementares, navegação entre módulos, acesso pelo painel inicial e filtro de histórico por módulo. Visual original preservado com ajustes de hierarquia, espaço e leitura no celular.
- Links externos para o caderno e programa da ANBIMA, simulados Elite Bancária, apostilas e simulados TopInvest.

## Referências consultadas

Consulta em 27/09/2026: programa CPA 1.2 e materiais da ANBIMA; Banco Central; Portal do Investidor/CVM (fundos, perfil e riscos); Susep (previdência e seguros); Receita Federal (tabelas de 2026); ANBIMA (fundos ESG); páginas públicas dos fornecedores de material gratuito. Fontes constam nas leituras. Materiais externos não foram reproduzidos ou incorporados ao banco de questões.

## Validação

- `npm run validate`: validações de programa, aulas, questões, fontes e experiência, auditorias estáticas, 100 testes em 21 arquivos, TypeScript e build web/offline.
- Testes novos verificam partição completa do edital, integridade das leituras, tamanho e exclusividade dos simulados, rejeição de módulo inválido, gravações concorrentes de leitura e restauração de backup com histórico antigo e novo.
- `npm run test:browser`: arquivo HTML sem rede, desktop e celular, 17 rotas, marcação e recarga de leitura, simulado específico, prevenção de duplicidade, retomada, correção, exportação e restauração em outro contexto de navegador. Testes anteriores de perguntas, mini quiz, flashcards e falhas de armazenamento mantidos.
- Capturas de tela do catálogo e da leitura móvel inspecionadas. Tabelas possuem rolagem local, sem alargar a página. Nenhum erro de JavaScript ou requisição de rede no teste offline.

## Limites

As novas leituras explicam os conceitos centrais; não substituem a consulta completa às regras e ao programa. As aulas e questões anteriores mantêm seu status de revisão. Esta entrega não afirma revisão normativa individual de todo o acervo. Simulados de módulo são exercícios educacionais, não provas oficiais nem estimativas de aprovação. Links externos podem exigir cadastro, mudar ou ficar indisponíveis; precisam de internet.

Banco e backup continuam na versão 2; os registros novos usam campos opcionais e a chave reservada `course:`. Nenhum ID anterior foi renumerado.
