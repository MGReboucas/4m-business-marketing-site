# 4M Business & Marketing - Site Institucional

https://www.4mbusinessmarketing.com/

Site institucional da **4M Business & Marketing**, focado em marketing estratégico, mídia urbana e tecnologia para empresas que buscam crescimento real.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/SCSS-Modules-pink?style=flat-square&logo=sass)](https://sass-lang.com/)

---

## Sobre o Projeto

O site apresenta os serviços e diferenciais da 4M Business & Marketing com foco em conversão e posicionamento. A estrutura atual combina seções institucionais, vídeos, ofertas especificas e CTAs diretas para contato.

---

## Estrutura do Site

### Página Inicial (Landing Page)

A home esta organizada na seguinte ordem:

1. **Hero (vídeo + mensagem principal)**
   - Vídeo do YouTube explicando como a 4M atua.
   - Título: "Marketing estratégico, mídia urbana e tecnologia para empresas que querem crescer de verdade."
   - CTA primario: **"Preencher Formulário"** (leva para `/contato`).
   - CTA secundario: **"Lei do incentivo ao esporte"** (scroll para `#processo`).

2. **Proposta de Valor (Por que 4M?)**
   - 5 diferenciais: estratégia personalizada, atuação online + cidade, conteudo com foco em conversão, tecnologia para escala, visão de negocio.

3. **Pesquisa de Mercado**
   - Video do YouTube explicando como funciona a pesquisa de mercado.
   - CTA: **"Solicitar Pesquisa de Mercado"** (leva para `/contato`).

4. **Podcast Natal Studio**
   - Sala de Podcast Profissional para criação de conteúdos.
   - Slider de imagens com fotos em `public/podcast/`.
   - CTA externo: **"Agendar gravação"** (abre o formulário externo).

5. **Serviços**
   - 4 blocos com listas de entregáveis:
     - Marketing Digital Estratégico
     - Produção de Conteúdo Profissional
     - Marketing Urbano e Mídias Fisicas
     - Tecnologia e Programação Aplicada ao Marketing

6. **Lei do Incentivo ao Esporte (Processo)**
   - Video do YouTube explicando modalidade de patrocinio com retorno em marketing.
   - Texto explicativo da Lei 11.438/06 (alterada pela LC 222/2025).
   - CTA: **"Preencher Formulário"** (leva para `/contato`).

7. **Para Quem Atendemos**
   - Lista de perfis ideais (negócios digitais, negócios locais, empresas que querem profissionalizar o marketing).

8. **Autoridade / Marketing com visao de negócio**
   - Objetivos: visibilidade, autoridade, clientes qualificados, crescimento sustentável.

---

### Página Sobre (`/sobre`)

- Hero institucional.
- Quem somos.
- Missão, visão e valores.
- CTA para contato.

---

### Página Contato (`/contato`)

- Formulário com envio para `/api/contato`.
- Dados de contato com opcao de copiar e-mail e link para WhatsApp.

---

## Navegação

Menu fixo no topo (desktop e mobile):

- Inicio
- Por que 4M?
- Serviços
- Podcast
- Lei do incentivo
- Sobre Nós
- Contato

O menu usa scroll suave com compensação de altura do header e redireciona para a home caso o usuário esteja em outra pagina.

---

## Tecnologias Utilizadas

- **Next.js 16.1.1**
- **React 19.2.3**
- **TypeScript 5.x**
- **SCSS Modules**
- **Nodemailer** (envio do formulário de contato)

---

## Estrutura do Projeto

```
4m-business-marketing/
|-- app/
|   |-- api/
|   |   `-- contato/
|   |       `-- route.ts
|   |-- contato/
|   |   |-- page.tsx
|   |   `-- page.module.scss
|   |-- sobre/
|   |   |-- page.tsx
|   |   `-- page.module.scss
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components/
|   |-- Autoridade/
|   |-- Footer/
|   |-- Header/
|   |-- HeroSection/
|   |-- ParaQuem/
|   |-- PodcastNatalStudio/
|   |-- Processo/
|   |-- PropostaValor/
|   |-- PesquisaMercado/
|   `-- Servicos/
|-- public/
|   |-- logos/
|   `-- podcast/
|-- next.config.ts
|-- package.json
|-- README.md
`-- tsconfig.json
```

---

## Pre-requisitos

- **Node.js** 18+
- **npm** ou **yarn**
- **Git**

---

## Variaveis de ambiente

Crie um arquivo `.env.local` com:

```
GMAIL_USER=seu-email@gmail.com
GMAIL_APP_PASSWORD=sua-senha-de-app
```

Essas variáveis são usadas no envio do formulário de contato (`/api/contato`).

---

## Instalacao e execucao

```bash
# Instalar dependencias
npm install

# Desenvolvimento
npm run dev
# Acesse: http://localhost:3000

# Build
npm run build

# Producão
npm run start
```

matheusreboucas.dev
