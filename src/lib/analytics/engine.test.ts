import { describe, expect, it } from 'vitest'
import { buildAnalyticsSnapshot } from './engine'

describe('V20 analytics engine',()=>{
  it('calcula acurácia, temas, dificuldade, recorrência e série diária sem inventar dados',()=>{
    const snapshot=buildAnalyticsSnapshot({
      attempts:[
        {id:'a1',questionId:'CPA-Q001',pdCode:'1.1.1.1.1',selectedAnswer:0,correctAnswer:0,isCorrect:true,answeredAt:'2026-09-19T12:00:00Z'},
        {id:'a2',questionId:'CPA-Q001',pdCode:'1.1.1.1.1',selectedAnswer:1,correctAnswer:0,isCorrect:false,answeredAt:'2026-09-20T12:00:00Z'},
        {id:'a3',questionId:'CPA-Q024',pdCode:'2.1.1.1.3.1',selectedAnswer:1,correctAnswer:0,isCorrect:false,answeredAt:'2026-09-20T13:00:00Z'},
      ],
      errors:[{id:'e1',sourceType:'question',sourceId:'CPA-Q024',questionId:'CPA-Q024',pdCode:'2.1.1.1.3.1',prompt:'erro',selectedAnswer:'B',correctAnswer:'A',createdAt:'2026-09-20T13:00:00Z',resolvedAt:null,errorCount:3}],
      simulations:[],
      sessions:[{id:'s1',activityType:'questions',pdCode:null,startedAt:'2026-09-20T11:00:00Z',endedAt:'2026-09-20T11:30:00Z',activeSeconds:1800}],
      lessons:[{pdCode:'1.1.1.1.1',status:'completed',openedAt:'2026-09-19T10:00:00Z',lastStudiedAt:'2026-09-19T10:30:00Z',completedAt:'2026-09-19T10:30:00Z',masteredAt:null,hasDoubt:false,quizBestScore:80}],
      quizzes:[{id:'q1',pdCode:'1.1.1.1.1',answers:[0,1,2],correct:2,total:3,score:67,completedAt:'2026-09-19T10:40:00Z'}],
      now:new Date('2026-09-20T15:00:00Z'),
    })
    expect(snapshot.totalAnswered).toBe(3)
    expect(snapshot.overallAccuracy).toBe(33)
    expect(snapshot.recentAccuracy).toBe(33)
    expect(snapshot.studyMinutes).toBe(30)
    expect(snapshot.lessonsStudied).toBe(1)
    expect(snapshot.quizAverage).toBe(67)
    expect(snapshot.byMacro.find((row)=>row.label==='Tema 1')?.total).toBe(2)
    expect(snapshot.recurrentErrors[0].count).toBe(3)
    expect(snapshot.daily).toHaveLength(30)
  })

  it('mantém métricas nulas quando não existe amostra',()=>{
    const snapshot=buildAnalyticsSnapshot({attempts:[],errors:[],simulations:[],sessions:[],lessons:[],quizzes:[],now:new Date('2026-09-20T15:00:00Z')})
    expect(snapshot.overallAccuracy).toBeNull()
    expect(snapshot.recentAccuracy).toBeNull()
    expect(snapshot.simulationAverage).toBeNull()
    expect(snapshot.pdHeatmap).toEqual([])
  })
})
