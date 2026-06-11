import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import {
  listSaasOperations,
  OperationHealth,
  OperationPriority,
  OperationStage,
  SaasOperationInput,
  upsertSaasOperation,
} from '@/lib/saasOperationsRepository'

const validStages: OperationStage[] = [
  'lead',
  'proposal',
  'contract',
  'development',
  'deploy',
  'operation',
  'lost',
]
const validPriorities: OperationPriority[] = ['Baixa', 'Media', 'Alta']
const validHealth: OperationHealth[] = ['online', 'attention', 'offline']

const requireAdminSession = async () => {
  const session = await getAdminSession()

  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 })
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

const parseOperationInput = (body: Record<string, unknown>) => {
  const client = String(body.client || '').trim()
  const projectName = String(body.projectName || '').trim()
  const stage = String(body.stage || 'lead') as OperationStage
  const priority = String(body.priority || 'Baixa') as OperationPriority
  const health = String(body.health || 'online') as OperationHealth

  if (!client || !projectName) {
    throw new Error('Preencha cliente e nome do SaaS/projeto.')
  }

  if (!validStages.includes(stage)) {
    throw new Error('Etapa invalida.')
  }

  if (!validPriorities.includes(priority)) {
    throw new Error('Prioridade invalida.')
  }

  if (!validHealth.includes(health)) {
    throw new Error('Saude invalida.')
  }

  const baseId = slugify(String(body.id || `${client}-${projectName}`))
  const id = baseId || `operacao-${Date.now()}`

  return {
    id,
    client,
    contactName: String(body.contactName || '').trim(),
    contactPhone: String(body.contactPhone || '').trim(),
    contactEmail: String(body.contactEmail || '').trim(),
    projectName,
    segment: String(body.segment || '').trim(),
    source: String(body.source || '').trim(),
    stage,
    priority,
    owner: String(body.owner || 'Equipe 4M').trim(),
    proposalValue: toInteger(body.proposalValue),
    setupValue: toInteger(body.setupValue),
    monthlyValue: toInteger(body.monthlyValue),
    costValue: toInteger(body.costValue),
    users: toInteger(body.users),
    tickets: toInteger(body.tickets),
    uptime: toUptime(body.uptime),
    health,
    saleDate: String(body.saleDate || '').trim(),
    contractDate: String(body.contractDate || '').trim(),
    expectedDeploy: String(body.expectedDeploy || '').trim(),
    deployedAt: String(body.deployedAt || '').trim(),
    renewal: String(body.renewal || '').trim(),
    nextAction: String(body.nextAction || '').trim(),
    notes: String(body.notes || '').trim(),
  } satisfies SaasOperationInput
}

export async function GET() {
  const unauthorized = await requireAdminSession()

  if (unauthorized) {
    return unauthorized
  }

  try {
    const records = await listSaasOperations()

    return NextResponse.json({ records })
  } catch (error) {
    console.error('Erro ao listar operacoes SaaS:', error)
    return NextResponse.json(
      {
        error:
          'Nao foi possivel conectar ao banco Neon. Verifique NEON_DATABASE_URL.',
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
    const record = parseOperationInput(body)
    const savedRecord = await upsertSaasOperation(record)

    return NextResponse.json({ record: savedRecord }, { status: 201 })
  } catch (error) {
    console.error('Erro ao salvar operacao SaaS:', error)
    const message =
      error instanceof Error ? error.message : 'Nao foi possivel salvar.'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
