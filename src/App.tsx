import { lazy, Suspense } from 'react'
import { BarChart3 } from 'lucide-react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AppErrorBoundary } from './components/system/AppErrorBoundary'
import { StudentProvider, useStudent } from './features/profile/StudentProvider'
import { AppLayout } from './layouts/AppLayout'
import { PlaceholderPage } from './pages/PlaceholderPage'

const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const ContentsPage = lazy(() => import('./pages/ContentsPage').then((module) => ({ default: module.ContentsPage })))
const CurriculumPage = lazy(() => import('./pages/CurriculumPage').then((module) => ({ default: module.CurriculumPage })))
const ErrorNotebookPage = lazy(() => import('./pages/ErrorNotebookPage').then((module) => ({ default: module.ErrorNotebookPage })))
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage').then((module) => ({ default: module.FlashcardsPage })))
const ExamPage = lazy(() => import('./pages/ExamPage').then((module) => ({ default: module.ExamPage })))
const LessonPage = lazy(() => import('./pages/LessonPage').then((module) => ({ default: module.LessonPage })))
const QuestionsPage = lazy(() => import('./pages/QuestionsPage').then((module) => ({ default: module.QuestionsPage })))
const ReviewPage = lazy(() => import('./pages/ReviewPage').then((module) => ({ default: module.ReviewPage })))
const ReviewSessionPage = lazy(() => import('./pages/ReviewSessionPage').then((module) => ({ default: module.ReviewSessionPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })))
const SimulationHistoryPage = lazy(() => import('./pages/SimulationHistoryPage').then((module) => ({ default: module.SimulationHistoryPage })))
const SimulationResultPage = lazy(() => import('./pages/SimulationResultPage').then((module) => ({ default: module.SimulationResultPage })))
const SimulationsPage = lazy(() => import('./pages/SimulationsPage').then((module) => ({ default: module.SimulationsPage })))
const SourcesPage = lazy(() => import('./pages/SourcesPage').then((module) => ({ default: module.SourcesPage })))
const StudyPlanPage = lazy(() => import('./pages/StudyPlanPage').then((module) => ({ default: module.StudyPlanPage })))
const WelcomePage = lazy(() => import('./pages/WelcomePage').then((module) => ({ default: module.WelcomePage })))

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

function LoadingScreen() {
  return <div className="grid min-h-[50vh] place-items-center" role="status" aria-live="polite">
    <div className="text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500 dark:border-white/10 dark:border-t-emerald-300" aria-hidden="true"/>
      <p className="mt-3 text-sm font-semibold text-slate-500">Carregando...</p>
    </div>
  </div>
}

function LocalApp() {
  const { profile, loading } = useStudent()
  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500 dark:bg-[#07111c] dark:text-slate-300" role="status" aria-live="polite">Carregando seus estudos...</div>
  if (!profile) return <Suspense fallback={<LoadingScreen/>}><WelcomePage/></Suspense>
  return <Suspense fallback={<LoadingScreen/>}><RouterProvider router={router}/></Suspense>
}

export default function App() {
  return <AppErrorBoundary><StudentProvider><LocalApp/></StudentProvider></AppErrorBoundary>
}
