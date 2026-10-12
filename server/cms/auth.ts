import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'qfb_cms_session';
const SESSION_SECONDS = 60 * 60 * 8;

type SessionPayload = { email: string; exp: number };

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Configuração ausente: ${name}`);
  return value;
}

function sign(value: string) {
  return createHmac('sha256', requiredEnv('CMS_SESSION_SECRET')).update(value).digest('base64url');
}

function parseCookies(request: Request) {
  const header = request.headers.get('cookie') ?? '';
  return Object.fromEntries(header.split(';').map(part => part.trim().split('=').map(decodeURIComponent)).filter(pair => pair.length === 2));
}

export function verifyPassword(email: string, password: string) {
  const expectedEmail = requiredEnv('CMS_ADMIN_EMAIL').trim().toLowerCase();
  const [salt, expectedHex] = requiredEnv('CMS_ADMIN_PASSWORD_HASH').split(':');
  if (!salt || !expectedHex || email.trim().toLowerCase() !== expectedEmail) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createSession(email: string) {
  const payload: SessionPayload = { email: email.trim().toLowerCase(), exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function readSession(request: Request): SessionPayload | null {
  const token = parseCookies(request)[COOKIE_NAME];
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.email || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookie(value: string) {
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}
