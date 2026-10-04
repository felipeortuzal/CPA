import pkg from '../../package.json'
export const APP_VERSION=pkg.version
export const CONTENT_REVIEW_DATE='2026-10-04'
export function newerVersion(candidate:string,current=APP_VERSION) {
  if(!/^\d+\.\d+\.\d+$/.test(candidate))throw new Error('A resposta de versão não é válida.')
  const a=candidate.split('.').map(Number),b=current.split('.').map(Number)
  for(let i=0;i<3;i++){if(a[i]>b[i])return true;if(a[i]<b[i])return false}
  return false
}
export async function checkVersion() {
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),8000)
  try {
    const response=await fetch('https://felipeortuzal.github.io/CPA/version.json',{cache:'no-store',signal:controller.signal})
    if(!response.ok)throw new Error('Não foi possível consultar a versão publicada.')
    const data:unknown=await response.json()
    if(!data||typeof data!=='object'||!('version' in data)||typeof data.version!=='string')throw new Error('Resposta de versão inválida.')
    return {version:data.version,available:newerVersion(data.version)}
  }finally{clearTimeout(timeout)}
}
