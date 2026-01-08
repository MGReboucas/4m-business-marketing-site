'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Header.module.scss'
import logo from '../../public/foto-sem-fundo.png'

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
            alt="4M Business & Marketing"
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
            <button
              onClick={() => scrollToSection('servicos')}
              className={styles.navLink}
            >
              Serviços
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('processo')}
              className={styles.navLink}
            >
              Como Trabalhamos
            </button>
          </li>
          <li>
            <Link href="/sobre" className={styles.navLink}>
              Sobre Nós
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
          <button
            onClick={() => scrollToSection('servicos')}
            className={styles.mobileLink}
          >
            Serviços
          </button>
          <button
            onClick={() => scrollToSection('processo')}
            className={styles.mobileLink}
          >
            Como Trabalhamos
          </button>
          <Link
            href="/sobre"
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Sobre Nós
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
