import { useEffect, useRef, useState } from 'react'
import { Copy, ExternalLink, GraduationCap, Loader2, MessageCircle, Send, Sparkles, Trash2, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useStudent } from '../features/profile/StudentProvider'

type Role = 'user' | 'assistant'

type Source = {
  title: string
  url: string
}

type ChatMessage = {
  id: string
  role: Role
  content: string
  sources?: Source[]
}

const STORAGE_KEY = 'cpa-study-mestre-cpa-v1'
const MAX_HISTORY = 12

const initialMessage: ChatMessage = {
  id: 'mestre-welcome',
  role: 'assistant',
  content: 'Oi! Eu sou o **Mestre CPA**, o tutor de IA da CPA Study.\n\nPode me perguntar qualquer coisa sobre a CPA: conceitos, produtos, matemática financeira, pegadinhas, cases, alternativas de uma questão ou simplesmente “não entendi nada disso”. Eu vou explicar do zero e conectar com o jeito que o assunto é cobrado.',
}

const quickPrompts = [
  'Me explique PGBL x VGBL do zero',
  'Qual a diferença entre CMN, BCB e CVM?',
  'Me ensine marcação a mercado com um exemplo',
  'Como eu resolvo uma questão de suitability?',
]

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [initialMessage]
    const parsed = JSON.parse(raw) as ChatMessage[]
    if (!Array.isArray(parsed) || parsed.length === 0) return [initialMessage]
    return parsed.slice(-40)
  } catch {
    return [initialMessage]
  }
}

