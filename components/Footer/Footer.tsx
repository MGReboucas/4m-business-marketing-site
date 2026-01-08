import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>
          &copy; {new Date().getFullYear()} 4M Business & Marketing. Todos os
          direitos reservados.
        </p>
      </div>
    </footer>
  )
}
