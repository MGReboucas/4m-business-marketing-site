'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type {
  OperationHealth,
  OperationPriority,
  OperationStage,
  SaasOperationRecord,
} from '@/lib/saasOperationsRepository'
import styles from './page.module.scss'

export type PanelPage =
  | 'overview'
  | 'sales'
  | 'projects'
  | 'deploy'
  | 'saas'
  | 'finance'
  | 'alerts'
  | 'create'

type FormMode = 'create' | 'edit'
type OperationFormData = Omit<SaasOperationRecord, 'createdAt' | 'updatedAt'>

const recordsApiPath = '/api/4m-saas-ops/records'
const panelBasePath = '/4m-monitor-vault-2026'

const stageLabels: Record<OperationStage, string> = {
  lead: 'Venda - lead',
  proposal: 'Proposta enviada',
  contract: 'Contrato fechado',
  development: 'Em desenvolvimento',
  deploy: 'Deploy / implantacao',
  operation: 'SaaS em operacao',
  lost: 'Perdido',
}

const healthLabels: Record<OperationHealth, string> = {
  online: 'Online',
  attention: 'Atencao',
  offline: 'Offline',
}

const stageOptions: OperationStage[] = [
  'lead',
  'proposal',
  'contract',
  'development',
  'deploy',
  'operation',
  'lost',
]
const priorityOptions: OperationPriority[] = ['Baixa', 'Media', 'Alta']
const healthOptions: OperationHealth[] = ['online', 'attention', 'offline']

const navItems: Array<{ page: PanelPage; label: string; href: string }> = [
  { page: 'overview', label: 'Visao geral', href: panelBasePath },
  { page: 'sales', label: 'Vendas', href: `${panelBasePath}/vendas` },
  { page: 'projects', label: 'Projetos', href: `${panelBasePath}/projetos` },
  { page: 'deploy', label: 'Deploys', href: `${panelBasePath}/deploys` },
  { page: 'saas', label: 'SaaS em operacao', href: `${panelBasePath}/saas` },
  { page: 'finance', label: 'Financeiro', href: `${panelBasePath}/financeiro` },
  { page: 'alerts', label: 'Alertas', href: `${panelBasePath}/alertas` },
  { page: 'create', label: 'Novo registro', href: `${panelBasePath}/cadastro` },
]

const pageCopy: Record<
  PanelPage,
  { kicker: string; title: string; subtitle: string }
> = {
  overview: {
    kicker: 'Operacao interna',
    title: 'Controle real da esteira SaaS da 4M',
    subtitle:
      'Acompanhe oportunidades, propostas, contratos, desenvolvimento, deploy, operacao e valores reais cadastrados no banco Neon.',
  },
  sales: {
    kicker: 'Vendas',
    title: 'Pipeline comercial SaaS',
    subtitle:
      'Veja leads, propostas e contratos fechados antes de virarem desenvolvimento.',
  },
  projects: {
    kicker: 'Projetos',
    title: 'SaaS em construcao',
    subtitle:
      'Controle responsavel, prioridade, prazo previsto e proxima acao de cada projeto.',
  },
  deploy: {
    kicker: 'Deploys',
    title: 'Implantacao e entrada em producao',
    subtitle:
      'Acompanhe o caminho final entre desenvolvimento, deploy e primeiro uso real do cliente.',
  },
  saas: {
    kicker: 'Operacao',
    title: 'SaaS ativos em operacao',
    subtitle:
      'Monitore uptime, chamados, usuarios, renovacao e receita mensal dos produtos ja deployados.',
  },
  finance: {
    kicker: 'Financeiro',
    title: 'Valores reais da carteira SaaS',
    subtitle:
      'Some proposta, setup, MRR, custos cadastrados e margem mensal informada pela equipe.',
  },
  alerts: {
    kicker: 'Alertas',
    title: 'Pendencias que precisam de acompanhamento',
    subtitle:
      'Prioridade alta, chamados abertos, saude fora do online e proximas acoes aparecem aqui.',
  },
  create: {
    kicker: 'Cadastro',
    title: 'Cadastrar ou atualizar operacao SaaS',
    subtitle:
      'Preencha somente informacoes reais. O painel nao cria dados ficticios nem estimativas automaticas.',
  },
}

