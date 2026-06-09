'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Header.module.scss'
import logo from '../../public/logos/4m-marketing-business-SEM-FUNDO.png'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      setIsMenuOpen(false)
    } else {
      window.location.href = `/#${id}`
    }
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <img
            src={logo.src}
            className={styles.logoImagem}
            alt="4M Marketing & Business"
          />
        </Link>

        <ul className={styles.desktopMenu}>
          <li>
            <Link href="/" className={styles.navLink}>
              Início
            </Link>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('proposta')}
              className={styles.navLink}
            >
              Por que 4M?
            </button>
          </li>
          <li>
            <Link href="/plano-growth-4m" className={styles.navLink}>
              Marketing
            </Link>
          </li>
          <li>
            <Link href="/aluguel-de-vans" className={styles.navLink}>
              Vans para alugar
            </Link>
          </li>
          <li>
            <Link href="/desenvolvimento-de-sistemas" className={styles.navLink}>
              Automações
            </Link>
          </li>
          <li>
            <a
              href="https://podcast-natal-form.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              Podcast
            </a>
          </li>
          <li>
            <Link href="/sobre" className={styles.navLink}>
              Sobre Nós
            </Link>
          </li>
          <li>
            <Link href="/trajetoria" className={styles.navLink}>
              Trajetória
            </Link>
          </li>
          <li>
            <Link href="/contato" className={styles.btnContact}>
              Contato
            </Link>
          </li>
        </ul>

        <button
          className={styles.mobileBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link
            href="/"
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Início
          </Link>
          <button
            onClick={() => scrollToSection('proposta')}
            className={styles.mobileLink}
          >
            Por que 4M?
          </button>
          <Link
            href="/plano-growth-4m"
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Marketing
          </Link>
          <Link
            href="/aluguel-de-vans"
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Vans para alugar
          </Link>
          <Link
            href="/desenvolvimento-de-sistemas"
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Automações
          </Link>
          <a
            href="https://podcast-natal-form.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Podcast
          </a>
          <Link
            href="/sobre"
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Sobre Nós
          </Link>
          <Link
            href="/trajetoria"
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Trajetória
          </Link>
          <Link
            href="/contato"
            className={styles.mobileBtnContact}
            onClick={() => setIsMenuOpen(false)}
          >
            Contato
          </Link>
        </div>
      )}
    </header>
  )
}
