# CMS visual do Quem Faz o Baile

Guia de configuração e operação do editor administrativo integrado ao museu digital. Atualizado em 19/10/2026.

**Estado:** configurado e publicado em produção pela Vercel.

## 1. Como funciona

```text
login no próprio site
  -> lápis de edição sobre os blocos
  -> função protegida da Vercel
  -> commit na branch main do GitHub
  -> validação automática
  -> deploy automático da Vercel
```

Não há Supabase, banco SQL ou servidor permanente. Os arquivos JSON e as imagens do repositório são o banco editorial. Isso atende ao projeto sem contratar um CMS ou banco externo.

O Pages CMS continua configurado em `.pages.yml` apenas como painel alternativo de recuperação. O fluxo principal é o editor visual dentro do site.

## 2. O que pode ser editado

- abertura, faixa animada, chamadas, rodapé e imagens gerais;
- texto da cronologia e conteúdo de cada década;
- nome, resumo, biografia, foto, crédito, fontes e links de cada artista;
- destaque de artistas na exposição Mulheres no Funk;
- título, introdução, nota editorial, cabeçalho da lista e legendas das estatísticas de Mulheres no Funk;
- título, contexto, relações e player Spotify ou YouTube das obras;
- pesquisas, perguntas e fontes da área Olhares;
- ordem dos quatro artistas dentro de cada década;
- canais e links do projeto.
- alinhamento à esquerda, centralizado, à direita ou justificado para títulos e blocos de texto.

Os valores `8 trajetórias`, `3 décadas` e `8 obras` na página Mulheres são calculados a partir do acervo. O CMS edita os rótulos, mas não permite falsificar esses totais.

## 3. Preparar a conta administrativa

No computador do projeto, execute:

```bash
npm run cms:credentials -- admin@exemplo.com
```

O comando cria uma senha forte e imprime as variáveis necessárias. Guarde a senha em um gerenciador de senhas; o projeto armazena somente o hash.

Cadastre na Vercel, em `Project Settings > Environment Variables`:

| Variável | Uso |
|---|---|
| `CMS_ADMIN_EMAIL` | e-mail aceito no login |
| `CMS_ADMIN_PASSWORD_HASH` | hash `scrypt`, nunca a senha aberta |
| `CMS_SESSION_SECRET` | assinatura da sessão administrativa |
| `CMS_GITHUB_OWNER` | `JuanOliveiraf` |
| `CMS_GITHUB_REPO` | `quem-faz-o-baile` |
| `CMS_GITHUB_BRANCH` | `main` |
| `CMS_GITHUB_TOKEN` | token restrito usado para salvar commits |

Use as variáveis em `Production` e `Preview`. Depois, faça um novo deploy para disponibilizá-las às funções.

## 4. Criar o token do GitHub

Crie um **fine-grained personal access token** na conta proprietária do repositório:

1. limite o proprietário a `JuanOliveiraf`;
2. selecione somente `quem-faz-o-baile`;
3. conceda `Contents: Read and write`;
4. defina uma data de expiração e registre um lembrete para renovar;
5. cole o valor somente em `CMS_GITHUB_TOKEN` na Vercel.

Não salve o token em `.env`, JSON, documento compartilhado ou mensagem. `.env.example` contém apenas os nomes das variáveis.

## 5. Entrada e publicação

O endereço de entrada é o próprio site publicado. Se alguém abrir `/admin`, também será levado ao login interno.

1. selecione `Entrar` no cabeçalho;
2. use o e-mail e a senha gerados;
3. selecione o lápis do bloco desejado;
4. use os quatro botões de alinhamento acima do campo quando quiser formatar o texto;
5. revise e use `Salvar e publicar`;
6. aguarde a Vercel concluir o novo deploy.

O alinhamento selecionado aparece no próprio campo como prévia. Escolher novamente o alinhamento à esquerda restaura o padrão do site. Listas como biografias, perguntas e notas usam um alinhamento comum para todos os seus itens.

Cada salvamento envia somente os arquivos relacionados e cria um único commit. Se outra pessoa salvar primeiro, o CMS bloqueia a edição antiga e pede recarregamento para não apagar trabalho recente.

## 6. Segurança e limites

- a sessão dura oito horas e usa cookie `HttpOnly`, `Secure` e `SameSite=Strict`;
- requisições de escrita aceitam somente a mesma origem do site;
- o token do GitHub fica no ambiente da função, nunca no JavaScript público;
- imagens aceitas: JPG, PNG ou WebP, até 3 MB;
- toda alteração passa pela validação completa antes do commit;
- a implementação atual possui uma única conta administrativa compartilhada pelo grupo;
- não há recuperação automática de senha por e-mail.

Para trocar a senha, execute novamente `npm run cms:credentials -- email@do-admin`, atualize `CMS_ADMIN_PASSWORD_HASH` e `CMS_SESSION_SECRET` na Vercel e faça um redeploy. Para encerrar todo acesso ao repositório, revogue também o token no GitHub.

## 7. Validações protegidas

`npm run check:content` e a API de publicação verificam:

- IDs únicos e relações entre artistas, obras, décadas e fontes;
- quatro salas e quatro artistas em cada sala;
- uma obra e uma imagem para cada perfil;
- texto alternativo e crédito de imagem;
- URLs HTTPS;
- exatamente um player Spotify ou YouTube por obra;
- IDs de mídia no formato esperado;
- alinhamentos de texto limitados às quatro opções oferecidas pelo editor;
- três estatísticas automáticas e ordenadas na página Mulheres;
- cobertura dos arquivos pelo CMS alternativo.

## 8. Validação local

Não existe login de demonstração ou prévia local sem senha. Para validar o código antes de enviar:

```bash
npm run check:content
npm run build
```

## 9. Custos

O editor não exige Supabase nem serviço pago. GitHub, GitHub Actions e o domínio `*.vercel.app` podem ser usados sem compra dentro dos limites de seus planos gratuitos. O domínio próprio é opcional. A equipe deve acompanhar os limites e os termos dos serviços, especialmente se o projeto deixar de ser acadêmico ou passar a ter uso comercial.

## 10. Recuperação

O histórico do GitHub registra todas as publicações do CMS. Se um conteúdo precisar ser desfeito, reverta o commit correspondente e envie a reversão para `main`; a Vercel publicará novamente. A edição manual dos JSON continua possível pelo VS Code, desde que `npm run check:content` seja executado antes do push.

Links úteis:

- GitHub, criação de token: https://github.com/settings/personal-access-tokens/new
- Vercel, novo projeto: https://vercel.com/new
- Pages CMS alternativo: https://app.pagescms.org
