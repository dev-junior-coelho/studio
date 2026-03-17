# Studio

O **Studio** é uma plataforma web interna para gerenciamento de ofertas de TV e serviços de streaming, permitindo organizar categorias de produtos, configurar preços e gerar ofertas personalizadas para clientes. Construído com **Next.js**, **TypeScript** e **Firebase**, o projeto fornece um painel de controle robusto e extensível para administrar conteúdos e automações.

## Descrição

Este projeto foi desenvolvido para simplificar a criação e atualização de pacotes de TV e serviços digitais. Ele permite que operadores adicionem novas categorias de produtos (como TV a cabo, TV Box, Claro TV App), ajustem preços e ordens de exibição, e sincronizem dados com sistemas externos por meio de arquivos *seed*.

## Funcionalidades

- Gestão de produtos e categorias de serviços de TV/streaming.
- Atualização de preços e planos a partir de arquivos `seed.ts`.
- Interface de administração com dashboards e filtros.
- Geração de ofertas automáticas para diferentes perfis de clientes.
- Integração com Firebase para hospedagem e dados.
- Aplicação escalável construída com Next.js e TypeScript.

## Tecnologias utilizadas

- **Next.js** e **React** para desenvolvimento front‑end.
- **TypeScript** para tipagem estática.
- **Firebase** como plataforma de back‑end e hospedagem.
- **Tailwind CSS** para estilização.
- **Git** e **GitHub** para controle de versão.

## Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/dev-junior-coelho/studio.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd studio
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure as variáveis de ambiente conforme `.env.example` (Firebase e outras chaves).
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
6. Abra `http://localhost:3000` no navegador.

## Status do projeto

Substitua o link abaixo pelo badge de seu workflow de CI/CD, se houver:

```markdown
![CI/CD](https://github.com/dev-junior-coelho/studio/actions/workflows/main.yml/badge.svg)
```

## Screenshots

Adicione capturas de tela demonstrando o painel e principais páginas:

![Dashboard](images/dashboard.png)

![Gerenciamento de produtos](images/gerenciamento-produtos.png)

## Licença

Este projeto está licenciado sob a **MIT License**.
