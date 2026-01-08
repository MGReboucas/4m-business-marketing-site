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
            Solicitar Diagnóstico Gratuito
          </Link>

          <button
            onClick={() => scrollToSection('servicos')}
            className={styles.btnSecondary}
          >
            Conheça Nossas Soluções
          </button>
        </div>
      </div>
    </section>
  )
}
