import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './page.module.scss'

const whatsappUrl =
  'https://wa.me/5584998045201?text=Ol%C3%A1%2C%20quero%20criar%20um%20sistema%20personalizado%20para%20minha%20empresa.'

export const metadata: Metadata = {
  title: 'Desenvolvimento de Sistemas e SaaS | 4M Marketing & Business',
  description:
    'Desenvolvimento de sistemas web, aplicativos, plataformas SaaS e automações empresariais sob medida para empresas que querem escalar com tecnologia.',
}

const problems = [
  {
    title: 'Controle por WhatsApp',
    text: 'Pedidos, prazos e informações importantes se perdem nas conversas.',
    image: '/sistemas/problem-whatsapp.png',
  },
  {
    title: 'Planilhas espalhadas',
    text: 'Dados ficam duplicados, desatualizados e difíceis de acompanhar.',
    image: '/sistemas/problem-sheets.png',
  },
  {
    title: 'Falta de organização',
    text: 'A equipe trabalha sem visão clara do que precisa ser feito.',
    image: '/sistemas/problem-organization.png',
  },
  {
    title: 'Retrabalho',
    text: 'Tarefas repetitivas tomam tempo que poderia virar crescimento.',
    image: '/sistemas/problem-rework.png',
  },
  {
    title: 'Perda de clientes',
    text: 'Leads e atendimentos esfriam porque o processo não é centralizado.',
    image: '/sistemas/problem-clients.png',
  },
  {
    title: 'Processos lentos',
    text: 'A operação depende de conferências manuais e decisões atrasadas.',
    image: '/sistemas/problem-slow.png',
  },
]

const solutions = [
  {
    title: 'Sistema para Clínicas de Estética',
    description: 'Agenda, clientes, histórico, financeiro e gestão completa.',
    image: '/sistemas/solution-clinicas.png',
  },
  {
    title: 'Sistema para Imobiliárias',
    description: 'Controle de imóveis, corretores, leads e visitas.',
    image: '/sistemas/solution-imobiliarias.png',
  },
  {
    title: 'Sistema para Oficinas',
    description: 'Ordens de serviço, clientes, veículos e estoque.',
    image: '/sistemas/solution-oficinas.png',
  },
  {
    title: 'Sistema para Academias',
    description: 'Alunos, pagamentos, planos e avaliações.',
    image: '/sistemas/solution-academias.png',
  },
  {
    title: 'Sistema para Restaurantes',
    description: 'Pedidos, cardápio, gestão e entregas.',
    image: '/sistemas/solution-restaurantes.png',
  },
  {
    title: 'E-commerce Personalizado',
    description: 'Loja virtual completa com painel administrativo.',
    image: '/sistemas/solution-ecommerce.png',
  },
  {
    title: 'Aplicativos Mobile',
    description: 'Aplicativos Android e iOS desenvolvidos sob medida.',
    image: '/sistemas/solution-mobile.png',
  },
  {
    title: 'Sistema SaaS Personalizado',
    description: 'Transforme sua ideia em um negócio recorrente por assinatura.',
    image: '/sistemas/solution-saas.png',
  },
]

const benefits = [
  'Automatização de processos',
  'Redução de erros',
  'Economia de tempo',
  'Mais produtividade',
  'Controle total da operação',
  'Escalabilidade',
  'Aumento de faturamento',
]

const processSteps = [
  'Análise da necessidade',
  'Planejamento da solução',
  'Desenvolvimento',
  'Testes e validação',
  'Implantação',
  'Suporte e evolução',
]

const dashboardStats = [
  { label: 'Processos ativos', value: '128' },
  { label: 'Tarefas automatizadas', value: '74%' },
  { label: 'Leads organizados', value: '3.2k' },
]

