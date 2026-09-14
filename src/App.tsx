import type { ReactNode } from 'react'
import { BarChart3, BookOpen, Brain, ClipboardCheck, FileText, GraduationCap, RotateCcw, Target } from 'lucide-react'
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider, useAuth } from './features/auth/AuthProvider'
import { ProfileProvider } from './features/auth/ProfileProvider'
import { AppLayout } from './layouts/AppLayout'
import { LoginPage, RecoveryPage, SignUpPage, UpdatePasswordPage } from './pages/AuthPages'
import { DashboardPage } from './pages/DashboardPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { SettingsPage } from './pages/SettingsPage'

function FullPageLoading() {
  return <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-500 dark:bg-[#07111c] dark:text-slate-300"><div className="text-center"><div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-400"/><p className="text-sm">Carregando sessão...</p></div></div>
}

function ProtectedApp() {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoading />
  if (!user) return <Navigate to="/login" replace />
  return <ProfileProvider><AppLayout /></ProfileProvider>
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoading />
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

const router = createBrowserRouter([
  { path: '/login', element: <PublicOnly><LoginPage /></PublicOnly> },
  { path: '/cadastro', element: <PublicOnly><SignUpPage /></PublicOnly> },
  { path: '/recuperar-senha', element: <PublicOnly><RecoveryPage /></PublicOnly> },
  { path: '/nova-senha', element: <UpdatePasswordPage /> },
  {
    path: '/',
    element: <ProtectedApp />,
    children: [
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
      { path: 'configuracoes', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function App() {
  return <AuthProvider><RouterProvider router={router} /></AuthProvider>
}
