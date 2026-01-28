'use client'

import Link from 'next/dist/client/link'
import styles from './Processo.module.scss'

export default function Processo() {
  return (
    <section id="processo" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Transforme imposto em impacto, visibilidade e posicionamento
        </h2>
        <div className={styles.videoWrapper}>
          <iframe
            src="https://www.youtube.com/embed/3MHtEaHau4w?rel=0&modestbranding=1&playsinline=1&autoplay=0"
            title="Video Lei do incentivo ao esporte"
            frameBorder="0"
            allowFullScreen
          />
        </div>
        <p className={styles.description}>
          A Lei no 11.438/06 (Lei de Incentivo ao Esporte) alterada pela lei
          complementar 222/2025 permite direcionar parte do imposto devido para
          projetos esportivos e paradesportivos que transformam vidas em todo o
          Brasil. Sua empresa apoia crianças, jovens, pessoas com deficiência e
          idosos, e ainda fortalece sua marca com impacto social real. Com a 4M,
          além de contribuir para a inclusão, você ganha visibilidade e
          posicionamento estratégico, nós cuidamos do projeto e entregamos
          marketing de alto potencial para sua empresa.
        </p>
        <Link href="/contato" className={styles.btnPrimary}>
          Preencher Formulário
        </Link>
        <div className={styles.grid}>
          <div className={styles.step}></div>
        </div>
      </div>
    </section>
  )
}
