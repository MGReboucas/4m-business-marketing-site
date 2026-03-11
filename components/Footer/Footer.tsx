import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>
          &copy; {new Date().getFullYear()} 4M Business & Marketing. Todos os
          direitos reservados.
        </p>
        <p className={styles.cnpj}>CNPJ: 65.557.213/0001-64</p>
      </div>
    </footer>
  )
}
