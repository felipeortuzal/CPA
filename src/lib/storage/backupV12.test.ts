import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createBackup, getBackupSummary, importBackup, resetAllProgress, validateBackup } from './backup'
import { closeDatabase, DB_VERSION, getDatabase } from './database'

const now='2026-09-20T15:30:00.000Z'

describe('V12 backup completo e importação segura',()=>{
  beforeEach(async()=>{await resetAllProgress()})
  afterEach(async()=>{await closeDatabase()})

  it('exporta e restaura todos os stores pessoais relevantes',async()=>{
    const db=await getDatabase()
    await db.put('profile',{id:'local',displayName:'Thó',currentCertification:'CPA',dailyGoalMinutes:45,createdAt:now,updatedAt:now})
    await db.put('lessonProgress',{pdCode:'1.1.1.1.1',status:'completed',openedAt:now,lastStudiedAt:now,completedAt:now,masteredAt:null,hasDoubt:false,quizBestScore:67})
    await db.put('quizAttempts',{id:'quiz-1',pdCode:'1.1.1.1.1',answers:[0],correct:1,total:1,score:100,completedAt:now})
    await db.put('questionAttempts',{id:'qa-1',questionId:'CPA-T1-001',pdCode:'1.1.1.1.1',selectedAnswer:0,correctAnswer:0,isCorrect:true,answeredAt:now})
    await db.put('favorites',{id:'fav-1',itemType:'lesson',itemId:'1.1.1.1.1',createdAt:now})
    await db.put('flashcards',{id:'card-1',pdCode:'1.1.1.1.1',front:'Frente',back:'Verso',createdAt:now,updatedAt:now})
    await db.put('flashcardReviews',{id:'review-1',flashcardId:'card-1',rating:'good',reviewedAt:now,lastReviewed:now,nextReview:null,interval:1,ease:2.5,reviewCount:1,correctStreak:1})
    await db.put('questionBookmarks',{id:'bookmark-1',questionId:'CPA-T1-001',createdAt:now})
    await db.put('errors',{id:'error-1',sourceType:'question',sourceId:'CPA-T1-002',questionId:'CPA-T1-002',pdCode:'1.1.1.1.1',prompt:'Teste',selectedAnswer:'B',correctAnswer:'A',createdAt:now,resolvedAt:null})
    await db.put('simulations',{id:'sim-1',certification:'CPA',score:null,questionCount:1,completedAt:null,payload:{mode:'quick10',label:'Simulado 10',theme:null,questionIds:['CPA-T1-001'],answers:{'CPA-T1-001':null},markedForReview:[],notes:'',startedAt:now,durationSeconds:1800,cutoff:null,result:null}})
    await db.put('studySessions',{id:'session-1',activityType:'lesson',pdCode:'1.1.1.1.1',startedAt:now,endedAt:now,activeSeconds:120})
    await db.put('activityDays',{date:'2026-09-20',events:1,lastActivityAt:now})
    await db.put('preferences',{id:'preferences',theme:'dark',updatedAt:now})
    await db.put('studyPlans',{id:'exam-plan:settings',payload:{examDate:'2026-12-10',startDate:null,availableWeekdays:[1,2,3,4,5],minutesPerDay:45,updatedAt:now},updatedAt:now})

    const backup=await createBackup()
    expect(validateBackup(backup)).toBe(true)
    expect(getBackupSummary(backup)).toMatchObject({profileName:'Thó',lessons:1,quizzes:1,questions:1,simulations:1,errors:1,studyPlans:1})
    expect(backup.flashcards).toHaveLength(1)
    expect(backup.flashcardReviews).toHaveLength(1)

    await resetAllProgress()
    await importBackup(backup)
    const restored=await getDatabase()
    expect((await restored.get('profile','local'))?.displayName).toBe('Thó')
    expect(await restored.getAll('lessonProgress')).toHaveLength(1)
    expect(await restored.getAll('questionAttempts')).toHaveLength(1)
    expect(await restored.getAll('simulations')).toHaveLength(1)
    expect(await restored.getAll('studyPlans')).toHaveLength(1)
    expect(await restored.getAll('flashcardReviews')).toHaveLength(1)
  })

  it('rejeita estrutura interna malformada mesmo com versão válida',()=>{
    const invalid={
      backupVersion:2,databaseVersion:DB_VERSION,exportedAt:now,profile:null,
      lessonProgress:[],quizAttempts:[],questionAttempts:[],favorites:[],flashcards:[],
      flashcardReviews:[{id:'x'}],questionBookmarks:[],errors:[],simulations:[],
      studySessions:[],activityDays:[],preferences:[],studyPlans:[],
    }
    expect(validateBackup(invalid)).toBe(false)
  })

  it('recusa importação criada por schema futuro sem apagar o banco atual',async()=>{
    const db=await getDatabase()
    await db.put('profile',{id:'local',displayName:'Felipe',currentCertification:'CPA',dailyGoalMinutes:30,createdAt:now,updatedAt:now})
    const backup=await createBackup()
    const future={...backup,databaseVersion:DB_VERSION+1}
    await expect(importBackup(future)).rejects.toThrow(/versão mais nova/)
    expect((await db.get('profile','local'))?.displayName).toBe('Felipe')
  })
})
