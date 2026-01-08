import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, empresa, telefone, email, servico, mensagem } = body

    if (!nome || !email || !telefone) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 },
      )
    }

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
      replyTo: email,
      subject: `Novo contato do site - ${nome}`,
      html: `
        <h2>Novo contato recebido do site</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Empresa:</strong> ${empresa || 'Não informado'}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Serviço de Interesse:</strong> ${
          servico || 'Não selecionado'
        }</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem || 'Nenhuma mensagem adicional'}</p>
        <hr>
        <p><small>Para responder, basta clicar em "Responder" que o email irá para: ${email}</small></p>
      `,
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
