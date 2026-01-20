'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './PodcastNatalStudio.module.scss'

type PodcastNatalStudioSliderProps = {
  images: string[]
  intervalMs?: number
}

export default function PodcastNatalStudioSlider({
  images,
  intervalMs = 7000,
}: PodcastNatalStudioSliderProps) {
  const slides = useMemo(
    () => (images.length > 0 ? images : ['/podcast/podcast-natal-studio.jpg']),
    [images],
  )
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, slides.length])

  const goPrev = () => {
    setActiveIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1,
    )
  }

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length)
  }

  return (
    <div className={styles.slider} aria-live="polite">
      {slides.map((src, index) => (
        <img
          key={src}
          src={src}
          alt="Espaco Podcast Natal Studio"
          className={`${styles.slide} ${
            index === activeIndex ? styles.slideActive : ''
          }`}
        />
      ))}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.navButton} ${styles.navPrev}`}
            aria-label="Foto anterior"
            onClick={goPrev}
          />
          <button
            type="button"
            className={`${styles.navButton} ${styles.navNext}`}
            aria-label="Proxima foto"
            onClick={goNext}
          />
        </>
      )}
    </div>
  )
}
