import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import HeroSection from '@/components/HeroSection/HeroSection'
import PropostaValor from '@/components/PropostaValor/PropostaValor'
import Servicos from '@/components/Servicos/Servicos'
import Processo from '@/components/Processo/Processo'
import ParaQuem from '@/components/ParaQuem/ParaQuem'
import Autoridade from '@/components/Autoridade/Autoridade'
import PesquisaMercado from '@/components/PesquisaMercado/CTAFinal'
import PodcastNatalStudio from '@/components/PodcastNatalStudio/PodcastNatalStudio'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PropostaValor />
        <PesquisaMercado />
        <PodcastNatalStudio />
        <Servicos />
        <Processo />
        <ParaQuem />
        <Autoridade />
      </main>
      <Footer />
    </>
  )
}
