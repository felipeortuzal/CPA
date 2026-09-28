import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cpaQuestions } from '../../content/cpa/questions'
import { isReviewed } from '../../content/cpa/questions/quality'
import { applyEditorialReview } from '../../content/cpa/questions/editorial'
import { courseModules, matchesModule } from '../../content/cpa/course/modules'
import { moduleReadings } from '../../content/cpa/course/readings'
import { buildModuleProgress } from './course/progress'
import { buildDailySteps, type DailyInput } from './daily/engine'
import { advanceDailySession, getDailySession, startDailySession, validDailySession } from './daily/repository'
import { generateSimulation, gradeSimulation } from './simulations/engine'
import { reliableAttempt } from './qualityEvidence'
import { answerQuestion } from './storage/repositories/questionRepository'
import { getDatabase, deleteLocalDatabase } from './storage/database'
import { createBackup, importBackup, validateBackup } from './storage/backup'
import { prepareBackupExport } from './storage/repositories/backupStatusRepository'
import { checkVersion, newerVersion } from './version'
import type { QuestionAttemptRecord, SimulationRecord } from './storage/types'
const now=new Date('2026-09-28T12:00:00Z')
const module=courseModules[0]
const pool=cpaQuestions.filter(q=>isReviewed(q)&&matchesModule(module,q.pdCode))
const progress={[module.id]:{version:1 as const,moduleId:module.id,readSections:moduleReadings[module.id].sections.map(s=>s.id)}}
function attempt(i:number,at='2026-09-28T12:00:00Z',correct=true):QuestionAttemptRecord {const q=pool[i%pool.length];return{id:`${i}:${at}`,questionId:q.id,pdCode:q.pdCode,questionSnapshot:q,selectedAnswer:q.correctAnswer,correctAnswer:q.correctAnswer,isCorrect:correct,answeredAt:at}}
function exam(correct=true):SimulationRecord {const qs=pool.slice(0,8);const answers=Object.fromEntries(qs.map(q=>[q.id,correct?q.correctAnswer:(q.correctAnswer+1)%4]));const result=gradeSimulation(qs,answers,[],null,10);return{id:'exam',certification:'CPA',score:result.scorePercent,questionCount:8,completedAt:now.toISOString(),payload:{mode:'module',moduleId:module.id,label:'test',theme:null,questionIds:qs.map(q=>q.id),questionSnapshots:qs,answers,markedForReview:[],notes:'',startedAt:now.toISOString(),durationSeconds:1440,cutoff:null,result}}}
const input=():DailyInput=>({modules:buildModuleProgress({},[],[],now),progress:{},attempts:[],simulations:[],errors:[],cards:[],reviews:[],budget:30,now})
describe('V25 editorial and course evidence',()=>{
 it('keeps exactly 15 reviewed original questions per module and excludes generated drafts',()=>{expect(cpaQuestions.filter(isReviewed)).toHaveLength(300);for(const m of courseModules)expect(cpaQuestions.filter(q=>isReviewed(q)&&matchesModule(m,q.pdCode)),m.id).toHaveLength(15);expect(cpaQuestions.filter(q=>q.origin==='generated').every(q=>!isReviewed(q))).toBe(true)})
 it('invalidates approval and old evidence after a text change',()=>{const q={...pool[0],prompt:'Changed premise'};expect(applyEditorialReview(q).reviewStatus).toBe('draft');expect(reliableAttempt({...attempt(0),questionSnapshot:q})).toBe(false)})
 it('prioritizes all seven remaining unseen questions on a second module exam',()=>{const first=generateSimulation(cpaQuestions,{mode:'module',moduleId:module.id,random:()=>.4});const second=generateSimulation(cpaQuestions,{mode:'module',moduleId:module.id,seenQuestionIds:new Set(first.questionIds),random:()=>.4});expect(second.questionIds.filter(id=>!first.questionIds.includes(id))).toHaveLength(7)})
 it('finishing a failed exam completes the module but calls for review',()=>{const row=buildModuleProgress(progress,[exam(false)],[],now)[0];expect(row.completed).toBe(true);expect(row.state).toBe('review')})
 it('does not call same-day repetition mastery',()=>{const rows=Array.from({length:50},(_,i)=>attempt(i));expect(buildModuleProgress(progress,[exam()],rows,now)[0].state).toBe('completed')})
 it('requires different reviewed questions, three days and spaced successful practice',()=>{const rows=[...Array.from({length:5},(_,i)=>attempt(i,'2026-09-20T12:00:00Z')),...Array.from({length:5},(_,i)=>attempt(i+5,'2026-09-24T12:00:00Z')),...Array.from({length:5},(_,i)=>attempt(i+10))];expect(buildModuleProgress(progress,[exam()],rows,now)[0].state).toBe('mastered');expect(buildModuleProgress(progress,[exam()],rows,new Date('2026-11-01T12:00:00Z'))[0].state).toBe('review')})
 it('cannot use an unreviewed simulation as mastery evidence',()=>{const e=exam();e.payload.questionSnapshots![0]={...pool[0],prompt:'Different question'};expect(buildModuleProgress(progress,[e],[],now)[0].state).toBe('completed')})
 it('mixes errors, due cards, weak practice and spaced recall without duplicates within budget',()=>{const data=input();data.attempts=[attempt(1,'2026-09-01T12:00:00Z')];data.errors=[{id:'error',sourceType:'question',sourceId:pool[0].id,questionId:pool[0].id,pdCode:pool[0].pdCode,prompt:pool[0].prompt,selectedAnswer:null,correctAnswer:null,createdAt:now.toISOString(),resolvedAt:null}];data.cards=[{id:'card',certification:'CPA',pdCode:null,front:'Q',back:'A',source:'custom'}];data.modules[0].needsReview=true;const steps=buildDailySteps(data,'review');expect(steps.some(s=>s.type==='flashcard')).toBe(true);expect(steps.some(s=>s.reason.includes('erro'))).toBe(true);expect(steps.some(s=>s.reason.includes('espaçada'))).toBe(true);expect(new Set(steps.map(s=>s.id)).size).toBe(steps.length);expect(steps.reduce((s,r)=>s+r.minutes,0)).toBeLessThanOrEqual(20)})
 it('starts with reading and leaves an empty review queue for a new learner',()=>{expect(buildDailySteps(input(),'today')[0].type).toBe('reading');expect(buildDailySteps(input(),'review')).toEqual([])})
})
describe('V25 persisted sessions',()=>{
 beforeEach(async()=>{await deleteLocalDatabase()})
 afterEach(async()=>{await deleteLocalDatabase()})
 it('resumes the same queue and ignores concurrent stale advances',async()=>{const s=await startDailySession('today',buildDailySteps(input(),'today'));const [a,b]=await Promise.all([advanceDailySession(s),advanceDailySession(s)]);expect(a.index).toBe(1);expect(b.index).toBe(1);expect((await getDailySession('today'))?.index).toBe(1);expect((await startDailySession('today',[])).steps).toEqual(s.steps);expect(validDailySession({...a,done:[]})).toBe(false)})
 it('round-trips a resumed session and backup metadata, rejecting corrupt steps',async()=>{const s=await startDailySession('today',buildDailySteps(input(),'today'));await advanceDailySession(s);const backup=prepareBackupExport(await createBackup());expect(validateBackup(backup)).toBe(true);await deleteLocalDatabase();await importBackup(backup);expect((await getDailySession('today'))?.index).toBe(1);expect((await(await getDatabase()).get('studyPlans','backup:status'))?.payload).toHaveProperty('exportedAt');const invalid=structuredClone(backup);const row=invalid.studyPlans.find(r=>r.id.startsWith('session:'))!;(row.payload as {index:number}).index=999;expect(validateBackup(invalid)).toBe(false)})
 it('records only one answer when the daily step is retried',async()=>{await Promise.all([answerQuestion(pool[0],0,{id:'session:retry',mode:'review'}),answerQuestion(pool[0],0,{id:'session:retry',mode:'review'})]);expect(await(await getDatabase()).getAll('questionAttempts')).toHaveLength(1)})
})
describe('V25 manual version check',()=>{
 afterEach(()=>vi.unstubAllGlobals())
 it('compares version components numerically',()=>{expect(newerVersion('0.100.0','0.25.0')).toBe(true);expect(newerVersion('0.25.0','0.25.0')).toBe(false);expect(()=>newerVersion('bad')).toThrow()})
 it('rejects broken responses without changing stored progress',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({version:'invalid'})}));await expect(checkVersion()).rejects.toThrow();vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('offline')));await expect(checkVersion()).rejects.toThrow('offline')})
})
