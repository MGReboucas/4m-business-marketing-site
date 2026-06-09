import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import {
  listSaasProducts,
  SaasInput,
  SaasPriority,
  SaasStatus,
  upsertSaasProduct,
} from '@/lib/saasRepository'

const validStatuses: SaasStatus[] = ['online', 'attention', 'offline']
const validPriorities: SaasPriority[] = ['Baixa', 'Média', 'Alta']

const requireAdminSession = async () => {
  const session = await getAdminSession()

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  return null
}

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const toInteger = (value: unknown) => Math.max(0, Math.round(Number(value) || 0))

const toUptime = (value: unknown) =>
  Math.min(100, Math.max(0, Number(Number(value || 0).toFixed(2))))

const parseSaasInput = (body: Record<string, unknown>) => {
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

  const baseId = slugify(String(body.id || `${client}-${name}`))
  const id = baseId || `saas-${Date.now()}`

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

export async function GET() {
  const unauthorized = await requireAdminSession()

  if (unauthorized) {
    return unauthorized
  }

  try {
    const products = await listSaasProducts()

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Erro ao listar SaaS:', error)
    return NextResponse.json(
      {
        error:
          'Não foi possível conectar ao banco Neon. Verifique NEON_DATABASE_URL.',
      },
      { status: 503 },
    )
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminSession()

  if (unauthorized) {
    return unauthorized
  }

  try {
    const body = await request.json()
    const product = parseSaasInput(body)
    const savedProduct = await upsertSaasProduct(product)

    return NextResponse.json({ product: savedProduct }, { status: 201 })
  } catch (error) {
    console.error('Erro ao salvar SaaS:', error)
    const message =
      error instanceof Error ? error.message : 'Não foi possível salvar o SaaS.'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
