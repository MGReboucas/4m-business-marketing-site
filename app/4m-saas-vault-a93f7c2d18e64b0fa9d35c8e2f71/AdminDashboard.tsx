'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type {
  SaasPriority,
  SaasProduct,
  SaasStatus,
} from '@/lib/saasRepository'
import styles from './page.module.scss'

type StatusFilter = SaasStatus | 'all'
type FormMode = 'create' | 'edit'
type SaasFormData = Omit<SaasProduct, 'createdAt' | 'updatedAt'>

const productsApiPath = '/api/4m-saas-monitoring/products'

const statusLabels: Record<StatusFilter, string> = {
  all: 'Todos',
  online: 'Online',
  attention: 'Atenção',
  offline: 'Offline',
}

const statusOrder: StatusFilter[] = ['all', 'online', 'attention', 'offline']
const statusOptions: SaasStatus[] = ['online', 'attention', 'offline']
const priorityOptions: SaasPriority[] = ['Baixa', 'Média', 'Alta']

const emptyFormData: SaasFormData = {
  id: '',
  name: '',
  client: '',
  segment: '',
  plan: '',
  status: 'online',
  uptime: 99.9,
  mrr: 0,
  users: 0,
  tickets: 0,
  lastDeploy: '',
  renewal: '',
  owner: 'Equipe 4M',
  priority: 'Baixa',
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

const toFormData = (product: SaasProduct): SaasFormData => ({
  id: product.id,
  name: product.name,
  client: product.client,
  segment: product.segment,
  plan: product.plan,
  status: product.status,
  uptime: product.uptime,
  mrr: product.mrr,
  users: product.users,
  tickets: product.tickets,
  lastDeploy: product.lastDeploy,
  renewal: product.renewal,
  owner: product.owner,
  priority: product.priority,
})

type AdminDashboardProps = {
  username: string
}

export default function AdminDashboard({ username }: AdminDashboardProps) {
  const router = useRouter()
  const [products, setProducts] = useState<SaasProduct[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedId, setSelectedId] = useState('')
  const [lastUpdated, setLastUpdated] = useState('Carregando...')
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [formData, setFormData] = useState<SaasFormData>(emptyFormData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(productsApiPath, {
        cache: 'no-store',
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || 'Não foi possível carregar os SaaS.')
      }

      const loadedProducts = (data?.products || []) as SaasProduct[]
      setProducts(loadedProducts)
      setLastUpdated(formatNow())

      setSelectedId((currentSelectedId) => {
        const currentProduct = loadedProducts.find(
          (item) => item.id === currentSelectedId,
        )
        const nextProduct = currentProduct || loadedProducts[0]

        if (nextProduct) {
          setFormMode('edit')
          setFormData(toFormData(nextProduct))
        } else {
          setFormMode('create')
          setFormData(emptyFormData)
        }

        return nextProduct?.id || ''
      })
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível conectar ao banco.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const summary = useMemo(() => {
    const totalMrr = products.reduce((sum, item) => sum + item.mrr, 0)
    const totalTickets = products.reduce((sum, item) => sum + item.tickets, 0)
    const averageUptime =
      products.length > 0
        ? products.reduce((sum, item) => sum + item.uptime, 0) / products.length
        : 0
    const criticalCount = products.filter((item) => item.status !== 'online')
      .length

    return {
      totalMrr,
      totalTickets,
      averageUptime,
      criticalCount,
    }
  }, [products])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return products.filter((item) => {
      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter
      const matchesQuery =
        !normalizedQuery ||
        `${item.name} ${item.client} ${item.segment} ${item.plan}`
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [products, query, statusFilter])

  const selectedProduct =
    products.find((item) => item.id === selectedId) || products[0]

  const handleSelectProduct = (product: SaasProduct) => {
    setSelectedId(product.id)
    setFormMode('edit')
    setFormData(toFormData(product))
    setSuccess('')
    setError('')
  }

  const handleNewProduct = () => {
    setSelectedId('')
    setFormMode('create')
    setFormData(emptyFormData)
    setSuccess('')
    setError('')
  }

  const updateFormData = (
    field: keyof SaasFormData,
    value: string | number,
  ) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }))
  }

  const handleSaveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    const method = formMode === 'create' ? 'POST' : 'PUT'
    const endpoint =
      formMode === 'create'
        ? productsApiPath
        : `${productsApiPath}/${encodeURIComponent(formData.id)}`

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
        throw new Error(data?.error || 'Não foi possível salvar o SaaS.')
      }

      const savedProduct = data.product as SaasProduct
      setProducts((currentProducts) => {
        const exists = currentProducts.some((item) => item.id === savedProduct.id)

        if (!exists) {
          return [savedProduct, ...currentProducts]
        }

        return currentProducts.map((item) =>
          item.id === savedProduct.id ? savedProduct : item,
        )
      })
      setSelectedId(savedProduct.id)
      setFormMode('edit')
      setFormData(toFormData(savedProduct))
      setLastUpdated(formatNow())
      setSuccess('SaaS salvo no banco Neon.')
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível salvar.'
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) {
      return
    }

    const shouldDelete = window.confirm(
      `Excluir ${selectedProduct.name} do monitoramento?`,
    )

    if (!shouldDelete) {
      return
    }

    setIsDeleting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(
        `${productsApiPath}/${encodeURIComponent(selectedProduct.id)}`,
        {
          method: 'DELETE',
        },
      )
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || 'Não foi possível excluir o SaaS.')
      }

      const remainingProducts = products.filter(
        (item) => item.id !== selectedProduct.id,
      )
      const nextProduct = remainingProducts[0]

      setProducts(remainingProducts)
      setSelectedId(nextProduct?.id || '')
      setFormData(nextProduct ? toFormData(nextProduct) : emptyFormData)
      setFormMode(nextProduct ? 'edit' : 'create')
      setLastUpdated(formatNow())
      setSuccess('SaaS removido do banco Neon.')
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível excluir.'
      setError(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExport = () => {
    const header = [
      'SaaS',
      'Cliente',
      'Segmento',
      'Plano',
      'Status',
      'Uptime',
      'MRR',
      'Usuários',
      'Chamados',
      'Renovação',
    ]
    const rows = filteredProducts.map((item) => [
      item.name,
      item.client,
      item.segment,
      item.plan,
      statusLabels[item.status],
      `${item.uptime}%`,
      item.mrr,
      item.users,
      item.tickets,
      item.renewal,
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
    link.download = '4m-saas-monitoramento.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleLogout = async () => {
    await fetch('/api/4m-internal-auth/logout', {
      method: 'POST',
    })
    router.refresh()
  }

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

        <nav className={styles.nav} aria-label="Navegação administrativa">
          <a className={styles.activeNav} href="#overview">
            Visão geral
          </a>
          <a href="#saas">SaaS monitorados</a>
          <a href="#cadastro">Cadastro</a>
          <a href="#alertas">Alertas</a>
        </nav>

        <div className={styles.operatorBox}>
          <span>Operação</span>
          <strong>4M SaaS Control</strong>
          <p>Dados persistidos no banco Neon conectado ao painel.</p>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.kicker}>Administração interna</p>
            <h1>Monitoramento dos SaaS fornecidos pela 4M</h1>
            <p className={styles.subtitle}>
              Acompanhe saúde, receita, chamados, renovações e responsáveis por
              cada plataforma com dados vindos do banco Neon.
            </p>
          </div>

          <div className={styles.topbarActions}>
            <span>Sessão: {username}</span>
            <span>Atualizado: {lastUpdated}</span>
            <button type="button" onClick={loadProducts} disabled={isLoading}>
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

        <section className={styles.metricsGrid} id="overview">
          <article className={styles.metricCard}>
            <span>SaaS ativos</span>
            <strong>{products.length}</strong>
            <p>{summary.criticalCount} precisam de atenção hoje</p>
          </article>
          <article className={styles.metricCard}>
            <span>Receita mensal monitorada</span>
            <strong>{currencyFormatter.format(summary.totalMrr)}</strong>
            <p>MRR estimado da carteira SaaS</p>
          </article>
          <article className={styles.metricCard}>
            <span>Uptime médio</span>
            <strong>{summary.averageUptime.toFixed(2)}%</strong>
            <p>Base dos produtos cadastrados</p>
          </article>
          <article className={styles.metricCard}>
            <span>Chamados abertos</span>
            <strong>{summary.totalTickets}</strong>
            <p>Demandas pendentes com a equipe</p>
          </article>
        </section>

        <section className={styles.controlBar} aria-label="Filtros do painel">
          <div className={styles.searchField}>
            <label htmlFor="search">Buscar SaaS, cliente ou segmento</label>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: Limpfy, CRM, estética..."
            />
          </div>

          <div className={styles.statusFilters} role="group" aria-label="Status">
            {statusOrder.map((status) => (
              <button
                key={status}
                type="button"
                className={statusFilter === status ? styles.activeFilter : ''}
                onClick={() => setStatusFilter(status)}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>
        </section>

        <div className={styles.dashboardGrid}>
          <section className={styles.tablePanel} id="saas">
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.kicker}>Carteira SaaS</p>
                <h2>Produtos em operação</h2>
              </div>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleNewProduct}
              >
                Novo SaaS
              </button>
            </div>

            {isLoading ? (
              <div className={styles.loadingState}>Carregando dados do Neon...</div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                Nenhum SaaS encontrado para os filtros atuais.
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>SaaS</th>
                      <th>Cliente</th>
                      <th>Status</th>
                      <th>Uptime</th>
                      <th>MRR</th>
                      <th>Chamados</th>
                      <th>Renovação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((item) => (
                      <tr
                        key={item.id}
                        className={
                          selectedProduct?.id === item.id
                            ? styles.selectedRow
                            : ''
                        }
                        onClick={() => handleSelectProduct(item)}
                      >
                        <td>
                          <strong>{item.name}</strong>
                          <span>{item.plan}</span>
                        </td>
                        <td>{item.client}</td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              styles[item.status]
                            }`}
                          >
                            {statusLabels[item.status]}
                          </span>
                        </td>
                        <td>{item.uptime.toFixed(2)}%</td>
                        <td>{currencyFormatter.format(item.mrr)}</td>
                        <td>{item.tickets}</td>
                        <td>{item.renewal || 'Sem data'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <aside className={styles.detailPanel} id="clientes">
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.kicker}>Detalhe do cliente</p>
                <h2>{selectedProduct?.name || 'Nenhum SaaS selecionado'}</h2>
              </div>
              {selectedProduct && (
                <span
                  className={`${styles.statusBadge} ${
                    styles[selectedProduct.status]
                  }`}
                >
                  {statusLabels[selectedProduct.status]}
                </span>
              )}
            </div>

            {selectedProduct ? (
              <>
                <div className={styles.detailRows}>
                  <div>
                    <span>Cliente</span>
                    <strong>{selectedProduct.client}</strong>
                  </div>
                  <div>
                    <span>Segmento</span>
                    <strong>{selectedProduct.segment}</strong>
                  </div>
                  <div>
                    <span>Responsável</span>
                    <strong>{selectedProduct.owner}</strong>
                  </div>
                  <div>
                    <span>Prioridade</span>
                    <strong>{selectedProduct.priority}</strong>
                  </div>
                  <div>
                    <span>Último deploy</span>
                    <strong>{selectedProduct.lastDeploy || 'Sem registro'}</strong>
                  </div>
                  <div>
                    <span>Próxima renovação</span>
                    <strong>{selectedProduct.renewal || 'Sem data'}</strong>
                  </div>
                </div>

                <div className={styles.healthBar} aria-label="Uptime do SaaS">
                  <span>Uptime</span>
                  <strong>{selectedProduct.uptime.toFixed(2)}%</strong>
                  <div>
                    <i style={{ width: `${selectedProduct.uptime}%` }} />
                  </div>
                </div>

                <div className={styles.detailActions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => handleSelectProduct(selectedProduct)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={handleDeleteProduct}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>Cadastre o primeiro SaaS.</div>
            )}
          </aside>
        </div>

        <section className={styles.editorPanel} id="cadastro">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.kicker}>
                {formMode === 'create' ? 'Novo registro' : 'Edição'}
              </p>
              <h2>
                {formMode === 'create'
                  ? 'Cadastrar SaaS no Neon'
                  : `Editar ${formData.name || 'SaaS'}`}
              </h2>
            </div>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleNewProduct}
            >
              Limpar formulário
            </button>
          </div>

          <form className={styles.editorForm} onSubmit={handleSaveProduct}>
            <div className={styles.formGrid}>
              <div>
                <label htmlFor="saas-id">ID interno</label>
                <input
                  id="saas-id"
                  type="text"
                  value={formData.id}
                  onChange={(event) => updateFormData('id', event.target.value)}
                  placeholder="gerado automaticamente se vazio"
                  disabled={formMode === 'edit'}
                />
              </div>

              <div>
                <label htmlFor="saas-name">Nome do SaaS *</label>
                <input
                  id="saas-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => updateFormData('name', event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="saas-client">Cliente *</label>
                <input
                  id="saas-client"
                  type="text"
                  value={formData.client}
                  onChange={(event) =>
                    updateFormData('client', event.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="saas-segment">Segmento *</label>
                <input
                  id="saas-segment"
                  type="text"
                  value={formData.segment}
                  onChange={(event) =>
                    updateFormData('segment', event.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="saas-plan">Plano *</label>
                <input
                  id="saas-plan"
                  type="text"
                  value={formData.plan}
                  onChange={(event) => updateFormData('plan', event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="saas-owner">Responsável</label>
                <input
                  id="saas-owner"
                  type="text"
                  value={formData.owner}
                  onChange={(event) => updateFormData('owner', event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="saas-status">Status</label>
                <select
                  id="saas-status"
                  value={formData.status}
                  onChange={(event) =>
                    updateFormData('status', event.target.value as SaasStatus)
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="saas-priority">Prioridade</label>
                <select
                  id="saas-priority"
                  value={formData.priority}
                  onChange={(event) =>
                    updateFormData('priority', event.target.value as SaasPriority)
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
                <label htmlFor="saas-uptime">Uptime (%)</label>
                <input
                  id="saas-uptime"
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
                <label htmlFor="saas-mrr">MRR (R$)</label>
                <input
                  id="saas-mrr"
                  type="number"
                  min="0"
                  value={formData.mrr}
                  onChange={(event) =>
                    updateFormData('mrr', Number(event.target.value))
                  }
                />
              </div>

              <div>
                <label htmlFor="saas-users">Usuários</label>
                <input
                  id="saas-users"
                  type="number"
                  min="0"
                  value={formData.users}
                  onChange={(event) =>
                    updateFormData('users', Number(event.target.value))
                  }
                />
              </div>

              <div>
                <label htmlFor="saas-tickets">Chamados abertos</label>
                <input
                  id="saas-tickets"
                  type="number"
                  min="0"
                  value={formData.tickets}
                  onChange={(event) =>
                    updateFormData('tickets', Number(event.target.value))
                  }
                />
              </div>

              <div>
                <label htmlFor="saas-deploy">Último deploy</label>
                <input
                  id="saas-deploy"
                  type="text"
                  value={formData.lastDeploy}
                  onChange={(event) =>
                    updateFormData('lastDeploy', event.target.value)
                  }
                  placeholder="Ex.: 09 jun 2026, 09:12"
                />
              </div>

              <div>
                <label htmlFor="saas-renewal">Renovação</label>
                <input
                  id="saas-renewal"
                  type="text"
                  value={formData.renewal}
                  onChange={(event) =>
                    updateFormData('renewal', event.target.value)
                  }
                  placeholder="Ex.: 30 jun 2026"
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
                onClick={handleNewProduct}
              >
                Novo cadastro
              </button>
            </div>
          </form>
        </section>

        <section className={styles.alertPanel} id="alertas">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.kicker}>Fila de atenção</p>
              <h2>Alertas que precisam de acompanhamento</h2>
            </div>
            <span>{summary.criticalCount} alertas</span>
          </div>

          <div className={styles.alertList}>
            {products.filter((item) => item.status !== 'online').length === 0 ? (
              <div className={styles.emptyState}>
                Nenhum alerta aberto neste momento.
              </div>
            ) : (
              products
                .filter((item) => item.status !== 'online')
                .map((item) => (
                  <article key={item.id}>
                    <span
                      className={`${styles.statusBadge} ${styles[item.status]}`}
                    >
                      {statusLabels[item.status]}
                    </span>
                    <div>
                      <strong>{item.name}</strong>
                      <p>
                        {item.client} tem {item.tickets} chamado(s) aberto(s),
                        uptime de {item.uptime.toFixed(2)}% e prioridade{' '}
                        {item.priority.toLowerCase()}.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(item)}
                    >
                      Ver detalhes
                    </button>
                  </article>
                ))
            )}
          </div>
        </section>
      </section>
    </main>
  )
}
