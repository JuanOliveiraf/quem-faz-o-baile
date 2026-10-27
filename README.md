# Quem Faz o Baile: Conheça o Grave

Museu digital do funk desenvolvido para o projeto transmídia do grupo Omnia, FAPCOM. A aplicação usa React, TypeScript e Vite e inclui um editor visual no próprio site.

## Executar localmente

Requer Node.js 22.12 ou superior.

```bash
npm ci
npm run dev
```

Abra o endereço informado pelo Vite. O modo de edição exige a conta administrativa configurada na Vercel e não oferece acesso local sem autenticação.

## Validar e gerar a produção

```bash
npm run check:content
npm run build
npm run preview
```

`check:content` valida relações, fontes, players, imagens e a configuração alternativa do Pages CMS. A build estática é gerada em `dist`.

## Editor visual

O modo administrativo funciona no mesmo site:

1. o editor seleciona `Entrar` no cabeçalho;
2. após o login, lápis aparecem nos blocos editáveis;
3. textos, artistas, obras, fontes, imagens e ordem dos cards podem ser alterados;
4. `Salvar e publicar` cria um commit atômico na branch `main`;
5. GitHub Actions valida o conteúdo e a Vercel inicia um novo deploy.

Não há Supabase nem banco de dados. Os JSON e as imagens do GitHub continuam sendo a fonte principal do acervo. As credenciais e o token de escrita existem somente como variáveis protegidas na Vercel; nada secreto é enviado ao navegador.

Para configurar a conta administrativa e a integração com o GitHub, siga [Quem_Faz_o_Baile_Como_Funciona_o_CMS.md](Quem_Faz_o_Baile_Como_Funciona_o_CMS.md).

## Conteúdo

| Área | Arquivo |
|---|---|
| Artistas, biografias, imagens e links | `src/data/artists.json` |
| Obras e vídeos do YouTube | `src/data/works.json` |
| Décadas e ordem dos cards | `src/data/decades.json` |
| Pesquisas e perguntas | `src/data/topics.json` |
| Fontes bibliográficas | `src/data/sources.json` |
| Textos gerais e seções | `src/data/site.json` |
| Fotos dos perfis | `public/artists` |
| Imagens gerais | `public/site` |

## Publicação na Vercel

Importe `JuanOliveiraf/quem-faz-o-baile` na Vercel. O `vercel.json` já define `npm run build:production`, saída `dist` e o fallback das rotas do React. Configure as variáveis descritas no guia do CMS e use Node.js 22.

`.github/workflows/validate-content.yml` também executa instalação, validação e build em commits e pull requests da branch `main`. Uma alteração inválida não substitui a versão de produção.

Arte, fotografias e músicas não recebem licença de redistribuição por integrarem o projeto. O grupo deve manter créditos, fontes e autorizações aplicáveis.
