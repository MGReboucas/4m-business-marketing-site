import { neon } from '@neondatabase/serverless'

export type SaasStatus = 'online' | 'attention' | 'offline'
export type SaasPriority = 'Baixa' | 'Média' | 'Alta'

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

const initialSaasProducts: SaasInput[] = [
  {
    id: 'limpfy-ops',
    name: 'Limpfy Ops',
    client: 'Limpfy',
    segment: 'Serviços de limpeza',
    plan: 'Gestão Operacional',
    status: 'online',
    uptime: 99.98,
    mrr: 2480,
    users: 42,
    tickets: 1,
    lastDeploy: '09 jun 2026, 09:12',
    renewal: '18 jun 2026',
    owner: 'Equipe Produto',
    priority: 'Baixa',
  },
  {
    id: 'free-multas-crm',
    name: 'Free Multas CRM',
    client: 'Free Multas',
    segment: 'Consultoria automotiva',
    plan: 'CRM e Atendimento',
    status: 'attention',
    uptime: 98.72,
    mrr: 3200,
    users: 28,
    tickets: 3,
    lastDeploy: '07 jun 2026, 18:40',
    renewal: '30 jun 2026',
    owner: 'Suporte 4M',
    priority: 'Alta',
  },
  {
    id: 'ana-beatriz-agenda',
    name: 'Ana Beatriz Agenda',
    client: 'Ana Beatriz Estética',
    segment: 'Clínica estética',
    plan: 'Agenda e Recorrência',
    status: 'online',
    uptime: 99.91,
    mrr: 1650,
    users: 17,
    tickets: 0,
    lastDeploy: '06 jun 2026, 14:20',
    renewal: '12 jul 2026',
    owner: 'Equipe Produto',
    priority: 'Baixa',
  },
  {
    id: 'aja-members',
    name: 'AJA Members',
    client: 'AJA Anadecon',
    segment: 'Associação',
    plan: 'Membros e Conteúdo',
    status: 'online',
    uptime: 99.63,
    mrr: 2100,
    users: 136,
    tickets: 2,
    lastDeploy: '05 jun 2026, 11:05',
    renewal: '25 jun 2026',
    owner: 'Suporte 4M',
    priority: 'Média',
  },
  {
    id: 'anpc-racing',
    name: 'ANPC Racing Hub',
    client: 'ANPC Automobilismo',
    segment: 'Eventos esportivos',
    plan: 'Inscrições e Ranking',
    status: 'attention',
    uptime: 97.89,
    mrr: 2850,
    users: 74,
    tickets: 4,
    lastDeploy: '03 jun 2026, 16:10',
    renewal: '20 jun 2026',
    owner: 'Dev 4M',
    priority: 'Alta',
  },
  {
    id: 'podcast-natal-booking',
    name: 'Podcast Natal Booking',
    client: 'Podcast Natal Studio',
    segment: 'Estúdio de gravação',
    plan: 'Reservas e Pagamentos',
    status: 'offline',
    uptime: 92.14,
    mrr: 1900,
    users: 11,
    tickets: 5,
    lastDeploy: '01 jun 2026, 10:32',
    renewal: '15 jun 2026',
    owner: 'Dev 4M',
    priority: 'Alta',
  },
]

const getDatabaseUrl = () =>
  process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || ''

const getSql = () => {
  const databaseUrl = getDatabaseUrl()

  if (!databaseUrl) {
    throw new Error('NEON_DATABASE_URL não configurada')
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
      priority TEXT NOT NULL CHECK (priority IN ('Baixa', 'Média', 'Alta')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  const countRows = (await sql`
    SELECT COUNT(*)::text AS count FROM saas_products
  `) as Array<{ count: string }>
  const [countRow] = countRows

  if (Number(countRow?.count || 0) > 0) {
    return
  }

  for (const product of initialSaasProducts) {
    await upsertSaasProduct(product, false)
  }
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
