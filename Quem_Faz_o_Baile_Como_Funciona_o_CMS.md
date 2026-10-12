# CMS do Quem Faz o Baile

Guia do painel editorial implementado no museu digital. Atualizado em 11/10/2026.

**Estado:** implementado. O projeto usa Pages CMS sobre os arquivos do repositório. Não utiliza Supabase, banco SQL, API própria ou servidor de escrita.

## 1. Decisão técnica

O CMS adotado é o [Pages CMS](https://pagescms.org/), um editor gratuito e open source para projetos armazenados no GitHub. Ele lê a configuração `.pages.yml`, apresenta formulários e salva as alterações nos mesmos arquivos JSON usados pelo site.

O conteúdo continua sob controle do grupo:

```text
Pages CMS -> arquivos JSON e imagens -> GitHub -> validação -> Vercel
```

Essa solução foi escolhida porque o acervo já é estruturado em arquivos, recebe atualizações editoriais ocasionais e não precisa de consultas de visitantes, cadastro público ou dados privados.

## 2. O que está implementado

O arquivo `.pages.yml` oferece formulários para:

| Área | Arquivo editado |
|---|---|
| Configurações e textos gerais | `src/data/site.json` |
| Artistas, biografias, imagens e créditos | `src/data/artists.json` |
| Obras e players | `src/data/works.json` |
| Salas e ordem dos cards | `src/data/decades.json` |
| Pesquisas de Olhares do Funk | `src/data/topics.json` |
| Fontes bibliográficas e créditos | `src/data/sources.json` |
| Biblioteca de imagens | `public/artists` |

Os formulários possuem campos obrigatórios, opções para década e estado editorial, validação de URLs, IDs de Spotify e YouTube, texto alternativo e crédito de imagem.

O endereço `/admin` encaminha o editor para `https://app.pagescms.org`. O painel não aparece na navegação pública do museu.

## 3. Ativação inicial

O código do CMS está pronto, mas a autorização do repositório exige a conta pessoal de quem será responsável pelo projeto.

1. Crie um repositório no GitHub e envie esta pasta para a branch `main`.
2. Entre em `https://app.pagescms.org` usando GitHub.
3. Autorize o Pages CMS apenas para o repositório do museu.
4. Abra o repositório no painel. O Pages CMS encontrará `.pages.yml` automaticamente.
5. Conecte o mesmo repositório à Vercel com build `npm run build` e saída `dist`.
6. Faça uma pequena edição de teste e confirme o commit, a validação e o deploy.

Não coloque senhas, tokens ou chaves dentro do repositório. O Pages CMS usa a autorização do GitHub; o site público não recebe essa credencial.

## 4. Fluxo editorial

1. O editor abre `/admin` ou `https://app.pagescms.org`.
2. Escolhe o repositório e uma área do acervo.
3. Edita o formulário e salva.
4. O Pages CMS registra a alteração no GitHub.
5. O GitHub Actions executa `npm ci`, `npm run check:content` e `npm run build`.
6. A Vercel gera uma nova versão a partir do commit.
7. Se a validação falhar, o deploy não deve substituir a versão pública anterior.

Salvar no CMS altera o repositório. Portanto, a revisão do conteúdo deve acontecer antes de salvar ou por pull request no GitHub quando o grupo precisar de aprovação formal.

O campo `editorialStatus` dos artistas indica a qualidade editorial do texto:

- `inicial`: conteúdo ainda não pesquisado;
- `pesquisado`: texto apoiado nas fontes, aguardando revisão final;
- `revisado`: texto aprovado pelo grupo.

Esse campo não é controle de acesso e não torna um texto privado.

## 5. Colaboração

Usuários com acesso ao repositório podem editar pelo Pages CMS. O serviço também permite convidar colaboradores por e-mail para editar conteúdo e mídia sem conceder administração da configuração.

Convide apenas pessoas responsáveis pelo acervo. A versão atual do Pages CMS não oferece permissões granulares por coleção, comentários editoriais ou agendamento de publicação. Para revisão obrigatória, use branches e pull requests do GitHub.

O histórico do Git registra quem alterou os arquivos e permite restaurar uma versão anterior. O repositório é também a cópia principal do conteúdo, mas arquivos importantes devem ter backup fora de uma única conta.

## 6. Regras protegidas

O comando `npm run check:content` verifica o conteúdo e a configuração do CMS. Entre as regras bloqueadas estão:

- IDs únicos e formados por letras minúsculas, números e hífens;
- quatro salas e quatro entradas por sala;
- cada artista em uma única sala;
- relações de artista e obra nos dois sentidos;
- ao menos uma obra e uma imagem por artista;
- texto alternativo, crédito e arquivo de imagem existentes;
- fontes cadastradas para perfis, obras e pesquisas;
- URLs com HTTPS;
- exatamente um player por obra, Spotify ou YouTube;
- IDs de mídia no formato esperado;
- cobertura de todos os campos JSON pela configuração `.pages.yml`.

O GitHub Actions executa essa checagem em commits e pull requests para `main`.

## 7. Como cadastrar conteúdo

### Artista

Cadastre ID e slug iguais, nome, recorte temporal, tipo, resumo, parágrafos, estado editorial, obras, fontes e imagem. Não altere o ID de um perfil publicado sem atualizar todas as relações.

Para aparecer na cronologia, o ID também precisa estar na sala correta em `Salas por década`. A seleção atual mantém quatro entradas por sala.

### Obra

Cadastre os IDs dos artistas nos dois lados: a obra aponta para os artistas e cada artista lista a obra. Preencha contexto e fontes.

Use somente um player:

- Spotify: tipo, ID de 22 caracteres e rótulo;
- YouTube: ID de 11 caracteres e rótulo.

Não cole `iframe` ou HTML no conteúdo. O componente do site cria o player a partir do ID validado.

### Imagem

Envie JPG, JPEG, PNG ou WebP pela biblioteca `Imagens dos artistas`. O arquivo entra em `public/artists` e o conteúdo recebe um caminho `/artists/...`.

Toda imagem exige texto alternativo e crédito. O upload não concede licença de uso; o grupo continua responsável por autoria, autorização e atribuição.

### Fonte

Cadastre primeiro a referência em `Fontes e créditos`; depois use seu ID nos perfis, obras ou pesquisas. URLs são opcionais, mas, quando existentes, precisam usar HTTPS.

## 8. Custos e dependências

O CMS não exige pagamento nem cartão:

- Pages CMS: gratuito e open source;
- conteúdo e imagens: armazenados no GitHub;
- site: estático;
- Vercel Hobby: adequado ao projeto acadêmico e não comercial dentro dos limites do plano;
- Supabase: não utilizado;
- domínio próprio: opcional e potencialmente pago.

Serviços externos podem alterar termos e limites. A independência do conteúdo é preservada porque os dados continuam em JSON no repositório.

## 9. Operação manual e recuperação

O CMS não impede edição pelo VS Code. Em uma emergência, edite os mesmos arquivos, execute:

```bash
npm ci
npm run check:content
npm run build
```

Depois envie o commit ao GitHub. Não edite simultaneamente o mesmo registro no CMS e localmente sem sincronizar o repositório.

Se uma alteração quebrar a validação:

1. abra o resultado da ação `Validar acervo` no GitHub;
2. identifique o ID ou campo informado;
3. corrija pelo CMS ou reverta o commit;
4. confirme que a ação e o deploy ficaram verdes.

## 10. Referências técnicas

- Pages CMS: https://pagescms.org/
- Introdução e funcionamento: https://pagescms.org/docs/
- Configuração de conteúdo: https://pagescms.org/docs/configuration/content/
- Biblioteca de mídia: https://pagescms.org/docs/configuration/media/
- Colaboradores: https://pagescms.org/docs/configuration/collaborators/
- Vercel para Vite: https://vercel.com/docs/frameworks/frontend/vite
- GitHub Actions: https://docs.github.com/actions
