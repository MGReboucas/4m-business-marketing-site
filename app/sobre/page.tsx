import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'
import styles from './page.module.scss'

export default function Sobre() {
  const valores = [
    'Estratégia antes da execução',
    'Foco em resultado',
    'Profissionalismo',
    'Inovação constante',
    'Parceria com o cliente',
  ]

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>Sobre a 4M Business & Marketing</h1>
            <p className={styles.subtitle}>
              Transformando negócios através de marketing estratégico e
              tecnologia
            </p>
          </div>
        </section>

        <section className={styles.quemSomos}>
          <div className={styles.container}>
            <div className={styles.content}>
              <h2 className={styles.sectionTitle}>Quem Somos</h2>
              <p className={styles.paragraph}>
                A 4M Business & Marketing nasceu com o propósito de auxiliar
                empresas a se posicionarem melhor no mercado, utilizando
                marketing estratégico, mídia urbana e tecnologia.
              </p>
              <p className={styles.paragraph}>
                Unimos criatividade, estratégia e programação para criar
                soluções completas, que vão desde a presença digital até a
                visibilidade física na cidade.
              </p>
              <p className={styles.paragraph}>
                Nosso foco é ajudar empresas a crescerem de forma estruturada,
                profissional e sustentável.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.mvv}>
          <div className={styles.container}>
            <div className={styles.grid}>
              <div className={styles.card}>
                <div className={styles.emoji}>🎯</div>
                <h3 className={styles.cardTitle}>Missão</h3>
                <p className={styles.cardText}>
                  Auxiliar empresas a alcançarem crescimento e relevância por
                  meio de estratégias integradas de marketing e tecnologia.
                </p>
              </div>

              <div className={styles.card}>
                <div className={styles.emoji}>🔭</div>
                <h3 className={styles.cardTitle}>Visão</h3>
                <p className={styles.cardText}>
                  Ser referência em soluções completas de marketing e inovação
                  para empresas.
                </p>
              </div>

              <div className={styles.card}>
                <div className={styles.emoji}>💎</div>
                <h3 className={styles.cardTitle}>Valores</h3>
                <ul className={styles.valuesList}>
                  {valores.map((valor, index) => (
                    <li key={index}>
                      <span className={styles.checkmark}>✓</span>
                      <span>{valor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>
              Pronto para conhecer nossas soluções?
            </h2>
            <p className={styles.ctaText}>
              Entre em contato e descubra como podemos ajudar sua empresa a
              crescer.
            </p>
            <Link href="/contato" className={styles.ctaButton}>
              Falar com a 4M
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
