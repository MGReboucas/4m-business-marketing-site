import Link from 'next/link'
import styles from './CTAFinal.module.scss'

export default function CTAFinal() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Sua empresa está pronta para crescer?</h2>
        <p className={styles.text}>
          Se você busca mais clientes, mais visibilidade e uma presença
          profissional no digital e na cidade, a 4M Business & Marketing pode
          ajudar.
        </p>
        <Link href="/contato" className={styles.btn}>
          Agendar Diagnóstico Gratuito
        </Link>
      </div>
    </section>
  )
}
