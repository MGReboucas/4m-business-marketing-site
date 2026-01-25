import Link from 'next/link'
import styles from './CTAFinal.module.scss'

export default function CTAFinal() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Pesquisa de mercado para crescer com dados
        </h2>
        <p className={styles.text}>
          Entenda seu publico, identifique oportunidades e valide sua proposta
          antes de investir. A 4M entrega diagnostico claro e recomendacoes
          praticas para orientar suas proximas ações.
        </p>
        <div className={styles.videoWrapper}>
          <iframe
            src="https://www.youtube.com/embed/yqOAakjFiV0?rel=0&modestbranding=1&playsinline=1&autoplay=0"
            title="Video pesquisa de mercado"
            frameBorder={0}
            allowFullScreen
          />
        </div>
        <Link href="/contato" className={styles.btn}>
          Solicitar Pesquisa de Mercado
        </Link>
      </div>
    </section>
  )
}
