import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './page.module.scss'

const whatsappUrl =
  'https://wa.me/5584998045201?text=Ol%C3%A1%2C%20quero%20contratar%20o%20Plano%20Growth%204M.'

export const metadata: Metadata = {
  title: 'Plano Growth 4M | Assinatura mensal de marketing',
  description:
    'Assinatura mensal de marketing da 4M com posts profissionais, campanhas patrocinadas, planejamento estratégico e suporte especializado.',
}

const inclusions = [
  '9 posts profissionais por mês',
  '2 campanhas patrocinadas',
  'Planejamento estratégico mensal',
  'Reunião de alinhamento',
  'Suporte especializado',
]

const metrics = [
  { value: '9', label: 'posts/mês' },
  { value: '2', label: 'campanhas' },
  { value: '1', label: 'reunião' },
  { value: '30 dias', label: 'suporte' },
]

const problems = [
  'Seu Instagram parece parado, mesmo quando você trabalha todos os dias.',
  'Você posta sem saber qual mensagem aproxima o cliente da compra.',
  'As campanhas patrocinadas não conversam com a estratégia comercial.',
]

const deliverables = [
  {
    title: 'Conteúdo com posicionamento',
    text: 'Posts criados para explicar valor, reforçar autoridade e deixar sua empresa mais fácil de entender.',
  },
  {
    title: 'Campanhas com intenção',
    text: 'Duas campanhas patrocinadas para ampliar alcance, gerar interesse e testar mensagens comerciais.',
  },
  {
    title: 'Direção mensal',
    text: 'Planejamento, alinhamento e suporte para sua comunicação não depender de improviso.',
  },
]

const steps = [
  {
    title: 'Entramos no contexto',
    text: 'Entendemos sua empresa, oferta, público e prioridade comercial do mês.',
  },
  {
    title: 'Montamos o plano',
    text: 'Definimos temas, ângulos, criativos e campanhas com foco em crescimento.',
  },
  {
    title: 'Produzimos e publicamos',
    text: 'Criamos os posts e estruturamos as campanhas para colocar a marca em movimento.',
  },
  {
    title: 'Ajustamos o caminho',
    text: 'Acompanhamos o mês, damos suporte e melhoramos a próxima rodada.',
  },
]

const audiences = [
  'Empresas que precisam parecer mais profissionais online',
  'Negócios locais que querem vender pelo Instagram, site ou WhatsApp',
  'Marcas que já postam, mas não conseguem transformar atenção em oportunidade',
]

const comparison = [
  {
    before: 'Postagens soltas',
    after: 'Calendário com estratégia',
  },
  {
    before: 'Visual sem padrão',
    after: 'Identidade mais forte',
  },
  {
    before: 'Campanhas improvisadas',
    after: 'Anúncios com objetivo claro',
  },
]

const faqs = [
  {
    question: 'Esse plano serve para qualquer empresa?',
    answer:
      'Ele funciona melhor para empresas que já têm uma oferta clara e querem manter presença digital profissional todos os meses.',
  },
  {
    question: 'O investimento em anúncios está incluso?',
    answer:
      'O plano inclui a criação e gestão de 2 campanhas. A verba de mídia é definida separadamente conforme o objetivo.',
  },
  {
    question: 'Como começo?',
    answer:
      'Você chama no WhatsApp ou preenche o formulário. A 4M entende seu negócio e orienta os próximos passos.',
  },
]

