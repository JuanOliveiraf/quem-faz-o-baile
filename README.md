# Quem Faz o Baile: Conheça o Grave

Museu digital do funk desenvolvido para o projeto transmídia do grupo Omnia, FAPCOM. A interface usa React, TypeScript e Vite. O acervo possui um CMS gratuito baseado em Git, sem Supabase ou banco de dados.

## Executar localmente

Requer Node.js 22.12 ou superior.

```bash
npm ci
npm run dev
```

Abra o endereço informado pelo Vite. Não abra `index.html` diretamente.

## Validar e gerar a produção

```bash
npm run check:content
npm run build
npm run preview
```

`check:content` valida o acervo e o arquivo `.pages.yml`. A build é gerada em `dist`.

## CMS

O painel usa [Pages CMS](https://pagescms.org/), que edita os JSON e as imagens diretamente no GitHub.

1. O administrador entra em `https://app.pagescms.org` com GitHub e instala o Pages CMS somente neste repositório.
2. No painel do repositório, o administrador convida os editores por e-mail.
3. Os editores aceitam o convite e acessam o painel sem criar conta GitHub.
4. Cada salvamento gera um commit na branch `main` e inicia a publicação na Vercel.

Depois da publicação, `/admin` é o endereço de entrada do grupo e encaminha ao painel. A configuração completa está em `.pages.yml`. Consulte `Quem_Faz_o_Baile_Como_Funciona_o_CMS.md` para ativação, convites, segurança, validação e recuperação.

O CMS hospedado não exige banco, API própria, variáveis de ambiente ou credenciais no frontend deste projeto. O GitHub guarda o conteúdo e seu histórico; a Vercel recompila o site a cada alteração conectada à branch de produção.

## Conteúdo

| Área | Arquivo |
|---|---|
| Artistas, biografias, imagens e links | `src/data/artists.json` |
| Obras, Spotify e YouTube | `src/data/works.json` |
| Décadas e ordem dos cards | `src/data/decades.json` |
| Pesquisas e perguntas | `src/data/topics.json` |
| Fontes bibliográficas | `src/data/sources.json` |
| Textos gerais e conexões | `src/data/site.json` |
| Imagens dos perfis | `public/artists` |

O acervo atual contém 16 perfis, 14 obras com player, quatro salas cronológicas, quatro núcleos de pesquisa e referências exibidas nos perfis.

## Publicação na Vercel

Importe o repositório na Vercel usando:

- preset: Vite;
- build: `npm run build:production` (já definido em `vercel.json`);
- saída: `dist`;
- Node.js: 22.

O `vercel.json` preserva rotas internas e o acesso `/admin`. O plano Hobby é destinado a projetos pessoais e não comerciais. Um domínio `*.vercel.app` não exige compra; domínio próprio é opcional.

## Automação

`.github/workflows/validate-content.yml` executa instalação, validação e build em commits e pull requests da branch `main`. A Vercel também executa a validação por meio de `npm run build:production`; uma alteração inválida não substitui a versão de produção.

## Documentação

- `Quem_Faz_o_Baile_Como_Funciona_o_CMS.md`: operação do CMS.
- `PROJETO_ARQUITETURA_REGRAS.md`: arquitetura, regras e estado do acervo.

Arte, fotografias e músicas não recebem licença de redistribuição por integrarem o projeto. O grupo deve manter créditos, fontes e autorizações aplicáveis.
