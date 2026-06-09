import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import {
  deleteSaasProduct,
  SaasInput,
  SaasPriority,
  SaasStatus,
  upsertSaasProduct,
} from '@/lib/saasRepository'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

const validStatuses: SaasStatus[] = ['online', 'attention', 'offline']
const validPriorities: SaasPriority[] = ['Baixa', 'Média', 'Alta']

const requireAdminSession = async () => {
  const session = await getAdminSession()

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  return null
}

const toInteger = (value: unknown) => Math.max(0, Math.round(Number(value) || 0))

const toUptime = (value: unknown) =>
  Math.min(100, Math.max(0, Number(Number(value || 0).toFixed(2))))

const parseSaasInput = (id: string, body: Record<string, unknown>) => {
  const name = String(body.name || '').trim()
  const client = String(body.client || '').trim()
  const segment = String(body.segment || '').trim()
  const plan = String(body.plan || '').trim()
  const status = String(body.status || 'online') as SaasStatus
  const priority = String(body.priority || 'Baixa') as SaasPriority

  if (!name || !client || !segment || !plan) {
    throw new Error('Preencha nome, cliente, segmento e plano.')
  }

  if (!validStatuses.includes(status)) {
    throw new Error('Status inválido.')
  }

  if (!validPriorities.includes(priority)) {
    throw new Error('Prioridade inválida.')
  }

  return {
    id,
    name,
    client,
    segment,
    plan,
    status,
    uptime: toUptime(body.uptime),
    mrr: toInteger(body.mrr),
    users: toInteger(body.users),
    tickets: toInteger(body.tickets),
    lastDeploy: String(body.lastDeploy || '').trim(),
    renewal: String(body.renewal || '').trim(),
    owner: String(body.owner || 'Equipe 4M').trim(),
    priority,
  } satisfies SaasInput
}

export async function PUT(request: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminSession()

  if (unauthorized) {
    return unauthorized
  }

  try {
    const { id } = await params
    const body = await request.json()
    const product = parseSaasInput(id, body)
    const savedProduct = await upsertSaasProduct(product)

    return NextResponse.json({ product: savedProduct })
  } catch (error) {
    console.error('Erro ao atualizar SaaS:', error)
    const message =
      error instanceof Error ? error.message : 'Não foi possível atualizar.'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminSession()

  if (unauthorized) {
    return unauthorized
  }

  try {
    const { id } = await params
    const deleted = await deleteSaasProduct(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'SaaS não encontrado.' },
        { status: 404 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erro ao excluir SaaS:', error)
    return NextResponse.json(
      { error: 'Não foi possível excluir o SaaS.' },
      { status: 400 },
    )
  }
}
