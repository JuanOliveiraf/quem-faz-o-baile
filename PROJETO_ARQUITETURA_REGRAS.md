# Quem Faz o Baile: arquitetura e regras

Documento técnico do museu digital. Atualizado em 27/10/2026.

## 1. Escopo

O museu integra a narrativa transmídia do grupo Omnia, FAPCOM:

- Instagram `@quemfaz0baile`: descoberta e debate;
- Spotify, `Quem Faz o Baile: Beat a Beat`: seleção musical;
- museu `Conheça o Grave`: artistas, obras, pesquisas e memória cultural.

O visitante acessa todo o acervo sem login. O login existe somente no Pages CMS, fora da aplicação pública, para integrantes autorizados editarem os arquivos do repositório.

## 2. Experiência implementada

### Página inicial

Abertura, faixa animada, cronologia, destaque de mulheres no funk, Olhares do Funk, catálogo e conexões transmídia.

### Cronologia

Quatro salas, com quatro entradas em cada recorte:

| Sala | Entradas |
|---|---|
| 1990 | Claudinho & Buchecha; Cidinho & Doca; MC Marcinho; DJ Marlboro |
| 2000 | Furacão 2000; Tati Quebra Barraco; Perlla; Mr. Catra |
| 2010 | Anitta; Valesca Popozuda; MC Pedrinho; MC Lan |
| 2020 | Bia Soull; Irmãs de Pau; NandaTsunami; Katy da Voz e as Abusadas |

A sala é um recorte curatorial, não o início ou o fim da carreira. A ordem dos cards está em `decades.json`.

### Perfis

Cada entrada possui URL própria, biografia pesquisada, imagem com crédito, fontes e uma obra representativa com player do YouTube.

### Mulheres no funk

A exposição reutiliza os perfis marcados por `womenHighlight`: Tati Quebra Barraco, Perlla, Anitta, Valesca Popozuda, Bia Soull, Irmãs de Pau, NandaTsunami e Katy da Voz e as Abusadas.

O recorte atual apresenta oito trajetórias, três décadas e oito obras. A seleção é explícita no cadastro; não se infere identidade de gênero por nome ou fotografia.

### Olhares do Funk

Quatro núcleos: comunidade e pertencimento; política e espaço público; gênero, corpo e autonomia; estética e circulação. Cada núcleo possui textos, perguntas e fontes.

### Catálogo e música

O catálogo reúne as 16 entradas, com busca por nome e filtro por década. O acervo musical contém 16 obras, uma para cada perfil, todas com vídeo incorporado do YouTube.

Os players só são carregados após ação do visitante. Cada obra mantém o ID validado do vídeo e um link direto para a publicação no YouTube.

## 3. Regras de negócio

| Código | Regra |
|---|---|
| RN01 | O museu público não exige login. |
| RN02 | Artistas, obras, temas e fontes têm IDs únicos e estáveis. |
| RN03 | Slug de artista é igual ao ID. |
| RN04 | A seleção atual contém quatro entradas em cada sala. |
| RN05 | Cada artista aparece em uma única sala principal. |
| RN06 | Catálogo, cronologia e exposição reutilizam o mesmo cadastro. |
| RN07 | Relações entre obra e artista precisam existir nos dois sentidos. |
| RN08 | Todo artista possui imagem, crédito, fonte e obra. |
| RN09 | Toda obra possui fontes e exatamente um vídeo validado do YouTube. |
| RN10 | Conteúdo pesquisado ou revisado declara as fontes usadas. |
| RN11 | Imagem exige caminho local, texto alternativo e crédito. |
| RN12 | Links cadastrados usam HTTPS. |
| RN13 | Elementos com aparência interativa executam uma ação real. |
| RN14 | Conteúdo explícito recebe aviso editorial. |
| RN15 | URLs internas sobrevivem ao recarregamento na hospedagem. |
| RN16 | Alterações do CMS são validadas antes da nova build. |
| RN17 | Credenciais administrativas nunca entram no frontend ou no Git. |
| RN18 | IDs publicados não mudam sem migração de todas as referências. |

## 4. Arquitetura

React, TypeScript e Vite geram uma aplicação estática. React Router controla as rotas e os JSON são incluídos na build.

| Camada | Responsabilidade |
|---|---|
| `src/data` | Conteúdo editorial estruturado. |
| `src/types/content.ts` | Contratos TypeScript. |
| `src/services/content.ts` | Acesso e relações do acervo. |
| `src/components` | Timeline, cards, players e fontes. |
| `src/pages` | Páginas públicas. |
| `public/artists` | Biblioteca de imagens do CMS. |
| `.pages.yml` | Formulários, campos e mídia do Pages CMS. |
| `scripts/check-content.mjs` | Integridade editorial e de arquivos. |
| `scripts/check-cms-config.mjs` | Integridade da configuração do CMS. |
| `.github/workflows` | Validação automática no GitHub. |
| `vercel.json` | Build, rotas públicas e entrada `/admin`. |

Não há Supabase, Firebase, banco SQL, backend próprio, API de escrita ou armazenamento de dados de visitantes.

## 5. CMS e publicação

O Pages CMS é uma camada de edição sobre o GitHub. Ele não copia o acervo para um banco separado.

```text
Editor
  -> Pages CMS
  -> commit nos JSON/imagens
  -> GitHub Actions
  -> Vercel
  -> site público
```

O arquivo `.pages.yml` cobre todos os campos dos seis arquivos de dados e gerencia imagens em `public/artists`. O histórico do Git permite auditoria e restauração.

O Pages CMS atual não oferece permissões por coleção, comentários ou publicação agendada. Colaboradores convidados podem editar o conteúdo configurado. Revisões formais devem usar pull requests e proteção de branch no GitHub.

## 6. Validação

Execute antes de publicar:

```bash
npm run check:content
npm run build
```

A checagem cobre IDs duplicados, relações, quatro entradas por sala, fontes, textos obrigatórios, imagens existentes, URLs HTTPS, formatos de mídia e compatibilidade entre JSON e CMS.

O workflow `Validar acervo` repete instalação, validação e build em `main` e pull requests.

## 7. Custos e operação

O projeto funciona sem serviço pago:

- Pages CMS gratuito;
- conteúdo no GitHub;
- site estático na Vercel Hobby para uso acadêmico e não comercial;
- YouTube por incorporação e playlist transmídia externa opcional;
- domínio próprio opcional.

Se o Pages CMS deixar de ser usado, os JSON continuam editáveis no VS Code. Não existe migração de banco para recuperar o conteúdo.

## 8. Pendências editoriais

1. Revisão final das biografias pelo grupo.
2. Confirmação de links sociais oficiais ainda ausentes.
3. Revisão periódica de disponibilidade dos players externos.
4. Aprovação dos indicadores de linguagem explícita.
5. Conferência contínua de autoria, licença e crédito das imagens.
6. Ampliação dos artigos de Olhares do Funk com pesquisa revisada.
7. Publicação e cadastro da URL oficial da playlist Beat a Beat.

## 9. Referências técnicas

- Pages CMS: https://pagescms.org/
- Configuração do CMS: https://pagescms.org/docs/configuration/content/
- Vite na Vercel: https://vercel.com/docs/frameworks/frontend/vite
- YouTube Embedded Players: https://developers.google.com/youtube/player_parameters