export default function DesenvolvimentoDeSistemas() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroCopy}>
              <p className={styles.badge}>Desenvolvimento de Sistemas e SaaS</p>
              <h1>Transforme sua ideia em um sistema que trabalha para você.</h1>
              <p className={styles.heroText}>
                Desenvolvemos sistemas web, aplicativos e plataformas SaaS para
                empresas que desejam automatizar processos, aumentar produtividade
                e escalar resultados.
              </p>
              <div className={styles.heroActions}>
                <Link href="/contato" className={styles.primaryButton}>
                  Solicitar Projeto
                </Link>
                <a href="#solucoes" className={styles.secondaryButton}>
                  Conhecer Soluções
                </a>
              </div>
              <div className={styles.trustRow}>
                <span>Projeto sob medida</span>
                <span>Painel administrativo</span>
                <span>Suporte evolutivo</span>
              </div>
            </div>

            <div className={styles.dashboardVisual}>
              <img
                src="/sistemas/hero-system-dashboard.png"
                alt="Mockup de sistema sob medida com painel operacional, aplicativo e automações conectadas"
                className={styles.dashboardImage}
              />
            </div>
          </div>
        </section>

        <section className={styles.statsStrip} aria-label="Indicadores de sistemas">
          <div className={styles.container}>
            {dashboardStats.map((item) => (
              <div className={styles.statCard} key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.problems}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>Sinais de alerta</p>
              <h2>Sua empresa ainda depende de processos manuais?</h2>
              <p>
                Empresas que dependem apenas de processos manuais perdem tempo,
                dinheiro e oportunidades todos os dias.
              </p>
            </div>
            <div className={styles.problemGrid}>
              {problems.map((problem, index) => (
                <article className={styles.problemCard} key={problem.title}>
                  <img src={problem.image} alt="" aria-hidden="true" />
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{problem.title}</h3>
                  <p>{problem.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.solutions} id="solucoes">
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>Soluções sob medida</p>
              <h2>Soluções que podemos desenvolver para sua empresa</h2>
              <p>
                Cada sistema nasce a partir da sua operação real: processos,
                equipe, clientes, dados e metas de crescimento.
              </p>
            </div>
            <div className={styles.solutionGrid}>
              {solutions.map((solution) => (
                <article className={styles.solutionCard} key={solution.title}>
                  <img src={solution.image} alt="" aria-hidden="true" />
                  <h3>{solution.title}</h3>
                  <p>{solution.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.benefits}>
          <div className={styles.container}>
            <div className={styles.benefitCopy}>
              <p className={styles.kicker}>Por que criar um sistema próprio?</p>
              <h2>Um software feito para o seu fluxo elimina gargalos que ferramenta genérica não resolve.</h2>
              <p>
                Em vez de adaptar sua empresa a sistemas prontos, construímos a
                tecnologia em torno da sua operação.
              </p>
            </div>
            <div className={styles.benefitList}>
              {benefits.map((benefit) => (
                <div className={styles.benefitItem} key={benefit}>
                  <span aria-hidden="true">✓</span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.differential}>
          <div className={styles.container}>
            <div className={styles.strategyCard}>
              <p className={styles.badge}>Tecnologia + Estratégia</p>
              <h2>Na 4M Marketing & Business não apenas desenvolvemos sistemas.</h2>
              <p>
                Criamos soluções alinhadas aos objetivos comerciais da sua
                empresa, unindo tecnologia, marketing e crescimento.
              </p>
            </div>
            <div className={styles.strategyVisual}>
              <div>
                <span>01</span>
                <strong>Operação</strong>
                <p>Mapeamos processos e gargalos.</p>
              </div>
              <div>
                <span>02</span>
                <strong>Produto</strong>
                <p>Desenhamos uma solução clara e escalável.</p>
              </div>
              <div>
                <span>03</span>
                <strong>Crescimento</strong>
                <p>Conectamos sistema, dados e vendas.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.process}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>Como funciona</p>
              <h2>Do problema operacional ao sistema rodando.</h2>
            </div>
            <div className={styles.timeline}>
              {processSteps.map((step, index) => (
                <article className={styles.timelineItem} key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{step}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.container}>
            <p className={styles.badge}>Análise gratuita</p>
            <h2>Pronto para transformar sua empresa?</h2>
            <p>
              Solicite uma análise gratuita e descubra como a tecnologia pode
              acelerar seus resultados.
            </p>
            <div className={styles.finalActions}>
              <Link href="/contato" className={styles.primaryButton}>
                Solicitar Projeto
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappButton}
              >
                Falar com Especialista
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
