import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State { return { hasError: true } }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('CPA Study encontrou um erro de interface.', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-950 dark:bg-[#07111c] dark:text-slate-100">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#0b1824]" role="alert">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-600 dark:text-rose-300">Erro de interface</p>
        <h1 className="mt-2 text-2xl font-black">Seus dados locais continuam preservados.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">A tela encontrou um problema inesperado. Recarregar a aplicação normalmente resolve sem apagar o IndexedDB, o progresso ou os backups.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950" onClick={() => window.location.reload()}>Recarregar</button>
          <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold dark:border-white/10" onClick={() => window.location.assign('/')}>Voltar ao início</button>
        </div>
      </section>
    </main>
  }
}
