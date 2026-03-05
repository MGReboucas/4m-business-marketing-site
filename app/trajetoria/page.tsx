import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'
import styles from './page.module.scss'

export default function Trajetoria() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.construction}>
          <div className={styles.icon}>🚧</div>
          <h1 className={styles.title}>Página em construção</h1>
          <p className={styles.subtitle}>
            Em breve você poderá acompanhar aqui a trajetória de todas as
            empresas parceiras da 4M.
          </p>
          <Link href="/" className={styles.btn}>
            Voltar para o início
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
