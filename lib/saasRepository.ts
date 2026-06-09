import { neon } from '@neondatabase/serverless'

export type SaasStatus = 'online' | 'attention' | 'offline'
export type SaasPriority = 'Baixa' | 'M\u00e9dia' | 'Alta'

export type SaasProduct = {
  id: string
  name: string
  client: string
  segment: string
  plan: string
  status: SaasStatus
  uptime: number
  mrr: number
  users: number
  tickets: number
  lastDeploy: string
  renewal: string
  owner: string
  priority: SaasPriority
  createdAt?: string
  updatedAt?: string
}

export type SaasInput = Omit<SaasProduct, 'createdAt' | 'updatedAt'>

type SaasRow = {
  id: string
  name: string
  client: string
  segment: string
  plan: string
  status: SaasStatus
  uptime: string | number
  mrr: string | number
  users_count: string | number
  tickets_count: string | number
  last_deploy: string
  renewal: string
  owner: string
  priority: SaasPriority
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

const toSaasProduct = (row: SaasRow): SaasProduct => ({
  id: row.id,
  name: row.name,
  client: row.client,
  segment: row.segment,
  plan: row.plan,
  status: row.status,
  uptime: Number(row.uptime),
  mrr: Number(row.mrr),
  users: Number(row.users_count),
  tickets: Number(row.tickets_count),
  lastDeploy: row.last_deploy,
  renewal: row.renewal,
  owner: row.owner,
  priority: row.priority,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const ensureSaasSchema = async () => {
  const sql = getSql()

  await sql`
    CREATE TABLE IF NOT EXISTS saas_products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      client TEXT NOT NULL,
      segment TEXT NOT NULL,
      plan TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('online', 'attention', 'offline')),
      uptime NUMERIC(5, 2) NOT NULL DEFAULT 0,
      mrr INTEGER NOT NULL DEFAULT 0,
      users_count INTEGER NOT NULL DEFAULT 0,
      tickets_count INTEGER NOT NULL DEFAULT 0,
      last_deploy TEXT NOT NULL DEFAULT '',
      renewal TEXT NOT NULL DEFAULT '',
      owner TEXT NOT NULL DEFAULT '',
      priority TEXT NOT NULL CHECK (priority IN ('Baixa', 'M\u00e9dia', 'Alta')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export const listSaasProducts = async () => {
  await ensureSaasSchema()

  const sql = getSql()
  const rows = (await sql`
    SELECT
      id,
      name,
      client,
      segment,
      plan,
      status,
      uptime,
      mrr,
      users_count,
      tickets_count,
      last_deploy,
      renewal,
      owner,
      priority,
      created_at::text,
      updated_at::text
    FROM saas_products
    ORDER BY
      CASE status
        WHEN 'offline' THEN 1
        WHEN 'attention' THEN 2
        ELSE 3
      END,
      updated_at DESC,
      name ASC
  `) as SaasRow[]

  return rows.map(toSaasProduct)
}

export const upsertSaasProduct = async (
  product: SaasInput,
  ensureSchema = true,
) => {
  if (ensureSchema) {
    await ensureSaasSchema()
  }

  const sql = getSql()
  const rows = (await sql`
    INSERT INTO saas_products (
      id,
      name,
      client,
      segment,
      plan,
      status,
      uptime,
      mrr,
      users_count,
      tickets_count,
      last_deploy,
      renewal,
      owner,
      priority
    )
    VALUES (
      ${product.id},
      ${product.name},
      ${product.client},
      ${product.segment},
      ${product.plan},
      ${product.status},
      ${product.uptime},
      ${product.mrr},
      ${product.users},
      ${product.tickets},
      ${product.lastDeploy},
      ${product.renewal},
      ${product.owner},
      ${product.priority}
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      client = EXCLUDED.client,
      segment = EXCLUDED.segment,
      plan = EXCLUDED.plan,
      status = EXCLUDED.status,
      uptime = EXCLUDED.uptime,
      mrr = EXCLUDED.mrr,
      users_count = EXCLUDED.users_count,
      tickets_count = EXCLUDED.tickets_count,
      last_deploy = EXCLUDED.last_deploy,
      renewal = EXCLUDED.renewal,
      owner = EXCLUDED.owner,
      priority = EXCLUDED.priority,
      updated_at = NOW()
    RETURNING
      id,
      name,
      client,
      segment,
      plan,
      status,
      uptime,
      mrr,
      users_count,
      tickets_count,
      last_deploy,
      renewal,
      owner,
      priority,
      created_at::text,
      updated_at::text
  `) as SaasRow[]
  const [row] = rows

  return toSaasProduct(row)
}

export const deleteSaasProduct = async (id: string) => {
  await ensureSaasSchema()

  const sql = getSql()
  const rows = (await sql`
    DELETE FROM saas_products
    WHERE id = ${id}
    RETURNING id
  `) as Array<{ id: string }>
  const [row] = rows

  return Boolean(row)
}
