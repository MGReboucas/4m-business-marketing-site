import styles from './PodcastNatalStudio.module.scss'
import PodcastNatalStudioSlider from './PodcastNatalStudioSlider'
import fs from 'fs'
import path from 'path'

const getPodcastImages = () => {
  const podcastDir = path.join(process.cwd(), 'public', 'podcast')
  try {
    return fs
      .readdirSync(podcastDir)
      .filter(file => /\.(png|jpe?g|webp|avif)$/i.test(file))
      .map(file => `/podcast/${file}`)
  } catch {
    return []
  }
}

export default function PodcastNatalStudio() {
  const images = getPodcastImages()
  const slides =
    images.length > 0 ? images : ['/podcast/podcast-natal-studio.jpg']

  return (
    <section id="podcast" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.text}>
            <p className={styles.eyebrow}>Nosso espaço</p>
            <h2 className={styles.title}>Podcast Natal Studio</h2>
            <p className={styles.paragraph}>
              A 4M Business & Marketing também tem o Podcast Natal Studio, um
              studio de podcast profissional em Natal feito para o público.
            </p>
            <p className={styles.paragraph}>
              Um ambiente completo para gravações, entrevistas e conteúdos com
              qualidade de áudio e vídeo.
            </p>
            <div className={styles.ctaButtonWrap}>
              <a
                href="https://podcast-natal-form.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaButton}
              >
                Agendar gravação
              </a>
            </div>
          </div>
          <div className={styles.imageWrapper}>
            <PodcastNatalStudioSlider images={slides} intervalMs={4000} />
          </div>
        </div>
      </div>
    </section>
  )
}
