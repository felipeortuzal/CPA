export type StudyPlanPhase='fundamentals'|'coverage'|'practice'|'consolidation'|'simulations'|'final_review'
export type PaceStatus='ahead'|'on_track'|'behind'|'continuous'
export type PlannedTaskType='learn'|'practice'|'review'|'simulation'|'flashcards'|'errors'

export interface ExamStudyPlanSettings{
  examDate:string|null
  startDate:string|null
  availableWeekdays:number[]
  minutesPerDay:number
  updatedAt:string
}
export interface PlannedTask{id:string;type:PlannedTaskType;title:string;description:string;minutes:number;route:string;pdCode:string|null}
export interface StudyPlanDay{date:string;phase:StudyPlanPhase;phaseLabel:string;minutes:number;tasks:PlannedTask[]}
export interface PhaseSummary{phase:StudyPlanPhase;label:string;purpose:string;days:number;startDate:string|null;endDate:string|null}
export interface ExamStudyPlan{
 generatedAt:string
 settings:ExamStudyPlanSettings
 daysUntilExam:number|null
 availableStudyDays:number
 paceStatus:PaceStatus
 paceMessage:string
 currentPhase:StudyPlanPhase
 phases:PhaseSummary[]
 agenda:StudyPlanDay[]
 plannedMinutes:number
 simulationDays:number
 recommendationBasis:string[]
}
