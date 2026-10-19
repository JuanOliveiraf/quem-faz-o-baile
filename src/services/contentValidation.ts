import type { ContentBundle } from '../types/content.js';

const idPattern = /^[a-z0-9-]+$/;
const spotifyPattern = /^[a-zA-Z0-9]{22}$/;
const youtubePattern = /^[a-zA-Z0-9_-]{11}$/;

function required(value: unknown, label: string, errors: string[]) {
  if (typeof value !== 'string' || !value.trim()) errors.push(`${label} é obrigatório.`);
}

function secureUrl(value: unknown, label: string, errors: string[]) {
  if (value === null || value === '') return;
  try {
    if (typeof value !== 'string' || new URL(value).protocol !== 'https:') errors.push(`${label} precisa usar HTTPS.`);
  } catch {
    errors.push(`${label} não contém uma URL válida.`);
  }
}

function uniqueIds(rows: Array<{ id: string }>, label: string, errors: string[]) {
  const ids = rows.map(row => row.id);
  if (new Set(ids).size !== ids.length) errors.push(`Existem IDs duplicados em ${label}.`);
  ids.forEach(id => { if (!idPattern.test(id)) errors.push(`ID inválido em ${label}: ${id}`); });
}

function validTextAlignments(value: unknown, label: string, errors: string[]) {
  if (value === undefined) return;
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`A formatação de ${label} é inválida.`);
    return;
  }
  Object.values(value).forEach(alignment => {
    if (!['left', 'center', 'right', 'justify'].includes(String(alignment))) errors.push(`Alinhamento inválido em ${label}.`);
  });
}

