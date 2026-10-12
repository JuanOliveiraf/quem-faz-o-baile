import type { ContentBundle, ContentCollection } from '../../src/types/content.js';
import { validateContentBundle } from '../../src/services/contentValidation.js';
import { readSession } from '../../server/cms/auth.js';
import { commitContent, loadContentBundle, type MediaUpload } from '../../server/cms/github.js';
import { json, methodNotAllowed, sameOrigin } from '../../server/cms/http.js';

const collections = new Set<ContentCollection>(['artists', 'works', 'decades', 'topics', 'sources', 'site']);

function validMedia(media: MediaUpload | undefined) {
  if (!media) return true;
  if (!/^public\/(?:artists|site)\/[a-z0-9-]+\.(?:jpe?g|png|webp)$/i.test(media.path)) return false;
  if (!/^[a-zA-Z0-9+/=]+$/.test(media.contentBase64)) return false;
  return Buffer.byteLength(media.contentBase64, 'base64') <= 3 * 1024 * 1024;
}

export default {
  async fetch(request: Request) {
    let session;
    try { session = readSession(request); } catch { session = null; }
    if (!session) return json({ error: 'Sessão expirada. Entre novamente.' }, 401);

    try {
      if (request.method === 'GET') {
        const content = await loadContentBundle();
        return json(content);
      }
      if (request.method !== 'PUT') return methodNotAllowed(['GET', 'PUT']);
      if (!sameOrigin(request)) return json({ error: 'Origem da requisição não permitida.' }, 403);
      const contentLength = Number(request.headers.get('content-length') || 0);
      if (contentLength > 4_200_000) return json({ error: 'O arquivo enviado é grande demais.' }, 413);

      const body = await request.json() as { changes?: Partial<ContentBundle>; baseSha?: string; media?: MediaUpload };
      const changeKeys = Object.keys(body.changes || {}) as ContentCollection[];
      if (!body.changes || !changeKeys.length || changeKeys.some(key => !collections.has(key)) || !body.baseSha) return json({ error: 'Edição inválida.' }, 400);
      if (!validMedia(body.media)) return json({ error: 'A imagem deve ser JPG, PNG ou WebP e ter no máximo 3 MB.' }, 400);

      const current = await loadContentBundle();
      if (current.sha !== body.baseSha) return json({ error: 'Outra edição foi salva antes desta. Recarregue o conteúdo e tente novamente.', conflict: true }, 409);
      const bundle = { ...current.bundle, ...body.changes } as ContentBundle;
      const errors = validateContentBundle(bundle);
      if (errors.length) return json({ error: 'A edição contém informações inválidas.', details: errors.slice(0, 12) }, 422);

      const sha = await commitContent(body.changes, body.baseSha, body.media);
      return json({ ok: true, sha });
    } catch (error) {
      if (error instanceof Error && error.name === 'ContentConflict') return json({ error: error.message, conflict: true }, 409);
      const message = error instanceof Error && error.message.startsWith('Configuração ausente')
        ? 'A integração com o GitHub ainda não foi configurada na Vercel.'
        : 'Não foi possível salvar a edição. Tente novamente.';
      console.error(error);
      return json({ error: message }, 500);
    }
  }
};
