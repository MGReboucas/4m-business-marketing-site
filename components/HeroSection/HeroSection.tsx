'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './HeroSection.module.scss'

const ROTATION_DELAY = 7000
const WHATSAPP_VANS_URL =
  'https://wa.me/5584998045201?text=Ol%C3%A1%2C%20quero%20consultar%20a%20disponibilidade%20para%20aluguel%20de%20vans.'

type SlideTheme = 'themeStrategy' | 'themeVans' | 'themeSaas'
type ActionVariant = 'primary' | 'secondary'

type HeroAction =
  | {
      label: string
      href: string
      variant: ActionVariant
    }
  | {
      label: string
      targetId: string
      variant: ActionVariant
    }

type GrowthSummary = {
  label: string
  title: string
  text: string
  outcomes: string[]
}

type Slide = {
  eyebrow: string
  theme: SlideTheme
  title: string
  subtitle: string
  highlights?: string[]
  actions: HeroAction[]
  summary?: GrowthSummary
}

const slides: Slide[] = [
  {
    eyebrow: 'Promoção especial · Plano Growth 4M',
    theme: 'themeStrategy',
    title: 'Sua empresa merece mais do que posts bonitos.',
    subtitle:
      'Receba mensalmente conteúdo profissional, campanhas patrocinadas e estratégias de crescimento desenvolvidas pela 4M Marketing & Business.',
    actions: [
      { label: 'Contratar Agora', href: '/contato', variant: 'primary' },
      { label: 'Veja Como Funciona', href: '/plano-growth-4m', variant: 'secondary' },
    ],
    summary: {
      label: 'O que você ganha',
      title: 'Marketing mensal com direção, execução e acompanhamento.',
      text:
        'A 4M organiza a comunicação da sua empresa para ela aparecer com mais autoridade e gerar conversas melhores.',
      outcomes: [
        'Presença profissional todos os meses',
        'Conteúdo que posiciona sua marca',
        'Campanhas com objetivo comercial',
        'Acompanhamento para ajustar a rota',
        'Mais clareza para vender no digital',
      ],
    },
  },
  {
    eyebrow: 'Aluguel de vans',
    theme: 'themeVans',
    title: 'Aluguel de vans para viagens, eventos e empresas.',
    subtitle:
      'Consulte disponibilidade para traslados, turismo, eventos, viagens corporativas e rotas personalizadas com atendimento rápido e seguro.',
    highlights: ['Viagens e eventos', 'Traslados', 'Atendimento rápido'],
    actions: [
      {
        label: 'Consultar Disponibilidade',
        href: WHATSAPP_VANS_URL,
        variant: 'primary',
      },
      { label: 'Solicitar Orçamento', href: '/contato', variant: 'secondary' },
    ],
  },
  {
    eyebrow: 'Assinatura para SaaS',
    theme: 'themeSaas',
    title:
      'Planos recorrentes de marketing e tecnologia para SaaS vender todos os meses.',
    subtitle:
      'Unimos landing pages, automações, funis de aquisição e conteúdo estratégico para transformar visitantes em leads, testes gratuitos e assinantes ativos.',
    highlights: ['Funil de aquisição', 'Automação comercial', 'Receita recorrente'],
    actions: [
      { label: 'Criar plano SaaS', href: '/contato', variant: 'primary' },
      { label: 'Conhecer a 4M', href: '/sobre', variant: 'secondary' },
    ],
  },
]

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const goToSlide = (index: number) => {
    setActiveSlide(index)
  }

  const goToPreviousSlide = () => {
    setActiveSlide((current) =>
      current === 0 ? slides.length - 1 : current - 1,
    )
  }

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length)
  }

  useEffect(() => {
    if (isPaused) {
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, ROTATION_DELAY)

    return () => window.clearInterval(intervalId)
  }, [isPaused])

  const currentSlide = slides[activeSlide]

  return (
    <section
      id="hero"
      className={`${styles.heroSection} ${styles[currentSlide.theme]}`}
      aria-label="Destaques da 4M Marketing & Business"
    >
      <div className={styles.bgDecoration} aria-hidden="true">
        <span className={styles.gridLayer}></span>
        <span className={styles.diagonalLayer}></span>
      </div>

      <div
        className={styles.carousel}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <div className={styles.slides}>
          {slides.map((slide, index) => (
            <article
              key={slide.eyebrow}
              className={`${styles.slide} ${
                activeSlide === index ? styles.activeSlide : ''
              }`}
              aria-hidden={activeSlide !== index}
            >
              <div
                className={`${styles.container} ${
                  slide.summary ? styles.offerContainer : ''
                }`}
              >
                <div className={styles.copy}>
                  <p className={styles.eyebrow}>{slide.eyebrow}</p>
                  <h1 className={styles.title}>{slide.title}</h1>
                  <p className={styles.subtitle}>{slide.subtitle}</p>

                  {slide.highlights && slide.highlights.length > 0 && (
                    <ul className={styles.highlights}>
                      {slide.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  )}

                  <div className={styles.ctaButtons}>
                    {slide.actions.map((action) => {
                      const isExternal =
                        'href' in action && action.href.startsWith('http')

                      return 'href' in action ? (
                        <Link
                          key={action.label}
                          href={action.href}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          className={`${styles.btn} ${
                            action.variant === 'primary'
                              ? styles.btnPrimary
                              : styles.btnSecondary
                          }`}
                        >
                          {action.label}
                        </Link>
                      ) : (
                        <button
                          key={action.label}
                          onClick={() => scrollToSection(action.targetId)}
                          className={`${styles.btn} ${
                            action.variant === 'primary'
                              ? styles.btnPrimary
                              : styles.btnSecondary
                          }`}
                        >
                          {action.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {slide.summary && (
                  <aside className={styles.planCard} aria-label="Benefícios do Plano Growth 4M">
                    <span className={styles.planLabel}>{slide.summary.label}</span>
                    <h2 className={styles.planTitle}>{slide.summary.title}</h2>
                    <p className={styles.planText}>{slide.summary.text}</p>
                    <ul className={styles.featureList}>
                      {slide.summary.outcomes.map((outcome) => (
                        <li key={outcome}>
                          <span aria-hidden="true">✓</span>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}
              </div>
            </article>
          ))}
        </div>

        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          type="button"
          onClick={goToPreviousSlide}
          aria-label="Slide anterior"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M15 18L9 12l6-6" />
          </svg>
        </button>

        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          type="button"
          onClick={goToNextSlide}
          aria-label="Próximo slide"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        <div className={styles.dots} aria-label="Selecionar destaque">
          {slides.map((slide, index) => (
            <button
              key={slide.eyebrow}
              type="button"
              onClick={() => goToSlide(index)}
              className={`${styles.dot} ${
                activeSlide === index ? styles.activeDot : ''
              }`}
              aria-label={`Mostrar ${slide.eyebrow}`}
              aria-current={activeSlide === index ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
