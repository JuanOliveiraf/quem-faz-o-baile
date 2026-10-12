import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';

const root = new URL('../', import.meta.url);
const config = parse(readFileSync(new URL('../.pages.yml', import.meta.url), 'utf8'));

assert(config && typeof config === 'object', 'Configuração do CMS inválida');
assert(Array.isArray(config.content), 'O CMS precisa declarar content');
assert(Array.isArray(config.media), 'O CMS precisa declarar media');
assert.equal(new Set(config.content.map(item => item.name)).size, config.content.length, 'Nomes duplicados no CMS');

const expected = {
  site: { path: 'src/data/site.json', list: false },
  artists: { path: 'src/data/artists.json', list: true },
  works: { path: 'src/data/works.json', list: true },
  decades: { path: 'src/data/decades.json', list: true },
  topics: { path: 'src/data/topics.json', list: true },
  sources: { path: 'src/data/sources.json', list: true }
};

for (const [name, definition] of Object.entries(expected)) {
  const entry = config.content.find(item => item.name === name);
  assert(entry, `Coleção ausente no CMS: ${name}`);
  assert.equal(entry.type, 'file', `A coleção ${name} deve editar um arquivo`);
  assert.equal(entry.path, definition.path, `Caminho incorreto no CMS: ${name}`);
  assert.equal(Boolean(entry.list), definition.list, `Configuração list incorreta: ${name}`);
  assert(Array.isArray(entry.fields) && entry.fields.length > 0, `Campos ausentes no CMS: ${name}`);

  const fileUrl = new URL(`../${entry.path}`, import.meta.url);
  assert(existsSync(fileUrl), `Arquivo configurado não existe: ${entry.path}`);
  const data = JSON.parse(readFileSync(fileUrl, 'utf8'));
  assert.equal(Array.isArray(data), definition.list, `Formato incompatível com o CMS: ${entry.path}`);
  const records = definition.list ? data : [data];
  const dataKeys = new Set(records.flatMap(record => Object.keys(record)));
  const fieldKeys = new Set(entry.fields.map(field => field.name));
  assert.deepEqual([...fieldKeys].sort(), [...dataKeys].sort(), `O CMS não cobre todos os campos de ${entry.path}`);

  for (const field of entry.fields) {
    assert(field.type || field.component, `Campo sem tipo em ${name}.${field.name}`);
    if (field.component) assert(config.components?.[field.component], `Componente inexistente: ${field.component}`);
  }
}

const artistMedia = config.media.find(item => item.name === 'artist_images');
assert(artistMedia, 'Biblioteca de imagens dos artistas ausente');
assert.equal(artistMedia.input, 'public/artists');
assert.equal(artistMedia.output, '/artists');
assert(existsSync(new URL(`../${artistMedia.input}`, import.meta.url)), 'Pasta da biblioteca de imagens ausente');

const siteMedia = config.media.find(item => item.name === 'site_images');
assert(siteMedia, 'Biblioteca de imagens gerais ausente');
assert.equal(siteMedia.input, 'public/site');
assert.equal(siteMedia.output, '/site');
assert(existsSync(new URL(`../${siteMedia.input}`, import.meta.url)), 'Pasta de imagens gerais ausente');

console.log('OK: o CMS cobre seis arquivos de conteúdo e as duas bibliotecas de imagens.');
