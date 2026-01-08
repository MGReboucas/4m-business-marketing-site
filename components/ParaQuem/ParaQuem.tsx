'use client'

import styles from './ParaQuem.module.scss'

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

export default function ParaQuem() {
  const publicos = [
    'Pequenas e médias empresas',
    'Negócios locais que querem mais visibilidade',
    'Empresas que precisam profissionalizar o marketing',
    'Marcas que desejam unir digital, físico e tecnologia',
    'Empreendedores que buscam resultados mensuráveis',
  ]

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Atendemos empresas que buscam crescimento real
        </h2>
        <p className={styles.subtitle}>
          A 4M Business & Marketing é ideal para:
        </p>
        <div className={styles.grid}>
          {publicos.map((publico, index) => (
            <div key={index} className={styles.item}>
              <CheckIcon />
              <span>{publico}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
