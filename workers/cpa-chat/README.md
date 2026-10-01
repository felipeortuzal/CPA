# Mestre CPA — backend

O frontend do CPA Study chama `POST /api/chat`.

## Por que existe um backend?

A chave da OpenAI não pode ficar no navegador nem no repositório público. O Worker mantém `OPENAI_API_KEY` como secret e encaminha somente a conversa necessária para a Responses API.

A OpenAI recomenda explicitamente manter a chave no servidor/variáveis de ambiente e nunca no client-side.

## Deploy no Cloudflare Workers

Na raiz do projeto:

    npx wrangler secret put OPENAI_API_KEY
    npx wrangler deploy --config workers/cpa-chat/wrangler.jsonc

O Worker ficará disponível em um endereço `workers.dev` enquanto essa opção estiver habilitada.

Para o frontend publicado no GitHub Pages, configure no build:

    VITE_CPA_CHAT_ENDPOINT=https://SEU-WORKER.workers.dev/api/chat
    VITE_CPA_CHAT_TOKEN=

O token é opcional nesta primeira versão. Para um projeto privado, prefira proteger o Worker com Cloudflare Access ou outra autenticação server-side.

## Desenvolvimento local

Crie `workers/cpa-chat/.dev.vars`:

    OPENAI_API_KEY="sua-chave"

Depois:

    npx wrangler dev --config workers/cpa-chat/wrangler.jsonc

Endpoint local: `http://localhost:8787/api/chat`.

Nunca faça commit de `.dev.vars` ou da chave.

## O que o Mestre CPA faz

- usa GPT-5.6 Luna;
- mantém o contexto da conversa enviado pelo frontend;
- explica conceitos da CPA do zero;
- treina raciocínio e aplicação em cases;
- analisa alternativas e pegadinhas;
- pode usar busca web quando necessário;
- restringe a busca a fontes institucionais prioritárias;
- retorna fontes encontradas para o frontend;
- não grava a resposta no histórico da API (`store: false`);
- aplica limite básico por cliente para reduzir abuso.

## Próximo passo

O site já contém o botão flutuante, a conversa e a integração. Falta apenas publicar este Worker e apontar `VITE_CPA_CHAT_ENDPOINT` para ele. Não coloque a chave da OpenAI no GitHub ou no frontend.