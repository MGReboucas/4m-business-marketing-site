'use client'

import Link from 'next/link'
import styles from './HeroSection.module.scss'

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className={styles.heroSection}>
      <div className={styles.bgDecoration}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
      </div>

      <p className={styles.titleVideo}>Assista o vídeo abaixo:</p>
      <div className={styles.heroVideo}>
        <iframe
          src="https://www.youtube.com/embed/rjPFZlyTonc?rel=0&modestbranding=1&playsinline=1&autoplay=1"
          title="Video 4M Business & Marketing"
          frameBorder="0"
          allow="autoplay; encrypted-media; gyroscope;"
          allowFullScreen
        />
      </div>

      <div className={styles.container}>
        <h1 className={styles.title}>
          Marketing estratégico, mídia urbana e tecnologia para empresas que
          querem crescer de verdade.
        </h1>

        <p className={styles.subtitle}>
          A 4M Business & Marketing auxilia empresas a aumentarem sua
          visibilidade, fortalecerem sua marca e conquistarem mais clientes por
          meio de estratégias integradas de marketing digital, mídia física e
          soluções tecnológicas.
        </p>

        <div className={styles.ctaButtons}>
          <Link href="/contato" className={styles.btnPrimary}>
            Preencher Formulário
          </Link>

          <button
            onClick={() => scrollToSection('processo')}
            className={styles.btnPrimary}
          >
            Lei do incentivo ao esporte
          </button>
        </div>
      </div>
    </section>
  )
}
