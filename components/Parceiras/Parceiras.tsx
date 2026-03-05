'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './Parceiras.module.scss'

const parceiras = [
  {
    nome: 'AJA Anadecon',
    logo: '/logos/empresas-parceiras/aja-anadecon.png',
  },
  {
    nome: 'Ana Beatriz Estética',
    logo: '/logos/empresas-parceiras/ana-beatriz-estetica.png',
  },
  {
    nome: 'ANPC Automobilismo',
    logo: '/logos/empresas-parceiras/anpc-automobilismo.png',
  },
  {
    nome: 'Free Multas',
    logo: '/logos/empresas-parceiras/free-multas.png',
  },
  {
    nome: 'Limpfy',
    logo: '/logos/empresas-parceiras/limpfy.png',
  },
  {
    nome: 'Podcast Natal',
    logo: '/logos/empresas-parceiras/podcast-natal.png',
  },
]

export default function Parceiras() {
  return (
    <section className={styles.section}>
      <p className={styles.label}>Empresas que estão com a gente</p>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {[...parceiras, ...parceiras].map((empresa, i) => (
            <div key={i} className={styles.item}>
              <Image
                src={empresa.logo}
                alt={empresa.nome}
                width={130}
                height={130}
                className={styles.logo}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.cta}>
        <Link href="/trajetoria" className={styles.btn}>
          Nossa trajetória
        </Link>
      </div>
    </section>
  )
}
