import { randomBytes, scryptSync } from 'node:crypto';

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !email.includes('@')) {
  console.error('Uso: npm run cms:credentials -- admin@exemplo.com');
  process.exit(1);
}

const password = randomBytes(18).toString('base64url');
const salt = randomBytes(16).toString('hex');
const hash = scryptSync(password, salt, 64).toString('hex');
const sessionSecret = randomBytes(32).toString('base64url');

console.log('\nLOGIN DO EDITOR');
console.log(`E-mail: ${email}`);
console.log(`Senha:  ${password}`);
console.log('\nVARIÁVEIS DA VERCEL');
console.log(`CMS_ADMIN_EMAIL=${email}`);
console.log(`CMS_ADMIN_PASSWORD_HASH=${salt}:${hash}`);
console.log(`CMS_SESSION_SECRET=${sessionSecret}`);
console.log('CMS_GITHUB_OWNER=JuanOliveiraf');
console.log('CMS_GITHUB_REPO=quem-faz-o-baile');
console.log('CMS_GITHUB_BRANCH=main');
console.log('CMS_GITHUB_TOKEN=COLE_AQUI_O_TOKEN_FINE_GRAINED');
console.log('\nGuarde a senha em um gerenciador. Ela não pode ser recuperada pelo hash.\n');
