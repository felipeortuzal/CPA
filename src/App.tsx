import { BarChart3, BookOpen, Brain, ClipboardCheck, FileText, GraduationCap, RotateCcw, Settings, Target } from 'lucide-react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

const router = createBrowserRouter([{ path: '/', element: <AppLayout />, children: [
  { index: true, element: <DashboardPage /> },
  { path: 'trilha', element: <PlaceholderPage title="Trilha de Estudos" description="Acompanhe sua cobertura do Programa Detalhado da certificação selecionada." icon={GraduationCap} /> },
  { path: 'conteudos', element: <PlaceholderPage title="Conteúdos" description="Aulas, conceitos e materiais oficiais organizados por microtema." icon={BookOpen} /> },
  { path: 'questoes', element: <PlaceholderPage title="Questões" description="Treinos por tema, dificuldade e histórico de desempenho." icon={ClipboardCheck} /> },
  { path: 'simulados', element: <PlaceholderPage title="Simulados" description="Simulados completos e rápidos para medir sua preparação." icon={FileText} /> },
  { path: 'revisao', element: <PlaceholderPage title="Revisão" description="Fila diária inteligente de conteúdos e questões para revisar." icon={RotateCcw} /> },
  { path: 'flashcards', element: <PlaceholderPage title="Flashcards" description="Repetição espaçada para fixar conceitos importantes." icon={Brain} /> },
  { path: 'erros', element: <PlaceholderPage title="Caderno de Erros" description="Centralize os erros recorrentes e transforme-os em aprendizado." icon={Target} /> },
  { path: 'estatisticas', element: <PlaceholderPage title="Estatísticas" description="Evolução, acertos e desempenho detalhado por tema." icon={BarChart3} /> },
  { path: 'fontes', element: <PlaceholderPage title="Fontes" description="Registro das fontes oficiais e datas de verificação dos conteúdos." icon={FileText} /> },
  { path: 'configuracoes', element: <PlaceholderPage title="Configurações" description="Preferências da conta, certificação e experiência de estudo." icon={Settings} /> }
]}])
export default function App() { return <RouterProvider router={router} /> }
