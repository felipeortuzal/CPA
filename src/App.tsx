import { BarChart3, Brain, RotateCcw } from 'lucide-react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { StudentProvider, useStudent } from './features/profile/StudentProvider'
import { AppLayout } from './layouts/AppLayout'
import { ContentsPage } from './pages/ContentsPage'
import { CurriculumPage } from './pages/CurriculumPage'
import { DashboardPage } from './pages/DashboardPage'
import { ErrorNotebookPage } from './pages/ErrorNotebookPage'
import { ExamPage } from './pages/ExamPage'
import { LessonPage } from './pages/LessonPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { QuestionsPage } from './pages/QuestionsPage'
import { SettingsPage } from './pages/SettingsPage'
import { SimulationHistoryPage } from './pages/SimulationHistoryPage'
import { SimulationResultPage } from './pages/SimulationResultPage'
import { SimulationsPage } from './pages/SimulationsPage'
import { SourcesPage } from './pages/SourcesPage'
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
    { path:'revisao', element:<PlaceholderPage title="Revisão" description="A fila inteligente de revisão será construída sobre o progresso local, questões e flashcards." icon={RotateCcw}/> },
    { path:'flashcards', element:<PlaceholderPage title="Flashcards" description="As aulas já contêm flashcards; o modo de repetição espaçada virá na etapa própria." icon={Brain}/> },
    { path:'erros', element:<ErrorNotebookPage/> },
    { path:'estatisticas', element:<PlaceholderPage title="Estatísticas" description="A plataforma já registra aulas, quizzes, questões e simulados para análises mais profundas nas próximas etapas." icon={BarChart3}/> },
    { path:'fontes', element:<SourcesPage/> },
    { path:'configuracoes', element:<SettingsPage/> },
  ]},
  { path:'/prova/:simulationId', element:<ExamPage/> },
  { path:'/prova/:simulationId/resultado', element:<SimulationResultPage/> },
  { path:'*', element:<Navigate to="/" replace/> },
])

function LocalApp() { const { profile, loading } = useStudent(); if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500 dark:bg-[#07111c] dark:text-slate-300">Carregando seus estudos...</div>; if (!profile) return <WelcomePage/>; return <RouterProvider router={router}/> }
export default function App() { return <StudentProvider><LocalApp/></StudentProvider> }
