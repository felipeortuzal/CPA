import { BarChart3, Brain, FileText, RotateCcw } from 'lucide-react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { StudentProvider, useStudent } from './features/profile/StudentProvider'
import { AppLayout } from './layouts/AppLayout'
import { ContentsPage } from './pages/ContentsPage'
import { CurriculumPage } from './pages/CurriculumPage'
import { DashboardPage } from './pages/DashboardPage'
import { ErrorNotebookPage } from './pages/ErrorNotebookPage'
import { LessonPage } from './pages/LessonPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { QuestionsPage } from './pages/QuestionsPage'
import { SettingsPage } from './pages/SettingsPage'
import { SourcesPage } from './pages/SourcesPage'
import { WelcomePage } from './pages/WelcomePage'

const router = createBrowserRouter([{ path:'/', element:<AppLayout/>, children:[
  { index:true, element:<DashboardPage/> },
  { path:'trilha', element:<CurriculumPage/> },
  { path:'conteudos', element:<ContentsPage/> },
  { path:'conteudos/:pdCode', element:<LessonPage/> },
  { path:'questoes', element:<QuestionsPage/> },
  { path:'simulados', element:<PlaceholderPage title="Simulados" description="Os simulados completos serão implementados na próxima etapa sobre o banco de questões já existente." icon={FileText}/> },
  { path:'revisao', element:<PlaceholderPage title="Revisão" description="A fila inteligente de revisão será construída sobre o progresso local, questões e flashcards." icon={RotateCcw}/> },
  { path:'flashcards', element:<PlaceholderPage title="Flashcards" description="As aulas já contêm flashcards; o modo de repetição espaçada virá na etapa própria." icon={Brain}/> },
  { path:'erros', element:<ErrorNotebookPage/> },
  { path:'estatisticas', element:<PlaceholderPage title="Estatísticas" description="O histórico local já registra aulas, quizzes e questões para análises mais profundas nas próximas etapas." icon={BarChart3}/> },
  { path:'fontes', element:<SourcesPage/> },
  { path:'configuracoes', element:<SettingsPage/> },
]} , { path:'*', element:<Navigate to="/" replace/> }])

function LocalApp() { const { profile, loading } = useStudent(); if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500 dark:bg-[#07111c] dark:text-slate-300">Carregando seus estudos...</div>; if (!profile) return <WelcomePage/>; return <RouterProvider router={router}/> }
export default function App() { return <StudentProvider><LocalApp/></StudentProvider> }