const emptyFormData: OperationFormData = {
  id: '',
  client: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  projectName: '',
  segment: '',
  source: '',
  stage: 'lead',
  priority: 'Baixa',
  owner: 'Equipe 4M',
  proposalValue: 0,
  setupValue: 0,
  monthlyValue: 0,
  costValue: 0,
  users: 0,
  tickets: 0,
  uptime: 0,
  health: 'online',
  saleDate: '',
  contractDate: '',
  expectedDeploy: '',
  deployedAt: '',
  renewal: '',
  nextAction: '',
  notes: '',
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const formatNow = () =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

const toFormData = (record: SaasOperationRecord): OperationFormData => ({
  id: record.id,
  client: record.client,
  contactName: record.contactName,
  contactPhone: record.contactPhone,
  contactEmail: record.contactEmail,
  projectName: record.projectName,
  segment: record.segment,
  source: record.source,
  stage: record.stage,
  priority: record.priority,
  owner: record.owner,
  proposalValue: record.proposalValue,
  setupValue: record.setupValue,
  monthlyValue: record.monthlyValue,
  costValue: record.costValue,
  users: record.users,
  tickets: record.tickets,
  uptime: record.uptime,
  health: record.health,
  saleDate: record.saleDate,
  contractDate: record.contractDate,
  expectedDeploy: record.expectedDeploy,
  deployedAt: record.deployedAt,
  renewal: record.renewal,
  nextAction: record.nextAction,
  notes: record.notes,
})

const includesStage = (
  record: SaasOperationRecord,
  stages: OperationStage[],
) => stages.includes(record.stage)

const getPageRecords = (
  records: SaasOperationRecord[],
  activePage: PanelPage,
) => {
  if (activePage === 'sales') {
    return records.filter((record) =>
      includesStage(record, ['lead', 'proposal', 'contract']),
    )
  }

  if (activePage === 'projects') {
    return records.filter((record) =>
      includesStage(record, ['contract', 'development']),
    )
  }

  if (activePage === 'deploy') {
    return records.filter((record) =>
      includesStage(record, ['development', 'deploy', 'operation']),
    )
  }

  if (activePage === 'saas') {
    return records.filter((record) => record.stage === 'operation')
  }

  if (activePage === 'alerts') {
    return records.filter(
      (record) =>
        record.priority === 'Alta' ||
        record.health !== 'online' ||
        record.tickets > 0 ||
        Boolean(record.nextAction),
    )
  }

  return records
}

type AdminDashboardProps = {
  username: string
  activePage?: PanelPage
}

export default function AdminDashboard({
  username,
  activePage = 'overview',
}: AdminDashboardProps) {
  const router = useRouter()
  const [records, setRecords] = useState<SaasOperationRecord[]>([])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [lastUpdated, setLastUpdated] = useState('Carregando...')
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [formData, setFormData] = useState<OperationFormData>(emptyFormData)
  const [showEditor, setShowEditor] = useState(activePage === 'create')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const copy = pageCopy[activePage]

  const loadRecords = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(recordsApiPath, {
        cache: 'no-store',
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || 'Nao foi possivel carregar os registros.')
      }

      const loadedRecords = (data?.records || []) as SaasOperationRecord[]
      setRecords(loadedRecords)
      setLastUpdated(formatNow())
      setSelectedId((currentSelectedId) => {
        const currentRecord = loadedRecords.find(
          (record) => record.id === currentSelectedId,
        )
        return currentRecord?.id || loadedRecords[0]?.id || ''
      })
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Nao foi possivel conectar ao banco.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  useEffect(() => {
    setShowEditor(activePage === 'create')
    if (activePage === 'create') {
      setFormMode('create')
      setFormData(emptyFormData)
    }
  }, [activePage])

  const summary = useMemo(() => {
    const totalProposal = records.reduce(
      (sum, record) => sum + record.proposalValue,
      0,
    )
    const totalSetup = records.reduce((sum, record) => sum + record.setupValue, 0)
    const totalMrr = records.reduce((sum, record) => sum + record.monthlyValue, 0)
    const totalCost = records.reduce((sum, record) => sum + record.costValue, 0)
    const openTickets = records.reduce((sum, record) => sum + record.tickets, 0)
    const averageUptime =
      records.filter((record) => record.stage === 'operation').length > 0
        ? records
            .filter((record) => record.stage === 'operation')
            .reduce((sum, record) => sum + record.uptime, 0) /
          records.filter((record) => record.stage === 'operation').length
        : 0
    const alertCount = records.filter(
      (record) =>
        record.priority === 'Alta' ||
        record.health !== 'online' ||
        record.tickets > 0 ||
        Boolean(record.nextAction),
    ).length

    return {
      totalProposal,
      totalSetup,
      totalMrr,
      totalCost,
      openTickets,
      averageUptime,
      alertCount,
      salesCount: records.filter((record) =>
        includesStage(record, ['lead', 'proposal', 'contract']),
      ).length,
      projectCount: records.filter((record) =>
        includesStage(record, ['development', 'deploy']),
      ).length,
      operationCount: records.filter((record) => record.stage === 'operation')
        .length,
    }
  }, [records])

  const visibleRecords = useMemo(() => {
    const pageRecords = getPageRecords(records, activePage)
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return pageRecords
    }

    return pageRecords.filter((record) =>
      `${record.client} ${record.projectName} ${record.segment} ${record.owner}`
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [activePage, query, records])

  const selectedRecord =
    records.find((record) => record.id === selectedId) || records[0]

  const updateFormData = (
    field: keyof OperationFormData,
    value: string | number,
  ) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }))
  }

  const handleSelectRecord = (record: SaasOperationRecord) => {
    setSelectedId(record.id)
    setSuccess('')
    setError('')
  }

  const handleNewRecord = () => {
    setSelectedId('')
    setFormMode('create')
    setFormData(emptyFormData)
    setShowEditor(true)
    setSuccess('')
    setError('')
  }

  const handleStartEdit = (record: SaasOperationRecord) => {
    setSelectedId(record.id)
    setFormMode('edit')
    setFormData(toFormData(record))
    setShowEditor(true)
    setSuccess('')
    setError('')
    window.setTimeout(() => {
      document.getElementById('registro-operacional')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 0)
  }

  const handleSaveRecord = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    const method = formMode === 'create' ? 'POST' : 'PUT'
    const endpoint =
      formMode === 'create'
        ? recordsApiPath
        : `${recordsApiPath}/${encodeURIComponent(formData.id)}`

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || 'Nao foi possivel salvar.')
      }

      const savedRecord = data.record as SaasOperationRecord
      setRecords((currentRecords) => {
        const exists = currentRecords.some((record) => record.id === savedRecord.id)

        if (!exists) {
          return [savedRecord, ...currentRecords]
        }

        return currentRecords.map((record) =>
          record.id === savedRecord.id ? savedRecord : record,
        )
      })
      setSelectedId(savedRecord.id)
      setFormMode('edit')
      setFormData(toFormData(savedRecord))
      setLastUpdated(formatNow())
      setSuccess('Registro salvo no Neon com dados reais cadastrados.')
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Nao foi possivel salvar.'
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteRecord = async () => {
    if (!selectedRecord) {
      return
    }

    const shouldDelete = window.confirm(
      `Excluir ${selectedRecord.projectName} da operacao?`,
    )

    if (!shouldDelete) {
      return
    }

    setIsDeleting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(
        `${recordsApiPath}/${encodeURIComponent(selectedRecord.id)}`,
        {
          method: 'DELETE',
        },
      )
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || 'Nao foi possivel excluir.')
      }

      const remainingRecords = records.filter(
        (record) => record.id !== selectedRecord.id,
      )
      setRecords(remainingRecords)
      setSelectedId(remainingRecords[0]?.id || '')
      setFormMode('create')
      setFormData(emptyFormData)
      setShowEditor(activePage === 'create')
      setLastUpdated(formatNow())
      setSuccess('Registro removido do Neon.')
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Nao foi possivel excluir.'
      setError(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExport = () => {
    const header = [
      'Cliente',
      'SaaS',
      'Etapa',
      'Responsavel',
      'Proposta',
      'Setup',
      'MRR',
      'Custo',
      'Saude',
      'Uptime',
      'Chamados',
      'Deploy',
      'Renovacao',
      'Proxima acao',
    ]
    const rows = visibleRecords.map((record) => [
      record.client,
      record.projectName,
      stageLabels[record.stage],
      record.owner,
      record.proposalValue,
      record.setupValue,
      record.monthlyValue,
      record.costValue,
      healthLabels[record.health],
      `${record.uptime}%`,
      record.tickets,
      record.deployedAt,
      record.renewal,
      record.nextAction,
    ])

    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
      )
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '4m-saas-operacao-real.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleLogout = async () => {
    await fetch('/api/4m-internal-auth/logout', {
      method: 'POST',
    })
    router.refresh()
  }

  const renderMetrics = () => (
    <section className={styles.metricsGrid}>
      <article className={styles.metricCard}>
        <span>Vendas em aberto</span>
        <strong>{summary.salesCount}</strong>
        <p>Leads, propostas e contratos cadastrados</p>
      </article>
      <article className={styles.metricCard}>
        <span>Projetos e deploys</span>
        <strong>{summary.projectCount}</strong>
        <p>SaaS em desenvolvimento ou implantacao</p>
      </article>
      <article className={styles.metricCard}>
        <span>MRR real cadastrado</span>
        <strong>{currencyFormatter.format(summary.totalMrr)}</strong>
        <p>Receita mensal dos registros no Neon</p>
      </article>
      <article className={styles.metricCard}>
        <span>Alertas</span>
        <strong>{summary.alertCount}</strong>
        <p>Prioridade, chamados ou proximas acoes</p>
      </article>
    </section>
  )

  const renderControlBar = () => (
    <section className={styles.controlBar} aria-label="Filtros do painel">
      <div className={styles.searchField}>
        <label htmlFor="search">Buscar cliente, SaaS, segmento ou responsavel</label>
        <input
          id="search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ex.: cliente, SaaS, responsavel..."
        />
      </div>

      <div className={styles.statusFilters} role="group" aria-label="Acoes">
        <button type="button" onClick={handleNewRecord}>
          Novo registro
        </button>
        <button type="button" onClick={handleExport}>
          Exportar pagina
        </button>
      </div>
    </section>
  )

  const renderRecordsTable = (
    title: string,
    emptyMessage = 'Nenhum registro encontrado para esta pagina.',
  ) => (
    <div className={styles.dashboardGrid}>
      <section className={styles.tablePanel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.kicker}>Dados reais</p>
            <h2>{title}</h2>
          </div>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleNewRecord}
          >
            Novo registro
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>Carregando dados do Neon...</div>
        ) : visibleRecords.length === 0 ? (
          <div className={styles.emptyState}>{emptyMessage}</div>
        ) : (
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Cliente / SaaS</th>
                  <th>Etapa</th>
                  <th>Responsavel</th>
                  <th>Proposta</th>
                  <th>Setup</th>
                  <th>MRR</th>
                  <th>Saude</th>
                  <th>Proxima acao</th>
                </tr>
              </thead>
              <tbody>
                {visibleRecords.map((record) => (
                  <tr
                    key={record.id}
                    className={
                      selectedRecord?.id === record.id ? styles.selectedRow : ''
                    }
                    onClick={() => handleSelectRecord(record)}
                  >
                    <td>
                      <strong>{record.client}</strong>
                      <span>{record.projectName}</span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles.stage}`}>
                        {stageLabels[record.stage]}
                      </span>
                    </td>
                    <td>{record.owner || 'Sem responsavel'}</td>
                    <td>{currencyFormatter.format(record.proposalValue)}</td>
                    <td>{currencyFormatter.format(record.setupValue)}</td>
                    <td>{currencyFormatter.format(record.monthlyValue)}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[record.health]
                        }`}
                      >
                        {healthLabels[record.health]}
                      </span>
                    </td>
                    <td>{record.nextAction || 'Sem acao registrada'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {renderDetailPanel()}
    </div>
  )

  const renderDetailPanel = () => (
    <aside className={styles.detailPanel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.kicker}>Registro selecionado</p>
          <h2>{selectedRecord?.projectName || 'Nenhum registro selecionado'}</h2>
        </div>
        {selectedRecord && (
          <span className={`${styles.statusBadge} ${styles.stage}`}>
            {stageLabels[selectedRecord.stage]}
          </span>
        )}
      </div>

      {selectedRecord ? (
        <>
          <div className={styles.detailRows}>
            <div>
              <span>Cliente</span>
              <strong>{selectedRecord.client}</strong>
            </div>
            <div>
              <span>Contato</span>
              <strong>
                {selectedRecord.contactName || 'Sem nome'}{' '}
                {selectedRecord.contactPhone
                  ? `- ${selectedRecord.contactPhone}`
                  : ''}
              </strong>
            </div>
            <div>
              <span>Valores</span>
              <strong>
                Setup {currencyFormatter.format(selectedRecord.setupValue)} / MRR{' '}
                {currencyFormatter.format(selectedRecord.monthlyValue)}
              </strong>
            </div>
            <div>
              <span>Datas</span>
              <strong>
                Venda {selectedRecord.saleDate || 'sem data'} / Deploy{' '}
                {selectedRecord.deployedAt || 'sem data'}
              </strong>
            </div>
            <div>
              <span>Proxima acao</span>
              <strong>{selectedRecord.nextAction || 'Sem acao registrada'}</strong>
            </div>
          </div>

          <div className={styles.healthBar} aria-label="Uptime do SaaS">
            <span>Uptime em operacao</span>
            <strong>{selectedRecord.uptime.toFixed(2)}%</strong>
            <div>
              <i style={{ width: `${selectedRecord.uptime}%` }} />
            </div>
          </div>

          <div className={styles.detailActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => handleStartEdit(selectedRecord)}
            >
              Editar
            </button>
            <button
              type="button"
              className={styles.dangerButton}
              onClick={handleDeleteRecord}
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>Cadastre o primeiro registro real.</div>
      )}
    </aside>
  )

  const renderOverview = () => (
    <>
      <section className={styles.metricsGrid}>
        <article className={styles.metricCard}>
          <span>Setup vendido</span>
          <strong>{currencyFormatter.format(summary.totalSetup)}</strong>
          <p>Valor de implantacao cadastrado</p>
        </article>
        <article className={styles.metricCard}>
          <span>MRR cadastrado</span>
          <strong>{currencyFormatter.format(summary.totalMrr)}</strong>
          <p>Receita recorrente mensal real</p>
        </article>
        <article className={styles.metricCard}>
          <span>Custo mensal</span>
          <strong>{currencyFormatter.format(summary.totalCost)}</strong>
          <p>Custos informados pela operacao</p>
        </article>
        <article className={styles.metricCard}>
          <span>Uptime medio</span>
          <strong>{summary.averageUptime.toFixed(2)}%</strong>
          <p>Somente SaaS em operacao</p>
        </article>
      </section>

      <section className={styles.stageBoard}>
        {stageOptions.map((stage) => {
          const stageRecords = records.filter((record) => record.stage === stage)

          return (
            <article key={stage} className={styles.stageCard}>
              <span>{stageLabels[stage]}</span>
              <strong>{stageRecords.length}</strong>
              <p>
                {currencyFormatter.format(
                  stageRecords.reduce(
                    (sum, record) => sum + record.monthlyValue,
                    0,
                  ),
                )}{' '}
                de MRR
              </p>
            </article>
          )
        })}
      </section>

      {renderRecordsTable('Ultimos registros da operacao')}
    </>
  )

  const renderFinance = () => (
    <>
      <section className={styles.metricsGrid}>
        <article className={styles.metricCard}>
          <span>Propostas em carteira</span>
          <strong>{currencyFormatter.format(summary.totalProposal)}</strong>
          <p>Soma dos valores de proposta cadastrados</p>
        </article>
        <article className={styles.metricCard}>
          <span>Setup vendido</span>
          <strong>{currencyFormatter.format(summary.totalSetup)}</strong>
          <p>Valor de implantacao cadastrado</p>
        </article>
        <article className={styles.metricCard}>
          <span>MRR</span>
          <strong>{currencyFormatter.format(summary.totalMrr)}</strong>
          <p>Receita recorrente mensal real</p>
        </article>
        <article className={styles.metricCard}>
          <span>Margem mensal informada</span>
          <strong>
            {currencyFormatter.format(summary.totalMrr - summary.totalCost)}
          </strong>
          <p>MRR menos custos cadastrados</p>
        </article>
      </section>
      {renderRecordsTable('Valores por cliente')}
    </>
  )

  const renderEditor = () => (
    <section className={styles.editorPanel} id="registro-operacional">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.kicker}>
            {formMode === 'create' ? 'Novo registro' : 'Edicao'}
          </p>
          <h2>
            {formMode === 'create'
              ? 'Cadastrar operacao real'
              : `Editar ${formData.projectName || 'registro'}`}
          </h2>
        </div>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={handleNewRecord}
        >
          Limpar formulario
        </button>
      </div>

      <form className={styles.editorForm} onSubmit={handleSaveRecord}>
        <div className={styles.formGrid}>
          <div>
            <label htmlFor="operation-id">ID interno</label>
            <input
              id="operation-id"
              type="text"
              value={formData.id}
              onChange={(event) => updateFormData('id', event.target.value)}
              placeholder="gerado automaticamente se vazio"
              disabled={formMode === 'edit'}
            />
          </div>

          <div>
            <label htmlFor="client">Cliente *</label>
            <input
              id="client"
              type="text"
              value={formData.client}
              onChange={(event) => updateFormData('client', event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="projectName">Nome do SaaS/projeto *</label>
            <input
              id="projectName"
              type="text"
              value={formData.projectName}
              onChange={(event) =>
                updateFormData('projectName', event.target.value)
              }
              required
            />
          </div>

          <div>
            <label htmlFor="contactName">Contato principal</label>
            <input
              id="contactName"
              type="text"
              value={formData.contactName}
              onChange={(event) =>
                updateFormData('contactName', event.target.value)
              }
            />
          </div>

          <div>
            <label htmlFor="contactPhone">WhatsApp</label>
            <input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={(event) =>
                updateFormData('contactPhone', event.target.value)
              }
            />
          </div>

          <div>
            <label htmlFor="contactEmail">E-mail</label>
            <input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(event) =>
                updateFormData('contactEmail', event.target.value)
              }
            />
          </div>

          <div>
            <label htmlFor="segment">Segmento</label>
            <input
              id="segment"
              type="text"
              value={formData.segment}
              onChange={(event) => updateFormData('segment', event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="source">Origem da venda</label>
            <input
              id="source"
              type="text"
              value={formData.source}
              onChange={(event) => updateFormData('source', event.target.value)}
              placeholder="Site, indicacao, outbound..."
            />
          </div>

          <div>
            <label htmlFor="owner">Responsavel</label>
            <input
              id="owner"
              type="text"
              value={formData.owner}
              onChange={(event) => updateFormData('owner', event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="stage">Etapa</label>
            <select
              id="stage"
              value={formData.stage}
              onChange={(event) =>
                updateFormData('stage', event.target.value as OperationStage)
              }
            >
              {stageOptions.map((stage) => (
                <option key={stage} value={stage}>
                  {stageLabels[stage]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority">Prioridade</label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(event) =>
                updateFormData(
                  'priority',
                  event.target.value as OperationPriority,
                )
              }
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="health">Saude operacional</label>
            <select
              id="health"
              value={formData.health}
              onChange={(event) =>
                updateFormData('health', event.target.value as OperationHealth)
              }
            >
              {healthOptions.map((health) => (
                <option key={health} value={health}>
                  {healthLabels[health]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="proposalValue">Valor da proposta (R$)</label>
            <input
              id="proposalValue"
              type="number"
              min="0"
              value={formData.proposalValue}
              onChange={(event) =>
                updateFormData('proposalValue', Number(event.target.value))
              }
            />
          </div>

          <div>
            <label htmlFor="setupValue">Setup / implantacao (R$)</label>
            <input
              id="setupValue"
              type="number"
              min="0"
              value={formData.setupValue}
              onChange={(event) =>
                updateFormData('setupValue', Number(event.target.value))
              }
            />
          </div>

          <div>
            <label htmlFor="monthlyValue">MRR mensal (R$)</label>
            <input
              id="monthlyValue"
              type="number"
              min="0"
              value={formData.monthlyValue}
              onChange={(event) =>
                updateFormData('monthlyValue', Number(event.target.value))
              }
            />
          </div>

          <div>
            <label htmlFor="costValue">Custo mensal (R$)</label>
            <input
              id="costValue"
              type="number"
              min="0"
              value={formData.costValue}
              onChange={(event) =>
                updateFormData('costValue', Number(event.target.value))
              }
            />
          </div>

          <div>
            <label htmlFor="users">Usuarios reais</label>
            <input
              id="users"
              type="number"
              min="0"
              value={formData.users}
              onChange={(event) => updateFormData('users', Number(event.target.value))}
            />
          </div>

          <div>
            <label htmlFor="tickets">Chamados abertos</label>
            <input
              id="tickets"
              type="number"
              min="0"
              value={formData.tickets}
              onChange={(event) =>
                updateFormData('tickets', Number(event.target.value))
              }
            />
          </div>

          <div>
            <label htmlFor="uptime">Uptime (%)</label>
            <input
              id="uptime"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.uptime}
              onChange={(event) =>
                updateFormData('uptime', Number(event.target.value))
              }
            />
          </div>

          <div>
            <label htmlFor="saleDate">Data da venda</label>
            <input
              id="saleDate"
              type="date"
              value={formData.saleDate}
              onChange={(event) => updateFormData('saleDate', event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="contractDate">Data do contrato</label>
            <input
              id="contractDate"
              type="date"
              value={formData.contractDate}
              onChange={(event) =>
                updateFormData('contractDate', event.target.value)
              }
            />
          </div>

          <div>
            <label htmlFor="expectedDeploy">Deploy previsto</label>
            <input
              id="expectedDeploy"
              type="date"
              value={formData.expectedDeploy}
              onChange={(event) =>
                updateFormData('expectedDeploy', event.target.value)
              }
            />
          </div>

          <div>
            <label htmlFor="deployedAt">Deploy real</label>
            <input
              id="deployedAt"
              type="date"
              value={formData.deployedAt}
              onChange={(event) =>
                updateFormData('deployedAt', event.target.value)
              }
            />
          </div>

          <div>
            <label htmlFor="renewal">Renovacao</label>
            <input
              id="renewal"
              type="date"
              value={formData.renewal}
              onChange={(event) => updateFormData('renewal', event.target.value)}
            />
          </div>

          <div className={styles.fullField}>
            <label htmlFor="nextAction">Proxima acao real</label>
            <input
              id="nextAction"
              type="text"
              value={formData.nextAction}
              onChange={(event) =>
                updateFormData('nextAction', event.target.value)
              }
              placeholder="Ex.: enviar contrato, validar homologacao, cobrar retorno..."
            />
          </div>

          <div className={styles.fullField}>
            <label htmlFor="notes">Observacoes operacionais</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(event) => updateFormData('notes', event.target.value)}
              rows={4}
              placeholder="Registre somente informacoes reais da operacao."
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isSaving}
          >
            {isSaving ? 'Salvando...' : 'Salvar no Neon'}
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleNewRecord}
          >
            Novo registro
          </button>
        </div>
      </form>
    </section>
  )

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <a href="/" className={styles.brand}>
          <img
            src="/logos/4m-marketing-business-SEM-FUNDO.png"
            alt="4M Marketing & Business"
          />
          <span>Painel 4M</span>
        </a>

        <nav className={styles.nav} aria-label="Navegacao administrativa">
          {navItems.map((item) => (
            <Link
              key={item.page}
              className={activePage === item.page ? styles.activeNav : ''}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.operatorBox}>
          <span>Operacao real</span>
          <strong>4M SaaS Control</strong>
          <p>Sem dados ficticios: tudo exibido vem dos formularios e do Neon.</p>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.kicker}>{copy.kicker}</p>
            <h1>{copy.title}</h1>
            <p className={styles.subtitle}>{copy.subtitle}</p>
          </div>

          <div className={styles.topbarActions}>
            <span>Sessao: {username}</span>
            <span>Atualizado: {lastUpdated}</span>
            <button type="button" onClick={loadRecords} disabled={isLoading}>
              {isLoading ? 'Carregando...' : 'Atualizar'}
            </button>
            <button type="button" onClick={handleExport}>
              Exportar CSV
            </button>
            <button type="button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>

        {(error || success) && (
          <div className={styles.feedbackBar} aria-live="polite">
            {error && <p className={styles.errorBanner}>{error}</p>}
            {success && <p className={styles.successBanner}>{success}</p>}
          </div>
        )}

        {activePage !== 'overview' && activePage !== 'finance' && renderMetrics()}
        {activePage !== 'create' && renderControlBar()}

        {activePage === 'overview' && renderOverview()}
        {activePage === 'sales' &&
          renderRecordsTable('Leads, propostas e contratos')}
        {activePage === 'projects' &&
          renderRecordsTable('Projetos em desenvolvimento')}
        {activePage === 'deploy' &&
          renderRecordsTable('Deploys e implantacoes')}
        {activePage === 'saas' && renderRecordsTable('SaaS em operacao')}
        {activePage === 'finance' && renderFinance()}
        {activePage === 'alerts' &&
          renderRecordsTable('Alertas e proximas acoes', 'Nenhum alerta aberto.')}

        {(showEditor || activePage === 'create') && renderEditor()}
      </section>
    </main>
  )
}
