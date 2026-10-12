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

1. Envie o projeto para um repositório GitHub na branch `main`.
2. Entre em `https://app.pagescms.org` e autorize esse repositório.
3. Abra o repositório no painel.
4. Edite e salve o conteúdo.

Depois da publicação, `/admin` também encaminha ao painel. A configuração completa está em `.pages.yml`. Consulte `Quem_Faz_o_Baile_Como_Funciona_o_CMS.md` para colaboração, segurança, validação e recuperação.

O CMS não precisa de banco, API própria, variáveis de ambiente ou credenciais no frontend. O GitHub guarda o conteúdo e seu histórico; a Vercel recompila o site a cada alteração conectada à branch de produção.

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
- build: `npm run build`;
- saída: `dist`;
- Node.js: 22.

O `vercel.json` preserva rotas internas e o acesso `/admin`. O plano Hobby é destinado a projetos pessoais e não comerciais. Um domínio `*.vercel.app` não exige compra; domínio próprio é opcional.

## Automação

`.github/workflows/validate-content.yml` executa instalação, validação e build em commits e pull requests da branch `main`. Uma alteração inválida não deve ser publicada como nova versão de produção.

## Documentação

- `Quem_Faz_o_Baile_Como_Funciona_o_CMS.md`: operação do CMS.
- `PROJETO_ARQUITETURA_REGRAS.md`: arquitetura, regras e estado do acervo.

Arte, fotografias e músicas não recebem licença de redistribuição por integrarem o projeto. O grupo deve manter créditos, fontes e autorizações aplicáveis.
