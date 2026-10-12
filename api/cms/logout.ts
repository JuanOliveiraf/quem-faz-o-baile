import { clearSessionCookie } from '../../server/cms/auth.js';
import { json, methodNotAllowed, sameOrigin } from '../../server/cms/http.js';

export default {
  fetch(request: Request) {
    if (request.method !== 'POST') return methodNotAllowed(['POST']);
    if (!sameOrigin(request)) return json({ error: 'Origem da requisição não permitida.' }, 403);
    return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
  }
};
