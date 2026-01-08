'use client'

import styles from './Processo.module.scss'

export default function Processo() {
  const etapas = [
    {
      numero: '1',
      title: 'Diagnóstico',
      description:
        'Analisamos sua empresa, mercado, concorrência e oportunidades.',
    },
    {
      numero: '2',
      title: 'Estratégia',
      description:
        'Criamos um plano personalizado, alinhado aos seus objetivos.',
    },
    {
      numero: '3',
      title: 'Execução',
      description: 'Produzimos, implementamos e acompanhamos todas as ações.',
    },
    {
      numero: '4',
      title: 'Otimização',
      description:
        'Analisamos dados, ajustamos estratégias e escalamos resultados.',
    },
  ]

  return (
    <section id="processo" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Um processo claro, estratégico e focado em resultado
        </h2>
        <div className={styles.grid}>
          {etapas.map((etapa, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.card}>
                <div className={styles.number}>{etapa.numero}</div>
                <h3 className={styles.stepTitle}>{etapa.title}</h3>
                <p className={styles.stepDescription}>{etapa.description}</p>
              </div>
              {index < etapas.length - 1 && (
                <div className={styles.arrow}>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
