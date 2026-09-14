export interface LessonSource { id:string; institution:string; title:string; url:string; verifiedAt:string }
export interface LessonComparison { left:string; right:string; explanation:string }
export interface LessonFormula { name:string; expression:string; explanation:string }
export interface LessonFlashcard { front:string; back:string }
export interface LessonQuizQuestion { question:string; options:string[]; correctIndex:number; explanation:string }
export interface CPALesson {
  certification:'CPA'; programVersion:'1.2'; pdCode:string; parentCode:string|null; title:string
  oneSentence:string; beginnerExplanation:string; completeExplanation:string[]; essentialConcepts:string[]; examFocus:string[]
  practicalExample:string; comparisons:LessonComparison[]; formulas:LessonFormula[]; traps:string[]; reviewSummary:string[]
  flashcards:LessonFlashcard[]; miniQuiz:LessonQuizQuestion[]; officialSources:LessonSource[]; searchTerms:string[]; lastVerified:string
}
