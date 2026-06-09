import { getAdminSession, isAdminAuthConfigured } from '@/lib/adminAuth'
import AdminDashboard from './AdminDashboard'
import LoginPanel from './LoginPanel'

export default async function ProtectedSaasPanel() {
  const session = await getAdminSession()

  if (!session) {
    return <LoginPanel isConfigured={isAdminAuthConfigured()} />
  }

  return <AdminDashboard username={session.user} />
}