export default function PlanoGrowth4M() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroCopy}>
              <p className={styles.badge}>Promoção especial · Plano Growth 4M</p>
              <h1>Sua empresa merece mais do que posts bonitos.</h1>
              <p className={styles.heroText}>
                Receba mensalmente conteúdo profissional, campanhas patrocinadas
                e estratégias de crescimento desenvolvidas pela 4M Marketing &
                Business.
              </p>
              <div className={styles.heroActions}>
                <Link href="/contato" className={styles.primaryButton}>
                  Contratar Agora
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryButton}
                >
                  Falar no WhatsApp
                </a>
              </div>
              <div className={styles.trustRow} aria-label="Destaques do plano">
                <span>Sem fidelidade longa</span>
                <span>Execução mensal</span>
                <span>Foco em venda</span>
              </div>
            </div>

            <div className={styles.heroVisual} aria-hidden="true">
              <img
                src="/growth/growth-system-preview.png"
                alt=""
                className={styles.heroVisualImage}
              />
            </div>
          </div>
        </section>

        <section className={styles.proofStrip} aria-label="Resumo do plano">
          <div className={styles.container}>
            {metrics.map((metric) => (
              <div className={styles.metric} key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.showcase}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>Prova visual</p>
              <h2>O conteúdo precisa parecer profissional antes do cliente chamar.</h2>
              <p>
                O Plano Growth transforma a presença digital em uma vitrine mais
                clara, mais bonita e mais alinhada com o que sua empresa vende.
              </p>
            </div>
            <div className={styles.showcaseFrame}>
              <img
                src="/growth/posts-showcase.png"
                alt="Mosaico com exemplos de posts profissionais criados pela 4M"
                className={styles.showcaseImage}
              />
            </div>
          </div>
        </section>

        <section className={styles.problem}>
          <div className={styles.container}>
            <div className={styles.problemCopy}>
              <p className={styles.kicker}>O ponto real</p>
              <h2>Não é falta de postar. É falta de direção.</h2>
              <p>
                Quando sua comunicação nasce sem estratégia, você gasta energia
                criando conteúdo que não posiciona, não educa e não aproxima o
                cliente da decisão.
              </p>
            </div>
            <div className={styles.problemList}>
              {problems.map((problem) => (
                <div key={problem}>{problem}</div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.system}>
          <div className={styles.container}>
            <div className={styles.systemVisual}>
              <img
                src="/growth/growth-system-preview.png"
                alt="Prévia de uma rotina mensal com posts, campanhas patrocinadas e suporte"
                className={styles.systemImage}
              />
            </div>
            <div className={styles.systemCopy}>
              <p className={styles.kicker}>O que a 4M entrega</p>
              <h2>Um sistema mensal para sua marca aparecer com intenção.</h2>
              <div className={styles.deliverableGrid}>
                {deliverables.map((item) => (
                  <article key={item.title} className={styles.deliverable}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.steps}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>Como funciona</p>
              <h2>Você não precisa virar especialista em marketing para crescer.</h2>
              <p>
                A 4M organiza o mês, produz os criativos e acompanha a execução
                para sua empresa manter presença com método.
              </p>
            </div>
            <div className={styles.stepsGrid}>
              {steps.map((step, index) => (
                <article className={styles.step} key={step.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.conversion}>
          <div className={styles.container}>
            <div className={styles.offerCard}>
              <p className={styles.kicker}>Promoção mensal</p>
              <h2>Plano Growth 4M</h2>
              <p className={styles.offerOriginalPrice}>
                De <span>R$ 997/mês</span>
              </p>
              <strong>R$ 497/mês</strong>
              <span className={styles.offerTag}>Economia de R$ 500/mês nesta promoção</span>
              <p className={styles.offerDescription}>
                Uma assinatura acessível para sua empresa sair do improviso e ter
                marketing rodando com consistência todos os meses.
              </p>
              <div className={styles.offerActions}>
                <Link href="/contato" className={styles.darkButton}>
                  Preencher formulário
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.greenButton}
                >
                  Contratar pelo WhatsApp
                </a>
              </div>
            </div>
            <div className={styles.fitCard}>
              <h3>Esse plano é para você se...</h3>
              <ul>
                {audiences.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.comparison}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>A mudança</p>
              <h2>O cliente sente quando a marca tem direção.</h2>
            </div>
            <div className={styles.comparisonGrid}>
              {comparison.map((item) => (
                <article className={styles.comparisonItem} key={item.before}>
                  <div>
                    <span>Antes</span>
                    <p>{item.before}</p>
                  </div>
                  <div>
                    <span>Depois</span>
                    <p>{item.after}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.faq}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>Perguntas rápidas</p>
              <h2>Antes de chamar, saiba o essencial.</h2>
            </div>
            <div className={styles.faqGrid}>
              {faqs.map((item) => (
                <article className={styles.faqItem} key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.container}>
            <p className={styles.badge}>Vamos colocar seu marketing em movimento?</p>
            <h2>Comece o próximo mês com estratégia, campanha e conteúdo profissional.</h2>
            <p>
              Chame a 4M no WhatsApp ou envie seus dados pelo formulário. O
              próximo passo é entender sua empresa e liberar o início do Plano
              Growth.
            </p>
            <div className={styles.finalActions}>
              <Link href="/contato" className={styles.primaryButton}>
                Preencher formulário
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryButton}
              >
                Falar no WhatsApp agora
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
