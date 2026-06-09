import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const revenueLabels: Record<string, string> = {
  'ate-50-mil': 'Até R$ 50 mil',
  '51-70-mil': 'De R$ 51 mil a R$ 70 mil',
  '71-100-mil': 'De R$ 71 mil a R$ 100 mil',
  '101-200-mil': 'De R$ 101 mil a R$ 200 mil',
  '201-400-mil': 'De R$ 201 mil a R$ 400 mil',
  '401-mil-1-milhao': 'De R$ 401 mil a R$ 1 milhão',
  '1-4-milhoes': 'De R$ 1 milhão a R$ 4 milhões',
  '4-16-milhoes': 'De R$ 4 milhões a R$ 16 milhões',
  '16-40-milhoes': 'De R$ 16 milhões a R$ 40 milhões',
  'mais-40-milhoes': 'Mais de R$ 40 milhões',
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      nome = '',
      empresa = '',
      telefone = '',
      email = '',
      servico = '',
      mensagem = '',
      website = '',
      origem = '',
    } = body

    if (website) {
      return NextResponse.json(
        { message: 'Email enviado com sucesso' },
        { status: 200 },
      )
    }

    const requiredFields = [nome, empresa, telefone, email, servico]
    const hasMissingField = requiredFields.some(
      (field) => typeof field !== 'string' || !field.trim(),
    )

    if (hasMissingField) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 },
      )
    }

    const normalizedEmail = String(email).trim()
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)

    if (!emailIsValid) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 },
      )
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Credenciais do Gmail não configuradas')
      return NextResponse.json(
        { error: 'Erro ao enviar email' },
        { status: 500 },
      )
    }

    const isVansLead = String(origem).trim() === 'aluguel-de-vans'
    const serviceLabel = revenueLabels[String(servico)] || String(servico)
    const leadTitle = isVansLead
      ? 'Novo pedido de aluguel de vans recebido pelo site da 4M'
      : 'Novo contato recebido pelo site da 4M'
    const serviceFieldLabel = isVansLead
      ? 'Servico solicitado'
      : 'Faturamento mensal aproximado'
    const messageFieldLabel = isVansLead
      ? 'Detalhes da viagem'
      : 'Principal desafio'
    const subject = isVansLead
      ? `Novo pedido de van - ${String(empresa).trim()}`
      : `Novo lead do site - ${String(empresa).trim()}`
    const safeNome = escapeHtml(nome)
    const safeEmpresa = escapeHtml(empresa)
    const safeTelefone = escapeHtml(telefone)
    const safeEmail = escapeHtml(normalizedEmail)
    const safeService = escapeHtml(serviceLabel)
    const safeServiceFieldLabel = escapeHtml(serviceFieldLabel)
    const safeMessageFieldLabel = escapeHtml(messageFieldLabel)
    const safeMensagem = escapeHtml(mensagem || 'Nenhuma mensagem adicional')

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: normalizedEmail,
      subject,
      html: `
        <h2>${escapeHtml(leadTitle)}</h2>
        <p><strong>Nome:</strong> ${safeNome}</p>
        <p><strong>Empresa:</strong> ${safeEmpresa}</p>
        <p><strong>Telefone / WhatsApp:</strong> ${safeTelefone}</p>
        <p><strong>E-mail:</strong> ${safeEmail}</p>
        <p><strong>${safeServiceFieldLabel}:</strong> ${safeService}</p>
        <p><strong>${safeMessageFieldLabel}:</strong></p>
        <p>${safeMensagem}</p>
        <hr>
        <p><small>Para responder, clique em "Responder" ou chame o lead pelo WhatsApp informado.</small></p>
      `,
      text: `
${leadTitle}

Nome: ${String(nome).trim()}
Empresa: ${String(empresa).trim()}
Telefone / WhatsApp: ${String(telefone).trim()}
E-mail: ${normalizedEmail}
${serviceFieldLabel}: ${serviceLabel}
${messageFieldLabel}: ${String(mensagem || 'Nenhuma mensagem adicional').trim()}
      `.trim(),
    })

    return NextResponse.json(
      { message: 'Email enviado com sucesso' },
      { status: 200 },
    )
  } catch (err) {
    console.error('Erro ao enviar email:', err)
    return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 })
  }
}
