export type QuestionDifficulty = 'easy' | 'medium' | 'hard'
export type CognitiveLevel = 'comprehension' | 'application' | 'analysis'
export type QuestionType = 'multiple_choice' | 'case' | 'dialog_tree'

export interface QuestionOfficialSource {
  id: string
  institution: string
  title: string
  url: string
  verifiedAt: string
}

export interface CPAQuestion {
  reviewStatus?: 'draft' | 'reviewed' | 'verified'
  origin?: 'authored' | 'generated'
  conceptId?: string
  reviewEvidence?: string
  id: string
  certification: 'CPA'
  pdCode: string
  macroTopic: string
  topic: string
  difficulty: QuestionDifficulty
  cognitiveLevel: CognitiveLevel
  questionType: QuestionType
  context: string
  prompt: string
  options: [string, string, string, string]
  correctAnswer: 0 | 1 | 2 | 3
  explanation: string
  whyOthersAreWrong: [string, string, string, string]
  officialSources: QuestionOfficialSource[]
  verifiedAt: string
}

export interface QuestionDraft extends Omit<CPAQuestion, 'certification' | 'officialSources' | 'verifiedAt'> {
  sourceIds: QuestionSourceId[]
}

export type QuestionSourceId =
  | 'ANBIMA_PD'
  | 'BCB_SFN'
  | 'BCB_SPB'
  | 'BCB_MONETARY'
  | 'BCB_SELIC'
  | 'BCB_CAMBIO'
  | 'BCB_PIX'
  | 'BCB_SCR'
  | 'BCB_OPEN_FINANCE'
  | 'BCB_DREX'
  | 'CVM'
  | 'CVM_30'
  | 'CVM_62'
  | 'CVM_175'
  | 'CVM_ESG'
  | 'ANBIMA_DISTRIBUICAO'
  | 'SUSEP'
  | 'SUSEP_PREVIDENCIA'
  | 'SUSEP_OPEN_INSURANCE'
  | 'PREVIC'
  | 'FGC'
  | 'TESOURO_DIRETO'
  | 'B3'
  | 'ANPD_LGPD'
  | 'PLANALTO_LGPD'
  | 'PLANALTO_LRF'
