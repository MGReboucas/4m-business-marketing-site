'use client'

import { useState } from 'react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './page.module.scss'

const initialFormData = {
  nome: '',
  empresa: '',
  telefone: '',
  email: '',
  servico: '',
  mensagem: '',
  website: '',
}

const contacts = {
  email: '4mbusinessmarketing@gmail.com',
  whatsapp: '+55 84 99804-5201',
}

const revenueOptions = [
  { value: 'ate-50-mil', label: 'Até R$ 50 mil' },
  { value: '51-70-mil', label: 'De R$ 51 mil a R$ 70 mil' },
  { value: '71-100-mil', label: 'De R$ 71 mil a R$ 100 mil' },
  { value: '101-200-mil', label: 'De R$ 101 mil a R$ 200 mil' },
  { value: '201-400-mil', label: 'De R$ 201 mil a R$ 400 mil' },
  { value: '401-mil-1-milhao', label: 'De R$ 401 mil a R$ 1 milhão' },
  { value: '1-4-milhoes', label: 'De R$ 1 milhão a R$ 4 milhões' },
  { value: '4-16-milhoes', label: 'De R$ 4 milhões a R$ 16 milhões' },
  { value: '16-40-milhoes', label: 'De R$ 16 milhões a R$ 40 milhões' },
  { value: 'mais-40-milhoes', label: 'Mais de R$ 40 milhões' },
]

const highlights = [
  'Resposta em até 24 horas',
  'Diagnóstico inicial sem compromisso',
  'Atendimento direto com a equipe 4M',
]

const nextSteps = [
  'Entendemos seu momento atual e seu principal gargalo.',
  'Indicamos o caminho mais viável para crescimento, marketing ou automação.',
  'Você recebe um próximo passo claro para decidir com segurança.',
]

type ContactFormData = typeof initialFormData
type SubmitStatus = 'idle' | 'success' | 'error'

export default function Contato() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [emailCopied, setEmailCopied] = useState(false)

  const whatsappLink = `https://wa.me/${contacts.whatsapp.replace(
    /[^0-9]/g,
    '',
  )}?text=${encodeURIComponent(
    'Olá, vim pelo site e quero conversar sobre crescimento para minha empresa.',
  )}`

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((currentData) => ({
      ...currentData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contacts.email)
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2200)
    } catch (err) {
      console.error('Erro ao copiar email:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const payload = {
      nome: formData.nome.trim(),
      empresa: formData.empresa.trim(),
      telefone: formData.telefone.trim(),
      email: formData.email.trim(),
      servico: formData.servico,
      mensagem: formData.mensagem.trim(),
      website: formData.website.trim(),
    }

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData(initialFormData)
        setTimeout(() => setSubmitStatus('idle'), 7000)
      } else {
        setSubmitStatus('error')
        setTimeout(() => setSubmitStatus('idle'), 7000)
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 7000)
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
            <p className={styles.eyebrow}>Contato 4M Marketing & Business</p>
            <h1 className={styles.title}>
              Vamos encontrar o próximo passo de crescimento da sua empresa.
            </h1>
            <p className={styles.subtitle}>
              Envie seu cenário para a equipe da 4M e receba um direcionamento
              claro para marketing, vendas, automação ou presença digital.
            </p>

            <div className={styles.heroActions}>
              <a href="#formulario-contato" className={styles.primaryAction}>
                Quero falar com a 4M
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryAction}
              >
                Chamar no WhatsApp
              </a>
            </div>

            <ul className={styles.highlights} aria-label="Diferenciais do atendimento">
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.formSection} id="formulario-contato">
          <div className={styles.container}>
            <div className={styles.formHeader}>
              <p className={styles.sectionEyebrow}>Resposta humana e direta</p>
              <h2>Conte o que você quer melhorar. A gente te chama.</h2>
              <p>
                Quanto mais contexto você enviar, mais objetiva será a primeira
                conversa. Se preferir velocidade, o WhatsApp está logo ao lado.
              </p>
            </div>

            <div className={styles.contactLayout}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.honeypot} aria-hidden="true">
                  <label htmlFor="website">Site</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nome" className={styles.label}>
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className={styles.input}
                      placeholder="Seu nome e sobrenome"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="telefone" className={styles.label}>
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      className={styles.input}
                      placeholder="(84) 99999-9999"
                    />
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      E-mail profissional *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className={styles.input}
                      placeholder="voce@empresa.com"
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
                      autoComplete="organization"
                      className={styles.input}
                      placeholder="Nome da empresa"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="servico" className={styles.label}>
                    Faturamento mensal aproximado *
                  </label>
                  <select
                    id="servico"
                    name="servico"
                    value={formData.servico}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="" disabled>
                      Selecione uma faixa
                    </option>
                    {revenueOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="mensagem" className={styles.label}>
                    Qual é o principal desafio hoje?
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    rows={5}
                    className={styles.textarea}
                    placeholder="Ex.: gerar mais leads, organizar vendas, automatizar atendimento, melhorar presença digital..."
                  />
                </div>

                <div className={styles.statusArea} aria-live="polite">
                  {submitStatus === 'success' && (
                    <div className={styles.successMessage}>
                      Recebemos seu contato. A equipe da 4M vai chamar você no
                      WhatsApp informado.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className={styles.errorMessage}>
                      Não conseguimos enviar agora. Tente novamente ou chame a
                      equipe direto pelo WhatsApp.
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting
                    ? 'Enviando seu contato...'
                    : 'Receber meu direcionamento'}
                </button>

                <p className={styles.privacyNote}>
                  Suas informações serão usadas apenas para a equipe da 4M
                  responder ao seu contato.
                </p>
              </form>

              <aside
                className={styles.contactPanel}
                aria-label="Canais e próximos passos"
              >
                <div>
                  <p className={styles.panelEyebrow}>Atalho para conversar</p>
                  <h2>Prefere resolver agora?</h2>
                  <p className={styles.panelText}>
                    Chame no WhatsApp e envie o mesmo contexto do formulário.
                    Assim a equipe já chega na conversa com clareza.
                  </p>
                </div>

                <div className={styles.quickActions}>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappButton}
                  >
                    Abrir WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={styles.copyButton}
                  >
                    {emailCopied ? 'E-mail copiado' : 'Copiar e-mail'}
                  </button>
                </div>

                <div className={styles.contactLine}>
                  <span>E-mail</span>
                  <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
                </div>

                <div className={styles.contactLine}>
                  <span>WhatsApp</span>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contacts.whatsapp}
                  </a>
                </div>

                <div className={styles.nextSteps}>
                  <h3>Depois do envio</h3>
                  <ol>
                    {nextSteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
