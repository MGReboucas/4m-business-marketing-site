import styles from './PodcastNatalStudio.module.scss'
import podcastNatalStudio from '../../public/podcast-natal-studio.jpg'

export default function PodcastNatalStudio() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.text}>
            <p className={styles.eyebrow}>Nosso espaço</p>
            <h2 className={styles.title}>Podcast Natal Studio</h2>
            <p className={styles.paragraph}>
              A 4M Business & Marketing também tem o Podcast Natal Studio, um
              studio de podcast profissional em Natal feito para o publico.
            </p>
            <p className={styles.paragraph}>
              Um ambiente completo para gravações, entrevistas e conteúdos com
              qualidade de áudio e vídeo.
            </p>
            <a
              href="https://podcast-natal-form.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              Agendar gravação
            </a>
          </div>
          <div className={styles.imageWrapper}>
            <img
              src={podcastNatalStudio.src}
              alt="Espaco Podcast Natal Studio"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
