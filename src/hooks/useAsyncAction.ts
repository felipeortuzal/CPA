import { useRef, useState } from 'react'

// The ref closes the gap before React renders disabled controls.
export function useAsyncAction() {
  const locked = useRef(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function run(action: () => Promise<void>) {
    if (locked.current) return
    locked.current = true
    setBusy(true)
    setError('')
    try { await action() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar. Tente novamente.') }
    finally { locked.current = false; setBusy(false) }
  }
  return { busy, error, run }
}
