import { createSession, sessionCookie, verifyPassword } from '../../server/cms/auth.js';
import { json, methodNotAllowed, sameOrigin } from '../../server/cms/http.js';

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return methodNotAllowed(['POST']);
    if (!sameOrigin(request)) return json({ error: 'Origem da requisição não permitida.' }, 403);
    try {
      const body = await request.json() as { email?: string; password?: string };
      if (!body.email || !body.password || !verifyPassword(body.email, body.password)) {
        return json({ error: 'E-mail ou senha incorretos.' }, 401);
      }
      return json({ email: body.email.trim().toLowerCase() }, 200, { 'Set-Cookie': sessionCookie(createSession(body.email)) });
    } catch (error) {
      const message = error instanceof Error && error.message.startsWith('Configuração ausente')
        ? 'O acesso administrativo ainda não foi configurado na Vercel.'
        : 'Não foi possível entrar.';
      return json({ error: message }, 503);
    }
  }
};
