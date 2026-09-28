import fundamentals from './fundamentals.txt?raw'
import investments from './investments.txt?raw'
import banking from './banking.txt?raw'
import client from './client.txt?raw'
import innovation from './innovation.txt?raw'
import { makeQuestion } from '../builder'
import { courseModules, courseModuleMap } from '../../course/modules'
import type { CPAQuestion, QuestionSourceId } from '../types'
const counters=new Map<string,number>()
export const expandedQuestions:CPAQuestion[]=[]
for(const file of [fundamentals,investments,banking,client,innovation]) {
  let moduleId='',pdCode='',source='ANBIMA_PD'
  for(const line of file.split(/\r?\n/).filter(Boolean)) {
    if(line.startsWith('# ')){[moduleId,pdCode,source]=line.slice(2).split('|');continue}
    const cells=line.split('|')
    if(cells.length!==8||!courseModuleMap.has(moduleId))throw new Error(`Questão editorial malformada: ${moduleId} ${cells[0]}`)
    const [topic,context,prompt,correct,explanation,...wrong]=cells
    const pairs=wrong.map(text=>text.split('~'))
    if(pairs.some(pair=>pair.length!==2))throw new Error(`Distrator sem justificativa: ${topic}`)
    const n=(counters.get(moduleId)??0)+1;counters.set(moduleId,n)
    const module=courseModuleMap.get(moduleId)!
    const id=`CPA-V25-${String(courseModules.indexOf(module)+1).padStart(2,'0')}-${String(n).padStart(2,'0')}`
    expandedQuestions.push(makeQuestion({id,pdCode,macroTopic:module.stage,topic,context,prompt,options:[correct,...pairs.map(pair=>pair[0])] as CPAQuestion['options'],correctAnswer:0,explanation,whyOthersAreWrong:['',...pairs.map(pair=>pair[1])] as CPAQuestion['whyOthersAreWrong'],difficulty:'medium',cognitiveLevel:'application',questionType:'case',reviewStatus:'draft',conceptId:`${moduleId}:${topic}`,sourceIds:source==='ANBIMA_PD'?['ANBIMA_PD']:['ANBIMA_PD',source as QuestionSourceId]}))
  }
}
