import { getAdminSession, isAdminAuthConfigured } from '@/lib/adminAuth'
import AdminDashboard, { PanelPage } from './AdminDashboard'
import LoginPanel from './LoginPanel'

type ProtectedPanelProps = {
  activePage: PanelPage
}

export default async function ProtectedPanel({ activePage }: ProtectedPanelProps) {
  const session = await getAdminSession()

  if (!session) {
    return <LoginPanel isConfigured={isAdminAuthConfigured()} />
  }

  return <AdminDashboard username={session.user} activePage={activePage} />
}
