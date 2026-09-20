import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

function sha256(buffer){return crypto.createHash('sha256').update(buffer).digest('hex')}

export function fingerprintResponse(source,response,bytes){
  const etag=response.headers.get('etag')
  const lastModified=response.headers.get('last-modified')
  const contentLength=response.headers.get('content-length')??String(bytes.byteLength)
  const contentType=response.headers.get('content-type')??''
  const finalUrl=response.url||source.url
  if(source.fingerprintMode==='content')return `sha256:${sha256(bytes)}`
  if(source.fingerprintMode==='availability')return `available:${response.status}:${finalUrl}`
  return `metadata:${etag??''}|${lastModified??''}|${contentLength}|${contentType}|${finalUrl}`
}

export async function checkSource(source,previousSources={},options={}){
  const timeoutMs=options.timeoutMs??10000
  const fetchImpl=options.fetchImpl??fetch
  const controller=new AbortController()
  const timer=setTimeout(()=>controller.abort(),timeoutMs)
  const checkedAt=(options.now??new Date()).toISOString()
  try{
    const response=await fetchImpl(source.url,{method:'GET',redirect:'follow',signal:controller.signal,headers:{'user-agent':'CPA-Study-Official-Source-Monitor/1.0'}})
    const bytes=Buffer.from(await response.arrayBuffer())
    const fingerprint=fingerprintResponse(source,response,bytes)
    const old=previousSources?.[source.id]
    const changed=Boolean(old?.fingerprint&&(old.fingerprint!==fingerprint||old.url!==source.url))
    return{id:source.id,url:source.url,finalUrl:response.url||source.url,status:response.ok?(changed?'changed':old?.fingerprint?'unchanged':'baseline'):'unreachable',httpStatus:response.status,fingerprintMode:source.fingerprintMode,fingerprint,etag:response.headers.get('etag'),lastModified:response.headers.get('last-modified'),contentLength:Number(response.headers.get('content-length')??bytes.byteLength),contentType:response.headers.get('content-type'),checkedAt,error:response.ok?null:`HTTP ${response.status}`}
  }catch(error){
    return{id:source.id,url:source.url,finalUrl:null,status:'unreachable',httpStatus:null,fingerprintMode:source.fingerprintMode,fingerprint:previousSources?.[source.id]?.fingerprint??null,etag:null,lastModified:null,contentLength:null,contentType:null,checkedAt,error:error instanceof Error?error.message:String(error)}
  }finally{clearTimeout(timer)}
}

export async function runSourceCheck(manifest,previous={schemaVersion:1,checkedAt:null,sources:{}},options={}){
  const concurrency=Math.max(1,Math.min(10,options.concurrency??5))
  const queue=[...manifest.sources]
  const results=[]
  async function worker(){while(queue.length){const source=queue.shift();if(!source)return;results.push(await checkSource(source,previous.sources??{},options))}}
  await Promise.all(Array.from({length:Math.min(concurrency,queue.length||1)},()=>worker()))
  results.sort((a,b)=>a.id.localeCompare(b.id))
  const checkedAt=(options.now??new Date()).toISOString()
  const summary={total:results.length,unchanged:results.filter((item)=>item.status==='unchanged').length,baseline:results.filter((item)=>item.status==='baseline').length,changed:results.filter((item)=>item.status==='changed').length,unreachable:results.filter((item)=>item.status==='unreachable').length}
  const report={schemaVersion:1,checkedAt,manifestGeneratedAt:manifest.generatedAt,summary,policy:{automaticRewrite:false,networkFailureBlocksStudy:false,message:'Mudanças são apenas sinalizadas. Nenhuma aula, questão, currículo ou regra de prova é reescrita automaticamente.'},results}
  const state={schemaVersion:1,checkedAt,sources:Object.fromEntries(results.filter((item)=>item.fingerprint).map((item)=>[item.id,{url:item.url,finalUrl:item.finalUrl,fingerprintMode:item.fingerprintMode,fingerprint:item.fingerprint,checkedAt:item.checkedAt}]))}
  return{report,state}
}

function arg(name,fallback){const index=process.argv.indexOf(name);return index>=0&&process.argv[index+1]?process.argv[index+1]:fallback}

export async function main(){
  const manifestPath=path.resolve(arg('--manifest','content/sources.json'))
  const statePath=path.resolve(arg('--state','.source-monitor/state.json'))
  const reportPath=path.resolve(arg('--report','.source-monitor/report.json'))
  const timeoutMs=Number(arg('--timeout-ms','10000'))
  const concurrency=Math.max(1,Math.min(10,Number(arg('--concurrency','5'))))
  const strictChanges=process.argv.includes('--strict-changes')
  const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'))
  let previous={schemaVersion:1,checkedAt:null,sources:{}}
  try{previous=JSON.parse(await fs.readFile(statePath,'utf8'))}catch{}
  const {report,state}=await runSourceCheck(manifest,previous,{timeoutMs,concurrency})
  await fs.mkdir(path.dirname(reportPath),{recursive:true});await fs.mkdir(path.dirname(statePath),{recursive:true})
  await fs.writeFile(reportPath,`${JSON.stringify(report,null,2)}\n`);await fs.writeFile(statePath,`${JSON.stringify(state,null,2)}\n`)
  console.log(`Official source check: ${report.summary.total} total | ${report.summary.changed} changed | ${report.summary.unreachable} unreachable | ${report.summary.baseline} baseline | ${report.summary.unchanged} unchanged`)
  for(const item of report.results.filter((row)=>row.status==='changed'))console.warn(`CHANGED ${item.id}: ${item.url}`)
  for(const item of report.results.filter((row)=>row.status==='unreachable'))console.warn(`UNREACHABLE ${item.id}: ${item.error}`)
  process.exit(strictChanges&&report.summary.changed>0?2:0)
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await main()
