import { readSession } from '../../server/cms/auth.js';
import { json, methodNotAllowed } from '../../server/cms/http.js';

export default {
  fetch(request: Request) {
    if (request.method !== 'GET') return methodNotAllowed(['GET']);
    try {
      const session = readSession(request);
      return session ? json({ authenticated: true, email: session.email }) : json({ authenticated: false }, 401);
    } catch {
      return json({ authenticated: false }, 401);
    }
  }
};
