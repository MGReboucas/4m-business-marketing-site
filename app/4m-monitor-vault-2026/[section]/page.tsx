import { notFound } from 'next/navigation'
import type { PanelPage } from '../AdminDashboard'
import ProtectedPanel from '../ProtectedPanel'

type RouteContext = {
  params: Promise<{
    section: string
  }>
}

const pageBySection: Record<string, PanelPage> = {
  vendas: 'sales',
  projetos: 'projects',
  deploys: 'deploy',
  saas: 'saas',
  financeiro: 'finance',
  alertas: 'alerts',
  cadastro: 'create',
}

export default async function ProtectedSaasSection({ params }: RouteContext) {
  const { section } = await params
  const activePage = pageBySection[section]

  if (!activePage) {
    notFound()
  }

  return <ProtectedPanel activePage={activePage} />
}
