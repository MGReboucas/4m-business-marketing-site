'use client'

import { useState } from 'react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './page.module.scss'

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    telefone: '',
    email: '',
    servico: '',
    mensagem: '',
  })

  const contacts = {
    email: '4mbusinessmarketing@gmail.com',
    whatsapp: '+55 84 99804-5201',
  }

  const linkWatsapp = `https://wa.me/${contacts.whatsapp.replace(
    /[^0-9]/g,
    '',
  )}?text=${encodeURIComponent('Olá, venho pelo site oficial da empresa')}`

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [emailCopied, setEmailCopied] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contacts.email)
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar email:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          nome: '',
          empresa: '',
          telefone: '',
          email: '',
          servico: '',
          mensagem: '',
        })
        setTimeout(() => setSubmitStatus('idle'), 5000)
      } else {
        setSubmitStatus('error')
        setTimeout(() => setSubmitStatus('idle'), 5000)
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>
              Vamos levar sua empresa para o próximo nível?
            </h1>
            <p className={styles.subtitle}>
              Preencha o formulário abaixo e fale com a equipe da 4M Business &
              Marketing. Nosso time irá analisar sua necessidade e apresentar a
              melhor solução para o seu negócio.
            </p>
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.container}>
            <div className={styles.formWrapper}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="nome" className={styles.label}>
                    Nome *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="empresa" className={styles.label}>
                    Empresa *
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div className={styles.gridTwo}>
                  <div className={styles.formGroup}>
                    <label htmlFor="telefone" className={styles.label}>
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="servico" className={styles.label}>
                    Serviço de Interesse
                  </label>
                  <select
                    id="servico"
                    name="servico"
                    value={formData.servico}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Selecione um serviço</option>
                    <option value="marketing-digital">
                      Marketing Digital Estratégico
                    </option>
                    <option value="producao-conteudo">
                      Produção de Conteúdo Profissional
                    </option>
                    <option value="marketing-urbano">
                      Marketing Urbano e Mídias Físicas
                    </option>
                    <option value="tecnologia">Tecnologia e Programação</option>
                    <option value="consultoria">Consultoria Geral</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="mensagem" className={styles.label}>
                    Mensagem
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    rows={5}
                    className={styles.textarea}
                    placeholder="Conte-nos um pouco mais sobre sua necessidade..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className={styles.successMessage}>
                    ✓ Mensagem enviada com sucesso! Entraremos em contato em
                    breve.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className={styles.errorMessage}>
                    ✗ Erro ao enviar mensagem. Por favor, tente novamente.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>

              <div className={styles.contactInfo}>
                <h3 className={styles.infoTitle}>Outras formas de contato</h3>
                <p className={styles.infoText}>
                  Prefere falar diretamente? Entre em contato pelos nossos
                  canais:
                </p>
                <div className={styles.infoCards}>
                  <div className={styles.infoCard}>
                    <span className={styles.infoLabel}>📧 E-mail: </span>
                    <button
                      onClick={handleCopyEmail}
                      className={styles.infoValue}
                      style={{
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: 'inherit',
                        font: 'inherit',
                      }}
                      title="Clique para copiar"
                    >
                      {contacts.email} {emailCopied && '✓ Copiado!'}
                    </button>
                  </div>
                  <div className={styles.infoCard}>
                    <span className={styles.infoLabel}>📱 WhatsApp: </span>
                    <a
                      href={linkWatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.infoValue}
                    >
                      {contacts.whatsapp}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
