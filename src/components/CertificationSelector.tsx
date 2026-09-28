import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { certifications } from '../data/certifications'
import { useStudent } from '../features/profile/StudentProvider'

export function CertificationSelector() {
  const { profile, updateStudent } = useStudent(); const [saving,setSaving] = useState(false); const value = profile?.currentCertification ?? 'CPA'
  async function changeCertification(next: string) { if (!profile || next===value) return; setSaving(true); try { await updateStudent({ currentCertification: next }) } finally { setSaving(false) } }
  if(certifications.filter(item=>item.available).length===1)return <span className="rounded-xl bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">CPA</span>
  return <div className="relative"><select aria-label="Certificação" value={value} disabled={saving} onChange={(event)=>void changeCertification(event.target.value)} className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-semibold outline-none ring-emerald-400 focus:ring-2 disabled:opacity-60 dark:border-white/10 dark:bg-white/5">{certifications.map((certification)=><option key={certification.id} value={certification.id} disabled={!certification.available}>{certification.name}{!certification.available?' — em breve':''}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/></div>
}
