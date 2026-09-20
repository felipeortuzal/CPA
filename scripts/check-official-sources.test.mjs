import { describe, expect, it } from 'vitest'
import { runSourceCheck } from './check-official-sources.mjs'

const source={id:'TEST_SOURCE',url:'https://official.example/source',fingerprintMode:'content'}
const manifest={generatedAt:'2026-09-20',sources:[source]}
const now=new Date('2026-09-20T12:00:00.000Z')

function response(body){
  return new Response(body,{status:200,headers:{'content-type':'text/plain'}})
}

describe('V11 official source monitor',()=>{
  it('cria baseline, mantém unchanged e detecta mudança de fingerprint',async()=>{
    const first=await runSourceCheck(manifest,{schemaVersion:1,checkedAt:null,sources:{}},{now,fetchImpl:async()=>response('v1')})
    expect(first.report.summary.baseline).toBe(1)
    const second=await runSourceCheck(manifest,first.state,{now,fetchImpl:async()=>response('v1')})
    expect(second.report.summary.unchanged).toBe(1)
    const third=await runSourceCheck(manifest,second.state,{now,fetchImpl:async()=>response('v2 changed')})
    expect(third.report.summary.changed).toBe(1)
  })

  it('tolera indisponibilidade sem apagar fingerprint anterior nem lançar erro',async()=>{
    const baseline=await runSourceCheck(manifest,{schemaVersion:1,checkedAt:null,sources:{}},{now,fetchImpl:async()=>response('stable')})
    const failed=await runSourceCheck(manifest,baseline.state,{now,fetchImpl:async()=>{throw new Error('offline')}})
    expect(failed.report.summary.unreachable).toBe(1)
    expect(failed.report.policy.networkFailureBlocksStudy).toBe(false)
    expect(failed.state.sources.TEST_SOURCE.fingerprint).toBe(baseline.state.sources.TEST_SOURCE.fingerprint)
  })
})
