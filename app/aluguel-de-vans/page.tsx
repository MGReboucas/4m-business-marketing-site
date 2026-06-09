import type { Metadata } from 'next'
import VansPageClient from './VansPageClient'

export const metadata: Metadata = {
  title: 'Aluguel de Vans em Natal | 4M Marketing & Business',
  description:
    'Solicite aluguel de vans para viagens, eventos, empresas, turismo e traslados com atendimento rapido da 4M.',
}

export default function AluguelDeVans() {
  return <VansPageClient />
}
