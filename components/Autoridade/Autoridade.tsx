'use client'

import styles from './Autoridade.module.scss'

const CheckIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export default function Autoridade() {
  const objetivos = [
    'Aumentar visibilidade',
    'Gerar autoridade',
    'Atrair clientes qualificados',
    'Sustentar o crescimento da empresa',
  ]

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Marketing com visão de negócio</h2>
        <p className={styles.subtitle}>
          Nossa atuação vai além da estética. Pensamos em estratégia, funil,
          posicionamento e retorno sobre investimento.
        </p>
        <p className={styles.description}>Cada ação é planejada para:</p>
        <div className={styles.grid}>
          {objetivos.map((objetivo, index) => (
            <div key={index} className={styles.item}>
              <CheckIcon />
              <span>{objetivo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