function makeId() {
  return `mestre-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getEndpoint() {
  const runtime = (window as Window & { __CPA_CHAT_ENDPOINT__?: string }).__CPA_CHAT_ENDPOINT__
  return runtime?.trim() || import.meta.env.VITE_CPA_CHAT_ENDPOINT?.trim() || ''
}

function getToken() {
  const runtime = (window as Window & { __CPA_CHAT_TOKEN__?: string }).__CPA_CHAT_TOKEN__
  return runtime?.trim() || import.meta.env.VITE_CPA_CHAT_TOKEN?.trim() || ''
}

function MessageText({ content }: { content: string }) {
  return <div className="whitespace-pre-wrap break-words text-[13px] leading-6">{content}</div>
}

export function CPAMentorChat() {
  const location = useLocation()
  const { profile } = useStudent()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const endpoint = getEndpoint()
  const connected = Boolean(endpoint)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)))
  }, [messages])

  useEffect(() => {
    if (!open) return
    window.setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  function resetChat() {
    setMessages([initialMessage])
    setDraft('')
  }

  async function copyMessage(message: ChatMessage) {
    await navigator.clipboard?.writeText(message.content)
    setCopiedId(message.id)
    window.setTimeout(() => setCopiedId(null), 1200)
  }

  async function sendMessage(prefilled?: string) {
    const content = (prefilled ?? draft).trim()
    if (!content || loading) return

    if (!connected) {
      const errorMessage: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: 'O visual do Mestre CPA já está instalado, mas a conexão com a IA ainda não foi configurada.\n\nPara manter a chave da OpenAI segura, a CPA Study precisa de um pequeno endpoint de backend. A V27 já deixou o Worker preparado; basta configurar o endpoint nas variáveis de ambiente do deploy.',
      }
      setMessages(prev => [...prev, { id: makeId(), role: 'user', content }, errorMessage])
      setDraft('')
      return
    }

    const userMessage: ChatMessage = { id: makeId(), role: 'user', content }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setDraft('')
    setLoading(true)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(getToken() ? { 'X-CPA-Chat-Token': getToken() } : {}),
        },
        body: JSON.stringify({
          messages: nextMessages.filter(item => item.id !== 'mestre-welcome').slice(-MAX_HISTORY).map(item => ({
            role: item.role,
            content: item.content,
          })),
          context: {
            page: location.pathname,
            studentName: profile?.displayName || 'Aluno',
            certification: 'CPA',
            appVersion: '0.27.0',
          },
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data?.error === 'string' ? data.error : `Erro ${response.status}`)
      }

      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: typeof data?.content === 'string' && data.content.trim() ? data.content : 'Não consegui montar uma resposta agora. Tente novamente.',
        sources: Array.isArray(data?.sources) ? data.sources.filter((source: unknown): source is Source => {
          if (!source || typeof source !== 'object') return false
          const item = source as { title?: unknown; url?: unknown }
          return typeof item.title === 'string' && typeof item.url === 'string'
        }) : undefined,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessages(prev => [...prev, {
        id: makeId(),
        role: 'assistant',
        content: `Não consegui falar com o Mestre CPA agora.\n\nDetalhe técnico: ${detail}\n\nSe você acabou de configurar o endpoint, confira se o Worker está publicado e se OPENAI_API_KEY está configurada nele.`,
      }])
    } finally {
      setLoading(false)
    }
  }

  function onComposerKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  return <>
    {open && <section
      aria-label="Mestre CPA"
      role="dialog"
      aria-modal="false"
      className="fixed bottom-24 right-4 z-[70] flex h-[min(680px,calc(100vh-7rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-white/10 dark:bg-[#0a1724]"
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#0a1724]">
        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#0b1724] ring-1 ring-emerald-400/30" aria-hidden="true">
          <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#0b1724"/><path d="M18 18h28v8H26v12h20v8H18z" fill="#34d399"/></svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-black">Mestre CPA</p>
            <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300">IA</span>
          </div>
          <p className="truncate text-[11px] text-slate-500">{connected ? 'Tutor especializado em CPA · online' : 'Interface pronta · conexão pendente'}</p>
        </div>
        <button aria-label="Limpar conversa" title="Limpar conversa" onClick={resetChat} className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
          <Trash2 className="h-4 w-4" />
        </button>
        <button aria-label="Fechar Mestre CPA" title="Fechar" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
          <X className="h-5 w-5" />
        </button>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50/80 p-4 dark:bg-[#07111c]">
        {messages.length === 1 && <div className="mb-2 rounded-2xl border border-violet-400/20 bg-violet-400/5 p-3">
          <div className="flex items-center gap-2 text-xs font-bold"><Sparkles className="h-3.5 w-3.5 text-violet-500" /> Comece por aqui</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.map(prompt => <button key={prompt} onClick={() => void sendMessage(prompt)} disabled={loading} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-[11px] font-semibold text-slate-700 transition hover:border-emerald-400/50 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-emerald-400/5">{prompt}</button>)}
          </div>
        </div>}

        {messages.map(message => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[88%] ${message.role === 'user' ? 'rounded-2xl rounded-br-md bg-emerald-500 px-3.5 py-2.5 text-white' : 'rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3.5 py-2.5 text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-100'}`}>
            <MessageText content={message.content} />
            {message.role === 'assistant' && message.sources && message.sources.length > 0 && <div className="mt-3 border-t border-slate-200 pt-2 dark:border-white/10">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Fontes</p>
              <div className="space-y-1">
                {message.sources.slice(0, 5).map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="flex items-start gap-1 text-[10px] leading-4 text-emerald-700 hover:underline dark:text-emerald-300"><ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />{source.title}</a>)}
              </div>
            </div>}
            {message.role === 'assistant' && message.id !== 'mestre-welcome' && <button onClick={() => void copyMessage(message)} className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Copy className="h-3 w-3" />{copiedId === message.id ? 'Copiado' : 'Copiar'}</button>}
          </div>
        </div>)}

        {loading && <div className="flex justify-start"><div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5"><div className="flex items-center gap-2 text-xs text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Mestre CPA está pensando...</div></div></div>}
      </div>

      <footer className="shrink-0 border-t border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#0a1724]">
        {!connected && <p className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-[10px] leading-4 text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">O botão e a conversa já estão instalados. Falta somente conectar o backend seguro da OpenAI.</p>}
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-emerald-400 dark:border-white/10 dark:bg-white/5">
          <textarea
            ref={inputRef}
            value={draft}
            onChange={event => setDraft(event.target.value)}
            onKeyDown={onComposerKeyDown}
            rows={1}
            maxLength={4000}
            disabled={loading}
            placeholder={connected ? 'Tire sua dúvida sobre a CPA...' : 'Backend ainda não conectado'}
            className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />
          <button aria-label="Enviar pergunta" onClick={() => void sendMessage()} disabled={!draft.trim() || loading} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-[9px] text-slate-400">Use para estudar. Confirme regras vigentes nas fontes oficiais quando o tema for regulatório.</p>
      </footer>
    </section>}

    <button
      aria-label={open ? 'Fechar Mestre CPA' : 'Abrir Mestre CPA'}
      title="Mestre CPA"
      onClick={() => setOpen(value => !value)}
      className={`fixed bottom-5 right-5 z-[69] grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-slate-950 text-white shadow-xl shadow-slate-950/25 transition hover:-translate-y-0.5 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:bg-emerald-400 dark:text-slate-950 dark:focus:ring-offset-[#07111c] ${open ? 'rotate-0' : ''}`}
    >
      {open ? <X className="h-6 w-6" /> : <div className="relative"><MessageCircle className="h-6 w-6" /><span className="absolute -right-1 -top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-emerald-400 ring-2 ring-slate-950 dark:bg-slate-950 dark:ring-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-white dark:bg-emerald-400" /></span></div>}
    </button>
  </>
}