export function validateContentBundle(bundle: ContentBundle): string[] {
  const errors: string[] = [];
  const { artists, works, decades, topics, sources, site } = bundle;
  if (!Array.isArray(artists) || !Array.isArray(works) || !Array.isArray(decades) || !Array.isArray(topics) || !Array.isArray(sources)) {
    return ['O formato dos arquivos de conteúdo é inválido.'];
  }

  uniqueIds(artists, 'artistas', errors);
  uniqueIds(works, 'obras', errors);
  uniqueIds(decades, 'décadas', errors);
  uniqueIds(topics, 'pesquisas', errors);
  uniqueIds(sources, 'fontes', errors);

  const artistIds = new Set(artists.map(row => row.id));
  const workIds = new Set(works.map(row => row.id));
  const sourceIds = new Set(sources.map(row => row.id));
  const decadeIds = new Set(decades.map(row => row.id));
  const roomArtists: string[] = [];

  if (decades.length !== 4) errors.push('A cronologia precisa manter quatro décadas.');
  decades.forEach(decade => {
    validTextAlignments(decade.textAlignments, decade.id, errors);
    required(decade.label, `Rótulo da década ${decade.id}`, errors);
    required(decade.title, `Título da década ${decade.id}`, errors);
    required(decade.description, `Descrição da década ${decade.id}`, errors);
    if (decade.artistIds.length !== 4) errors.push(`A década ${decade.id} precisa ter quatro artistas.`);
    decade.artistIds.forEach(id => {
      if (!artistIds.has(id)) errors.push(`Artista ${id} não existe, mas está na década ${decade.id}.`);
      if (artists.find(artist => artist.id === id)?.decade !== decade.id) errors.push(`Artista ${id} está na década incorreta.`);
      roomArtists.push(id);
    });
  });
  if (new Set(roomArtists).size !== artists.length || roomArtists.length !== artists.length) errors.push('Cada artista precisa aparecer uma única vez na cronologia.');

  artists.forEach(artist => {
    validTextAlignments(artist.textAlignments, artist.id, errors);
    required(artist.name, `Nome de ${artist.id}`, errors);
    required(artist.kind, `Tipo de ${artist.id}`, errors);
    required(artist.summary, `Resumo de ${artist.id}`, errors);
    if (artist.slug !== artist.id) errors.push(`O slug de ${artist.id} precisa ser igual ao ID.`);
    if (!decadeIds.has(artist.decade)) errors.push(`Década inválida em ${artist.id}.`);
    if (!artist.paragraphs.length) errors.push(`A biografia de ${artist.id} está vazia.`);
    artist.paragraphs.forEach((text, index) => required(text, `Parágrafo ${index + 1} de ${artist.id}`, errors));
    if (!['inicial', 'pesquisado', 'revisado'].includes(artist.editorialStatus)) errors.push(`Estado editorial inválido em ${artist.id}.`);
    if (!artist.workIds.length) errors.push(`${artist.name} precisa ter pelo menos uma obra.`);
    artist.workIds.forEach(id => {
      if (!workIds.has(id)) errors.push(`Obra ${id} não existe.`);
      if (!works.find(work => work.id === id)?.artistIds.includes(artist.id)) errors.push(`A relação entre ${artist.id} e ${id} está incompleta.`);
    });
    artist.sourceIds.forEach(id => { if (!sourceIds.has(id)) errors.push(`Fonte ${id} não existe.`); });
    secureUrl(artist.instagramUrl, `Instagram de ${artist.id}`, errors);
    secureUrl(artist.youtubeUrl, `YouTube de ${artist.id}`, errors);
    if (!artist.image) errors.push(`${artist.name} precisa ter uma imagem.`);
    if (artist.image) {
      if (!artist.image.url.startsWith('/artists/')) errors.push(`A imagem de ${artist.id} precisa estar na biblioteca de artistas.`);
      required(artist.image.alt, `Texto alternativo de ${artist.id}`, errors);
      required(artist.image.credit, `Crédito da imagem de ${artist.id}`, errors);
    }
  });

  works.forEach(work => {
    validTextAlignments(work.textAlignments, work.id, errors);
    required(work.title, `Título da obra ${work.id}`, errors);
    required(work.type, `Tipo da obra ${work.id}`, errors);
    required(work.context, `Contexto da obra ${work.id}`, errors);
    if (!work.artistIds.length) errors.push(`${work.title} precisa ter um artista.`);
    work.artistIds.forEach(id => {
      if (!artistIds.has(id)) errors.push(`Artista ${id} não existe.`);
      if (!artists.find(artist => artist.id === id)?.workIds.includes(work.id)) errors.push(`A relação entre ${work.id} e ${id} está incompleta.`);
    });
    work.sourceIds.forEach(id => { if (!sourceIds.has(id)) errors.push(`Fonte ${id} não existe.`); });
    if (Boolean(work.spotify) === Boolean(work.youtube)) errors.push(`${work.title} precisa usar Spotify ou YouTube, nunca os dois.`);
    if (work.spotify && (!['track', 'album', 'playlist'].includes(work.spotify.type) || !spotifyPattern.test(work.spotify.id))) errors.push(`Player do Spotify inválido em ${work.title}.`);
    if (work.youtube && !youtubePattern.test(work.youtube.id)) errors.push(`Player do YouTube inválido em ${work.title}.`);
  });

  topics.forEach(topic => {
    validTextAlignments(topic.textAlignments, topic.id, errors);
    required(topic.title, `Título da pesquisa ${topic.id}`, errors);
    required(topic.subtitle, `Abertura da pesquisa ${topic.id}`, errors);
    if (!topic.text.length || !topic.questions.length) errors.push(`A pesquisa ${topic.id} está incompleta.`);
    topic.sourceIds.forEach(id => { if (!sourceIds.has(id)) errors.push(`Fonte ${id} não existe.`); });
  });
  sources.forEach(source => {
    validTextAlignments(source.textAlignments, source.id, errors);
    required(source.title, `Título da fonte ${source.id}`, errors);
    required(source.credit, `Crédito da fonte ${source.id}`, errors);
    secureUrl(source.url, `URL da fonte ${source.id}`, errors);
  });

  required(site.title, 'Título do site', errors);
  validTextAlignments(site.textAlignments, 'site', errors);
  required(site.hero?.intro, 'Texto de abertura', errors);
  required(site.hero?.imageUrl, 'Imagem de abertura', errors);
  if (site.hero?.imageUrl && !site.hero.imageUrl.startsWith('/')) errors.push('A imagem de abertura precisa usar um caminho público do site.');
  required(site.ribbonText, 'Texto da faixa', errors);
  required(site.womenTitle, 'Título Mulheres no Funk', errors);
  required(site.womenIntro, 'Introdução Mulheres no Funk', errors);
  required(site.womenEditorialNote, 'Nota editorial Mulheres no Funk', errors);
  required(site.womenPage?.eyebrow, 'Identificação da página Mulheres no Funk', errors);
  required(site.womenPage?.directoryEyebrow, 'Identificação da lista Mulheres no Funk', errors);
  required(site.womenPage?.directoryTitle, 'Título da lista Mulheres no Funk', errors);
  if (!Array.isArray(site.womenPage?.stats) || site.womenPage.stats.length !== 3) {
    errors.push('A página Mulheres no Funk precisa manter três estatísticas.');
  } else {
    const expectedStats = ['artists', 'decades', 'works'];
    site.womenPage.stats.forEach((stat, index) => {
      if (stat.id !== expectedStats[index]) errors.push('A ordem das estatísticas de Mulheres no Funk é protegida.');
      required(stat.label, `Rótulo da estatística ${index + 1}`, errors);
      required(stat.detail, `Complemento da estatística ${index + 1}`, errors);
    });
  }
  if (!Array.isArray(site.aboutSection?.channels)) {
    errors.push('As experiências do projeto precisam estar em uma lista.');
  } else {
    uniqueIds(site.aboutSection.channels, 'experiências do projeto', errors);
    site.aboutSection.channels.forEach((channel, index) => {
      validTextAlignments(channel.textAlignments, `experiência ${index + 1}`, errors);
      secureUrl(channel.linkUrl, `URL da experiência ${index + 1}`, errors);
    });
  }
  secureUrl(site.instagramUrl, 'Instagram do projeto', errors);
  secureUrl(site.playlistUrl, 'Playlist do projeto', errors);

  return [...new Set(errors)];
}
