import { access, readFile } from 'node:fs/promises';

const requiredFiles = ['dist/index.html', 'dist/privacy/index.html', 'dist/404.html', 'dist/robots.txt', 'dist/sitemap.xml', 'dist/assets/icon.svg', 'dist/assets/social-card.png'];
await Promise.all(requiredFiles.map(file => access(file)));
const html = await readFile('dist/index.html', 'utf8');
const checks = [
  ['title', /<title>[^<]+<\/title>/],
  ['description', /<meta name="description" content="[^"]+"/],
  ['canonical', /<link rel="canonical" href="(?:https:\/\/[^"]+|\/)"/],
  ['Open Graph', /property="og:title"/],
  ['main heading', /<h1[ >]/],
  ['structured data', /application\/ld\+json/]
];
for (const [name, pattern] of checks) if (!pattern.test(html)) throw new Error(`Missing ${name}`);
for (const file of ['dist/index.html', 'dist/privacy/index.html', 'dist/404.html', 'dist/robots.txt', 'dist/sitemap.xml']) {
  const content = await readFile(file, 'utf8');
  if (/{{(?:SITE_URL|CURRENT_YEAR)}}/.test(content)) throw new Error(`Unresolved build token in ${file}`);
  if (/localhost|127\.0\.0\.1/.test(content)) throw new Error(`Local URL in ${file}`);
}
if (/example\.com|\.invalid/.test(html)) throw new Error('Placeholder domain in production HTML');
console.log('Build checks passed: SEO metadata and required static files are present.');
