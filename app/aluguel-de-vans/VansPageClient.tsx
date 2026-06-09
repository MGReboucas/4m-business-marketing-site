'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './page.module.scss'

const whatsappUrl =
  'https://wa.me/5584998045201?text=Ol%C3%A1%2C%20quero%20consultar%20a%20disponibilidade%20para%20aluguel%20de%20vans.'

const initialFormData = {
  nome: '',
  telefone: '',
  email: '',
  grupo: '',
  tipo: '',
  data: '',
  passageiros: '',
  roteiro: '',
  mensagem: '',
  website: '',
}

const tripTypes = [
  'Viagem em grupo',
  'Evento corporativo',
  'Transfer / traslado',
  'Turismo',
  'Casamento ou festa',
  'Rota personalizada',
]

const trustItems = [
  'Viagens e eventos',
  'Empresas e equipes',
  'Traslados e turismo',
]

const metrics = [
  { value: '01', label: 'pedido organizado com rota, data e passageiros' },
  { value: '24h', label: 'para retornar com disponibilidade e proximo passo' },
  { value: '4M', label: 'atendimento direto para fechar sem enrolacao' },
]

const problems = [
  {
    title: 'Atraso vira prejuizo',
    text: 'Em evento, transfer ou viagem de equipe, sair tarde muda toda a agenda.',
  },
  {
    title: 'Rota mal combinada custa caro',
    text: 'Sem origem, destino, paradas e horario alinhados, o orcamento perde precisao.',
  },
  {
    title: 'Grupo grande precisa de previsibilidade',
    text: 'Passageiros, bagagem, horario e ponto de encontro precisam estar claros antes da saida.',
  },
]

const useCases = [
  {
    title: 'Empresas e equipes',
    text: 'Deslocamento para treinamentos, eventos, reunioes externas e operacoes com grupo.',
  },
  {
    title: 'Eventos e celebracoes',
    text: 'Transporte para convidados, producao, equipes de apoio e grupos fechados.',
  },
  {
    title: 'Turismo e viagens',
    text: 'Roteiros em Natal, litoral, interior e viagens sob consulta de disponibilidade.',
  },
  {
    title: 'Traslados',
    text: 'Aeroporto, hotel, pontos de encontro e deslocamentos com horario combinado.',
  },
]

const steps = [
  {
    title: 'Voce envia a demanda',
    text: 'Data, horario, quantidade de pessoas, origem, destino e tipo de viagem.',
  },
  {
    title: 'A equipe confirma disponibilidade',
    text: 'Validamos a janela da viagem e organizamos as informacoes essenciais.',
  },
  {
    title: 'Voce recebe o direcionamento',
    text: 'Retornamos pelo WhatsApp ou e-mail com o proximo passo para fechar.',
  },
  {
    title: 'A rota fica combinada',
    text: 'Depois da confirmacao, os detalhes ficam alinhados antes da saida.',
  },
]

type FormData = typeof initialFormData
type SubmitStatus = 'idle' | 'success' | 'error'

