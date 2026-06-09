'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.scss'

type LoginPanelProps = {
  isConfigured: boolean
}

export default function LoginPanel({ isConfigured }: LoginPanelProps) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/4m-internal-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error || 'Não foi possível acessar o painel.')
        return
      }

      router.refresh()
    } catch {
      setError('Não foi possível conectar ao servidor de autenticação.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.loginScreen}>
      <section className={styles.loginCard}>
        <img
          src="/logos/4m-marketing-business-SEM-FUNDO.png"
          alt="4M Marketing & Business"
          className={styles.loginLogo}
        />

        <p className={styles.kicker}>Área protegida</p>
        <h1>Painel interno 4M SaaS Control</h1>
        <p className={styles.loginText}>
          Acesse com as credenciais internas para monitorar os SaaS fornecidos
          pela 4M.
        </p>

        {!isConfigured ? (
          <div className={styles.setupWarning}>
            Configure as variáveis ADMIN_PANEL_USER, ADMIN_PANEL_PASSWORD e
            ADMIN_SESSION_SECRET no ambiente para ativar o login.
          </div>
        ) : (
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div>
              <label htmlFor="admin-user">Usuário</label>
              <input
                id="admin-user"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label htmlFor="admin-password">Senha</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className={styles.loginError}>{error}</p>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Validando acesso...' : 'Entrar no painel'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
