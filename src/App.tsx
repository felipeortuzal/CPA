import { BarChart3 } from 'lucide-react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { StudentProvider, useStudent } from './features/profile/StudentProvider'
import { AppLayout } from './layouts/AppLayout'
import { ContentsPage } from './pages/ContentsPage'
import { CurriculumPage } from './pages/CurriculumPage'
import { DashboardPage } from './pages/DashboardPage'
import { ErrorNotebookPage } from './pages/ErrorNotebookPage'
import { FlashcardsPage } from './pages/FlashcardsPage'
import { ExamPage } from './pages/ExamPage'
import { LessonPage } from './pages/LessonPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { QuestionsPage } from './pages/QuestionsPage'
import { ReviewPage } from './pages/ReviewPage'
import { ReviewSessionPage } from './pages/ReviewSessionPage'
import { SettingsPage } from './pages/SettingsPage'
import { SimulationHistoryPage } from './pages/SimulationHistoryPage'
import { SimulationResultPage } from './pages/SimulationResultPage'
import { SimulationsPage } from './pages/SimulationsPage'
import { SourcesPage } from './pages/SourcesPage'
import { StudyPlanPage } from './pages/StudyPlanPage'
import { WelcomePage } from './pages/WelcomePage'

const router = createBrowserRouter([
  { path:'/', element:<AppLayout/>, children:[
    { index:true, element:<DashboardPage/> },
    { path:'trilha', element:<CurriculumPage/> },
    { path:'conteudos', element:<ContentsPage/> },
    { path:'conteudos/:pdCode', element:<LessonPage/> },
    { path:'questoes', element:<QuestionsPage/> },
    { path:'simulados', element:<SimulationsPage/> },
    { path:'simulados/historico', element:<SimulationHistoryPage/> },
    { path:'plano', element:<StudyPlanPage/> },
    { path:'revisao', element:<ReviewPage/> },
    { path:'flashcards', element:<FlashcardsPage/> },
    { path:'erros', element:<ErrorNotebookPage/> },
    { path:'estatisticas', element:<PlaceholderPage title="Estatísticas" description="A plataforma já registra aulas, quizzes, questões, simulados e planos do Study Engine para análises mais profundas nas próximas etapas." icon={BarChart3}/> },
    { path:'fontes', element:<SourcesPage/> },
    { path:'configuracoes', element:<SettingsPage/> },
  ]},
  { path:'/revisao/sessao', element:<ReviewSessionPage/> },
  { path:'/prova/:simulationId', element:<ExamPage/> },
  { path:'/prova/:simulationId/resultado', element:<SimulationResultPage/> },
  { path:'*', element:<Navigate to="/" replace/> },
])

function LocalApp() {
  const { profile, loading } = useStudent()
  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500 dark:bg-[#07111c] dark:text-slate-300">Carregando seus estudos...</div>
  if (!profile) return <WelcomePage/>
  return <RouterProvider router={router}/>
}

export default function App() {
  return <StudentProvider><LocalApp/></StudentProvider>
}