export default function VansPageClient() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const detalhes = [
      `Tipo de atendimento: ${formData.tipo}`,
      `Data prevista: ${formData.data || 'A definir'}`,
      `Quantidade de passageiros: ${formData.passageiros}`,
      `Roteiro: ${formData.roteiro}`,
      `Observacoes: ${formData.mensagem || 'Nenhuma observacao adicional'}`,
    ].join('\n')

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          empresa: formData.grupo.trim(),
          telefone: formData.telefone.trim(),
          email: formData.email.trim(),
          servico: 'Aluguel de vans',
          mensagem: detalhes,
          website: formData.website.trim(),
          origem: 'aluguel-de-vans',
        }),
      })

      if (!response.ok) {
        throw new Error('Nao foi possivel enviar a solicitacao.')
      }

      setSubmitStatus('success')
      setFormData(initialFormData)
      window.setTimeout(() => setSubmitStatus('idle'), 7000)
    } catch (error) {
      console.error('Erro ao enviar solicitacao de van:', error)
      setSubmitStatus('error')
      window.setTimeout(() => setSubmitStatus('idle'), 7000)
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
            <div className={styles.heroCopy}>
              <p className={styles.badge}>Aluguel de vans</p>
              <h1>Van certa, rota combinada e viagem sem improviso.</h1>
              <p className={styles.heroText}>
                Consulte disponibilidade para viagens, eventos, empresas,
                turismo e traslados com atendimento direto da 4M. Voce informa
                o roteiro e a equipe organiza o proximo passo para fechar com
                clareza.
              </p>

              <div className={styles.heroActions}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryButton}
                >
                  Chamar no WhatsApp
                </a>
                <a href="#orcamento" className={styles.secondaryButton}>
                  Pedir orcamento
                </a>
              </div>

              <div className={styles.trustRow} aria-label="Atendimentos">
                {trustItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.metricsStrip} aria-label="Resumo do atendimento">
          <div className={styles.container}>
            {metrics.map((metric) => (
              <article className={styles.metric} key={metric.value}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.problemSection}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>Por que organizar antes</p>
              <h2>Transporte de grupo nao pode depender de mensagem solta.</h2>
              <p>
                Um bom atendimento comeca antes da viagem: data, horario,
                passageiros, rota, paradas e expectativa precisam estar na mesa
                para o orcamento fazer sentido.
              </p>
            </div>

            <div className={styles.problemGrid}>
              {problems.map((problem) => (
                <article className={styles.problemCard} key={problem.title}>
                  <h3>{problem.title}</h3>
                  <p>{problem.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.useCases}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>Atendimentos sob consulta</p>
              <h2>Para quando voce precisa levar pessoas com previsibilidade.</h2>
              <p>
                A 4M recebe a demanda, organiza as informacoes e direciona o
                contato para uma resposta objetiva sobre disponibilidade.
              </p>
            </div>

            <div className={styles.useCaseGrid}>
              {useCases.map((item) => (
                <article className={styles.useCaseCard} key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.processSection}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>Como funciona</p>
              <h2>Do pedido ao proximo passo sem confusao.</h2>
            </div>

            <div className={styles.stepsGrid}>
              {steps.map((step, index) => (
                <article className={styles.stepCard} key={step.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.quoteSection} id="orcamento">
          <div className={styles.container}>
            <div className={styles.quoteHeader}>
              <p className={styles.kicker}>Orcamento rapido</p>
              <h2>Envie os dados da viagem. A 4M retorna com disponibilidade.</h2>
              <p>
                Preencha o essencial para a equipe entender sua necessidade e
                responder com mais precisao. Se for urgente, chame direto no
                WhatsApp.
              </p>
            </div>

            <div className={styles.quoteLayout}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.honeypot} aria-hidden="true">
                  <label htmlFor="website">Site</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nome">Nome completo *</label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="telefone">WhatsApp *</label>
                    <input
                      id="telefone"
                      name="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(84) 99999-9999"
                    />
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">E-mail *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      placeholder="voce@email.com"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="grupo">Empresa, evento ou grupo *</label>
                    <input
                      id="grupo"
                      name="grupo"
                      type="text"
                      value={formData.grupo}
                      onChange={handleChange}
                      required
                      placeholder="Ex.: Equipe comercial, casamento, turismo"
                    />
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="tipo">Tipo de atendimento *</label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Selecione uma opcao
                      </option>
                      {tripTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="data">Data prevista</label>
                    <input
                      id="data"
                      name="data"
                      type="date"
                      value={formData.data}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="passageiros">Quantidade de passageiros *</label>
                    <input
                      id="passageiros"
                      name="passageiros"
                      type="number"
                      min="1"
                      value={formData.passageiros}
                      onChange={handleChange}
                      required
                      placeholder="Ex.: 12"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="roteiro">Origem, destino e paradas *</label>
                    <input
                      id="roteiro"
                      name="roteiro"
                      type="text"
                      value={formData.roteiro}
                      onChange={handleChange}
                      required
                      placeholder="Ex.: Natal > Pipa > Natal"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="mensagem">Observacoes importantes</label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Horario de saida, bagagens, criancas, retorno, necessidade especial..."
                  />
                </div>

                <div className={styles.statusArea} aria-live="polite">
                  {submitStatus === 'success' && (
                    <p className={styles.successMessage}>
                      Pedido recebido. A equipe da 4M vai retornar no WhatsApp
                      informado.
                    </p>
                  )}
                  {submitStatus === 'error' && (
                    <p className={styles.errorMessage}>
                      Nao conseguimos enviar agora. Chame pelo WhatsApp para
                      garantir atendimento.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando pedido...' : 'Solicitar orcamento'}
                </button>
              </form>

              <aside className={styles.contactPanel}>
                <p className={styles.panelKicker}>Atendimento direto</p>
                <h2>Tem pressa para saber se tem van disponivel?</h2>
                <p>
                  Envie uma mensagem no WhatsApp com data, horario, quantidade
                  de passageiros e roteiro. A conversa ja comeca no ponto certo.
                </p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappButton}
                >
                  Abrir WhatsApp
                </a>

                <div className={styles.panelList}>
                  <span>Informe no primeiro contato:</span>
                  <ul>
                    <li>Data e horario da saida</li>
                    <li>Origem, destino e paradas</li>
                    <li>Quantidade de passageiros</li>
                    <li>Se a viagem tem retorno no mesmo dia</li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.container}>
            <p className={styles.badge}>Pronto para organizar sua viagem?</p>
            <h2>Quanto antes voce envia o roteiro, melhor fica a resposta.</h2>
            <p>
              Fale com a 4M agora ou preencha o formulario. Seu pedido chega com
              contexto e a equipe retorna com o proximo passo.
            </p>
            <div className={styles.finalActions}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryButton}
              >
                Consultar pelo WhatsApp
              </a>
              <Link href="/contato" className={styles.secondaryButton}>
                Ir para contato geral
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
