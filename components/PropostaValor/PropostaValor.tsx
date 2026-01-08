'use client'

import styles from './PropostaValor.module.scss'

const IconTarget = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const IconGlobe = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
)

const IconChart = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
)

const IconCode = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
)

const IconBriefcase = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

export default function PropostaValor() {
  const diferenciais = [
    {
      title: 'Estratégias personalizadas para cada negócio',
      icon: <IconTarget />,
    },
    {
      title: 'Atuação no digital e no físico (online + cidade)',
      icon: <IconGlobe />,
    },
    {
      title: 'Conteúdo profissional com foco em conversão',
      icon: <IconChart />,
    },
    {
      title: 'Uso de tecnologia e programação para escalar resultados',
      icon: <IconCode />,
    },
    {
      title: 'Visão de negócio, não apenas de marketing',
      icon: <IconBriefcase />,
    },
  ]

  return (
    <section id="proposta" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Por que escolher a 4M Business & Marketing?
        </h2>
        <p className={styles.subtitle}>
          Não entregamos apenas posts, placas ou campanhas isoladas. Entregamos
          estratégia, posicionamento e resultado.
        </p>
        <p className={styles.description}>
          A 4M atua como parceira estratégica do seu negócio, integrando
          marketing digital, presença física na cidade e tecnologia, criando
          soluções completas que conectam sua empresa ao público certo, no
          momento certo.
        </p>
        <div className={styles.grid}>
          {diferenciais.map((diferencial, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{diferencial.icon}</div>
              <h3 className={styles.cardTitle}>{diferencial.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
