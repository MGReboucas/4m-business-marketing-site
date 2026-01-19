import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import HeroSection from '@/components/HeroSection/HeroSection'
import PropostaValor from '@/components/PropostaValor/PropostaValor'
import Servicos from '@/components/Servicos/Servicos'
import Processo from '@/components/Processo/Processo'
import ParaQuem from '@/components/ParaQuem/ParaQuem'
import Autoridade from '@/components/Autoridade/Autoridade'
import CTAFinal from '@/components/CTAFinal/CTAFinal'
import PodcastNatalStudio from '@/components/PodcastNatalStudio/PodcastNatalStudio'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PropostaValor />
        <Servicos />
        <PodcastNatalStudio />
        <Processo />
        <ParaQuem />
        <Autoridade />
        <CTAFinal />
      </main>
      <Footer />
    </>
  )
}
