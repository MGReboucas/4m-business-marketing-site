'use client'

import styles from './Servicos.module.scss'

const IconMobile = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
)
const IconVideo = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
)
const IconCity = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
)
const IconCog = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)
const CheckIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

export default function Servicos() {
  const servicos = [
    {
      title: 'Marketing Digital Estratégico',
      description:
        'Planejamento e execução de estratégias digitais focadas em crescimento, autoridade e geração de leads.',
      items: [
        'Gestão de redes sociais',
        'Estratégia de conteúdo',
        'Tráfego pago',
        'Posicionamento digital',
        'Branding e identidade visual',
      ],
      icon: <IconMobile />,
      color: 'blue',
    },
    {
      title: 'Produção de Conteúdo Profissional',
      description:
        'Conteúdos que valorizam sua marca e geram percepção de profissionalismo.',
      items: [
        'Vídeos institucionais e promocionais',
        'Conteúdo para redes sociais',
        'Fotografia profissional',
        'Podcasts e vídeos corporativos',
      ],
      icon: <IconVideo />,
      color: 'purple',
    },
    {
      title: 'Marketing Urbano e Mídias Físicas',
      description: 'Sua marca presente onde o público está na cidade.',
      items: [
        'Placas publicitárias',
        'Adesivagem de fachadas e veículos',
        'Materiais visuais corporativos',
        'Estratégias de visibilidade local',
      ],
      icon: <IconCity />,
      color: 'green',
    },
    {
      title: 'Tecnologia e Programação Aplicada ao Marketing',
      description:
        'Marketing aliado à tecnologia para escalar resultados e otimizar processos.',
      items: [
        'Landing pages de alta conversão',
        'Sistemas e formulários inteligentes',
        'Automação de marketing',
        'Integrações digitais',
        'Soluções personalizadas para empresas',
      ],
      icon: <IconCog />,
      color: 'orange',
    },
  ]

  return (
    <section id="servicos" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Soluções completas para empresas que querem crescer
        </h2>
        <div className={styles.grid}>
          {servicos.map((servico, index) => (
            <div key={index} className={styles.card}>
              <div className={`${styles.iconWrapper} ${styles[servico.color]}`}>
                {servico.icon}
              </div>
              <h3 className={styles.cardTitle}>{servico.title}</h3>
              <p className={styles.cardDescription}>{servico.description}</p>
              <div>
                <p className={styles.listTitle}>Inclui:</p>
                <ul className={styles.list}>
                  {servico.items.map((item, i) => (
                    <li key={i}>
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
