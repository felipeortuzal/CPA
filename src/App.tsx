import { BarChart3, Brain, ClipboardCheck, FileText, RotateCcw, Target } from 'lucide-react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { StudentProvider, useStudent } from './features/profile/StudentProvider'
import { AppLayout } from './layouts/AppLayout'
import { ContentsPage } from './pages/ContentsPage'
import { CurriculumPage } from './pages/CurriculumPage'
import { DashboardPage } from './pages/DashboardPage'
import { LessonPage } from './pages/LessonPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { SettingsPage } from './pages/SettingsPage'
import { SourcesPage } from './pages/SourcesPage'
import { WelcomePage } from './pages/WelcomePage'

const router = createBrowserRouter([{ path:'/', element:<AppLayout/>, children:[
  { index:true, element:<DashboardPage/> },
  { path:'trilha', element:<CurriculumPage/> },
  { path:'conteudos', element:<ContentsPage/> },
  { path:'conteudos/:pdCode', element:<LessonPage/> },
  { path:'questoes', element:<PlaceholderPage title="Questões" description="O banco original de questões será implementado na próxima etapa." icon={ClipboardCheck}/> },
  { path:'simulados', element:<PlaceholderPage title="Simulados" description="Os simulados completos serão implementados depois do banco de questões." icon={FileText}/> },
  { path:'revisao', element:<PlaceholderPage title="Revisão" description="A fila inteligente de revisão será construída sobre o progresso local já salvo." icon={RotateCcw}/> },
  { path:'flashcards', element:<PlaceholderPage title="Flashcards" description="As aulas já contêm flashcards; o modo de repetição espaçada virá na etapa própria." icon={Brain}/> },
  { path:'erros', element:<PlaceholderPage title="Caderno de Erros" description="O armazenamento local já está preparado para o futuro caderno de erros." icon={Target}/> },
  { path:'estatisticas', element:<PlaceholderPage title="Estatísticas" description="O histórico local está preparado para análises mais profundas nas próximas etapas." icon={BarChart3}/> },
  { path:'fontes', element:<SourcesPage/> },
  { path:'configuracoes', element:<SettingsPage/> },
]} , { path:'*', element:<Navigate to="/" replace/> }])

function LocalApp() { const { profile, loading } = useStudent(); if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500 dark:bg-[#07111c] dark:text-slate-300">Carregando seus estudos...</div>; if (!profile) return <WelcomePage/>; return <RouterProvider router={router}/> }
export default function App() { return <StudentProvider><LocalApp/></StudentProvider> }
