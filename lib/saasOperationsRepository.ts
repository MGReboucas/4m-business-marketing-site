import { neon } from '@neondatabase/serverless'

export type OperationStage =
  | 'lead'
  | 'proposal'
  | 'contract'
  | 'development'
  | 'deploy'
  | 'operation'
  | 'lost'

export type OperationPriority = 'Baixa' | 'Media' | 'Alta'
export type OperationHealth = 'online' | 'attention' | 'offline'

export type SaasOperationRecord = {
  id: string
  client: string
  contactName: string
  contactPhone: string
  contactEmail: string
  projectName: string
  segment: string
  source: string
  stage: OperationStage
  priority: OperationPriority
  owner: string
  proposalValue: number
  setupValue: number
  monthlyValue: number
  costValue: number
  users: number
  tickets: number
  uptime: number
  health: OperationHealth
  saleDate: string
  contractDate: string
  expectedDeploy: string
  deployedAt: string
  renewal: string
  nextAction: string
  notes: string
  createdAt?: string
  updatedAt?: string
}

export type SaasOperationInput = Omit<
  SaasOperationRecord,
  'createdAt' | 'updatedAt'
>

type SaasOperationRow = {
  id: string
  client: string
  contact_name: string
  contact_phone: string
  contact_email: string
  project_name: string
  segment: string
  source: string
  stage: OperationStage
  priority: OperationPriority
  owner: string
  proposal_value: string | number
  setup_value: string | number
  monthly_value: string | number
  cost_value: string | number
  users_count: string | number
  tickets_count: string | number
  uptime: string | number
  health: OperationHealth
  sale_date: string
  contract_date: string
  expected_deploy: string
  deployed_at: string
  renewal: string
  next_action: string
  notes: string
  created_at?: string
  updated_at?: string
}

const getDatabaseUrl = () =>
  process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || ''

const getSql = () => {
  const databaseUrl = getDatabaseUrl()

  if (!databaseUrl) {
    throw new Error('NEON_DATABASE_URL nao configurada')
  }

  return neon(databaseUrl)
}

const toNumber = (value: string | number) => Number(value || 0)

const toOperationRecord = (row: SaasOperationRow): SaasOperationRecord => ({
  id: row.id,
  client: row.client,
  contactName: row.contact_name,
  contactPhone: row.contact_phone,
  contactEmail: row.contact_email,
  projectName: row.project_name,
  segment: row.segment,
  source: row.source,
  stage: row.stage,
  priority: row.priority,
  owner: row.owner,
  proposalValue: toNumber(row.proposal_value),
  setupValue: toNumber(row.setup_value),
  monthlyValue: toNumber(row.monthly_value),
  costValue: toNumber(row.cost_value),
  users: toNumber(row.users_count),
  tickets: toNumber(row.tickets_count),
  uptime: toNumber(row.uptime),
  health: row.health,
  saleDate: row.sale_date,
  contractDate: row.contract_date,
  expectedDeploy: row.expected_deploy,
  deployedAt: row.deployed_at,
  renewal: row.renewal,
  nextAction: row.next_action,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const ensureSaasOperationsSchema = async () => {
  const sql = getSql()

  await sql`
    CREATE TABLE IF NOT EXISTS saas_operations (
      id TEXT PRIMARY KEY,
      client TEXT NOT NULL,
      contact_name TEXT NOT NULL DEFAULT '',
      contact_phone TEXT NOT NULL DEFAULT '',
      contact_email TEXT NOT NULL DEFAULT '',
      project_name TEXT NOT NULL,
      segment TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT '',
      stage TEXT NOT NULL CHECK (
        stage IN (
          'lead',
          'proposal',
          'contract',
          'development',
          'deploy',
          'operation',
          'lost'
        )
      ),
      priority TEXT NOT NULL CHECK (priority IN ('Baixa', 'Media', 'Alta')),
      owner TEXT NOT NULL DEFAULT '',
      proposal_value INTEGER NOT NULL DEFAULT 0,
      setup_value INTEGER NOT NULL DEFAULT 0,
      monthly_value INTEGER NOT NULL DEFAULT 0,
      cost_value INTEGER NOT NULL DEFAULT 0,
      users_count INTEGER NOT NULL DEFAULT 0,
      tickets_count INTEGER NOT NULL DEFAULT 0,
      uptime NUMERIC(5, 2) NOT NULL DEFAULT 0,
      health TEXT NOT NULL CHECK (health IN ('online', 'attention', 'offline')),
      sale_date TEXT NOT NULL DEFAULT '',
      contract_date TEXT NOT NULL DEFAULT '',
      expected_deploy TEXT NOT NULL DEFAULT '',
      deployed_at TEXT NOT NULL DEFAULT '',
      renewal TEXT NOT NULL DEFAULT '',
      next_action TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export const listSaasOperations = async () => {
  await ensureSaasOperationsSchema()

  const sql = getSql()
  const rows = (await sql`
    SELECT
      id,
      client,
      contact_name,
      contact_phone,
      contact_email,
      project_name,
      segment,
      source,
      stage,
      priority,
      owner,
      proposal_value,
      setup_value,
      monthly_value,
      cost_value,
      users_count,
      tickets_count,
      uptime,
      health,
      sale_date,
      contract_date,
      expected_deploy,
      deployed_at,
      renewal,
      next_action,
      notes,
      created_at::text,
      updated_at::text
    FROM saas_operations
    ORDER BY
      CASE stage
        WHEN 'lead' THEN 1
        WHEN 'proposal' THEN 2
        WHEN 'contract' THEN 3
        WHEN 'development' THEN 4
        WHEN 'deploy' THEN 5
        WHEN 'operation' THEN 6
        ELSE 7
      END,
      updated_at DESC,
      client ASC
  `) as SaasOperationRow[]

  return rows.map(toOperationRecord)
}

export const upsertSaasOperation = async (
  record: SaasOperationInput,
  ensureSchema = true,
) => {
  if (ensureSchema) {
    await ensureSaasOperationsSchema()
  }

  const sql = getSql()
  const rows = (await sql`
    INSERT INTO saas_operations (
      id,
      client,
      contact_name,
      contact_phone,
      contact_email,
      project_name,
      segment,
      source,
      stage,
      priority,
      owner,
      proposal_value,
      setup_value,
      monthly_value,
      cost_value,
      users_count,
      tickets_count,
      uptime,
      health,
      sale_date,
      contract_date,
      expected_deploy,
      deployed_at,
      renewal,
      next_action,
      notes
    )
    VALUES (
      ${record.id},
      ${record.client},
      ${record.contactName},
      ${record.contactPhone},
      ${record.contactEmail},
      ${record.projectName},
      ${record.segment},
      ${record.source},
      ${record.stage},
      ${record.priority},
      ${record.owner},
      ${record.proposalValue},
      ${record.setupValue},
      ${record.monthlyValue},
      ${record.costValue},
      ${record.users},
      ${record.tickets},
      ${record.uptime},
      ${record.health},
      ${record.saleDate},
      ${record.contractDate},
      ${record.expectedDeploy},
      ${record.deployedAt},
      ${record.renewal},
      ${record.nextAction},
      ${record.notes}
    )
    ON CONFLICT (id) DO UPDATE SET
      client = EXCLUDED.client,
      contact_name = EXCLUDED.contact_name,
      contact_phone = EXCLUDED.contact_phone,
      contact_email = EXCLUDED.contact_email,
      project_name = EXCLUDED.project_name,
      segment = EXCLUDED.segment,
      source = EXCLUDED.source,
      stage = EXCLUDED.stage,
      priority = EXCLUDED.priority,
      owner = EXCLUDED.owner,
      proposal_value = EXCLUDED.proposal_value,
      setup_value = EXCLUDED.setup_value,
      monthly_value = EXCLUDED.monthly_value,
      cost_value = EXCLUDED.cost_value,
      users_count = EXCLUDED.users_count,
      tickets_count = EXCLUDED.tickets_count,
      uptime = EXCLUDED.uptime,
      health = EXCLUDED.health,
      sale_date = EXCLUDED.sale_date,
      contract_date = EXCLUDED.contract_date,
      expected_deploy = EXCLUDED.expected_deploy,
      deployed_at = EXCLUDED.deployed_at,
      renewal = EXCLUDED.renewal,
      next_action = EXCLUDED.next_action,
      notes = EXCLUDED.notes,
      updated_at = NOW()
    RETURNING
      id,
      client,
      contact_name,
      contact_phone,
      contact_email,
      project_name,
      segment,
      source,
      stage,
      priority,
      owner,
      proposal_value,
      setup_value,
      monthly_value,
      cost_value,
      users_count,
      tickets_count,
      uptime,
      health,
      sale_date,
      contract_date,
      expected_deploy,
      deployed_at,
      renewal,
      next_action,
      notes,
      created_at::text,
      updated_at::text
  `) as SaasOperationRow[]
  const [row] = rows

  return toOperationRecord(row)
}

export const deleteSaasOperation = async (id: string) => {
  await ensureSaasOperationsSchema()

  const sql = getSql()
  const rows = (await sql`
    DELETE FROM saas_operations
    WHERE id = ${id}
    RETURNING id
  `) as Array<{ id: string }>
  const [row] = rows

  return Boolean(row)
}
